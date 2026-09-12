export interface GenreProfile {
  id: string;
  name: string;
  nameFa: string;
  commonInstruments: string[];
  typicalBPM: [number, number];
  commonStructure: string[];
  harmonyStyle: string;
  productionStyle: string;
  cliches: string[];
  avoid: string[];
  soundCharacter: string;
}

export const genres: GenreProfile[] = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    nameFa: 'سینمایی',
    commonInstruments: ['orchestral strings', 'piano', 'brass', 'timpani', 'cello'],
    typicalBPM: [60, 90],
    commonStructure: ['Intro', 'Build-up', 'Climax', 'Resolution'],
    harmonyStyle: 'rich harmonic progressions with modal interchange',
    productionStyle: 'wide spatial reverb, lush orchestration',
    cliches: ['sweeping strings', 'epic brass swells'],
    avoid: ['distorted guitars', 'electronic drops'],
    soundCharacter: 'wide, deep, atmospheric, emotive',
  },
  {
    id: 'piano-solo',
    name: 'Piano / Solo Instrumental',
    nameFa: 'پیانو / تکنوازی',
    commonInstruments: ['solo piano'],
    typicalBPM: [40, 120],
    commonStructure: ['Intro', 'Theme', 'Variation', 'Outro'],
    harmonyStyle: 'intimate chord voicings, arpeggiated patterns',
    productionStyle: 'close-miked, minimal reverb, warm tone',
    cliches: ['felt piano', 'soft sustain pedal'],
    avoid: ['drums', 'strings', 'bass', 'synth', 'any additional instruments'],
    soundCharacter: 'intimate, pure, minimal, raw',
  },
  {
    id: 'lofi',
    name: 'Lo-fi',
    nameFa: 'لو-فای',
    commonInstruments: ['soft electric piano', 'mellow guitar', 'vinyl crackle', 'lo-fi drums'],
    typicalBPM: [70, 90],
    commonStructure: ['Intro', 'Loop', 'Variation', 'Outro'],
    harmonyStyle: 'jazzy extended chords, 7ths and 9ths',
    productionStyle: 'tape saturation, low-pass filter, vinyl warmth',
    cliches: ['rain sounds', 'mellow boom-bap drums'],
    avoid: ['bright production', 'loud dynamics', 'distortion'],
    soundCharacter: 'warm, nostalgic, relaxed, dusty',
  },
  {
    id: 'electronic',
    name: 'Electronic',
    nameFa: 'الکترونیک',
    commonInstruments: ['synthesizer', 'electronic drums', 'bass synth', 'pads'],
    typicalBPM: [120, 140],
    commonStructure: ['Intro', 'Build-up', 'Drop', 'Breakdown', 'Outro'],
    harmonyStyle: 'minimal repetitive harmonic cells',
    productionStyle: 'clean digital, punchy transients, sidechain compression',
    cliches: ['rising snare roll', 'filter sweep'],
    avoid: ['acoustic instruments', 'organic textures'],
    soundCharacter: 'punchy, energetic, synthetic, driving',
  },
  {
    id: 'classical',
    name: 'Classical',
    nameFa: 'کلاسیک',
    commonInstruments: ['strings', 'woodwinds', 'piano', 'brass', 'timpani'],
    typicalBPM: [60, 120],
    commonStructure: ['Exposition', 'Development', 'Recapitulation', 'Coda'],
    harmonyStyle: 'functional tonal harmony, clear cadences',
    productionStyle: 'natural acoustic space, balanced orchestration',
    cliches: ['string quartet texture', 'sonata form'],
    avoid: ['electronic elements', 'distortion', 'modern production'],
    soundCharacter: 'elegant, structured, refined, timeless',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    nameFa: 'امبینت',
    commonInstruments: ['pads', 'drone textures', 'reverb-heavy piano', 'soft synth'],
    typicalBPM: [40, 70],
    commonStructure: ['Gradual fade-in', 'Sustained texture', 'Slow evolution', 'Fade-out'],
    harmonyStyle: 'static or slowly shifting harmonies, modal',
    productionStyle: 'heavy reverb, long attack, atmospheric',
    cliches: ['ethereal pad layers'],
    avoid: ['sharp transients', 'fast rhythm', 'percussion'],
    soundCharacter: 'floating, spacious, meditative, formless',
  },
  {
    id: 'hiphop',
    name: 'Hip-Hop',
    nameFa: 'هیپ-هاپ',
    commonInstruments: ['boom-bap drums', 'bass', 'sampled melody', '808s'],
    typicalBPM: [70, 95],
    commonStructure: ['Intro', 'Verse', 'Chorus', 'Verse', 'Outro'],
    harmonyStyle: 'sampled melodic loops, minor key',
    productionStyle: 'punchy drums, warm bass, vinyl character',
    cliches: ['808 bass', 'hi-hat rolls'],
    avoid: ['live orchestral strings', 'acoustic guitar'],
    soundCharacter: 'groovy, rhythmic, raw, powerful',
  },
  {
    id: 'rock',
    name: 'Rock',
    nameFa: 'راک',
    commonInstruments: ['electric guitar', 'bass guitar', 'drum kit', 'distorted guitar'],
    typicalBPM: [100, 160],
    commonStructure: ['Intro', 'Verse', 'Chorus', 'Solo', 'Outro'],
    harmonyStyle: 'power chords, blues-based progressions',
    productionStyle: 'distorted guitars, punchy drums, driving bass',
    cliches: ['guitar solo', 'power chord riff'],
    avoid: ['orchestral strings', 'electronic synth pads'],
    soundCharacter: 'energetic, raw, powerful, driving',
  },
  {
    id: 'jazz',
    name: 'Jazz',
    nameFa: 'جاز',
    commonInstruments: ['upright bass', 'piano', 'saxophone', 'brushed drums', 'trumpet'],
    typicalBPM: [80, 160],
    commonStructure: ['Head', 'Solos', 'Head out'],
    harmonyStyle: 'extended harmonies, 7ths 9ths 11ths, ii-V-I progressions',
    productionStyle: 'warm, organic, room ambience',
    cliches: ['walking bass line', 'brushed snare'],
    avoid: ['distortion', 'electronic beats', 'synth bass'],
    soundCharacter: 'smooth, sophisticated, improvisational, warm',
  },
  {
    id: 'rnb',
    name: 'R&B',
    nameFa: 'آر اند بی',
    commonInstruments: ['smooth synth', 'electric piano', 'soft drums', 'bass', 'vocals'],
    typicalBPM: [60, 90],
    commonStructure: ['Intro', 'Verse', 'Chorus', 'Bridge', 'Outro'],
    harmonyStyle: 'lush extended chords, minor harmonies',
    productionStyle: 'smooth, polished, warm low-end',
    cliches: ['vocal runs', 'smooth groove'],
    avoid: ['distortion', 'aggressive drums'],
    soundCharacter: 'smooth, soulful, warm, intimate',
  },
  {
    id: 'folk',
    name: 'Folk',
    nameFa: 'فولک',
    commonInstruments: ['acoustic guitar', 'mandolin', 'violin', 'soft percussion'],
    typicalBPM: [70, 120],
    commonStructure: ['Intro', 'Verse', 'Chorus', 'Verse', 'Outro'],
    harmonyStyle: 'simple diatonic progressions, major and minor',
    productionStyle: 'organic, natural, minimal processing',
    cliches: ['fingerpicked guitar', 'harmonized vocals'],
    avoid: ['electronic beats', 'distortion', 'synth'],
    soundCharacter: 'warm, organic, storytelling, earthy',
  },
  {
    id: 'orchestral',
    name: 'Orchestral',
    nameFa: 'ارکستال',
    commonInstruments: ['full string section', 'brass section', 'woodwinds', 'timpani', 'percussion'],
    typicalBPM: [60, 120],
    commonStructure: ['Overture', 'Themes', 'Development', 'Grand finale'],
    harmonyStyle: 'complex orchestral harmony, counterpoint',
    productionStyle: 'concert hall acoustics, full dynamic range',
    cliches: ['string swell', 'brass fanfare'],
    avoid: ['electronic elements', 'distortion'],
    soundCharacter: 'grand, majestic, powerful, sweeping',
  },
];

export interface EmotionProfile {
  id: string;
  name: string;
  nameFa: string;
  tonality: string;
  tempo: string;
  melodicContour: string;
  register: string;
  arrangement: string;
  dynamics: string;
  harmonicProgression: string;
  noteDuration: string;
  rhythmicActivity: string;
}

export const emotions: EmotionProfile[] = [
  {
    id: 'sad',
    name: 'Sad',
    nameFa: 'غمگین',
    tonality: 'minor key',
    tempo: 'slow tempo',
    melodicContour: 'descending melodic lines',
    register: 'lower register',
    arrangement: 'sparse arrangement',
    dynamics: 'soft dynamics',
    harmonicProgression: 'minor chord progressions with descending bass',
    noteDuration: 'long sustained notes',
    rhythmicActivity: 'reduced rhythmic activity',
  },
  {
    id: 'happy',
    name: 'Happy',
    nameFa: 'شاد',
    tonality: 'major key',
    tempo: 'upbeat tempo',
    melodicContour: 'ascending melodic lines',
    register: 'bright higher register',
    arrangement: 'full arrangement',
    dynamics: 'energetic dynamics',
    harmonicProgression: 'major chord progressions, I-IV-V',
    noteDuration: 'short bouncy notes',
    rhythmicActivity: 'active rhythmic patterns',
  },
  {
    id: 'tension',
    name: 'Tension',
    nameFa: 'تنش',
    tonality: 'dissonant harmonies',
    tempo: 'variable tempo',
    melodicContour: 'angular jagged melodic lines',
    register: 'extreme register shifts',
    arrangement: 'dense building arrangement',
    dynamics: 'crescendo dynamics',
    harmonicProgression: 'diminished and augmented chords, suspended tension',
    noteDuration: 'staccato accents',
    rhythmicActivity: 'irregular rhythmic patterns',
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia',
    nameFa: 'نوستالژی',
    tonality: 'modal harmony, mixolydian',
    tempo: 'moderate slow tempo',
    melodicContour: 'gentle wistful melodic lines',
    register: 'warm mid register',
    arrangement: 'warm intimate arrangement',
    dynamics: 'gentle swells',
    harmonicProgression: 'modal progressions, bVII chords',
    noteDuration: 'flowing legato notes',
    rhythmicActivity: 'gentle rhythmic pulse',
  },
  {
    id: 'hope',
    name: 'Hope',
    nameFa: 'امید',
    tonality: 'major key with occasional minor borrowings',
    tempo: 'moderate tempo',
    melodicContour: 'rising hopeful melodic lines',
    register: 'ascending register',
    arrangement: 'gradually building arrangement',
    dynamics: 'crescendo from soft to full',
    harmonicProgression: 'IV to I progressions, plagal cadences',
    noteDuration: 'sustained flowing notes',
    rhythmicActivity: 'steady forward-moving rhythm',
  },
  {
    id: 'dark',
    name: 'Dark',
    nameFa: 'تاریک',
    tonality: 'minor key with chromaticism',
    tempo: 'slow to moderate tempo',
    melodicContour: 'low brooding melodic lines',
    register: 'deep low register',
    arrangement: 'heavy dark arrangement',
    dynamics: 'powerful intense dynamics',
    harmonicProgression: 'minor i-bVI-bVII, tritone intervals',
    noteDuration: 'heavy sustained notes',
    rhythmicActivity: 'ominous slow pulse',
  },
  {
    id: 'calm',
    name: 'Calm',
    nameFa: 'آرام',
    tonality: 'major or modal harmony',
    tempo: 'very slow tempo',
    melodicContour: 'smooth stepwise melodic lines',
    register: 'comfortable mid register',
    arrangement: 'minimal open arrangement',
    dynamics: 'very soft gentle dynamics',
    harmonicProgression: 'simple stable harmonies, pedal points',
    noteDuration: 'long flowing notes',
    rhythmicActivity: 'minimal rhythmic activity',
  },
  {
    id: 'epic',
    name: 'Epic',
    nameFa: 'حماسی',
    tonality: 'minor key with major resolution',
    tempo: 'moderate to fast tempo',
    melodicContour: 'wide soaring melodic lines',
    register: 'full range',
    arrangement: 'massive full arrangement',
    dynamics: 'powerful dramatic dynamics',
    harmonicProgression: 'i-VI-III-VII epic progressions',
    noteDuration: 'powerful sustained notes',
    rhythmicActivity: 'driving powerful rhythm',
  },
  {
    id: 'romance',
    name: 'Romance',
    nameFa: 'عاشقانه',
    tonality: 'major key with rich harmonies',
    tempo: 'slow to moderate tempo',
    melodicContour: 'tender lyrical melodic lines',
    register: 'warm expressive register',
    arrangement: 'warm intimate arrangement',
    dynamics: 'gentle expressive dynamics',
    harmonicProgression: 'romantic progressions, secondary dominants',
    noteDuration: 'flowing expressive notes',
    rhythmicActivity: 'gentle rubato rhythm',
  },
  {
    id: 'anxiety',
    name: 'Anxiety',
    nameFa: 'اضطراب',
    tonality: 'atonal or minor with dissonance',
    tempo: 'erratic variable tempo',
    melodicContour: 'fragmented irregular melodic lines',
    register: 'unpredictable register shifts',
    arrangement: 'claustrophobic dense arrangement',
    dynamics: 'sudden dynamic changes',
    harmonicProgression: 'cluster chords, tritones, unresolved dissonance',
    noteDuration: 'short fragmented notes',
    rhythmicActivity: 'nervous irregular rhythmic patterns',
  },
];

export interface InstrumentItem {
  id: string;
  name: string;
  nameFa: string;
  category: string;
}

export const instruments: InstrumentItem[] = [
  { id: 'piano', name: 'Piano', nameFa: 'پیانو', category: 'keys' },
  { id: 'grand-piano', name: 'Grand Piano', nameFa: 'پیانو گرند', category: 'keys' },
  { id: 'felt-piano', name: 'Felt Piano', nameFa: 'پیانو فلتی', category: 'keys' },
  { id: 'electric-piano', name: 'Electric Piano', nameFa: 'پیانو الکتریک', category: 'keys' },
  { id: 'strings', name: 'Strings', nameFa: 'سازهای زهی', category: 'strings' },
  { id: 'violin', name: 'Violin', nameFa: 'ویولن', category: 'strings' },
  { id: 'cello', name: 'Cello', nameFa: 'ویولنسل', category: 'strings' },
  { id: 'acoustic-guitar', name: 'Acoustic Guitar', nameFa: 'گیتار آکوستیک', category: 'strings' },
  { id: 'electric-guitar', name: 'Electric Guitar', nameFa: 'گیتار الکتریک', category: 'strings' },
  { id: 'bass', name: 'Bass', nameFa: 'باس', category: 'bass' },
  { id: 'synth', name: 'Synthesizer', nameFa: 'سینتی‌سایزر', category: 'electronic' },
  { id: 'pads', name: 'Pads', nameFa: 'پد', category: 'electronic' },
  { id: 'drums', name: 'Drums', nameFa: 'درام', category: 'percussion' },
  { id: 'percussion', name: 'Percussion', nameFa: 'پرکاشن', category: 'percussion' },
  { id: 'brass', name: 'Brass', nameFa: 'برس', category: 'brass' },
  { id: 'saxophone', name: 'Saxophone', nameFa: 'ساکسوفون', category: 'wind' },
  { id: 'flute', name: 'Flute', nameFa: 'فلوت', category: 'wind' },
  { id: 'vocals', name: 'Vocals', nameFa: 'آواز', category: 'voice' },
];

export interface EnergyLevel {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  bpmRange: string;
  dynamicLevel: string;
}

export const energyLevels: EnergyLevel[] = [
  { id: 'very-low', name: 'Very Low', nameFa: 'بسیار پایین', description: 'Minimal, barely there', bpmRange: '40-60 BPM', dynamicLevel: 'pp to ppp' },
  { id: 'low', name: 'Low', nameFa: 'پایین', description: 'Gentle and restrained', bpmRange: '60-80 BPM', dynamicLevel: 'p to mp' },
  { id: 'medium', name: 'Medium', nameFa: 'متوسط', description: 'Moderate energy', bpmRange: '80-110 BPM', dynamicLevel: 'mf' },
  { id: 'high', name: 'High', nameFa: 'بالا', description: 'Energetic and driving', bpmRange: '110-140 BPM', dynamicLevel: 'f' },
  { id: 'very-high', name: 'Very High', nameFa: 'بسیار بالا', description: 'Intense and explosive', bpmRange: '140-180 BPM', dynamicLevel: 'ff to fff' },
];

export interface StructureTemplate {
  id: string;
  name: string;
  nameFa: string;
  parts: string[];
}

export const structures: StructureTemplate[] = [
  { id: 'simple', name: 'Simple (Intro-Theme-Outro)', nameFa: 'ساده', parts: ['Intro', 'Main theme', 'Variation', 'Outro'] },
  { id: 'song', name: 'Song (Verse-Chorus)', nameFa: 'آهنگ', parts: ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Outro'] },
  { id: 'cinematic', name: 'Cinematic (Build-Climax)', nameFa: 'سینمایی', parts: ['Atmospheric intro', 'Gradual build-up', 'Main climax', 'Resolution'] },
  { id: 'ambient', name: 'Ambient (Evolution)', nameFa: 'امبینت', parts: ['Slow fade-in', 'Sustained texture', 'Gradual evolution', 'Slow fade-out'] },
  { id: 'minimal', name: 'Minimal (Theme-Variation)', nameFa: 'مینیمال', parts: ['Theme statement', 'Variation 1', 'Variation 2', 'Final statement'] },
];

export interface PromptTemplate {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  genreId: string;
  emotionId: string;
  instrumentIds: string[];
  energyId: string;
  vocals: 'none' | 'female' | 'male' | 'instrumental';
  extraPrompt: string;
}

export const templates: PromptTemplate[] = [
  {
    id: 'solo-piano',
    name: 'Solo Sad Piano',
    nameFa: 'پیانوی غمگین تکنوازی',
    description: 'Intimate solo piano with melancholic mood',
    descriptionFa: 'پیانوی تنهایی با حال غمگین',
    genreId: 'piano-solo',
    emotionId: 'sad',
    instrumentIds: ['felt-piano'],
    energyId: 'very-low',
    vocals: 'instrumental',
    extraPrompt: 'sparse, intimate, close-miked, no other instruments',
  },
  {
    id: 'cinematic-sad',
    name: 'Cinematic Sad Score',
    nameFa: 'موسیقی غمگین سینمایی',
    description: 'Emotional cinematic score with strings and piano',
    descriptionFa: 'موسیقی احساسی سینمایی با زهی و پیانو',
    genreId: 'cinematic',
    emotionId: 'sad',
    instrumentIds: ['piano', 'cello', 'strings'],
    energyId: 'low',
    vocals: 'instrumental',
    extraPrompt: 'sweeping strings, emotional piano melody, slow build',
  },
  {
    id: 'epic-trailer',
    name: 'Epic Trailer',
    nameFa: 'تیزر حماسی',
    description: 'Powerful orchestral trailer music',
    descriptionFa: 'موسیقی ارکستال قدرتمند برای تیزر',
    genreId: 'orchestral',
    emotionId: 'epic',
    instrumentIds: ['brass', 'strings', 'percussion'],
    energyId: 'very-high',
    vocals: 'instrumental',
    extraPrompt: 'massive brass, driving percussion, epic crescendo',
  },
  {
    id: 'lofi-beat',
    name: 'Lo-fi Beat',
    nameFa: 'بیت لو-فای',
    description: 'Relaxed lo-fi hip-hop for studying',
    descriptionFa: 'هیپ-هاپ آرام لو-فای برای مطالعه',
    genreId: 'lofi',
    emotionId: 'nostalgia',
    instrumentIds: ['electric-piano', 'drums'],
    energyId: 'low',
    vocals: 'instrumental',
    extraPrompt: 'vinyl crackle, mellow boom-bap drums, warm tape saturation',
  },
  {
    id: 'meditation',
    name: 'Meditation',
    nameFa: 'مدیتیشن',
    description: 'Calming ambient soundscape for meditation',
    descriptionFa: 'فضای صوتی آرام امبینت برای مدیتیشن',
    genreId: 'ambient',
    emotionId: 'calm',
    instrumentIds: ['pads', 'piano'],
    energyId: 'very-low',
    vocals: 'instrumental',
    extraPrompt: 'ethereal pad layers, long reverb, no rhythm, floating',
  },
  {
    id: 'romantic-piano',
    name: 'Romantic Piano',
    nameFa: 'پیانوی عاشقانه',
    description: 'Tender romantic piano piece',
    descriptionFa: 'قطعه پیانوی لطیف عاشقانه',
    genreId: 'piano-solo',
    emotionId: 'romance',
    instrumentIds: ['grand-piano'],
    energyId: 'low',
    vocals: 'instrumental',
    extraPrompt: 'lyrical melody, gentle rubato, warm tone, intimate',
  },
  {
    id: 'horror',
    name: 'Horror / Dark',
    nameFa: 'ترسناک / تاریک',
    description: 'Dark unsettling atmosphere for horror',
    descriptionFa: 'فضای تاریک و ناراحت‌کننده برای ترس',
    genreId: 'cinematic',
    emotionId: 'anxiety',
    instrumentIds: ['strings', 'pads'],
    energyId: 'low',
    vocals: 'instrumental',
    extraPrompt: 'dissonant strings, unsettling atmosphere, sudden dynamic shifts, no melody',
  },
  {
    id: 'game-music',
    name: 'Game Music',
    nameFa: 'موسیقی بازی',
    description: 'Adventurous orchestral game soundtrack',
    descriptionFa: 'موسیقی ارکستال ماجراجویانه برای بازی',
    genreId: 'orchestral',
    emotionId: 'hope',
    instrumentIds: ['strings', 'brass', 'flute', 'percussion'],
    energyId: 'medium',
    vocals: 'instrumental',
    extraPrompt: 'adventurous melody, heroic brass, driving rhythm',
  },
];

// ──────────────────────────────────────────────────────────────
// STRATEGY 2: Mix & Mastering Vocabulary (Production Intent)
// ──────────────────────────────────────────────────────────────

export interface ProductionIntent {
  id: string;
  label: string;
  labelFa: string;
  description: string;
  keywords: string[];
  emotionAffinity: string[];
  energyAffinity: string[];
  tokenCost: number;
}

export const productionIntents: ProductionIntent[] = [
  {
    id: 'warmth',
    label: 'Analog Warmth',
    labelFa: 'گرمای آنالوگ',
    description: 'Tape saturation, vinyl crackle, tube amp warmth',
    keywords: ['analog warmth', 'tape saturation', 'vinyl crackle', 'tube amp warmth'],
    emotionAffinity: ['nostalgia', 'romance', 'calm', 'sad'],
    energyAffinity: ['very-low', 'low', 'medium'],
    tokenCost: 3,
  },
  {
    id: 'space',
    label: 'Spatial Audio',
    labelFa: 'صدای فضایی',
    description: 'Wide stereo, cathedral reverb, immersive spatial mix',
    keywords: ['immersive spatial mix', 'wide stereo image', 'cathedral reverb', 'close-mic intimacy'],
    emotionAffinity: ['epic', 'dark', 'hope', 'calm'],
    energyAffinity: ['very-low', 'low', 'high', 'very-high'],
    tokenCost: 3,
  },
  {
    id: 'fidelity',
    label: 'Audiophile Quality',
    labelFa: 'کیفیت آدیوفایل',
    description: 'Pristine mix, high fidelity, audiophile mastering',
    keywords: ['pristine mix', 'high fidelity', 'audiophile mastering', 'lossless quality'],
    emotionAffinity: ['calm', 'hope', 'romance'],
    energyAffinity: ['very-low', 'low', 'medium'],
    tokenCost: 2,
  },
  {
    id: 'grit',
    label: 'Raw & Gritty',
    labelFa: 'خام و زبر',
    description: 'Overdrive, analog distortion, lo-fi texture',
    keywords: ['raw overdrive', 'analog grit', 'lo-fi texture', 'saturated tone'],
    emotionAffinity: ['tension', 'dark', 'epic'],
    energyAffinity: ['medium', 'high', 'very-high'],
    tokenCost: 2,
  },
  {
    id: 'ethereal',
    label: 'Ethereal & Dreamy',
    labelFa: 'آسمانی و رؤیایی',
    description: 'Shimmer reverb, granular textures, granular synthesis',
    keywords: ['shimmer reverb', 'granular synthesis texture', 'ethereal wash', 'dreamlike haze'],
    emotionAffinity: ['hope', 'calm', 'nostalgia', 'romance'],
    energyAffinity: ['very-low', 'low'],
    tokenCost: 3,
  },
  {
    id: 'cinematic-mix',
    label: 'Cinematic Mix',
    labelFa: 'میکس سینمایی',
    description: 'Wide dynamic range, Dolby Atmos staging, orchestral depth',
    keywords: ['wide dynamic range', 'Dolby Atmos staging', 'orchestral depth', 'cinematic spatial staging'],
    emotionAffinity: ['epic', 'tension', 'dark', 'hope'],
    energyAffinity: ['medium', 'high', 'very-high'],
    tokenCost: 3,
  },
];

// ──────────────────────────────────────────────────────────────
// STRATEGY 5: Advanced Harmony — Musical Modes
// ──────────────────────────────────────────────────────────────

export interface MusicalMode {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  promptKeywords: string[];
  emotionAffinity: string[];
  moodTag: string;
}

export const musicalModes: MusicalMode[] = [
  {
    id: 'aeolian',
    name: 'Aeolian Mode',
    nameFa: 'مود ائولین',
    description: 'Natural minor — deep sadness, melancholic gravity',
    promptKeywords: ['Aeolian mode'],
    emotionAffinity: ['sad', 'dark', 'anxiety'],
    moodTag: 'melancholic gravity',
  },
  {
    id: 'phrygian',
    name: 'Phrygian Dominant',
    nameFa: 'مود فریجین دومیننت',
    description: 'Exotic tension, Spanish/Middle Eastern darkness',
    promptKeywords: ['Phrygian dominant scale'],
    emotionAffinity: ['tension', 'anxiety', 'dark'],
    moodTag: 'exotic tension',
  },
  {
    id: 'lydian',
    name: 'Lydian Mode',
    nameFa: 'مود لیدین',
    description: 'Dreamy, floating, ethereal hope with raised 4th',
    promptKeywords: ['Lydian mode', 'raised 4th interval'],
    emotionAffinity: ['hope', 'calm', 'romance'],
    moodTag: 'dreamy suspension',
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian Mode',
    nameFa: 'مود میکсолیدین',
    description: 'Warm nostalgia, bittersweet hopefulness',
    promptKeywords: ['Mixolydian mode', 'bVII chord color'],
    emotionAffinity: ['nostalgia', 'happy', 'hope'],
    moodTag: 'warm nostalgia',
  },
  {
    id: 'dorian',
    name: 'Dorian Mode',
    nameFa: 'مود دورین',
    description: 'Cool jazz sophistication, melancholy with brightness',
    promptKeywords: ['Dorian mode', 'jazz minor color'],
    emotionAffinity: ['calm', 'romance', 'nostalgia'],
    moodTag: 'cool sophistication',
  },
  {
    id: 'chromatic',
    name: 'Chromatic / Diminished',
    nameFa: 'کروماتیک / دیمینیشد',
    description: 'Unsettling, dissonant, horror-like instability',
    promptKeywords: ['chromatic runs', 'diminished scales'],
    emotionAffinity: ['anxiety', 'tension', 'dark'],
    moodTag: 'dissonant instability',
  },
  {
    id: 'pentatonic',
    name: 'Pentatonic',
    nameFa: 'پنتاتونیک',
    description: 'Simple, open, folk-like or world-music simplicity',
    promptKeywords: ['pentatonic melody', 'open intervals'],
    emotionAffinity: ['calm', 'happy', 'nostalgia'],
    moodTag: 'open simplicity',
  },
];

// ──────────────────────────────────────────────────────────────
// STRATEGY 1 & 4: Token Weight Scoring & Compound Adjectives
// ──────────────────────────────────────────────────────────────

export interface TokenEntry {
  word: string;
  weight: number;
  category: 'genre' | 'instrument' | 'emotion' | 'production' | 'exclusion' | 'modifier' | 'tempo';
}

export const compoundAdjectives: Record<string, string> = {
  'very sad': 'heart-wrenching',
  'very dark': 'deeply brooding',
  'very happy': 'euphoric',
  'very slow': 'glacial',
  'very fast': 'blistering',
  'very quiet': 'whisper-quiet',
  'very loud': 'thundering',
  'very warm': 'deeply saturated',
  'very cold': 'frost-tinged',
  'slightly sad': 'bittersweet',
  'slightly dark': 'shadowed',
  'slightly happy': 'gently bright',
  'very emotional': 'devastating',
  'very peaceful': 'serene',
  'very intense': 'relentless',
  'very gentle': 'featherlight',
  'very rich': 'lush',
  'very simple': 'minimal',
  'very big': 'massive',
  'very small': 'delicate',
};

const FILLER_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
  'should', 'may', 'might', 'must', 'can', 'could', 'to', 'of', 'in',
  'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'and', 'but',
  'or', 'nor', 'not', 'so', 'yet', 'both', 'either', 'neither', 'each',
  'every', 'all', 'any', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'also',
  'that', 'this', 'these', 'those', 'it', 'its', 'i', 'me', 'my', 'we',
  'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them',
  'their', 'what', 'which', 'who', 'whom', 'where', 'when', 'why', 'how',
  'if', 'then', 'else', 'because', 'since', 'while', 'although', 'though',
]);

export function getRecommendedMode(emotionId: string): MusicalMode | undefined {
  return musicalModes.find((m) => m.emotionAffinity.includes(emotionId));
}

export function getRecommendedProduction(
  emotionId: string,
  energyId: string,
): ProductionIntent[] {
  return productionIntents.filter(
    (p) =>
      p.emotionAffinity.includes(emotionId) &&
      p.energyAffinity.includes(energyId),
  );
}

export function compressPrompt(raw: string, maxChars = 200): {
  compressed: string;
  originalTokens: number;
  compressedTokens: number;
  tokenWeights: TokenEntry[];
  savedTokens: string[];
} {
  let text = raw;
  for (const [phrase, replacement] of Object.entries(compoundAdjectives)) {
    const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    text = text.replace(re, replacement);
  }

  const words = text.split(/[\s,]+/).filter(Boolean);
  const tokenWeights: TokenEntry[] = [];
  const kept: string[] = [];
  const savedTokens: string[] = [];

  for (const w of words) {
    const lower = w.toLowerCase().replace(/[.,;:!?]/g, '');
    if (FILLER_WORDS.has(lower)) {
      savedTokens.push(w);
      continue;
    }
    const weight = estimateTokenWeight(lower);
    tokenWeights.push({ word: w, weight, category: categorizeToken(lower) });
    kept.push(w);
  }

  const weighted = [...tokenWeights];
  weighted.sort((a, b) => b.weight - a.weight);

  let compressed = kept.join(', ');
  let truncated = false;

  if (compressed.length > maxChars) {
    truncated = true;
    const keptSet = new Set<string>();
    let charCount = 0;
    for (const entry of weighted) {
      if (charCount + entry.word.length + 2 > maxChars) break;
      keptSet.add(entry.word);
      charCount += entry.word.length + 2;
    }
    const finalWords = kept.filter((w) => keptSet.has(w));
    compressed = finalWords.join(', ');
  }

  return {
    compressed,
    originalTokens: words.length,
    compressedTokens: compressed.split(/[\s,]+/).filter(Boolean).length,
    tokenWeights,
    savedTokens,
  };
}

function estimateTokenWeight(word: string): number {
  if (FILLER_WORDS.has(word)) return 0;
  if (compoundAdjectives[word]) return 7;
  if (word.includes('no ') || word.includes('strictly') || word.includes('zero') || word.includes('never')) return 9;
  if (['genre', 'instrument', 'piano', 'guitar', 'strings', 'drums', 'vocals'].some(k => word.includes(k))) return 9;
  if (['sad', 'happy', 'dark', 'epic', 'ambient', 'lofi', 'jazz', 'rock', 'classical'].some(k => word.includes(k))) return 8;
  if (['bpm', 'tempo', 'slow', 'fast', 'moderate'].some(k => word.includes(k))) return 7;
  if (['reverb', 'saturation', 'mastering', 'mix', 'stereo', 'spatial'].some(k => word.includes(k))) return 6;
  if (['warm', 'cold', 'soft', 'loud', 'gentle', 'rich'].some(k => word.includes(k))) return 5;
  return 4;
}

function categorizeToken(word: string): TokenEntry['category'] {
  if (word.includes('no ') || word.includes('strictly') || word.includes('zero') || word.includes('never')) return 'exclusion';
  if (['bpm', 'tempo', 'slow', 'fast', 'moderate', 'rubato'].some(k => word.includes(k))) return 'tempo';
  if (['reverb', 'saturation', 'mastering', 'mix', 'stereo', 'spatial', 'vinyl', 'analog'].some(k => word.includes(k))) return 'production';
  if (['piano', 'guitar', 'strings', 'drums', 'vocals', 'synth', 'brass'].some(k => word.includes(k))) return 'instrument';
  if (['sad', 'happy', 'dark', 'epic', 'calm', 'tension', 'hope'].some(k => word.includes(k))) return 'emotion';
  if (['cinematic', 'ambient', 'lofi', 'jazz', 'rock', 'classical', 'folk'].some(k => word.includes(k))) return 'genre';
  return 'modifier';
}
