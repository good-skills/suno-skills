import { useState } from 'react';
import { genres, emotions, instruments, energyLevels, structures } from '@/data/musicKnowledge';
import { detectConflicts } from '@/utils/promptEngine';
import type { MusicSpec } from '@/utils/promptEngine';
import type { PipelineMode, PipelineStage } from '@/utils/pipeline';
import { Music, Heart, Guitar, Zap, ListMusic, Mic, AlertTriangle, Wand2, ChevronDown, Shuffle, Sparkles, Cpu } from 'lucide-react';

interface GeneratorProps {
  spec: MusicSpec;
  onSpecChange: (spec: MusicSpec) => void;
  onGenerate: () => void;
  onSurprise: () => void;
  compiling: boolean;
  stageIndex: number;
  aiMode: PipelineMode;
  onAiModeChange: (mode: PipelineMode) => void;
  onGenerateAi: () => void;
  aiBusy: boolean;
  aiStage: PipelineStage | null;
}

const IDEA_EXAMPLES: { icon: string; label: string; text: string }[] = [
  { icon: '🎬', label: 'Cinematic', text: 'A dark cinematic song about leaving home. Starts intimate, then builds into a huge emotional chorus.' },
  { icon: '🔥', label: 'Epic Rock', text: 'Epic rock anthem for a final battle. Fast, driving, with a massive guitar-led chorus.' },
  { icon: '🌙', label: 'Dark & Emotional', text: 'A slow, brooding piece about missing someone. Heavy low-end, male vocal, no bright synths.' },
  { icon: '🌌', label: 'Dreamy Electronic', text: 'Dreamy synthwave about driving alone at night. Nostalgic 80s mood, female vocal, steady pulse.' },
];

const AI_STAGE_LABELS: Record<PipelineStage, string> = {
  intent: 'Understanding your idea…',
  compiler: 'Composing the Suno prompt…',
  critic: 'Critic is reviewing the prompt…',
  refiner: 'Refining with critic feedback…',
};

const AI_STAGE_ORDER: PipelineStage[] = ['intent', 'compiler', 'critic', 'refiner'];

export function Generator({ spec, onSpecChange, onGenerate, onSurprise, compiling, stageIndex, aiMode, onAiModeChange, onGenerateAi, aiBusy, aiStage }: GeneratorProps) {
  const [showFineTune, setShowFineTune] = useState(false);
  const conflicts = detectConflicts(spec);

  const toggleInstrument = (id: string, list: 'include' | 'exclude') => {
    const key = list === 'include' ? 'instrumentIds' : 'excludeInstrumentIds';
    const current = spec[key];
    const next = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
    onSpecChange({ ...spec, [key]: next });
  };

  return (
    <section id="generator" className="relative py-20 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">What are you imagining?</h2>
          <p className="text-slate-400">Genre, mood, story, references — anything. Incomplete ideas welcome.</p>
          <p dir="rtl" className="text-sm text-slate-600 mt-2">هر چیزی که تو ذهنت است بنویس — ناقص هم مهم نیست.</p>
        </div>

        {/* Free-text input — the one thing everyone must see */}
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-sm p-5 mb-4 focus-within:border-slate-500 transition-colors">
          <textarea
            value={spec.description}
            onChange={(e) => onSpecChange({ ...spec, description: e.target.value })}
            placeholder={'Tell us what\u2019s in your head — genre, mood, story, references, anything.\n\n\u201CA dark cinematic song about leaving home. Starts intimate, then builds into a huge emotional chorus\u2026\u201D'}
            dir="auto"
            rows={4}
            className="w-full bg-transparent text-base text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800">
            <p className="text-xs text-slate-600">Your words are translated into musical direction — no jargon needed.</p>
            <button
              onClick={onSurprise}
              disabled={compiling}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300
                         hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50 shrink-0"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Surprise me
            </button>
          </div>
        </div>

        {/* Not sure what to write? — example chips */}
        <div className="mb-10">
          <p className="text-xs text-slate-500 mb-2.5">Not sure what to write? Try one:</p>
          <div className="flex flex-wrap gap-2">
            {IDEA_EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => onSpecChange({ ...spec, description: ex.text })}
                disabled={compiling}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400
                           hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all disabled:opacity-50"
              >
                <span className="mr-1.5">{ex.icon}</span>
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fine-tune (collapsed by default) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 mb-8 overflow-hidden">
          <button
            onClick={() => setShowFineTune((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-900/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-300">Fine-tune the direction</span>
              <span dir="rtl" className="text-xs text-slate-600">تنظیم دقیق‌تر</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showFineTune ? 'rotate-180' : ''}`} />
          </button>

          {showFineTune && (
            <div className="px-5 pb-5 space-y-1">
              {/* Genre */}
              <Field icon={<Music className="w-4 h-4" />} label="Genre" labelFa="ژانر">
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <Chip key={g.id} active={spec.genreId === g.id} onClick={() => onSpecChange({ ...spec, genreId: g.id })}>
                      {g.name}
                    </Chip>
                  ))}
                </div>
              </Field>

              {/* Emotion */}
              <Field icon={<Heart className="w-4 h-4" />} label="Mood / Emotion" labelFa="احساس">
                <div className="flex flex-wrap gap-2">
                  {emotions.map((e) => (
                    <Chip key={e.id} active={spec.emotionId === e.id} onClick={() => onSpecChange({ ...spec, emotionId: e.id })}>
                      {e.name}
                    </Chip>
                  ))}
                </div>
              </Field>

              {/* Instruments */}
              <Field icon={<Guitar className="w-4 h-4" />} label="Instruments" labelFa="سازها">
                <div className="flex flex-wrap gap-2 mb-3">
                  {instruments.map((inst) => {
                    const isIncluded = spec.instrumentIds.includes(inst.id);
                    const isExcluded = spec.excludeInstrumentIds.includes(inst.id);
                    return (
                      <button
                        key={inst.id}
                        onClick={() => toggleInstrument(inst.id, 'include')}
                        onContextMenu={(e) => { e.preventDefault(); toggleInstrument(inst.id, 'exclude'); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                          ${isIncluded
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : isExcluded
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 line-through opacity-60'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        title={isExcluded ? `${inst.name} (excluded — right-click to toggle)` : `${inst.name} (right-click to exclude)`}
                      >
                        {inst.name}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-600">Right-click an instrument to exclude it</p>
              </Field>

              {/* Energy */}
              <Field icon={<Zap className="w-4 h-4" />} label="Energy Level" labelFa="سطح انرژی">
                <div className="flex flex-wrap gap-2">
                  {energyLevels.map((e) => (
                    <Chip key={e.id} active={spec.energyId === e.id} onClick={() => onSpecChange({ ...spec, energyId: e.id })}>
                      {e.name}
                      <span className="text-[10px] text-slate-500 ml-1.5">{e.bpmRange}</span>
                    </Chip>
                  ))}
                </div>
              </Field>

              {/* Vocals */}
              <Field icon={<Mic className="w-4 h-4" />} label="Vocals" labelFa="آواز">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'instrumental', label: 'No vocals' },
                    { id: 'any', label: 'Lead vocals' },
                    { id: 'female', label: 'Female vocals' },
                    { id: 'male', label: 'Male vocals' },
                  ].map((v) => (
                    <Chip key={v.id} active={spec.vocals === v.id} onClick={() => onSpecChange({ ...spec, vocals: v.id as MusicSpec['vocals'] })}>
                      {v.label}
                    </Chip>
                  ))}
                </div>
              </Field>

              {/* Advanced */}
              <Field icon={<ListMusic className="w-4 h-4" />} label="Tempo" labelFa="تمپو">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'very-slow', label: 'Very Slow' },
                    { id: 'slow', label: 'Slow' },
                    { id: 'moderate', label: 'Moderate' },
                    { id: 'fast', label: 'Fast' },
                    { id: 'very-fast', label: 'Very Fast' },
                  ].map((t) => (
                    <Chip key={t.id} active={spec.tempo === t.id} onClick={() => onSpecChange({ ...spec, tempo: (spec.tempo === t.id ? null : t.id) as MusicSpec['tempo'] })}>
                      {t.label}
                    </Chip>
                  ))}
                </div>
              </Field>

              <Field icon={<ListMusic className="w-4 h-4" />} label="Structure" labelFa="ساختار">
                <div className="flex flex-wrap gap-2">
                  {structures.map((s) => (
                    <Chip key={s.id} active={spec.structureId === s.id} onClick={() => onSpecChange({ ...spec, structureId: spec.structureId === s.id ? null : s.id })}>
                      {s.name}
                    </Chip>
                  ))}
                </div>
              </Field>
            </div>
          )}
        </div>

        {/* Conflicts */}
        {conflicts.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-amber-300">Heads up</h4>
            </div>
            <ul className="space-y-1">
              {conflicts.map((c, i) => (
                <li key={i} className="text-xs text-amber-200/70">{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Generate */}
        <div className="flex flex-col items-center gap-4">
          {/* AI mode toggle — Fast vs Best Quality */}
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => onAiModeChange('fast')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  aiMode === 'fast' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Fast
              </button>
              <button
                onClick={() => onAiModeChange('best')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  aiMode === 'best' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                ✨ Best Quality
              </button>
            </div>
            <span className="text-[11px] text-slate-600 hidden sm:inline">
              {aiMode === 'best' ? 'Intent → Compiler → Critic → Refine' : 'Intent → Compiler'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onGenerateAi}
              disabled={compiling || aiBusy}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-base
                         hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                         flex items-center gap-2"
            >
              <Sparkles className={`w-5 h-5 ${aiBusy ? 'animate-pulse' : ''}`} />
              {aiBusy
                ? aiStage
                  ? AI_STAGE_LABELS[aiStage]
                  : 'Working…'
                : aiMode === 'best'
                  ? 'Generate with AI · Best'
                  : 'Generate with AI'}
            </button>
            <button
              onClick={onGenerate}
              disabled={compiling || aiBusy}
              className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-medium text-base
                         hover:bg-slate-800 hover:border-slate-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              {compiling ? 'Compiling…' : 'Instant compile'}
            </button>
          </div>

          {aiBusy && aiStage && (
            <div className="flex flex-col items-center gap-1.5">
              {AI_STAGE_ORDER.map((stage) => {
                const idx = AI_STAGE_ORDER.indexOf(stage);
                const currentIdx = AI_STAGE_ORDER.indexOf(aiStage);
                const done = idx < currentIdx;
                return (
                  <span
                    key={stage}
                    className={`text-xs transition-colors ${
                      done ? 'text-slate-500' : stage === aiStage ? 'text-sky-300 font-medium' : 'text-slate-700'
                    }`}
                  >
                    {done ? '✓ ' : stage === aiStage ? '→ ' : '· '}
                    {AI_STAGE_LABELS[stage]}
                  </span>
                );
              })}
            </div>
          )}

          {compiling && (
            <div className="flex flex-col items-center gap-1.5">
              {COMPILE_STAGES.map((stage, i) => (
                <span
                  key={stage}
                  className={`text-xs transition-colors ${i < stageIndex ? 'text-slate-600' : i === stageIndex ? 'text-sky-300 font-medium' : 'text-slate-700'}`}
                >
                  {i < stageIndex ? '✓ ' : i === stageIndex ? '→ ' : '· '}
                  {stage}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const COMPILE_STAGES = ['Analyzing your idea…', 'Finding musical direction…', 'Building song structure…', 'Writing Suno prompt…'];

function Field({ icon, label, labelFa, children }: { icon: React.ReactNode; label: string; labelFa: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-slate-500">{icon}</span>
        <label className="text-sm font-semibold text-slate-200">{label}</label>
        <span dir="rtl" className="text-xs text-slate-600">{labelFa}</span>
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all border
        ${active
          ? 'bg-white text-slate-900 border-white'
          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
        }`}
    >
      {children}
    </button>
  );
}
