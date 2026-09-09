import { Music, Heart, Guitar, AudioLines, Sun, BookOpen } from 'lucide-react';
import { genres, emotions, instruments } from '@/data/musicKnowledge';

export function KnowledgeShowcase() {
  return (
    <section id="knowledge" className="relative py-24 px-6 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-sky-500/10 border border-sky-500/20">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs text-sky-300 font-medium tracking-wide">Knowledge Base</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Music Knowledge Engine</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            The engine translates your intent into musical parameters across theory, emotion, instrumentation, and genre.
          </p>
          <p dir="rtl" className="text-sm text-slate-600 mt-2">
            موتور دانش، ایده شما را به پارامترهای موسیقایی در حوزه تئوری، احساس، سازبندی و ژانر تبدیل می‌کند.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Genres */}
          <KnowledgeCard
            icon={<Music className="w-5 h-5" />}
            color="sky"
            title="Genre Skills"
            titleFa="مهارت‌های ژانر"
            count={`${genres.length} genres`}
            items={genres.map((g) => g.name)}
          />

          {/* Emotions */}
          <KnowledgeCard
            icon={<Heart className="w-5 h-5" />}
            color="rose"
            title="Emotion Translation"
            titleFa="ترجمه احساس"
            count={`${emotions.length} emotions`}
            items={emotions.map((e) => `${e.name} → ${e.tonality}`)}
          />

          {/* Instruments */}
          <KnowledgeCard
            icon={<Guitar className="w-5 h-5" />}
            color="amber"
            title="Instrument Library"
            titleFa="کتابخانه سازها"
            count={`${instruments.length} instruments`}
            items={instruments.map((i) => i.name)}
          />

          {/* Theory */}
          <KnowledgeCard
            icon={<AudioLines className="w-5 h-5" />}
            color="emerald"
            title="Music Theory"
            titleFa="تئوری موسیقی"
            count="6 domains"
            items={['Melody & Contour', 'Harmony & Chords', 'Rhythm & Groove', 'Tonality & Modes', 'Form & Structure', 'Dynamics']}
          />

          {/* Prompt Engineering */}
          <KnowledgeCard
            icon={<Sun className="w-5 h-5" />}
            color="violet"
            title="Suno Prompt Engineering"
            titleFa="مهندسی پرامپت Suno"
            count="5 layers"
            items={['Intent Extraction', 'Music Specification', 'Constraint Engine', 'Prompt Critic', 'Quality Scoring']}
          />

          {/* Pipeline */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Pipeline Architecture</h3>
                <p dir="rtl" className="text-xs text-slate-600 mt-0.5">معماری خط لوله</p>
              </div>
            </div>
            <div className="space-y-2">
              {['User Intent', 'Music Spec Generator', 'Master Skill + Sub-skills', 'Constraint & Conflict Check', 'Suno Prompt Generator', 'Prompt Critic', 'Final Prompt → Suno'].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-400">{step}</span>
                  {i < 6 && <span className="text-slate-700 text-xs">↓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
};

function KnowledgeCard({ icon, color, title, titleFa, count, items }: {
  icon: React.ReactNode;
  color: string;
  title: string;
  titleFa: string;
  count: string;
  items: string[];
}) {
  const c = colorClasses[color] ?? colorClasses.sky;
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p dir="rtl" className="text-xs text-slate-600 mt-0.5">{titleFa}</p>
        </div>
        <span className="ml-auto text-[10px] text-slate-600 font-medium">{count}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 8).map((item, i) => (
          <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${c.bg} ${c.text} font-medium`}>
            {item}
          </span>
        ))}
        {items.length > 8 && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-500 font-medium">
            +{items.length - 8} more
          </span>
        )}
      </div>
    </div>
  );
}
