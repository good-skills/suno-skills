import { chat, type ActiveAi } from '@/utils/llm';
import { extractJson } from '@/utils/aiPrompt';
import {
  titleFromDescription, type SongBlueprint, type RefineAction,
} from '@/utils/blueprint';

/**
 * The SunoPromper pipeline. Four stages over ONE selected model:
 *
 *   User idea → Intent Analyzer → Song Blueprint → Prompt Compiler → Critic → Final prompt
 *
 * The blueprint is the single source of truth: the compiler never re-analyzes
 * the idea, and the critic sees idea + blueprint + prompt together so it can
 * judge intent alignment, not just prose quality.
 *
 * Modes:
 *   fast — Intent → Compiler (no critic round-trip)
 *   best — Intent → Compiler → Critic → (refine when overall_score < 80)
 */

export type PipelineMode = 'fast' | 'best';

export type PipelineStage = 'intent' | 'compiler' | 'critic' | 'refiner';

export interface BlueprintSchema {
  concept: string;
  genre: { primary: string; secondary: string[] };
  mood: string[];
  emotional_arc: string[];
  tempo: { bpm: number | null; description: string } | null;
  vocals: { presence: 'none' | 'male' | 'female' | 'mixed' | 'unspecified'; character: string; delivery: string };
  instrumentation: string[];
  structure: { section: string; description: string; energy: number }[];
  production: string[];
  avoid?: string[];
}

export interface CriticScores {
  intent_alignment: number;
  musical_coherence: number;
  specificity: number;
  naturalness: number;
  emotional_arc: number;
  arrangement: number;
  instrumentation: number;
  vocals: number;
  redundancy: number;
  contradictions: number;
  suno_usability: number;
}

export interface CriticReport {
  overall_score: number;
  quality: 'excellent' | 'strong' | 'usable' | 'weak' | 'poor';
  scores: CriticScores;
  issues: string[];
  improvements: string[];
  keep: string[];
}

export interface PipelineResult {
  blueprint: BlueprintSchema;
  prompt: string;
  critic: CriticReport | null;
  refined: boolean;
  mode: PipelineMode;
  modelLabel: string;
  titleCandidates: string[];
}

// ---------------------------------------------------------------------------
// Stage 1 — Music Intent Architect
// ---------------------------------------------------------------------------

const INTENT_SYSTEM_PROMPT = `You are the Music Intent Architect for SunoPromper.

Your job is NOT to write the final Suno prompt.

Your job is to understand what the user is trying to create musically, resolve ambiguity intelligently, and translate their natural-language idea into a precise, coherent musical blueprint.

The user may be:
- a complete beginner
- a musician
- a producer
- someone who cannot describe music technically
- writing in any language

Never require the user to know music theory or production terminology.

CORE PRINCIPLE

Translate INTENT into MUSICAL DECISIONS.

Do not blindly repeat the user's words.

For example:

User:
"I want something that feels like driving alone through a rainy city at 2 AM."

Do NOT simply produce:
"rainy, dark, city, emotional, driving song"

Instead infer a coherent musical direction such as:
- nocturnal atmosphere
- introspective emotional tone
- restrained beginning
- gradual emotional development
- spacious production
- subtle rhythmic movement
- cinematic or dreamlike textures

IMPORTANT:

Do not over-specify details that the user did not imply.

Do not randomly invent:
- exact BPM
- key
- instruments
- vocal gender
- genre
- song structure

unless they are strongly implied or genuinely useful.

When information is missing, use tasteful defaults only when necessary.

MUSICAL COHERENCE

Every decision must support the same artistic vision.

Avoid contradictory combinations such as:
- intimate acoustic performance + enormous EDM festival drop
unless the user explicitly asks for such contrast.

GENRE FUSION

When multiple genres are requested, do not simply concatenate them.

Determine:
1. Primary genre
2. Secondary influence
3. What each genre contributes

Example:

"Persian music + synthwave"

Better interpretation:
- synthwave provides the production foundation
- Persian melodic phrasing provides the melodic identity
- traditional Persian textures are used selectively

EMOTIONAL ARC

Think about how the song evolves over time.

Possible progression:
calm → tension → release
intimate → expansive
dark → hopeful
minimal → powerful
nostalgic → euphoric

Do not force an emotional arc if the user's concept is intentionally static.

VOCALS

Only specify vocals when relevant.

If vocals are requested, consider:
- gender/presentation if specified
- vocal character
- emotional delivery
- intensity
- phrasing
- evolution across the song

Do not use generic adjectives excessively.

INSTRUMENTATION

Choose instruments based on:
- genre
- emotional intent
- atmosphere
- arrangement

Avoid creating an overcrowded instrument list.

Prefer a small number of meaningful instruments over a long catalog.

STRUCTURE

Use conventional song sections when appropriate:
Intro, Verse, Pre-Chorus, Chorus, Bridge, Breakdown, Instrumental, Final Chorus, Outro.

Do not force every section into every song.

TEMPO

Only provide an approximate BPM when useful.

Never pretend the BPM is objectively required. Prefer "bpm": null with a short description when no tempo is implied.

STYLE VS LYRICS

Keep musical direction separate from lyrical content.

The blueprint should describe sound, arrangement, performance, production, structure, and emotional progression. Lyrics belong to a separate layer.

NATURAL LANGUAGE

The final prompt will later be written as natural musical direction.
Therefore avoid unnecessary keyword stuffing.
QUALITY OVER QUANTITY.

OUTPUT RULE

Return ONLY valid JSON matching the provided schema. No markdown. No commentary. No additional fields.

SCHEMA (all required unless noted):
{
  "concept": string,
  "genre": { "primary": string, "secondary": string[] (0-3 items) },
  "mood": string[] (1-5 items),
  "emotional_arc": string[] (1-6 items, ordered, e.g. ["intimate", "building", "expansive"]),
  "tempo": { "bpm": number|null (40-220), "description": string } or null,
  "vocals": { "presence": "none"|"male"|"female"|"mixed"|"unspecified", "character": string, "delivery": string },
  "instrumentation": string[] (1-10 items),
  "structure": [ { "section": string, "description": string, "energy": number (1-10) } ] (2-10 items),
  "production": string[] (0-8 items),
  "avoid": string[] (0-8 items, optional)
}

Never confuse more detail with better prompting.`;

// ---------------------------------------------------------------------------
// Stage 2 — Suno Prompt Composer
// ---------------------------------------------------------------------------

const COMPILER_SYSTEM_PROMPT = `You are the Suno Prompt Composer for SunoPromper.

Your task is to transform a structured musical blueprint into a concise, natural, expressive Suno style prompt.

The output should feel like a professional music producer describing a song to another musician.

IMPORTANT:
Do not output JSON.
Do not explain the prompt.
Do not use headings.
Do not use bullet points.
Return ONLY the final Suno style prompt.

WRITING STYLE

Write natural musical language. Avoid keyword stuffing.

Bad:
"cinematic, emotional, dark, epic, powerful, atmospheric, dramatic, beautiful, deep, melancholic rock song"

Better:
"A dark cinematic alternative rock track with an intimate opening, restrained drums and atmospheric guitar textures. The arrangement gradually builds in intensity before opening into a wide, emotionally charged chorus."

The second style is preferred.

PRIORITY ORDER

Preserve information in this order:
1. Core genre / sonic identity
2. Emotional character
3. Vocal identity
4. Main instrumentation
5. Arrangement and progression
6. Production character
7. Tempo, only when useful

Do not attempt to include every blueprint field literally. Select the details that contribute most to the musical identity.

GENRE FUSION

If the blueprint contains multiple genres, express their relationship naturally.

Do not write: "Rock + electronic + cinematic + ambient."
Instead describe how they interact.
Example: "Alternative rock forms the foundation, while atmospheric electronic textures add a cinematic sense of space."

EMOTIONAL ARC

Whenever the blueprint contains an emotional progression, express it through arrangement and dynamics.
Example: "Beginning intimate and restrained, gradually building tension before opening into a powerful, cathartic final chorus."

INSTRUMENTATION

Mention the most important instruments. Do not create a shopping list. Usually 3-6 meaningful instruments or sonic elements are enough.

STRUCTURE

Do not mechanically list "Intro, Verse, Pre-Chorus, Chorus, Bridge...". Instead describe structural movement naturally. Use explicit section names only when they meaningfully improve control.

VOCALS

Describe vocal delivery rather than merely saying "male vocals".
Prefer: "An intimate male vocal with restrained verses that gradually becomes more powerful and emotionally exposed in the chorus."

NEGATIVE PREFERENCES

If the blueprint contains avoid preferences, incorporate them naturally only when useful. Do not turn the prompt into a long list of prohibitions.

CONCISENESS

The final prompt should normally be between 60 and 140 words. Never sacrifice musical clarity merely to hit a word count.

NO HYPE

Avoid generic marketing language such as: amazing, incredible, perfect, beautiful, masterpiece, best. Describe the music instead.

NO ARTIST IMITATION

If the user's request contains a living artist or copyrighted artist reference, do not directly instruct the model to imitate that artist. Instead translate the reference into musical characteristics such as instrumentation, genre, era, vocal qualities, production techniques, rhythmic characteristics, and emotional character.

FINAL RULE:

Write one coherent musical direction, not a collection of tags.

Never confuse more detail with better prompting.`;

// ---------------------------------------------------------------------------
// Stage 3 — Suno Prompt Quality Critic
// ---------------------------------------------------------------------------

const CRITIC_SYSTEM_PROMPT = `You are the Suno Prompt Quality Critic for SunoPromper.

You evaluate whether a generated Suno prompt accurately and effectively represents the user's intended music.

You are NOT a prompt writer. Do not rewrite the prompt unless explicitly requested.

Evaluate the prompt using the following criteria:

1. INTENT ALIGNMENT - Does the prompt preserve the user's original musical idea?
2. MUSICAL COHERENCE - Do genre, mood, instrumentation, vocals and production logically belong together?
3. SPECIFICITY - Is the prompt specific enough to guide generation without becoming overloaded?
4. NATURALNESS - Does it read like natural musical direction rather than keyword stuffing?
5. EMOTIONAL ARC - If the user requested progression or contrast, is it represented clearly?
6. ARRANGEMENT - Does the prompt communicate how the song develops?
7. INSTRUMENTATION - Are the selected instruments meaningful and not excessive?
8. VOCAL DIRECTION - If vocals are relevant, is their character and delivery sufficiently clear?
9. REDUNDANCY - Does the prompt repeat the same idea using unnecessary adjectives?
10. CONTRADICTIONS - Does it contain conflicting musical instructions?
11. SUNO USABILITY - Would the prompt be practical as a Suno style description?

SCORING

Score each category from 0 to 10. Calculate an overall score from 0 to 100.

QUALITY LEVELS:
90-100: excellent. Minimal or no changes needed.
80-89: strong. Minor improvements possible.
70-79: usable but should be improved.
60-69: weak. Significant refinement recommended.
Below 60: poor. Rebuild the musical direction.

CRITICAL RULE

Do not penalize a prompt for missing information that the user never requested. A simple prompt can be excellent if simplicity matches the user's intent. Do not reward unnecessary complexity. A shorter, coherent prompt is better than a longer, overloaded prompt.

Return ONLY valid JSON matching the schema below. No markdown, no commentary.

SCHEMA:
{
  "overall_score": number (0-100),
  "quality": "excellent"|"strong"|"usable"|"weak"|"poor",
  "scores": {
    "intent_alignment": number (0-10),
    "musical_coherence": number (0-10),
    "specificity": number (0-10),
    "naturalness": number (0-10),
    "emotional_arc": number (0-10),
    "arrangement": number (0-10),
    "instrumentation": number (0-10),
    "vocals": number (0-10),
    "redundancy": number (0-10),
    "contradictions": number (0-10),
    "suno_usability": number (0-10)
  },
  "issues": string[] (0-6 items),
  "improvements": string[] (0-6 items),
  "keep": string[] (0-6 items)
}`;

const REFINE_SYSTEM_PROMPT = `You are the Suno Prompt Composer for SunoPromper, revising your own work.

You will receive the original user idea, the music blueprint, your previous prompt, and a critic report. Rewrite the prompt addressing the critic's issues while strictly preserving everything listed under "keep".

The output should feel like a professional music producer describing a song to another musician.

IMPORTANT:
Do not output JSON. Do not explain. Do not use headings or bullet points.
Return ONLY the final revised Suno style prompt.

Write natural musical language, avoid keyword stuffing, keep 60-140 words normally, no hype adjectives, no artist imitation. Express genre fusion, emotional arc and structure through arrangement and dynamics rather than lists.

Never confuse more detail with better prompting.`;

// ---------------------------------------------------------------------------
// JSON coercion — LLMs drift from schema; clamp instead of crash
// ---------------------------------------------------------------------------

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v.trim() : fallback;
}

function asStringArray(v: unknown, max: number): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map((s) => s.trim()).slice(0, max);
}

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' ? Math.round(v) : typeof v === 'string' ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

export function coerceBlueprint(raw: unknown): BlueprintSchema {
  const obj = (raw ?? {}) as Record<string, unknown>;

  const genreRaw = (obj.genre ?? {}) as Record<string, unknown>;
  const tempoRaw = obj.tempo;
  const vocalsRaw = (obj.vocals ?? {}) as Record<string, unknown>;
  const structureRaw = Array.isArray(obj.structure) ? obj.structure : [];

  const presence = asString(vocalsRaw.presence, 'unspecified');
  const presenceValid = ['none', 'male', 'female', 'mixed', 'unspecified'].includes(presence)
    ? (presence as BlueprintSchema['vocals']['presence'])
    : 'unspecified';

  const structure = structureRaw.slice(0, 10).map((s) => {
    const sec = (s ?? {}) as Record<string, unknown>;
    return {
      section: asString(sec.section, 'Section'),
      description: asString(sec.description),
      energy: clampInt(sec.energy, 1, 10, 5),
    };
  });

  const tempo =
    tempoRaw && typeof tempoRaw === 'object'
      ? (() => {
          const t = tempoRaw as Record<string, unknown>;
          const bpm = typeof t.bpm === 'number' && t.bpm >= 40 && t.bpm <= 220 ? Math.round(t.bpm) : null;
          const description = asString(t.description);
          return bpm === null && !description ? null : { bpm, description };
        })()
      : null;

  return {
    concept: asString(obj.concept),
    genre: { primary: asString(genreRaw.primary, 'Unspecified'), secondary: asStringArray(genreRaw.secondary, 3) },
    mood: asStringArray(obj.mood, 5),
    emotional_arc: asStringArray(obj.emotional_arc, 6),
    tempo,
    vocals: {
      presence: presenceValid,
      character: asString(vocalsRaw.character),
      delivery: asString(vocalsRaw.delivery),
    },
    instrumentation: asStringArray(obj.instrumentation, 10),
    structure: structure.length >= 2 ? structure : [{ section: 'Opening', description: '', energy: 4 }, { section: 'Development', description: '', energy: 7 }],
    production: asStringArray(obj.production, 8),
    avoid: asStringArray(obj.avoid, 8),
  };
}

export function coerceCriticReport(raw: unknown): CriticReport {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const scoresRaw = (obj.scores ?? {}) as Record<string, unknown>;

  const score = (k: keyof CriticScores) => clampInt(scoresRaw[k], 0, 10, 7);

  const scores: CriticScores = {
    intent_alignment: score('intent_alignment'),
    musical_coherence: score('musical_coherence'),
    specificity: score('specificity'),
    naturalness: score('naturalness'),
    emotional_arc: score('emotional_arc'),
    arrangement: score('arrangement'),
    instrumentation: score('instrumentation'),
    vocals: score('vocals'),
    redundancy: score('redundancy'),
    contradictions: score('contradictions'),
    suno_usability: score('suno_usability'),
  };

  const quality = asString(obj.quality, 'usable');
  const qualityValid = ['excellent', 'strong', 'usable', 'weak', 'poor'].includes(quality)
    ? (quality as CriticReport['quality'])
    : 'usable';

  return {
    overall_score: clampInt(obj.overall_score, 0, 100, 75),
    quality: qualityValid,
    scores,
    issues: asStringArray(obj.issues, 6),
    improvements: asStringArray(obj.improvements, 6),
    keep: asStringArray(obj.keep, 6),
  };
}

// ---------------------------------------------------------------------------
// Calls
// ---------------------------------------------------------------------------

function aiMessages(system: string, user: string) {
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}

export async function analyzeIntent(userIdea: string, ai: ActiveAi): Promise<BlueprintSchema> {
  const content = await chat({
    providerId: ai.providerId,
    model: ai.model,
    apiKey: ai.apiKey,
    temperature: 0.7,
    messages: aiMessages(INTENT_SYSTEM_PROMPT, `USER IDEA:\n${userIdea.trim() || 'An evocative instrumental piece with a cinematic, emotional atmosphere.'}`),
  });
  try {
    return coerceBlueprint(JSON.parse(extractJson(content)));
  } catch {
    throw new Error('The intent analyzer returned an unreadable response. Try again or switch models.');
  }
}

export async function compilePrompt(blueprint: BlueprintSchema, ai: ActiveAi): Promise<string> {
  const content = await chat({
    providerId: ai.providerId,
    model: ai.model,
    apiKey: ai.apiKey,
    temperature: 0.75,
    messages: aiMessages(COMPILER_SYSTEM_PROMPT, `MUSIC BLUEPRINT:\n${JSON.stringify(blueprint, null, 2)}`),
  });
  const text = content.trim().replace(/^```[a-z]*\s*/i, '').replace(/```$/i, '').trim();
  if (!text) throw new Error('The prompt compiler returned an empty response.');
  return text;
}

export async function critiquePrompt(userIdea: string, blueprint: BlueprintSchema, prompt: string, ai: ActiveAi): Promise<CriticReport> {
  const content = await chat({
    providerId: ai.providerId,
    model: ai.model,
    apiKey: ai.apiKey,
    temperature: 0.2,
    messages: aiMessages(
      CRITIC_SYSTEM_PROMPT,
      `ORIGINAL USER IDEA:\n${userIdea.trim()}\n\nMUSIC BLUEPRINT:\n${JSON.stringify(blueprint)}\n\nGENERATED SUNO PROMPT:\n${prompt}`
    ),
  });
  try {
    return coerceCriticReport(JSON.parse(extractJson(content)));
  } catch {
    throw new Error('The critic returned an unreadable response.');
  }
}

export async function refineWithCritic(
  userIdea: string,
  blueprint: BlueprintSchema,
  prompt: string,
  critic: CriticReport,
  ai: ActiveAi
): Promise<string> {
  const content = await chat({
    providerId: ai.providerId,
    model: ai.model,
    apiKey: ai.apiKey,
    temperature: 0.6,
    messages: aiMessages(
      REFINE_SYSTEM_PROMPT,
      `ORIGINAL USER IDEA:\n${userIdea.trim()}\n\nMUSIC BLUEPRINT:\n${JSON.stringify(blueprint)}\n\nPREVIOUS PROMPT:\n${prompt}\n\nCRITIC REPORT:\n${JSON.stringify(critic)}`
    ),
  });
  const text = content.trim().replace(/^```[a-z]*\s*/i, '').replace(/```$/i, '').trim();
  if (!text) throw new Error('The refiner returned an empty response.');
  return text;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

const REFINE_THRESHOLD = 80;

export async function generateSunoPrompt(
  userIdea: string,
  mode: PipelineMode,
  ai: ActiveAi,
  onStage?: (stage: PipelineStage) => void
): Promise<PipelineResult> {
  const modelLabel = `${ai.model}`;

  onStage?.('intent');
  const blueprint = await analyzeIntent(userIdea, ai);

  onStage?.('compiler');
  let prompt = await compilePrompt(blueprint, ai);

  let critic: CriticReport | null = null;
  let refined = false;

  if (mode === 'best') {
    onStage?.('critic');
    critic = await critiquePrompt(userIdea, blueprint, prompt, ai);

    if (critic.overall_score < REFINE_THRESHOLD) {
      onStage?.('refiner');
      prompt = await refineWithCritic(userIdea, blueprint, prompt, critic, ai);
      refined = true;
      // Second-chance critique only: never loop, never spend more calls
      try {
        critic = await critiquePrompt(userIdea, blueprint, prompt, ai);
      } catch {
        // keep the first critic report if the re-critique fails
      }
    }
  }

  return {
    blueprint,
    prompt,
    critic,
    refined,
    mode,
    modelLabel,
    titleCandidates: titleFromDescription(blueprint.concept || userIdea).slice(0, 3),
  };
}

// ---------------------------------------------------------------------------
// Blueprint-level refine — small, targeted edits, then a single recompile
// ---------------------------------------------------------------------------

const SURPRISE_BLUEPRINT_APPENDS = [
  'with one unexpected but tasteful turn in the final section',
  'with one signature textural detail listeners will remember',
  'with a brief near-silent moment before the last section blooms',
];

function pushUnique(list: string[], value: string, max: number): string[] {
  return Array.from(new Set([...list, value])).slice(0, max);
}

export function refineBlueprint(bp: BlueprintSchema, action: RefineAction): BlueprintSchema {
  const next: BlueprintSchema = JSON.parse(JSON.stringify(bp));

  switch (action) {
    case 'darker':
      next.mood = pushUnique(next.mood, 'dark', 5);
      next.production = pushUnique(next.production, 'moody low-lit atmosphere', 8);
      next.avoid = pushUnique(next.avoid ?? [], 'bright cheerful tones', 8);
      break;
    case 'more-emotional':
      next.vocals = { ...next.vocals, delivery: pushUnique([next.vocals.delivery].filter(Boolean) as string[], 'raw, emotionally exposed', 2).join(', ') };
      next.production = pushUnique(next.production, 'expressive dynamic swells', 8);
      break;
    case 'bigger-chorus': {
      const peak = next.structure.reduce((m, s, i) => (s.energy > next.structure[m].energy ? i : m), 0);
      next.structure = next.structure.map((s, i) => (i === peak ? { ...s, energy: Math.min(10, s.energy + 2) } : s));
      next.production = pushUnique(next.production, 'anthemic wide chorus lift', 8);
      break;
    }
    case 'more-cinematic':
      next.genre.secondary = pushUnique(next.genre.secondary, 'cinematic', 3);
      next.production = pushUnique(next.production, 'wide spatial reverb', 8);
      break;
    case 'more-commercial':
      next.production = pushUnique(next.production, 'polished radio-ready mix', 8);
      break;
    case 'more-experimental':
      next.mood = pushUnique(next.mood, 'experimental', 5);
      next.production = pushUnique(next.production, 'unexpected textural turns', 8);
      break;
    case 'less-busy':
      next.instrumentation = next.instrumentation.slice(0, 4);
      next.production = pushUnique(next.production, 'spacious minimal arrangement', 8);
      break;
    case 'surprise':
      next.concept = `${next.concept} ${SURPRISE_BLUEPRINT_APPENDS[Math.floor(Math.random() * SURPRISE_BLUEPRINT_APPENDS.length)]}`.trim();
      break;
  }

  return next;
}

// ---------------------------------------------------------------------------
// Blueprint → display conversion (pipeline output to UI blueprint)
// ---------------------------------------------------------------------------

const VOCAL_PRESENCE_LABEL: Record<BlueprintSchema['vocals']['presence'], string> = {
  none: 'Instrumental',
  male: 'Male vocal',
  female: 'Female vocal',
  mixed: 'Mixed vocals',
  unspecified: 'Lead vocal (open)',
};

export function blueprintToDisplay(bp: BlueprintSchema, prompt: string, mode: PipelineMode): SongBlueprint {
  const words = titleFromDescription(bp.concept).slice(0, 3);
  const fallbackTitle = words.length > 0 ? words.join(' ') : 'Untitled Idea';

  const arcText = bp.emotional_arc.length > 0 ? bp.emotional_arc.join(' → ') : bp.mood.join(', ');
  const tempoText = bp.tempo ? `${bp.tempo.bpm ? `${bp.tempo.bpm} BPM` : ''}${bp.tempo.bpm && bp.tempo.description ? ' · ' : ''}${bp.tempo.description || 'free tempo'}` : 'Free tempo';

  const energy = bp.structure.length > 0 ? Math.max(...bp.structure.map((s) => s.energy)) : 5;

  const why: { snippet: string; reason: string }[] = [];
  if (bp.genre.secondary.length > 0) {
    why.push({
      snippet: `${bp.genre.primary} with ${bp.genre.secondary.join(', ')}`,
      reason: 'Genre fusion: the secondary styles shape texture and phrasing without taking over.',
    });
  }
  if (bp.emotional_arc.length > 1) {
    why.push({ snippet: bp.emotional_arc.join(' → '), reason: 'The emotional arc drives the arrangement and dynamics over time.' });
  }
  if (bp.vocals.presence !== 'none' && bp.vocals.delivery) {
    why.push({ snippet: bp.vocals.delivery, reason: 'Describes how the vocal is performed, not just who is singing.' });
  }
  if (bp.production.length > 0) {
    why.push({ snippet: bp.production.slice(0, 3).join(', '), reason: 'Production choices set the space and character of the mix.' });
  }

  return {
    title: fallbackTitle,
    titleCandidates: words.length > 0 ? words : ['Untitled Idea'],
    genre: bp.genre.secondary.length > 0 ? `${bp.genre.primary} × ${bp.genre.secondary.join(', ')}` : bp.genre.primary,
    mood: bp.mood.slice(0, 3).join(' · ') || 'Open mood',
    moodArc: arcText || 'Steady',
    tempo: tempoText,
    vocals: bp.vocals.presence === 'none' ? 'Instrumental' : `${VOCAL_PRESENCE_LABEL[bp.vocals.presence]}${bp.vocals.character ? ` — ${bp.vocals.character}` : ''}`,
    instruments: bp.instrumentation.slice(0, 6),
    energy,
    prompt,
    why: why.slice(0, 4),
    concept: bp.concept,
    structure: bp.structure,
    production: bp.production,
    avoid: bp.avoid,
    pipelineMode: mode,
  };
}
