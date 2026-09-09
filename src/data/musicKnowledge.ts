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
    nameFa: 'ارکستral',
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
    descriptionFa: 'موسیقی ارکستral قدرتمند برای تیزر',
    genreId: 'orchestral',
    emotionId: 'epic',
    instrumentIds: ['brass', 'strings', 'percussion', 'timpani'],
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
    descriptionFa: 'موسیقی ارکستral ماجراجویانه برای بازی',
    genreId: 'orchestral',
    emotionId: 'hope',
    instrumentIds: ['strings', 'brass', 'flute', 'percussion'],
    energyId: 'medium',
    vocals: 'instrumental',
    extraPrompt: 'adventurous melody, heroic brass, driving rhythm',
  },
];
