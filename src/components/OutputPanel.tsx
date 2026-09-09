import { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Sparkles, AlertTriangle, X, Loader2, Wand2, Settings2, Layers } from 'lucide-react';
import type { PromptResult } from '@/utils/promptEngine';
import type { AiVariant } from '@/utils/aiPrompt';
import { PROVIDERS } from '@/utils/llm';

interface OutputPanelProps {
  result: PromptResult | null;
  onReset: () => void;
  onAiEnhance?: () => Promise<void> | void;
  onCompare?: () => Promise<void> | void;
  enhancing?: boolean;
  comparing?: boolean;
  variants?: AiVariant[];
  activeVariantId?: string | null;
  onSelectVariant?: (id: string) => void;
  aiAttribution?: string | null;
  onOpenSettings?: () => void;
}

export function OutputPanel({
  result,
  onReset,
  onAiEnhance,
  onCompare,
  enhancing = false,
  comparing = false,
  variants = [],
  activeVariantId,
  onSelectVariant,
  aiAttribution,
  onOpenSettings,
}: OutputPanelProps) {
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

  const busy = enhancing || comparing;

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

  const providerName = (id: string) => PROVIDERS.find((p) => p.id === id)?.name ?? id;

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Your Suno Prompt</h2>
            {aiAttribution && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300">
                {aiAttribution}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                title="AI engine settings — providers, models, API keys"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-xs font-medium"
              >
                <Settings2 className="w-4 h-4" />
                AI Engine
              </button>
            )}
            <button
              onClick={onReset}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Variant tabs (compare mode) */}
        {variants.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-300">AI Variants</h3>
              <span className="text-xs text-slate-600">same spec, different engines</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const key = `${v.providerId}:${v.model}`;
                const isActive = key === activeVariantId;
                return (
                  <button
                    key={key}
                    onClick={() => v.result && onSelectVariant?.(key)}
                    disabled={!v.result}
                    title={v.error ?? `${v.providerName} · ${v.model}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                      v.error
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-300/60 cursor-not-allowed line-through'
                        : isActive
                        ? 'bg-white text-slate-900 border-white'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {v.providerName}
                    <span className="text-[10px] font-mono opacity-60">{v.model.split('/').pop()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Prompt box */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm overflow-hidden mb-6">
          <div className="p-6">
            {busy ? (
              <div className="flex items-center gap-3 py-4 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-sky-400" />
                <span className="text-sm">{comparing ? 'Asking multiple AI engines in parallel…' : 'AI is rewriting your prompt…'}</span>
              </div>
            ) : (
              <p className="text-base text-slate-200 leading-relaxed font-mono">{result.prompt}</p>
            )}
          </div>
          <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-800 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
            {onAiEnhance && (
              <button
                onClick={onAiEnhance}
                disabled={busy}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  bg-gradient-to-r from-sky-500/20 to-blue-600/20 border border-sky-500/40 text-sky-300
                  hover:from-sky-500/30 hover:to-blue-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {enhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {enhancing ? 'Enhancing…' : 'Enhance with AI'}
              </button>
            )}
            {onCompare && (
              <button
                onClick={onCompare}
                disabled={busy}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/40 text-amber-300
                  hover:from-amber-500/25 hover:to-orange-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {comparing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                {comparing ? 'Comparing…' : 'Compare AI variants'}
              </button>
            )}
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
                  <div className={`h-full ${scoreBar(s.value)} rounded-full transition-all duration-500`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variant errors detail */}
        {variants.some((v) => v.error) && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Variant failures</h4>
            <ul className="space-y-1">
              {variants
                .filter((v) => v.error)
                .map((v) => (
                  <li key={v.providerId} className="text-xs text-slate-500">
                    <span className="text-slate-400">{providerName(v.providerId)}</span> — {v.error}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
