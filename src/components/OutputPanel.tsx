import { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Sparkles, AlertTriangle, X } from 'lucide-react';
import type { PromptResult } from '@/utils/promptEngine';

interface OutputPanelProps {
  result: PromptResult | null;
  onReset: () => void;
}

export function OutputPanel({ result, onReset }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  if (!result) {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mb-4">
            <Sparkles className="w-7 h-7 text-slate-700" />
          </div>
          <p className="text-slate-500 text-sm">Your generated prompt will appear here</p>
          <p dir="rtl" className="text-slate-700 text-xs mt-1">پرامپت تولید شده اینجا نمایش داده می‌شود</p>
        </div>
      </section>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.prompt);
    setCopied(true);
  };

  const scoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-amber-400';
    return 'text-rose-400';
  };

  const scoreBar = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Close / reset */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Your Suno Prompt</h2>
          </div>
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt box */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm overflow-hidden mb-6">
          <div className="p-6">
            <p className="text-base text-slate-200 leading-relaxed font-mono">
              {result.prompt}
            </p>
          </div>
          <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-800">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                bg-white text-slate-900 hover:bg-slate-100 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-amber-300">Auto-adjustments</h4>
            </div>
            <ul className="space-y-1">
              {result.warnings.map((w, i) => (
                <li key={i} className="text-xs text-amber-200/70">{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Explanation */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 mb-6">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Why this prompt?</h4>
          <p className="text-sm text-slate-400 leading-relaxed mb-2">{result.explanation}</p>
          <p dir="rtl" className="text-xs text-slate-500 leading-relaxed">{result.explanationFa}</p>
        </div>

        {/* Quality scores */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <h4 className="text-sm font-semibold text-slate-300 mb-4">Prompt Quality Scores</h4>
          <div className="space-y-3">
            {[
              { label: 'Intent Match', value: result.scores.intentMatch },
              { label: 'Genre Accuracy', value: result.scores.genreAccuracy },
              { label: 'Emotion Accuracy', value: result.scores.emotionAccuracy },
              { label: 'Instrument Consistency', value: result.scores.instrumentConsistency },
              { label: 'Suno Compatibility', value: result.scores.sunoCompatibility },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className={`text-xs font-bold ${scoreColor(s.value)}`}>{s.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${scoreBar(s.value)} rounded-full transition-all duration-500`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
