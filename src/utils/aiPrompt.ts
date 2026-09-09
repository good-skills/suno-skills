import { genres, emotions, instruments, energyLevels, structures, templates } from '@/data/musicKnowledge';
import type { MusicSpec, PromptResult } from '@/utils/promptEngine';
import { chat, PROVIDERS, type ActiveAi, type ChatMessage } from '@/utils/llm';

/**
 * AI-enhanced Suno prompt generation.
 *
 * The rule-based `promptEngine` stays the source of truth for instant results.
 * AI providers reinterpret the same spec into richer, more nuanced prompts —
 * with all warnings and explanations kept in the same shape as the rule engine.
 */

const SYSTEM_PROMPT = `You are an expert Suno AI music prompt engineer. You translate a structured musical spec into a single, highly effective Suno prompt.

Rules:
- Output ONLY a JSON object. No markdown, no commentary.
- The "prompt" field: one flowing comma-separated description line, Suno style (e.g. "intimate felt piano, slow 60 BPM, minor key, soft dynamics"). No line breaks, max ~200 words.
- Weave in the provided music-theory knowledge (tonality, melodic contour, harmonic progressions, production style) — do not just copy the raw spec fields.
- Respect negative constraints (excluded instruments) with phrases like "no strings", "no vocals".
- If the user description is in Persian, translate its meaning into the English prompt.
- The "explanation" and "explanationFa" fields: 1-3 short sentences each (explanationFa must be natural Persian) describing the key choices made.
- "warnings": array of strings for auto-adjustments worth flagging (may be empty).
- Keep the prompt compatible with Suno: descriptive style/genre/mood/instrument/tempo language, avoid artist names, avoid song lyrics.`;

export class AiGenerationError extends Error {
  constructor(message: string, public readonly fallback?: PromptResult) {
    super(message);
  }
}

/** One AI attempt against a specific provider/model. */
export interface AiVariant {
  providerId: string;
  providerName: string;
  model: string;
  result?: PromptResult;
  error?: string;
}

function buildMessages(spec: MusicSpec, fallback: PromptResult): ChatMessage[] {
  const genre = genres.find((g) => g.id === spec.genreId);
  const emotion = emotions.find((e) => e.id === spec.emotionId);
  const energy = energyLevels.find((e) => e.id === spec.energyId);
  const structure = spec.structureId ? structures.find((s) => s.id === spec.structureId) : null;
  const selectedInstruments = instruments.filter((i) => spec.instrumentIds.includes(i.id));
  const excludedInstruments = instruments.filter((i) => spec.excludeInstrumentIds.includes(i.id));
  const templateHint = templates.find((t) => t.genreId === spec.genreId && t.emotionId === spec.emotionId);

  const knowledge = {
    genre: genre
      ? {
          name: genre.name,
          soundCharacter: genre.soundCharacter,
          commonInstruments: genre.commonInstruments,
          typicalBPM: genre.typicalBPM,
          productionStyle: genre.productionStyle,
          cliches: genre.cliches,
          avoid: genre.avoid,
        }
      : null,
    emotion: emotion
      ? {
          name: emotion.name,
          tonality: emotion.tonality,
          melodicContour: emotion.melodicContour,
          register: emotion.register,
          arrangement: emotion.arrangement,
          dynamics: emotion.dynamics,
          harmonicProgression: emotion.harmonicProgression,
          noteDuration: emotion.noteDuration,
          rhythmicActivity: emotion.rhythmicActivity,
        }
      : null,
    energy: energy ? { name: energy.name, bpmRange: energy.bpmRange, dynamicLevel: energy.dynamicLevel } : null,
    structure: structure ? { parts: structure.parts } : null,
    selectedInstruments: selectedInstruments.map((i) => i.name),
    excludedInstruments: excludedInstruments.map((i) => i.name),
    vocals: spec.vocals,
    tempo: spec.tempo,
    userDescription: spec.description.trim() || null,
    ruleEngineBaseline: fallback.prompt,
    templateHint: templateHint ? { name: templateHint.name, extraPrompt: templateHint.extraPrompt } : null,
  };

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: JSON.stringify(knowledge) },
  ];
}

/** Extract a JSON object substring from an LLM reply that may contain prose or code fences. */
function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : raw).trim();

  const firstBrace = candidate.search(/[{[]/);
  if (firstBrace === -1) return candidate;

  const openChar = candidate[firstBrace];
  const closeChar = openChar === '{' ? '}' : ']';

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = firstBrace; i < candidate.length; i++) {
    const c = candidate[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === openChar) depth++;
    else if (c === closeChar) {
      depth--;
      if (depth === 0) return candidate.slice(firstBrace, i + 1);
    }
  }
  return candidate;
}

function parseAiResult(content: string, fallback: PromptResult): PromptResult {
  let parsed: {
    prompt?: string;
    explanation?: string;
    explanationFa?: string;
    warnings?: string[];
  };
  try {
    parsed = JSON.parse(extractJson(content));
  } catch {
    throw new AiGenerationError('Could not parse the AI response.', fallback);
  }

  const prompt = typeof parsed.prompt === 'string' ? parsed.prompt.trim() : '';
  if (!prompt) {
    throw new AiGenerationError('AI response was missing the prompt field.', fallback);
  }

  return {
    prompt,
    explanation: typeof parsed.explanation === 'string' && parsed.explanation.trim() ? parsed.explanation.trim() : fallback.explanation,
    explanationFa: typeof parsed.explanationFa === 'string' && parsed.explanationFa.trim() ? parsed.explanationFa.trim() : fallback.explanationFa,
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.filter((w) => typeof w === 'string') : fallback.warnings,
    scores: fallback.scores,
  };
}

/** Single-provider AI enhancement (used for the Enhance button). */
export async function generateAiPrompt(spec: MusicSpec, fallback: PromptResult, active: ActiveAi): Promise<PromptResult> {
  const messages = buildMessages(spec, fallback);
  const content = await chat({ providerId: active.providerId, model: active.model, apiKey: active.apiKey, messages });
  return parseAiResult(content, fallback);
}

/**
 * Compare the same spec across multiple AI providers in parallel.
 * Each provider gets the identical music-knowledge context; failures are
 * isolated per provider and reported, never thrown.
 */
export async function generateAiVariants(
  spec: MusicSpec,
  fallback: PromptResult,
  targets: ActiveAi[]
): Promise<AiVariant[]> {
  const messages = buildMessages(spec, fallback);

  const tasks = targets.map(async (target): Promise<AiVariant> => {
    const def = PROVIDERS.find((p) => p.id === target.providerId);
    const providerName = def?.name ?? target.providerId;
    try {
      const content = await chat({
        providerId: target.providerId,
        model: target.model,
        apiKey: target.apiKey,
        messages,
      });
      return {
        providerId: target.providerId,
        providerName,
        model: target.model,
        result: parseAiResult(content, fallback),
      };
    } catch (e) {
      return {
        providerId: target.providerId,
        providerName,
        model: target.model,
        error: e instanceof Error ? e.message : 'Unknown error',
      };
    }
  });

  return Promise.all(tasks);
}
