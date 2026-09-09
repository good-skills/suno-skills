import { Copy, Check, Lightbulb, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { examples, categories, colorMap } from '@/data/promptLibrary';

export function Examples() {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
  };

  useEffect(() => {
    if (copiedIdx === null) return;
    const t = setTimeout(() => setCopiedIdx(null), 2000);
    return () => clearTimeout(t);
  }, [copiedIdx]);

  return (
    <section id="examples" className="relative py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-300 font-medium tracking-wide">Inspiration</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Example Prompts</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Ready-made prompt combinations to spark your creativity. Copy and use them directly.
          </p>
          <p dir="rtl" className="text-sm text-slate-600 mt-2">
            ترکیب‌های آماده پرامپت برای الهام بخشیدن به خلاقیت شما.
          </p>
        </div>

        {/* Example cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {examples.map((ex, idx) => (
            <div
              key={ex.title}
              className="group rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm overflow-hidden
                         hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Card header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{ex.title}</h3>
                    <p dir="rtl" className="text-sm text-slate-500">{ex.titleFa}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-3">{ex.description}</p>
                <p dir="rtl" className="text-xs text-slate-600 mt-1">{ex.descriptionFa}</p>
              </div>

              {/* Tags */}
              <div className="px-6 pb-3 flex flex-wrap gap-1.5">
                {ex.tags.map((tagId) => {
                  const cat = categories.find((c) => c.id === tagId);
                  if (!cat) return null;
                  const colors = colorMap[cat.color];
                  return (
                    <span key={tagId} className={`text-[10px] px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} font-medium`}>
                      {cat.title}
                    </span>
                  );
                })}
              </div>

              {/* Prompt text */}
              <div className="px-6 pb-4">
                <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                  {ex.prompt}
                </p>
              </div>

              {/* Copy button */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleCopy(ex.prompt, idx)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                    bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all duration-200
                    group-hover:bg-white group-hover:text-slate-900"
                >
                  {copiedIdx === idx ? <Check className="w-4 h-4 text-green-500 group-hover:text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copiedIdx === idx ? 'Copied!' : 'Copy Prompt'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
