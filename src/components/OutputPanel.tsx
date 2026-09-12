import { useState, useEffect } from 'react';
import {
  Copy, Check, RotateCcw, AlertTriangle, X, Loader2, Wand2, Settings2, Layers,
  ExternalLink, BookmarkPlus, Bookmark, ChevronDown, RefreshCcw, Music4, Trash2, FileMusic,
  ShieldCheck, Ban, AudioLines, BarChart3, Music2,
} from 'lucide-react';
import type { PromptResult } from '@/utils/promptEngine';
import type { AiVariant } from '@/utils/aiPrompt';
import { PROVIDERS } from '@/utils/llm';
import { REFINE_ACTIONS, formatDate, type SongBlueprint, type SavedSong, type RefineAction } from '@/utils/blueprint';
import type { CriticReport, PipelineMode } from '@/utils/pipeline';

interface OutputPanelProps {
  result: PromptResult | null;
  blueprint: SongBlueprint | null;
  selectedTitle: string;
  onSelectTitle: (title: string) => void;
  onReset: () => void;
  onRefine: (action: RefineAction) => void;
  refining: boolean;
  compileError: boolean;
  onRetry: () => void;
  savedSongs: SavedSong[];
  songSaved: boolean;
  onSaveSong: () => void;
  onOpenSong: (id: string) => void;
  onDeleteSong: (id: string) => void;
  critic: CriticReport | null;
  refined: boolean;
  pipelineMode: PipelineMode | null;
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

function buildFullPrompt(title: string, bp: SongBlueprint): string {
  return [
    `Song: ${title}`,
    `Genre: ${bp.genre}`,
    `Mood: ${bp.mood} — ${bp.moodArc}`,
    `Tempo: ${bp.tempo}`,
    `Vocals: ${bp.vocals}`,
    `Instruments: ${bp.instruments.join(', ')}`,
    `Energy: ${bp.energy}/5`,
    '',
    'Suno Prompt:',
    bp.prompt,
  ].join('\n');
}

export function OutputPanel({
  result,
  blueprint,
  selectedTitle,
  onSelectTitle,
  onReset,
  onRefine,
  refining,
  compileError,
  onRetry,
  savedSongs,
  songSaved,
  onSaveSong,
  onOpenSong,
  onDeleteSong,
  critic,
  refined,
  pipelineMode,
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
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!copiedPrompt && !copiedFull && !copiedMeta) return;
    const t = setTimeout(() => { setCopiedPrompt(false); setCopiedFull(false); setCopiedMeta(false); }, 2000);
    return () => clearTimeout(t);
  }, [copiedPrompt, copiedFull, copiedMeta]);

  if (!result || !blueprint) {
    return (
      <section className="py-16 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          {compileError ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/5 border border-rose-500/30 mb-4">
                <AlertTriangle className="w-7 h-7 text-rose-400" />
              </div>
              <p className="text-rose-300 text-sm font-medium mb-1">We couldn&apos;t generate your prompt this time.</p>
              <p className="text-slate-500 text-xs mb-1">Your idea is still here — nothing was lost.</p>
              {aiAttribution && <p className="text-slate-600 text-[11px] font-mono mb-4 max-w-md mx-auto break-words">{aiAttribution}</p>}
              <button
                onClick={onRetry}
                disabled={refining}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-rose-500/15 border border-rose-500/40 text-rose-200 hover:bg-rose-500/25 transition-all disabled:opacity-50"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Try again
              </button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mb-4">
                <FileMusic className="w-7 h-7 text-slate-700" />
              </div>
              <p className="text-slate-500 text-sm">Your Song Blueprint will appear here</p>
              <p dir="rtl" className="text-slate-700 text-xs mt-1">نقشه‌ی آهنگ شما اینجا ساخته می‌شود</p>
            </>
          )}
        </div>
      </section>
    );
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(blueprint.prompt);
    setCopiedPrompt(true);
  };

  const handleCopyFull = () => {
    navigator.clipboard.writeText(buildFullPrompt(selectedTitle, blueprint));
    setCopiedFull(true);
  };

  const handleCopyMeta = () => {
    navigator.clipboard.writeText(result.lyricsMetaTags);
    setCopiedMeta(true);
  };

  const busy = enhancing || comparing || refining;

  const scoreColor = (score: number) => (score >= 90 ? 'text-green-400' : score >= 75 ? 'text-amber-400' : 'text-rose-400');
  const scoreBar = (score: number) => (score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-amber-500' : 'bg-rose-500');
  const providerName = (id: string) => PROVIDERS.find((p) => p.id === id)?.name ?? id;

  const weightColor = (w: number) => {
    if (w >= 9) return 'bg-rose-400';
    if (w >= 7) return 'bg-amber-400';
    if (w >= 5) return 'bg-sky-400';
    return 'bg-slate-500';
  };

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'genre': return 'text-purple-300 bg-purple-500/15';
      case 'instrument': return 'text-emerald-300 bg-emerald-500/15';
      case 'emotion': return 'text-rose-300 bg-rose-500/15';
      case 'production': return 'text-amber-300 bg-amber-500/15';
      case 'exclusion': return 'text-red-300 bg-red-500/15';
      case 'tempo': return 'text-cyan-300 bg-cyan-500/15';
      default: return 'text-slate-300 bg-slate-500/15';
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Music4 className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white">Your Song Blueprint</h2>
            {pipelineMode && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  pipelineMode === 'best'
                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
                title={pipelineMode === 'best' ? 'Intent → Compiler → Critic → Refine' : 'Intent → Compiler'}
              >
                {pipelineMode === 'best' ? '✨ Best Quality' : '⚡ Fast'}
              </span>
            )}
            {refined && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                refined by critic
              </span>
            )}
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
              title="Start over"
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compile error — recoverable, idea preserved */}
        {compileError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 mb-6">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-semibold text-rose-300">We couldn&apos;t generate your prompt this time.</h4>
            </div>
            <p className="text-xs text-rose-200/70 mb-3">Your idea is still here — nothing was lost.</p>
            <button
              onClick={onRetry}
              disabled={busy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-rose-500/15 border border-rose-500/40 text-rose-200 hover:bg-rose-500/25 transition-all disabled:opacity-50"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Try again
            </button>
          </div>
        )}

        {/* Refine — keep iteration inside the product */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Refine</p>
          <div className="flex flex-wrap gap-2">
            {REFINE_ACTIONS.map((a) => (
              <button
                key={a.id}
                onClick={() => onRefine(a.id)}
                disabled={busy}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300
                           hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {a.id === 'surprise' && <ShuffleIcon />}
                {a.label}
              </button>
            ))}
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

        {/* Song Blueprint */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm overflow-hidden mb-6">
          <div className="p-6">
            {/* Title selection */}
            <div className="mb-5">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Title</p>
              <div className="flex flex-wrap gap-2">
                {blueprint.titleCandidates.map((t) => (
                  <button
                    key={t}
                    onClick={() => onSelectTitle(t)}
                    disabled={busy}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
                      t === selectedTitle
                        ? 'bg-white text-slate-900 border-white'
                        : 'bg-transparent border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Core decisions — visible on every screen size */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <BlueprintField label="Genre" labelFa="ژانر" value={blueprint.genre} />
              <BlueprintField label="Mood" labelFa="حال" value={blueprint.mood} />
              <BlueprintField label="Tempo" labelFa="تمپو" value={blueprint.tempo} />
              <div className="col-span-2 sm:col-span-3">
                <BlueprintField label="Mood arc" labelFa="قوس احساسی" value={blueprint.moodArc} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Energy</p>
                <div className="flex items-end gap-1 h-5" title={`Energy ${blueprint.energy}/5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`w-3 rounded-sm transition-all ${n <= blueprint.energy ? 'bg-sky-400' : 'bg-slate-800'}`}
                      style={{ height: `${n * 20}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Structure / energy curve — pipeline output only */}
            {blueprint.structure && blueprint.structure.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Structure <span dir="rtl" className="normal-case tracking-normal text-slate-600">ساختار و انرژی</span>
                </p>
                <div className="flex items-end gap-1.5 h-16">
                  {blueprint.structure.map((s, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0" title={`${s.section}: ${s.description} (energy ${s.energy}/10)`}>
                      <div
                        className={`w-full rounded-sm ${s.energy >= 8 ? 'bg-gradient-to-t from-sky-600 to-sky-300' : 'bg-slate-700'}`}
                        style={{ height: `${s.energy * 10}%` }}
                      />
                      <span className="text-[9px] text-slate-500 truncate w-full text-center">{s.section}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full details — collapsed, mobile-friendly */}
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="mt-5 flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
              {showDetails ? 'Hide details' : 'Full details'}
            </button>

            {showDetails && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <BlueprintField label="Vocals" labelFa="آواز" value={blueprint.vocals} />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                      Instrumentation <span dir="rtl" className="normal-case tracking-normal text-slate-600">سازها</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprint.instruments.map((i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-md bg-slate-800/80 text-slate-300">{i}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prompt anatomy — teach prompt engineering through use */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
                    Why this works <span dir="rtl" className="normal-case tracking-normal text-slate-600">چرا این پرامپت کار می‌کند</span>
                  </p>
                  <ul className="space-y-2">
                    {blueprint.why.map((w, i) => (
                      <li key={i} className="text-sm leading-relaxed">
                        <span className="text-slate-200 font-medium">&ldquo;{w.snippet}&rdquo;</span>
                        <span className="text-slate-500"> — {w.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Production character */}
                {blueprint.production && blueprint.production.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <AudioLines className="w-3.5 h-3.5" /> Production
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprint.production.map((p) => (
                        <span key={p} className="text-xs px-2 py-1 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300">{p}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Negative preferences */}
                {blueprint.avoid && blueprint.avoid.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5 text-rose-400" /> Avoid
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {blueprint.avoid.map((a) => (
                        <span key={a} className="text-xs px-2 py-1 rounded-md bg-rose-500/5 border border-rose-500/20 text-rose-300/80">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Suno prompt */}
          <div className="border-t border-slate-800 bg-slate-950/40 p-6">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2.5">Suno Prompt</p>
            <p className="text-base text-slate-200 leading-relaxed font-mono break-words">{blueprint.prompt}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 px-6 py-4 border-t border-slate-800 flex-wrap">
            <button
              onClick={handleCopyPrompt}
              className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 transition-all"
            >
              {copiedPrompt ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copiedPrompt ? '✓ Copied' : 'Copy Suno Prompt'}
            </button>
            <button
              onClick={handleCopyFull}
              className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all"
            >
              {copiedFull ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copiedFull ? '✓ Copied' : 'Copy Full Prompt'}
            </button>
            <a
              href="https://suno.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                bg-gradient-to-r from-sky-500/20 to-blue-600/20 border border-sky-500/40 text-sky-300
                hover:from-sky-500/30 hover:to-blue-600/30 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Open Suno ↗
            </a>
          </div>
          <div className="flex items-center gap-2 px-6 pb-5 flex-wrap">
            <button
              onClick={onSaveSong}
              disabled={songSaved}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                songSaved
                  ? 'bg-green-500/10 border-green-500/30 text-green-300 cursor-default'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {songSaved ? <Bookmark className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
              {songSaved ? 'Saved ✓' : 'Save this idea'}
            </button>
            {onAiEnhance && (
              <button
                onClick={onAiEnhance}
                disabled={busy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium
                  bg-violet-500/10 border border-violet-500/40 text-violet-300 hover:bg-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enhancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                {enhancing ? 'Enhancing…' : 'Enhance with AI'}
              </button>
            )}
            {onCompare && (
              <button
                onClick={onCompare}
                disabled={busy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium
                  bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {comparing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5" />}
                {comparing ? 'Comparing…' : 'Compare AI variants'}
              </button>
            )}
            <button
              onClick={onReset}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start over
            </button>
          </div>
        </div>

        {/* Auto-adjustments */}
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

        {/* Critic report — replaces rule-based scores when the pipeline ran */}
        {critic ? (
          <CriticCard critic={critic} />
        ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 mb-6">
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
        )}

        {/* My Songs — local library */}
        {savedSongs.length > 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="w-4 h-4 text-sky-400" />
              <h4 className="text-sm font-semibold text-slate-200">My Songs</h4>
              <span dir="rtl" className="text-xs text-slate-600">آهنگ‌های من</span>
              <span className="ml-auto text-[10px] text-slate-600">saved in this browser</span>
            </div>
            <ul className="divide-y divide-slate-800/70">
              {savedSongs.map((s) => (
                <li key={s.id} className="flex items-center gap-3 py-2.5">
                  <button onClick={() => onOpenSong(s.id)} className="flex-1 min-w-0 text-left group">
                    <span className="block text-sm font-medium text-slate-200 group-hover:text-white truncate">{s.title}</span>
                    <span className="block text-xs text-slate-500 truncate">
                      {s.blurb} · {formatDate(s.date)}
                    </span>
                  </button>
                  <button
                    onClick={() => onDeleteSong(s.id)}
                    title="Delete"
                    className="p-1.5 rounded-md text-slate-600 hover:text-rose-400 hover:bg-slate-800 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Lyrics Meta-Tags */}
        {result.lyricsMetaTags && (
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 overflow-hidden mb-4">
            <div className="px-6 pt-4 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400/80">Lyrics Box — Meta-Tags</span>
              </div>
              <button
                onClick={handleCopyMeta}
                className="text-[10px] font-medium px-2 py-1 rounded bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all"
              >
                {copiedMeta ? <Check className="w-3 h-3 inline" /> : <Copy className="w-3 h-3 inline" />}
                {' '}{copiedMeta ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="px-6 pb-4">
              <pre className="text-sm text-purple-200/80 font-mono whitespace-pre-wrap leading-relaxed">{result.lyricsMetaTags}</pre>
            </div>
          </div>
        )}

        {/* Token Weight Visualizer */}
        {result.tokenAnalysis.prompt.length > 0 && (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 overflow-hidden mb-4">
            <div className="px-6 pt-4 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-sky-400/80">Token Weight Visualizer</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {result.tokenAnalysis.charCount}/{result.tokenAnalysis.maxChars} chars
              </span>
            </div>
            <div className="px-6 pb-3">
              <div className="flex flex-wrap gap-1.5">
                {result.tokenAnalysis.prompt.map((entry, i) => (
                  <span
                    key={`${entry.word}-${i}`}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono border border-white/5 ${categoryColor(entry.category)}`}
                    title={`Weight: ${entry.weight}/10 · Category: ${entry.category}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: weightColor(entry.weight) }} />
                    {entry.word}
                  </span>
                ))}
              </div>
            </div>
            <div className="px-6 pb-4 flex flex-wrap gap-3 border-t border-slate-800 pt-3">
              <span className="text-[10px] text-slate-500">Weight:</span>
              {[
                { label: 'Critical', color: 'bg-rose-400' },
                { label: 'High', color: 'bg-amber-400' },
                { label: 'Medium', color: 'bg-sky-400' },
                { label: 'Low', color: 'bg-slate-500' },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${l.color}`} />
                  {l.label}
                </span>
              ))}
              <span className="text-[10px] text-slate-600 ml-2">|</span>
              {[
                { label: 'Genre', cls: 'text-purple-300' },
                { label: 'Instrument', cls: 'text-emerald-300' },
                { label: 'Emotion', cls: 'text-rose-300' },
                { label: 'Production', cls: 'text-amber-300' },
                { label: 'Exclusion', cls: 'text-red-300' },
                { label: 'Tempo', cls: 'text-cyan-300' },
              ].map((c) => (
                <span key={c.label} className={`text-[10px] ${c.cls}`}>{c.label}</span>
              ))}
            </div>
          </div>
        )}

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

function ShuffleIcon() {
  return (
    <span className="inline-block mr-1" aria-hidden>
      ⇄
    </span>
  );
}

function BlueprintField({ label, labelFa, value }: { label: string; labelFa: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
        {label} {labelFa && <span dir="rtl" className="normal-case tracking-normal text-slate-600">{labelFa}</span>}
      </p>
      <p className="text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}

const CRITIC_SCORE_LABELS: { key: keyof CriticReport['scores']; label: string }[] = [
  { key: 'intent_alignment', label: 'Intent alignment' },
  { key: 'musical_coherence', label: 'Musical coherence' },
  { key: 'specificity', label: 'Specificity' },
  { key: 'naturalness', label: 'Naturalness' },
  { key: 'emotional_arc', label: 'Emotional arc' },
  { key: 'arrangement', label: 'Arrangement' },
  { key: 'instrumentation', label: 'Instrumentation' },
  { key: 'vocals', label: 'Vocal direction' },
  { key: 'redundancy', label: 'No redundancy' },
  { key: 'contradictions', label: 'No contradictions' },
  { key: 'suno_usability', label: 'Suno usability' },
];

const CRITIC_QUALITY_STYLES: Record<CriticReport['quality'], string> = {
  excellent: 'bg-green-500/10 border-green-500/30 text-green-300',
  strong: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
  usable: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  weak: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
  poor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
};

function CriticCard({ critic }: { critic: CriticReport }) {
  const [expanded, setExpanded] = useState(false);
  const score = critic.overall_score;
  const scoreColor = score >= 90 ? 'text-green-400' : score >= 80 ? 'text-sky-400' : score >= 70 ? 'text-amber-400' : 'text-rose-400';
  const scoreBar = score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-sky-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 mb-6">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <h4 className="text-sm font-semibold text-slate-200">Prompt Critic</h4>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${CRITIC_QUALITY_STYLES[critic.quality]}`}>
          {critic.quality}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className={`text-2xl font-bold ${scoreColor}`}>{score}</span>
          <span className="text-xs text-slate-500">/ 100</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
        <div className={`h-full ${scoreBar} rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>

      {critic.keep.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-green-400 uppercase tracking-wide mb-1.5">What works</p>
          <ul className="space-y-1">
            {critic.keep.map((k, i) => (
              <li key={i} className="text-xs text-slate-400">✓ {k}</li>
            ))}
          </ul>
        </div>
      )}

      {critic.issues.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide mb-1.5">Issues</p>
          <ul className="space-y-1">
            {critic.issues.map((issue, i) => (
              <li key={i} className="text-xs text-slate-400">{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        {expanded ? 'Hide category scores' : 'Category scores'}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {CRITIC_SCORE_LABELS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-slate-400">{label}</span>
                <span className="text-xs font-bold text-slate-300">{critic.scores[key]}/10</span>
              </div>
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${critic.scores[key] * 10}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
