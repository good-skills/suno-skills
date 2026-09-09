import { genres, emotions, instruments, energyLevels } from '@/data/musicKnowledge';
import { generatePrompt, type MusicSpec, type PromptResult } from '@/utils/promptEngine';

/**
 * The Song Blueprint layer sits on top of the rule-based prompt engine.
 * It turns a raw MusicSpec into named song decisions (genre, mood, arc,
 * tempo, vocals, instrumentation, energy) plus a Suno prompt, and keeps
 * a localStorage song library for retention.
 */

export type EnergyAxisValue = 1 | 2 | 3 | 4 | 5;

export interface SongBlueprint {
  title: string;
  titleCandidates: string[];
  genre: string;
  mood: string;
  moodArc: string;
  tempo: string;
  vocals: string;
  instruments: string[];
  energy: number; // 1-5
  prompt: string;
  why: { snippet: string; reason: string }[];
  /** Populated only when the LLM pipeline produced this blueprint. */
  concept?: string;
  structure?: { section: string; description: string; energy: number }[];
  production?: string[];
  avoid?: string[];
  pipelineMode?: 'fast' | 'best';
}

export interface SavedSong {
  id: string;
  title: string;
  blurb: string;
  date: string; // ISO
  spec: MusicSpec;
}

export interface IdeaHints {
  moodId: string | null;
  genreId: string | null;
  vocalId: MusicSpec['vocals'];
  tempoId: MusicSpec['tempo'];
  matchedInstruments: string[];
  arc: string | null;
}

// ---------------------------------------------------------------------------
// Idea parsing — lets people write anything and maps it onto the spec
// ---------------------------------------------------------------------------

const IDEA_MOODS: { id: string; words: string[] }[] = [
  { id: 'sad', words: ['sad', 'heartbreak', 'breakup', 'lonely', 'alone', 'melanchol', 'grief', 'miss', 'crying', 'tears', 'غمگین', 'دلتنگ'] },
  { id: 'happy', words: ['happy', 'joy', 'celebrat', 'sunny', 'bright', 'fun', 'شاد'] },
  { id: 'tension', words: ['tension', 'suspense', 'thriller', 'chase', 'حالت تنش'] },
  { id: 'nostalgia', words: ['nostalg', 'memor', 'childhood', 'old days', 'retro', '80s', 'نوستالژی', 'خاطره'] },
  { id: 'hope', words: ['hope', 'uplift', 'inspir', 'rising', 'triumph', 'امید'] },
  { id: 'dark', words: ['dark', 'evil', 'sinister', 'brooding', 'ominous', 'تاریک'] },
  { id: 'calm', words: ['calm', 'peace', 'relax', 'meditat', 'serene', 'quiet', 'آرام'] },
  { id: 'epic', words: ['epic', 'battle', 'heroic', 'final boss', 'trailer', 'حماسی'] },
  { id: 'romance', words: ['romance', 'love', 'tender', 'wedding', 'عاشقانه'] },
  { id: 'anxiety', words: ['anxiet', 'panic', 'horror', 'unsettling', 'nightmare', 'اضطراب', 'ترسناک'] },
];

const IDEA_GENRES: { id: string; words: string[] }[] = [
  { id: 'cinematic', words: ['cinematic', 'film', 'movie', 'soundtrack', 'score', 'سینمایی'] },
  { id: 'piano-solo', words: ['solo piano', 'piano solo', 'just piano', 'پیانو'] },
  { id: 'lofi', words: ['lo-fi', 'lofi', 'study beat', 'chillhop', 'لو-فای'] },
  { id: 'electronic', words: ['electronic', 'synthwave', 'edm', 'techno', 'house', 'الکترونیک'] },
  { id: 'classical', words: ['classical', 'orchestra', 'mozart', 'کلاسیک'] },
  { id: 'ambient', words: ['ambient', 'drone', 'atmospheric', 'امبینت'] },
  { id: 'hiphop', words: ['hip hop', 'hip-hop', 'rap', 'trap', 'beat', 'هیپ-هاپ'] },
  { id: 'rock', words: ['rock', 'metal', 'guitar riff', 'راک'] },
  { id: 'jazz', words: ['jazz', 'swing', 'sax', 'جاز'] },
  { id: 'rnb', words: ['r&b', 'rnb', 'soul', 'آر اند بی'] },
  { id: 'folk', words: ['folk', 'acoustic', 'campfire', 'فولک'] },
  { id: 'orchestral', words: ['orchestral', 'symphonic', 'ارکستر'] },
];

const ARC_HINTS: { re: RegExp; arc: string }[] = [
  { re: /\b(start|begin|intro)\w*\b.*\b(build|grow|swell|explode|chorus)\w*\b|\bbuild\w*\b.*\b(into|to)\b.*\bchorus\b/i, arc: 'Intimate start → explosive chorus' },
  { re: /\b(quiet|soft|gentle|small)\b.*\b(loud|huge|big|massive|epic)\b/i, arc: 'Quiet → huge' },
  { re: /\b(fade|slow|drift)\w*\b.*\b(end|out)\w*\b/i, arc: 'Gradual build → fade-out ending' },
  { re: /\b(keep|stay|constant|steady)\b.*(level|throughout|all the way)/i, arc: 'Steady throughout' },
];

export function parseIdeaHints(description: string): IdeaHints {
  const lower = description.toLowerCase();

  const moodId = IDEA_MOODS.find((m) => m.words.some((w) => lower.includes(w)))?.id ?? null;
  const genreId = IDEA_GENRES.find((g) => g.words.some((w) => lower.includes(w)))?.id ?? null;
  const arc = ARC_HINTS.find((h) => h.re.test(description))?.arc ?? null;

  const vocalId: MusicSpec['vocals'] = /\b(instrumental|no vocals|without vocals)\b/i.test(lower)
    ? 'instrumental'
    : /\b(female (vocal|voice|singer)|she sings)\b/i.test(lower)
      ? 'female'
      : /\b(male (vocal|voice|singer)|he sings)\b/i.test(lower)
        ? 'male'
        : /\b(vocal|sing|song with words|lyrics)\b/i.test(lower)
          ? 'any'
          : 'instrumental';

  const tempoId: MusicSpec['tempo'] = /\b(very slow|downtempo|40|50|60)\b/.test(lower)
    ? 'very-slow'
    : /\b(slow|ballad)\b/.test(lower)
      ? 'slow'
      : /\b(fast|uptempo|driving|energetic)\b/.test(lower)
        ? 'fast'
        : /\b(very fast|racing|frantic)\b/.test(lower)
          ? 'very-fast'
          : null;

  const matchedInstruments = instruments
    .filter((i) => lower.includes(i.name.toLowerCase()))
    .map((i) => i.id);

  return { moodId, genreId, vocalId, tempoId, matchedInstruments, arc };
}

/** Merge parsed idea hints into a spec without clobbering deliberate user choices. */
export function specFromIdea(base: MusicSpec, description: string): MusicSpec {
  const hints = parseIdeaHints(description);
  return {
    ...base,
    description,
    emotionId: hints.moodId ?? base.emotionId,
    genreId: hints.genreId ?? base.genreId,
    // Only override vocals when the idea explicitly mentions them
    vocals: hints.vocalId !== 'instrumental' ? hints.vocalId : base.vocals,
    tempo: hints.tempoId ?? (hints.moodId || hints.genreId ? null : base.tempo),
    instrumentIds: hints.matchedInstruments.length > 0 ? hints.matchedInstruments.slice(0, 4) : base.instrumentIds,
  };
}

// ---------------------------------------------------------------------------
// Compile stages — perceived process for the free-form input
// ---------------------------------------------------------------------------

export const COMPILE_STAGES = [
  'Analyzing your idea…',
  'Finding musical direction…',
  'Building song structure…',
  'Writing Suno prompt…',
];

// ---------------------------------------------------------------------------
// Refine actions — keep iteration inside the product
// ---------------------------------------------------------------------------

export type RefineAction =
  | 'darker'
  | 'more-emotional'
  | 'bigger-chorus'
  | 'more-cinematic'
  | 'more-commercial'
  | 'more-experimental'
  | 'less-busy'
  | 'surprise';

export const REFINE_ACTIONS: { id: RefineAction; label: string }[] = [
  { id: 'darker', label: 'Darker' },
  { id: 'more-emotional', label: 'More emotional' },
  { id: 'bigger-chorus', label: 'Bigger chorus' },
  { id: 'more-cinematic', label: 'More cinematic' },
  { id: 'more-commercial', label: 'More commercial' },
  { id: 'more-experimental', label: 'More experimental' },
  { id: 'less-busy', label: 'Less busy' },
  { id: 'surprise', label: 'Surprise me' },
];

const REFINE_INSTRUCTIONS: Record<Exclude<RefineAction, 'surprise'>, string> = {
  darker: 'Make the overall tone darker and moodier: lower register, minor colorings, heavier low-end.',
  'more-emotional': 'Push the emotional intensity: more expressive dynamics, rubato phrasing, intimate-to-swell dynamics.',
  'bigger-chorus': 'Make the chorus land much bigger: fuller instrumentation at the hook, wider stereo image, anthemic lift.',
  'more-cinematic': 'Give it a more cinematic treatment: wide spatial reverb, rich orchestration, narrative dynamic arc.',
  'more-commercial': 'Polish it toward a commercial sound: cleaner production, tighter arrangement, radio-friendly mix.',
  'more-experimental': 'Push it more experimental: unusual textures, unexpected turns, extended techniques.',
  'less-busy': 'Simplify the arrangement: fewer layers, more space, restraint in the mid-range.',
};

export const SURPRISE_APPENDS = [
  'Add an unexpected but tasteful twist in the second half.',
  'Include one signature textural detail listeners will remember.',
  'Let the final section resolve in a subtly surprising way.',
  'Add a brief moment of near-silence before the last section blooms.',
];

export function applyRefine(spec: MusicSpec, action: RefineAction): MusicSpec {
  if (action === 'surprise') {
    const pick = SURPRISE_APPENDS[Math.floor(Math.random() * SURPRISE_APPENDS.length)];
    return { ...spec, description: `${spec.description.trim()} ${pick}`.trim() };
  }

  const instruction = REFINE_INSTRUCTIONS[action];
  const description = `${spec.description.trim()} ${instruction}`.replace(/\s+/g, ' ').trim();
  const next: MusicSpec = { ...spec, description };

  if (action === 'darker') next.emotionId = 'dark';
  if (action === 'more-emotional' && spec.emotionId === 'happy') next.emotionId = 'romance';
  if (action === 'more-cinematic') next.genreId = 'cinematic';
  if (action === 'less-busy') next.energyId = 'low';
  if (action === 'bigger-chorus') next.energyId = 'high';

  return next;
}

// ---------------------------------------------------------------------------
// Blueprint building
// ---------------------------------------------------------------------------

function energyToNumber(energyId: string): number {
  const idx = energyLevels.findIndex((e) => e.id === energyId);
  return Math.min(5, Math.max(1, idx + 1));
}

const TITLE_STOP_WORDS = new Set(['a', 'an', 'the', 'about', 'of', 'in', 'on', 'at', 'for', 'with', 'and', 'to', 'my', 'your']);

export function titleFromDescription(description: string): string[] {
  const words = description
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !TITLE_STOP_WORDS.has(w.toLowerCase()));
  return words.slice(0, 3).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}

function moodArcFromSpec(spec: MusicSpec, hints: IdeaHints): string {
  if (hints.arc) return hints.arc;
  const emotion = emotions.find((e) => e.id === spec.emotionId);
  if (spec.emotionId === 'hope') return 'Melancholic → hopeful';
  if (spec.emotionId === 'epic') return 'Gathering → triumphant';
  if (spec.emotionId === 'tension' || spec.emotionId === 'anxiety') return 'Uneasy → unresolved';
  if (spec.energyId === 'very-high') return 'Steady → explosive';
  if (spec.energyId === 'very-low') return 'Constant, suspended';
  return emotion ? `Sustained ${emotion.name.toLowerCase()}` : 'Steady';
}

export function buildBlueprint(spec: MusicSpec, result: PromptResult): SongBlueprint {
  const hints = parseIdeaHints(spec.description);
  const genre = genres.find((g) => g.id === spec.genreId);
  const emotion = emotions.find((e) => e.id === spec.emotionId);
  const energy = energyLevels.find((e) => e.id === spec.energyId);
  const selected = instruments.filter((i) => spec.instrumentIds.includes(i.id));

  const vocalLabel =
    spec.vocals === 'female' ? 'Female vocal' : spec.vocals === 'male' ? 'Male vocal' : spec.vocals === 'any' ? 'Lead vocal (open)' : 'Instrumental';

  const titleWords = titleFromDescription(spec.description);
  const title = titleWords.length > 0 ? titleWords.join(' ') : genre ? `${genre.name} Sketch` : 'Untitled Idea';

  const titleCandidates = Array.from(new Set([title, ...titleWords.slice(0, 2), emotion ? `${emotion.name} in Motion` : 'Sonic Sketch'])).slice(0, 3);

  const why: { snippet: string; reason: string }[] = [];
  if (genre) why.push({ snippet: genre.soundCharacter, reason: `Defines the overall sonic identity of the ${genre.name.toLowerCase()} direction.` });
  if (emotion) why.push({ snippet: emotion.tonality, reason: `Anchors the ${emotion.name.toLowerCase()} emotional color.` });
  if (emotion) why.push({ snippet: emotion.dynamics, reason: 'Shapes how intensity rises and falls across the song.' });
  if (energy) why.push({ snippet: `Tempo around ${energy.bpmRange}`, reason: 'Sets the pace the listener feels immediately.' });
  if (selected.length > 0) {
    why.push({
      snippet: `Featuring ${selected.map((i) => i.name.toLowerCase()).join(', ')}`,
      reason: 'Locks the instrumentation so the arrangement stays focused.',
    });
  }
  if (spec.vocals === 'instrumental') why.push({ snippet: 'No vocals, instrumental only', reason: 'Keeps the focus on pure musical direction.' });

  return {
    title,
    titleCandidates,
    genre: genre?.name ?? 'Open genre',
    mood: emotion ? emotion.name : 'Open mood',
    moodArc: moodArcFromSpec(spec, hints),
    tempo: energy ? energy.bpmRange : 'Free tempo',
    vocals: vocalLabel,
    instruments: selected.length > 0 ? selected.map((i) => i.name) : (genre?.commonInstruments.slice(0, 3) ?? []),
    energy: energyToNumber(spec.energyId),
    prompt: result.prompt,
    why: why.slice(0, 4),
  };
}

// ---------------------------------------------------------------------------
// Saved songs (localStorage) — retention without accounts
// ---------------------------------------------------------------------------

const LIBRARY_KEY = 'suno-skills:library:v1';

export function loadSavedSongs(): SavedSong[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedSong[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSong(song: SavedSong): SavedSong[] {
  const all = [song, ...loadSavedSongs().filter((s) => s.id !== song.id)].slice(0, 50);
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable — degrade silently
  }
  return all;
}

export function deleteSavedSong(id: string): SavedSong[] {
  const all = loadSavedSongs().filter((s) => s.id !== id);
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
  return all;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}
