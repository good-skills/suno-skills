export interface PromptOption {
  label: string;
  prompt: string;
}

export interface PromptCategory {
  id: string;
  title: string;
  titleFa: string;
  icon: string;
  description: string;
  descriptionFa: string;
  color: string;
  options: PromptOption[];
}

export const categories: PromptCategory[] = [
  {
    id: 'head-face',
    title: 'Head & Face',
    titleFa: 'سر و صورت',
    icon: 'face',
    description: 'Facial expressions, head angles, and gaze direction',
    descriptionFa: 'حالات چهره، زاویه سر و جهت نگاه',
    color: 'amber',
    options: [
      { label: 'Frontal view', prompt: 'frontal view, looking directly at camera' },
      { label: 'Profile view', prompt: 'side profile view, head turned 90 degrees' },
      { label: 'Three-quarter', prompt: 'three-quarter view, head slightly turned' },
      { label: 'Looking up', prompt: 'head tilted upward, looking at the sky with wonder' },
      { label: 'Looking down', prompt: 'head bowed, eyes cast downward, contemplative' },
      { label: 'Smile', prompt: 'gentle smile, soft and natural' },
      { label: 'Serious', prompt: 'serious expression, intense gaze, composed' },
      { label: 'Surprised', prompt: 'wide eyes, raised eyebrows, mouth slightly open in surprise' },
      { label: 'Closed eyes', prompt: 'eyes closed peacefully, serene expression' },
      { label: 'Laughing', prompt: 'genuine laugh, eyes crinkled with joy' },
    ],
  },
  {
    id: 'body-pose',
    title: 'Body & Pose',
    titleFa: 'بدن و ژست',
    icon: 'person',
    description: 'Full body positioning and posture',
    descriptionFa: 'وضعیت و ژست کل بدن',
    color: 'sky',
    options: [
      { label: 'Standing straight', prompt: 'standing upright, weight evenly distributed' },
      { label: 'Contrapposto', prompt: 'contrapposto pose, weight on one leg, hip shifted' },
      { label: 'Sitting', prompt: 'seated on a chair, relaxed posture' },
      { label: 'Walking', prompt: 'mid-stride walking pose, dynamic movement' },
      { label: 'Leaning', prompt: 'leaning against a wall, casual and relaxed' },
      { label: 'Arms crossed', prompt: 'arms crossed over chest, confident stance' },
      { label: 'Reaching', prompt: 'arm extended reaching outward, stretching' },
      { label: 'Crouching', prompt: 'crouching low, balanced and ready' },
      { label: 'Dynamic action', prompt: 'dynamic action pose, body in motion, mid-jump' },
      { label: 'Fetal position', prompt: 'curled up in fetal position, vulnerable' },
    ],
  },
  {
    id: 'arms-hands',
    title: 'Arms & Hands',
    titleFa: 'بازوها و دست‌ها',
    icon: 'hand',
    description: 'Hand gestures and arm positioning',
    descriptionFa: 'حرکات دست و موقعیت بازوها',
    color: 'rose',
    options: [
      { label: 'Hands on hips', prompt: 'hands resting on hips, confident posture' },
      { label: 'Prayer hands', prompt: 'hands pressed together in prayer position' },
      { label: 'Pointing', prompt: 'index finger pointing forward, directive gesture' },
      { label: 'Open palms', prompt: 'open palms facing forward, welcoming gesture' },
      { label: 'Thinking', prompt: 'hand resting on chin, thoughtful pose' },
      { label: 'Crossed arms', prompt: 'arms folded across chest, protective stance' },
      { label: 'Hands in pockets', prompt: 'hands casually in pockets, relaxed' },
      { label: 'Fist', prompt: 'clenched fist, determined expression' },
      { label: 'Waving', prompt: 'hand raised in a waving gesture, friendly' },
      { label: 'Touching hair', prompt: 'hand gently touching hair, subtle and natural' },
    ],
  },
  {
    id: 'legs-feet',
    title: 'Legs & Feet',
    titleFa: 'پاها و قدم‌ها',
    icon: 'footprints',
    description: 'Leg positions and foot placement',
    descriptionFa: 'موقعیت پاها و قرارگیری قدم‌ها',
    color: 'emerald',
    options: [
      { label: 'Shoulder-width', prompt: 'feet planted shoulder-width apart, stable stance' },
      { label: 'Crossed legs', prompt: 'legs crossed at the ankles, elegant' },
      { label: 'One foot forward', prompt: 'one foot stepped forward, weight shifted back' },
      { label: 'Wide stance', prompt: 'wide athletic stance, feet apart, grounded' },
      { label: 'On tiptoes', prompt: 'standing on tiptoes, reaching upward' },
      { label: 'Kneeling', prompt: 'kneeling on one knee, balanced and poised' },
      { label: 'Sitting cross-legged', prompt: 'sitting cross-legged on the ground, relaxed' },
      { label: 'Stepping', prompt: 'mid-step, one foot lifting off the ground' },
      { label: 'Legs extended', prompt: 'legs extended forward, sitting and relaxed' },
      { label: 'Pigeon-toed', prompt: 'feet turned slightly inward, endearing stance' },
    ],
  },
  {
    id: 'camera',
    title: 'Camera Angles',
    titleFa: 'زاویه دوربین',
    icon: 'camera',
    description: 'Shot composition and camera perspective',
    descriptionFa: 'ترکیب نما و زاویه دید دوربین',
    color: 'violet',
    options: [
      { label: 'Eye level', prompt: 'eye-level shot, camera at subject height' },
      { label: 'Low angle', prompt: 'low angle shot, looking up at subject, heroic' },
      { label: 'High angle', prompt: 'high angle shot, looking down at subject, vulnerable' },
      { label: 'Bird\'s eye', prompt: 'bird\'s eye view, top-down aerial perspective' },
      { label: 'Dutch angle', prompt: 'dutch angle, tilted camera, dramatic tension' },
      { label: 'Close-up', prompt: 'extreme close-up shot, face filling the frame' },
      { label: 'Medium shot', prompt: 'medium shot, waist up framing' },
      { label: 'Full shot', prompt: 'full body shot, entire figure visible' },
      { label: 'Wide shot', prompt: 'wide establishing shot, subject small in frame' },
      { label: 'Over-the-shoulder', prompt: 'over-the-shoulder shot, from behind another person' },
    ],
  },
  {
    id: 'lighting',
    title: 'Lighting',
    titleFa: 'نورپردازی',
    icon: 'sun',
    description: 'Light setup, direction, and mood',
    descriptionFa: 'تنظیمات نور، جهت و حال و هوا',
    color: 'orange',
    options: [
      { label: 'Golden hour', prompt: 'golden hour lighting, warm sunset glow' },
      { label: 'Blue hour', prompt: 'blue hour lighting, cool twilight tones' },
      { label: 'Rembrandt', prompt: 'rembrandt lighting, dramatic triangle on cheek' },
      { label: 'Backlit', prompt: 'backlit, rim light creating silhouette edge' },
      { label: 'Soft diffused', prompt: 'soft diffused lighting, gentle and even' },
      { label: 'Hard shadows', prompt: 'hard directional light, sharp contrasting shadows' },
      { label: 'Neon', prompt: 'neon lighting, vibrant pink and blue glow' },
      { label: 'Candlelight', prompt: 'warm candlelight, intimate and flickering' },
      { label: 'Moonlight', prompt: 'cool moonlight, silvery and ethereal' },
      { label: 'Studio', prompt: 'professional studio lighting, three-point setup' },
    ],
  },
];

export interface ExamplePrompt {
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  prompt: string;
  tags: string[];
}

export const examples: ExamplePrompt[] = [
  {
    title: 'Confident Portrait',
    titleFa: 'پرتره با اعتماد به نفس',
    description: 'A striking studio portrait with dramatic lighting',
    descriptionFa: 'یک پرتره استودیویی خیره‌کننده با نورپردازی دراماتیک',
    prompt: 'frontal view, gentle smile, confident expression, contrapposto pose, hands on hips, eye-level shot, medium shot, rembrandt lighting, professional studio setup, sharp focus',
    tags: ['head-face', 'body-pose', 'arms-hands', 'camera', 'lighting'],
  },
  {
    title: 'Dynamic Action',
    titleFa: 'اکشن پویا',
    description: 'A mid-motion capture full of energy',
    descriptionFa: 'تصویری در میانه حرکت، پر از انرژی',
    prompt: 'serious expression, head tilted upward, dynamic action pose, mid-jump, clenched fist, wide athletic stance, low angle shot, full shot, hard shadows, dramatic tension',
    tags: ['head-face', 'body-pose', 'arms-hands', 'legs-feet', 'camera', 'lighting'],
  },
  {
    title: 'Serene Contemplation',
    titleFa: 'تامل آرام',
    description: 'A peaceful moment bathed in soft light',
    descriptionFa: 'لحظه‌ای آرام غرق در نور ملایم',
    prompt: 'eyes closed peacefully, serene expression, head bowed, seated on a chair, hand resting on chin, legs crossed at the ankles, eye-level shot, medium shot, soft diffused lighting, warm candlelight',
    tags: ['head-face', 'body-pose', 'arms-hands', 'legs-feet', 'camera', 'lighting'],
  },
  {
    title: 'Urban Golden Hour',
    titleFa: 'ساعت طلایی شهری',
    description: 'A warm sunset scene with casual energy',
    descriptionFa: 'صحنه‌ای با غروب گرم و انرژی غیررسمی',
    prompt: 'genuine laugh, three-quarter view, leaning against a wall, hands in pockets, one foot forward, dutch angle, full shot, golden hour lighting, warm sunset glow',
    tags: ['head-face', 'body-pose', 'arms-hands', 'legs-feet', 'camera', 'lighting'],
  },
];

export const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string; ring: string }> = {
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-500/40' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', gradient: 'from-sky-500 to-blue-600', ring: 'ring-sky-500/40' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', gradient: 'from-rose-500 to-pink-600', ring: 'ring-rose-500/40' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500/40' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30', gradient: 'from-violet-500 to-purple-600', ring: 'ring-violet-500/40' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', gradient: 'from-orange-500 to-red-600', ring: 'ring-orange-500/40' },
};
