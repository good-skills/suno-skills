import { genres, emotions, instruments, energyLevels, structures, type GenreProfile, type EmotionProfile } from '@/data/musicKnowledge';

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
}

const tempoMap: Record<string, string> = {
  'very-slow': 'very slow, 40-60 BPM',
  'slow': 'slow, 60-80 BPM',
  'moderate': 'moderate tempo, 80-110 BPM',
  'fast': 'fast, 110-140 BPM',
  'very-fast': 'very fast, 140-180 BPM',
};

export function generatePrompt(spec: MusicSpec): PromptResult {
  const genre = genres.find((g) => g.id === spec.genreId);
  const emotion = emotions.find((e) => e.id === spec.emotionId);
  const energy = energyLevels.find((e) => e.id === spec.energyId);
  const structure = spec.structureId ? structures.find((s) => s.id === spec.structureId) : null;
  const selectedInstruments = instruments.filter((i) => spec.instrumentIds.includes(i.id));
  const excludedInstruments = instruments.filter((i) => spec.excludeInstrumentIds.includes(i.id));

  const warnings: string[] = [];
  const parts: string[] = [];

  // 1. Genre
  if (genre) {
    parts.push(genre.soundCharacter);
  }

  // 2. Emotion translation
  if (emotion) {
    parts.push(emotion.tonality);
    parts.push(emotion.melodicContour);
    parts.push(emotion.harmonicProgression);
    parts.push(emotion.dynamics);
    if (emotion.noteDuration !== 'sustained notes') {
      parts.push(emotion.noteDuration);
    }
  }

  // 3. Tempo
  if (spec.tempo && tempoMap[spec.tempo]) {
    parts.push(tempoMap[spec.tempo]);
  } else if (energy) {
    parts.push(`tempo around ${energy.bpmRange}`);
  }

  // 4. Instruments - positive constraints
  if (selectedInstruments.length > 0) {
    const instNames = selectedInstruments.map((i) => i.name.toLowerCase());
    parts.push(`featuring ${instNames.join(', ')}`);
  } else if (genre && genre.commonInstruments.length > 0) {
    parts.push(`featuring ${genre.commonInstruments.slice(0, 3).join(', ')}`);
  }

  // 5. Negative constraints
  const negativeParts: string[] = [];
  if (excludedInstruments.length > 0) {
    negativeParts.push(...excludedInstruments.map((i) => `no ${i.name.toLowerCase()}`));
  }

  // Auto-detect implicit conflicts
  if (genre && genre.id === 'piano-solo') {
    const implicitAdds = ['strings', 'drums', 'bass', 'synth', 'brass', 'percussion'];
    for (const imp of implicitAdds) {
      if (!spec.instrumentIds.includes(imp) && !spec.excludeInstrumentIds.includes(imp)) {
        negativeParts.push(`no ${imp}`);
      }
    }
  }

  // Check for "cinematic" adding strings implicitly
  if (genre && genre.id === 'cinematic' && spec.instrumentIds.length === 1 && spec.instrumentIds.includes('piano')) {
    warnings.push('Cinematic genre may cause Suno to add orchestral strings. Added negative constraints to keep it piano-focused.');
    if (!negativeParts.includes('no strings')) {
      negativeParts.push('no strings');
    }
    if (!negativeParts.includes('no brass')) {
      negativeParts.push('no brass');
    }
  }

  // 6. Structure
  if (structure) {
    parts.push(`structure: ${structure.parts.join(' → ')}`);
  }

  // 7. Energy / dynamics
  if (energy) {
    parts.push(`${energy.dynamicLevel} dynamics`);
  }

  // 8. Vocals
  if (spec.vocals === 'none' || spec.vocals === 'instrumental') {
    parts.push('no vocals, instrumental only');
    negativeParts.push('no vocals');
  } else if (spec.vocals === 'female') {
    parts.push('female vocals');
  } else if (spec.vocals === 'male') {
    parts.push('male vocals');
  } else if (spec.vocals === 'any') {
    parts.push('expressive lead vocals');
  }

  // 9. Genre production style
  if (genre) {
    parts.push(genre.productionStyle);
  }

  // 10. User description
  if (spec.description.trim()) {
    const extracted = extractIntent(spec.description);
    if (extracted) {
      parts.push(extracted);
    }
  }

  // 11. Extra from template
  // (handled by caller via spec.description)

  // Combine
  let prompt = parts.join(', ');

  if (negativeParts.length > 0) {
    prompt += `. ${negativeParts.join(', ')}`;
  }

  // Ensure strong emphasis on solo instruments
  if (genre && genre.id === 'piano-solo') {
    prompt += `. solo piano only, no other instruments whatsoever`;
  }

  // Explanation
  const explanationParts: string[] = [];
  const explanationPartsFa: string[] = [];

  if (emotion) {
    explanationParts.push(`Used ${emotion.tonality} and ${emotion.melodicContour} to convey ${emotion.name.toLowerCase()} emotion`);
    explanationPartsFa.push(`برای انتقال حس ${emotion.nameFa} از ${emotion.tonality} و ${emotion.melodicContour} استفاده شد`);
  }
  if (genre) {
    explanationParts.push(`Applied ${genre.name} production style: ${genre.productionStyle}`);
    explanationPartsFa.push(`سبک تولید ${genre.nameFa} اعمال شد: ${genre.productionStyle}`);
  }
  if (negativeParts.length > 0) {
    explanationParts.push(`Added negative constraints to prevent unwanted instruments`);
    explanationPartsFa.push(`محدودیت‌های منفی اضافه شد تا از سازهای ناخواسته جلوگیری شود`);
  }

  // Scores
  const scores = calculateScores(spec, genre, emotion);

  return {
    prompt,
    explanation: explanationParts.join('. ') + '.',
    explanationFa: explanationPartsFa.join('. ') + '.',
    warnings,
    scores,
  };
}

function extractIntent(description: string): string {
  const lower = description.toLowerCase().trim();
  if (!lower) return '';

  // Simple keyword-based intent extraction
  const keywords: Record<string, string> = {
    'lonely': 'lonely, isolated feeling',
    'alone': 'feeling of solitude',
    'night': 'nocturnal atmosphere',
    'rain': 'rainy melancholic atmosphere',
    'breakup': 'heartbreak emotion',
    'walking': 'steady walking pace rhythm',
    'empty': 'empty spacious atmosphere',
    'dark': 'dark brooding tone',
    'dream': 'dreamy ethereal quality',
    'memory': 'nostalgic memory quality',
    'hope': 'hopeful uplifting quality',
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

  // Also add the raw description as context
  if (matches.length === 0) {
    return lower;
  }

  return matches.join(', ');
}

function calculateScores(
  spec: MusicSpec,
  genre: GenreProfile | undefined,
  emotion: EmotionProfile | undefined
): PromptResult['scores'] {
  let intentMatch = 85;
  let genreAccuracy = 90;
  let emotionAccuracy = 92;
  let instrumentConsistency = 100;
  let sunoCompatibility = 88;

  // If description is provided, boost intent
  if (spec.description.trim()) intentMatch = Math.min(98, intentMatch + 8);

  // If genre matches emotion naturally
  if (genre && emotion) {
    if (genre.id === 'piano-solo' && (emotion.id === 'sad' || emotion.id === 'romance' || emotion.id === 'calm')) {
      emotionAccuracy = Math.min(99, emotionAccuracy + 5);
    }
    if (genre.id === 'cinematic' && (emotion.id === 'epic' || emotion.id === 'tension')) {
      genreAccuracy = Math.min(98, genreAccuracy + 5);
    }
  }

  // Check conflicts
  if (genre && genre.id === 'piano-solo' && spec.instrumentIds.length > 1) {
    instrumentConsistency -= 20;
  }

  if (spec.excludeInstrumentIds.length > 0 && spec.instrumentIds.some((id) => spec.excludeInstrumentIds.includes(id))) {
    instrumentConsistency -= 50;
  }

  // Suno compatibility - too many constraints can confuse
  const totalConstraints = spec.instrumentIds.length + spec.excludeInstrumentIds.length;
  if (totalConstraints > 6) {
    sunoCompatibility -= 10;
  }

  return { intentMatch, genreAccuracy, emotionAccuracy, instrumentConsistency, sunoCompatibility };
}

export function detectConflicts(spec: MusicSpec): string[] {
  const conflicts: string[] = [];

  // Piano solo + multiple instruments
  if (spec.genreId === 'piano-solo' && spec.instrumentIds.length > 1) {
    conflicts.push('Piano solo genre selected but multiple instruments specified');
  }

  // Very fast + calm
  if (spec.tempo === 'very-fast' && spec.emotionId === 'calm') {
    conflicts.push('Very fast tempo conflicts with calm emotion');
  }

  // Very high energy + sad
  if (spec.energyId === 'very-high' && spec.emotionId === 'sad') {
    conflicts.push('Very high energy conflicts with sad emotion');
  }

  // Same instrument in include and exclude
  const overlap = spec.instrumentIds.filter((id) => spec.excludeInstrumentIds.includes(id));
  if (overlap.length > 0) {
    const names = instruments.filter((i) => overlap.includes(i.id)).map((i) => i.name);
    conflicts.push(`${names.join(', ')} is both included and excluded`);
  }

  return conflicts;
}
