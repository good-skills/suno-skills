import {
  genres, emotions, instruments, energyLevels, structures,
  getRecommendedMode, getRecommendedProduction,
  compressPrompt,
  type GenreProfile, type EmotionProfile, type TokenEntry,
} from '@/data/musicKnowledge';

export interface MusicSpec {
  genreId: string;
  emotionId: string;
  instrumentIds: string[];
  excludeInstrumentIds: string[];
  energyId: string;
  tempo: 'very-slow' | 'slow' | 'moderate' | 'fast' | 'very-fast' | null;
  structureId: string | null;
  vocals: 'none' | 'female' | 'male' | 'instrumental' | 'any';
  description: string;
}

export interface PromptResult {
  prompt: string;
  lyricsMetaTags: string;
  explanation: string;
  explanationFa: string;
  warnings: string[];
  scores: {
    intentMatch: number;
    genreAccuracy: number;
    emotionAccuracy: number;
    instrumentConsistency: number;
    sunoCompatibility: number;
  };
  tokenAnalysis: {
    prompt: TokenEntry[];
    totalTokens: number;
    charCount: number;
    maxChars: number;
  };
}

const tempoMap: Record<string, string> = {
  'very-slow': '40-60 BPM',
  'slow': '60-80 BPM',
  'moderate': '80-110 BPM',
  'fast': '110-140 BPM',
  'very-fast': '140-180 BPM',
};

// ── STRATEGY 1: Golden Formula Assembler ──

interface PromptSlot {
  priority: number;
  tokens: string[];
  category: TokenEntry['category'];
}

function assembleGoldenFormula(spec: MusicSpec, genre: GenreProfile, emotion: EmotionProfile): PromptSlot[] {
  const slots: PromptSlot[] = [];

  slots.push({
    priority: 10,
    tokens: [`${genre.soundCharacter} ${genre.name}`.trim()],
    category: 'genre',
  });

  const selectedInstruments = instruments.filter((i) => spec.instrumentIds.includes(i.id));
  if (selectedInstruments.length > 0) {
    slots.push({
      priority: 9,
      tokens: selectedInstruments.map((i) => i.name.toLowerCase()),
      category: 'instrument',
    });
  } else if (genre.commonInstruments.length > 0) {
    slots.push({
      priority: 9,
      tokens: genre.commonInstruments.slice(0, 3),
      category: 'instrument',
    });
  }

  if (spec.vocals === 'female') {
    slots.push({ priority: 8, tokens: ['female vocals'], category: 'modifier' });
  } else if (spec.vocals === 'male') {
    slots.push({ priority: 8, tokens: ['male vocals'], category: 'modifier' });
  } else if (spec.vocals === 'any') {
    slots.push({ priority: 8, tokens: ['expressive lead vocals'], category: 'modifier' });
  } else {
    slots.push({ priority: 8, tokens: ['instrumental only'], category: 'modifier' });
  }

  slots.push({
    priority: 7,
    tokens: [
      emotion.tonality,
      emotion.melodicContour,
      emotion.harmonicProgression,
      emotion.dynamics,
    ],
    category: 'emotion',
  });

  const mode = getRecommendedMode(spec.emotionId);
  if (mode) {
    slots.push({ priority: 6, tokens: mode.promptKeywords, category: 'modifier' });
  }

  const bpm = spec.tempo ? tempoMap[spec.tempo] : `${energyLevels.find(e => e.id === spec.energyId)?.bpmRange ?? '80-110 BPM'}`;
  slots.push({ priority: 5, tokens: [bpm], category: 'tempo' });

  const prodIntents = getRecommendedProduction(spec.emotionId, spec.energyId);
  const topProd = prodIntents.slice(0, 2);
  if (topProd.length > 0) {
    slots.push({
      priority: 4,
      tokens: topProd.flatMap((p) => p.keywords.slice(0, 2)),
      category: 'production',
    });
  }

  if (spec.description.trim()) {
    const extracted = extractIntent(spec.description);
    if (extracted) {
      slots.push({ priority: 3, tokens: [extracted], category: 'modifier' });
    }
  }

  return slots;
}

// ── STRATEGY 6: Smart Exclusions ──

function buildSmartExclusions(
  spec: MusicSpec,
  genre: GenreProfile,
): { exclusions: string[]; antiHallucination: string[] } {
  const exclusions: string[] = [];
  const antiHallucination: string[] = [];
  const excludedInstruments = instruments.filter((i) => spec.excludeInstrumentIds.includes(i.id));

  for (const inst of excludedInstruments) {
    exclusions.push(`strictly NO ${inst.name.toLowerCase()}`);
  }

  if (genre.id === 'piano-solo') {
    const implicitAdds = ['strings', 'drums', 'bass', 'synth', 'brass', 'percussion', 'pads'];
    for (const imp of implicitAdds) {
      if (!spec.instrumentIds.includes(imp) && !spec.excludeInstrumentIds.includes(imp)) {
        exclusions.push(`strictly NO ${imp}`);
      }
    }
    exclusions.push('unaccompanied solo instrument');
    exclusions.push('single instrument recording');
  }

  if (genre.id === 'hiphop' && (spec.vocals === 'none' || spec.vocals === 'instrumental')) {
    antiHallucination.push('instrumental beat tape, no rapping, no MC, no voice');
  }
  if (genre.id === 'rnb' && (spec.vocals === 'none' || spec.vocals === 'instrumental')) {
    antiHallucination.push('instrumental R&B, no singing, no vocals');
  }
  if (genre.id === 'electronic' && spec.instrumentIds.includes('synth') && (spec.vocals === 'none' || spec.vocals === 'instrumental')) {
    antiHallucination.push('pure electronic instrumental, no vocal samples');
  }

  if (genre.id === 'cinematic' && spec.instrumentIds.length === 1 && spec.instrumentIds.includes('piano')) {
    if (!exclusions.some(e => e.includes('strings'))) exclusions.push('strictly NO strings');
    if (!exclusions.some(e => e.includes('brass'))) exclusions.push('strictly NO brass');
    if (!exclusions.some(e => e.includes('orchestra'))) exclusions.push('zero orchestra');
  }

  return { exclusions, antiHallucination };
}

// ── STRATEGY 3: Temporal Arc & Meta-Tags ──

function generateMetaTags(
  spec: MusicSpec,
  genre: GenreProfile,
  emotion: EmotionProfile,
  selectedInstrumentNames: string[],
): string {
  const lines: string[] = [];
  const inst = selectedInstrumentNames.length > 0 ? selectedInstrumentNames[0] : genre.commonInstruments[0] ?? 'piano';
  const mainInstLower = inst.toLowerCase();

  const isAmbientLike = genre.id === 'ambient' || genre.id === 'piano-solo';
  const isEpicLike = genre.id === 'orchestral' || genre.id === 'cinematic';
  const isSongLike = genre.id === 'hiphop' || genre.id === 'rnb' || genre.id === 'folk';

  if (isSongLike && spec.structureId) {
    const structure = structures.find(s => s.id === spec.structureId);
    const parts = structure?.parts ?? ['Intro', 'Verse', 'Chorus', 'Bridge', 'Outro'];
    for (const part of parts) {
      const lower = part.toLowerCase();
      if (lower.includes('intro')) {
        lines.push(`[Intro: atmospheric swell, establishing ${mainInstLower}, no rhythm]`);
      } else if (lower.includes('verse')) {
        lines.push(`[Verse: ${mainInstLower}, sparse arrangement, ${emotion.dynamics}]`);
      } else if (lower.includes('chorus')) {
        lines.push(`[Chorus: fuller ${mainInstLower}, ${emotion.melodicContour}, ${emotion.dynamics}]`);
      } else if (lower.includes('bridge')) {
        lines.push(`[Bridge: contrasting ${mainInstLower} voicing, tension build]`);
      } else if (lower.includes('outro')) {
        lines.push(`[Outro: fading ${mainInstLower} motif, ${isAmbientLike ? 'analog delay trail' : 'gentle resolution'}]`);
      } else if (lower.includes('climax')) {
        lines.push(`[Climax: powerful ${mainInstLower}, ${emotion.dynamics}, wide stereo]`);
      } else if (lower.includes('resolution')) {
        lines.push(`[Resolution: ${mainInstLower} resolution, fading to silence]`);
      } else {
        lines.push(`[${part}: ${mainInstLower}, ${emotion.dynamics}]`);
      }
    }
  } else if (isEpicLike) {
    lines.push(`[Intro: tape hiss, slow atmospheric swell]`);
    lines.push(`[Verse: sparse ${mainInstLower}, intimate close-mic, rubato]`);
    if (emotion.id === 'epic' || emotion.id === 'tension') {
      lines.push(`[Build: rising strings, accelerating tempo, tension build]`);
      lines.push(`[Drop: full orchestral impact, wide stereo, ${emotion.dynamics}]`);
    } else {
      lines.push(`[Bridge: granular synthesis texture, wide reverb]`);
    }
    lines.push(`[Outro: fading motif, ${isAmbientLike ? 'analog delay trail' : 'tape stop effect'}]`);
  } else {
    lines.push(`[Intro: ${mainInstLower}, slow atmospheric swell, no rhythm]`);
    lines.push(`[Main: ${mainInstLower}, ${emotion.melodicContour}, ${emotion.dynamics}]`);
    lines.push(`[Evolution: ${mainInstLower} variation, ${emotion.register}]`);
    lines.push(`[Outro: fading motif, tape hiss, silence]`);
  }

  return lines.join('\n');
}

// ── MAIN ──

export function generatePrompt(spec: MusicSpec): PromptResult {
  const genre = genres.find((g) => g.id === spec.genreId);
  const emotion = emotions.find((e) => e.id === spec.emotionId);

  if (!genre || !emotion) {
    return {
      prompt: '',
      lyricsMetaTags: '',
      explanation: '',
      explanationFa: '',
      warnings: ['Invalid genre or emotion selection.'],
      scores: { intentMatch: 0, genreAccuracy: 0, emotionAccuracy: 0, instrumentConsistency: 0, sunoCompatibility: 0 },
      tokenAnalysis: { prompt: [], totalTokens: 0, charCount: 0, maxChars: 200 },
    };
  }

  const warnings: string[] = [];
  const slots = assembleGoldenFormula(spec, genre, emotion);
  const rawParts: string[] = [];
  for (const slot of slots) {
    rawParts.push(...slot.tokens);
  }

  const { exclusions, antiHallucination } = buildSmartExclusions(spec, genre);

  let rawPrompt = rawParts.join(', ');
  if (exclusions.length > 0) {
    rawPrompt += '. ' + exclusions.join(', ');
  }
  if (antiHallucination.length > 0) {
    rawPrompt += '. ' + antiHallucination.join(', ');
  }

  const compressed = compressPrompt(rawPrompt, 200);
  let finalPrompt = compressed.compressed;

  if (genre.id === 'piano-solo') {
    finalPrompt += '. solo piano only, no other instruments whatsoever';
  }

  const selectedInstrumentNames = instruments
    .filter((i) => spec.instrumentIds.includes(i.id))
    .map((i) => i.name);
  const lyricsMetaTags = generateMetaTags(spec, genre, emotion, selectedInstrumentNames);

  const explanationParts: string[] = [];
  const explanationPartsFa: string[] = [];

  const mode = getRecommendedMode(spec.emotionId);
  if (mode) {
    explanationParts.push(`Applied ${mode.name} (${mode.moodTag}) instead of plain ${emotion.tonality}`);
    explanationPartsFa.push(`به جای ${emotion.tonality} ساده، از ${mode.nameFa} (${mode.moodTag}) استفاده شد`);
  }

  const prodIntents = getRecommendedProduction(spec.emotionId, spec.energyId);
  if (prodIntents.length > 0) {
    explanationParts.push(`Production vocabulary: ${prodIntents.map(p => p.label).join(', ')} for ${emotion.name.toLowerCase()} + ${genre.name.toLowerCase()}`);
    explanationPartsFa.push(`واژگان تولید: ${prodIntents.map(p => p.labelFa).join('، ')} برای ترکیب ${emotion.nameFa} + ${genre.nameFa}`);
  }

  if (exclusions.length > 0) {
    explanationParts.push(`Smart exclusions: absolute emphasis (${exclusions.length} constraints) to prevent AI hallucination`);
    explanationPartsFa.push(`حذف هوشمند: تأکید مطلق (${exclusions.length} محدودیت) برای جلوگیری از هذیان‌گویی مدل`);
  }

  explanationParts.push(`Prompt compressed from ${compressed.originalTokens} to ${compressed.compressedTokens} tokens (${finalPrompt.length}/200 chars)`);
  explanationPartsFa.push(`پرامپت از ${compressed.originalTokens} به ${compressed.compressedTokens} توکن فشرده شد (${finalPrompt.length}/200 کاراکتر)`);

  const scores = calculateScores(spec, genre, emotion, finalPrompt.length);

  const tokenAnalysis = {
    prompt: compressed.tokenWeights,
    totalTokens: compressed.compressedTokens,
    charCount: finalPrompt.length,
    maxChars: 200,
  };

  return {
    prompt: finalPrompt,
    lyricsMetaTags,
    explanation: explanationParts.join('. ') + '.',
    explanationFa: explanationPartsFa.join('. ') + '.',
    warnings,
    scores,
    tokenAnalysis,
  };
}

function extractIntent(description: string): string {
  const lower = description.toLowerCase().trim();
  if (!lower) return '';

  const keywords: Record<string, string> = {
    'lonely': 'lonely, isolated atmosphere',
    'alone': 'solitude feeling',
    'night': 'nocturnal atmosphere',
    'rain': 'rainy melancholic texture',
    'breakup': 'heartbreak emotion',
    'walking': 'steady walking pace',
    'empty': 'empty spacious atmosphere',
    'dark': 'deeply brooding tone',
    'dream': 'dreamlike ethereal quality',
    'memory': 'nostalgic memory texture',
    'hope': 'hopeful rising quality',
    'love': 'tender romantic warmth',
    'battle': 'intense combative energy',
    'journey': 'adventurous journey feel',
    'space': 'vast spatial atmosphere',
    'ocean': 'flowing watery texture',
    'forest': 'organic natural atmosphere',
    'city': 'urban textured atmosphere',
    'morning': 'fresh morning lightness',
    'sunset': 'warm golden glow',
  };

  const matches: string[] = [];
  for (const [key, value] of Object.entries(keywords)) {
    if (lower.includes(key)) {
      matches.push(value);
    }
  }

  return matches.length > 0 ? matches.join(', ') : lower;
}

function calculateScores(
  spec: MusicSpec,
  genre: GenreProfile,
  emotion: EmotionProfile,
  promptLength: number,
): PromptResult['scores'] {
  let intentMatch = 85;
  let genreAccuracy = 90;
  let emotionAccuracy = 92;
  let instrumentConsistency = 100;
  let sunoCompatibility = 88;

  if (spec.description.trim()) intentMatch = Math.min(98, intentMatch + 8);

  if (genre.id === 'piano-solo' && ['sad', 'romance', 'calm'].includes(emotion.id)) {
    emotionAccuracy = Math.min(99, emotionAccuracy + 5);
  }
  if (genre.id === 'cinematic' && ['epic', 'tension'].includes(emotion.id)) {
    genreAccuracy = Math.min(98, genreAccuracy + 5);
  }

  const mode = getRecommendedMode(spec.emotionId);
  if (mode) {
    emotionAccuracy = Math.min(99, emotionAccuracy + 3);
  }

  const prodIntents = getRecommendedProduction(spec.emotionId, spec.energyId);
  if (prodIntents.length > 0) {
    sunoCompatibility = Math.min(98, sunoCompatibility + 4);
  }

  if (genre.id === 'piano-solo' && spec.instrumentIds.length > 1) {
    instrumentConsistency -= 20;
  }
  if (spec.excludeInstrumentIds.length > 0 && spec.instrumentIds.some((id) => spec.excludeInstrumentIds.includes(id))) {
    instrumentConsistency -= 50;
  }

  if (promptLength <= 200) {
    sunoCompatibility = Math.min(98, sunoCompatibility + 5);
  } else if (promptLength > 250) {
    sunoCompatibility -= 5;
  }

  const totalConstraints = spec.instrumentIds.length + spec.excludeInstrumentIds.length;
  if (totalConstraints > 6) {
    sunoCompatibility -= 10;
  }

  return { intentMatch, genreAccuracy, emotionAccuracy, instrumentConsistency, sunoCompatibility };
}

export function detectConflicts(spec: MusicSpec): string[] {
  const conflicts: string[] = [];

  if (spec.genreId === 'piano-solo' && spec.instrumentIds.length > 1) {
    conflicts.push('Piano solo genre selected but multiple instruments specified');
  }
  if (spec.tempo === 'very-fast' && spec.emotionId === 'calm') {
    conflicts.push('Very fast tempo conflicts with calm emotion');
  }
  if (spec.energyId === 'very-high' && spec.emotionId === 'sad') {
    conflicts.push('Very high energy conflicts with sad emotion');
  }
  const overlap = spec.instrumentIds.filter((id) => spec.excludeInstrumentIds.includes(id));
  if (overlap.length > 0) {
    const names = instruments.filter((i) => overlap.includes(i.id)).map((i) => i.name);
    conflicts.push(`${names.join(', ')} is both included and excluded`);
  }

  return conflicts;
}
