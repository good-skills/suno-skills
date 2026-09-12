import { genres, emotions, instruments, energyLevels, structures, templates, getRecommendedMode, getRecommendedProduction } from '@/data/musicKnowledge';
import type { MusicSpec, PromptResult } from '@/utils/promptEngine';
import { chat, PROVIDERS, type ActiveAi, type ChatMessage } from '@/utils/llm';

/**
 * AI-enhanced Suno prompt generation.
 *
 * The rule-based `promptEngine` stays the source of truth for instant results.
 * AI providers reinterpret the same spec into richer, more nuanced prompts —
 * with all warnings and explanations kept in the same shape as the rule engine.
 */

const SYSTEM_PROMPT = `You are a world-class Suno AI music prompt engineer. You translate structured musical specs into two outputs:

1. **Style Box**: A single-line comma-separated Suno prompt (~200 chars max).
2. **Lyrics Box**: Structural meta-tags using [ ] brackets for the Lyrics input field.

## GOLDEN FORMULA (apply this ordering strictly):
Genre + Vocal Style + Core Instruments + Vibe/Emotion + Musical Mode + Tempo + Production Quality + Exclusions

## RULES:
- Output ONLY a JSON object with exactly these fields: "prompt", "explanation", "explanationFa", "warnings".
- **"prompt"**: single line, comma-separated, no line breaks, max ~200 characters. Follow the Golden Formula order.
- Respect negative constraints with absolute emphasis: "strictly NO drums", "zero percussion", "completely drumless".
- Use musical modes (Aeolian, Lydian, Phrygian, Dorian, Mixolydian) instead of generic major/minor when appropriate.
- Inject production vocabulary: "analog warmth", "tape saturation", "immersive spatial mix", "audiophile mastering", "pristine mix", "shimmer reverb", "wide stereo image".
- For solo instruments, add anti-hallucination phrases: "unaccompanied solo instrument", "single instrument recording".
- If the user description is in Persian, translate its meaning into the English prompt.
- **"explanation"** and **"explanationFa"**: 2-4 sentences each (explanationFa must be natural Persian) describing key choices: which mode, which production vocabulary, which compression strategies.
- **"warnings"**: array of strings for auto-adjustments (may be empty).
- NEVER include artist names or song lyrics in the style prompt.
- Use compound adjectives for conciseness: "heart-wrenching" not "very sad and emotional", "deeply brooding" not "very dark", "glacial" not "very slow".

## MODE SELECTION GUIDE:
- Deep sadness/darkness → Aeolian mode, Phrygian dominant
- Dreamy/hopeful/ethereal → Lydian mode (raised 4th)
- Nostalgia/warmth → Mixolydian mode (bVII chord color)
- Cool sophistication → Dorian mode
- Unsettling tension → Chromatic / Diminished scales
- Open simplicity → Pentatonic

## PRODUCTION VOCABULARY GUIDE:
- For warmth/depth: "analog warmth", "tape saturation", "vinyl crackle", "tube amp warmth"
- For space: "immersive spatial mix", "wide stereo image", "cathedral reverb", "close-mic intimacy"
- For quality: "pristine mix", "high fidelity", "audiophile mastering"
- For raw/grit: "raw overdrive", "analog grit", "lo-fi texture"
- For ethereal: "shimmer reverb", "granular synthesis texture", "ethereal wash"
- For cinematic: "wide dynamic range", "Dolby Atmos staging", "cinematic spatial staging"`;

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

  const recommendedMode = getRecommendedMode(spec.emotionId);
  const recommendedProduction = getRecommendedProduction(spec.emotionId, spec.energyId);

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
    recommendedMode: recommendedMode
      ? { name: recommendedMode.name, moodTag: recommendedMode.moodTag, keywords: recommendedMode.promptKeywords }
      : null,
    recommendedProduction: recommendedProduction.map((p) => ({
      label: p.label,
      keywords: p.keywords.slice(0, 2),
    })),
  };

  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: JSON.stringify(knowledge) },
  ];
}

/** Extract a JSON object substring from an LLM reply that may contain prose or code fences. */
export function extractJson(raw: string): string {
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
    lyricsMetaTags: fallback.lyricsMetaTags,
    explanation: typeof parsed.explanation === 'string' && parsed.explanation.trim() ? parsed.explanation.trim() : fallback.explanation,
    explanationFa: typeof parsed.explanationFa === 'string' && parsed.explanationFa.trim() ? parsed.explanationFa.trim() : fallback.explanationFa,
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings.filter((w) => typeof w === 'string') : fallback.warnings,
    scores: fallback.scores,
    tokenAnalysis: fallback.tokenAnalysis,
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
