import { useState } from 'react';
import { genres, emotions, instruments, energyLevels, structures, templates } from '@/data/musicKnowledge';
import { detectConflicts } from '@/utils/promptEngine';
import type { MusicSpec } from '@/utils/promptEngine';
import { Music, Heart, Guitar, Zap, ListMusic, Mic, AlertTriangle, Wand2 } from 'lucide-react';

interface GeneratorProps {
  spec: MusicSpec;
  onSpecChange: (spec: MusicSpec) => void;
  onGenerate: () => void;
}

export function Generator({ spec, onSpecChange, onGenerate }: GeneratorProps) {
  const [mode, setMode] = useState<'beginner' | 'advanced'>('beginner');
  const conflicts = detectConflicts(spec);

  const toggleInstrument = (id: string, list: 'include' | 'exclude') => {
    const key = list === 'include' ? 'instrumentIds' : 'excludeInstrumentIds';
    const current = spec[key];
    const next = current.includes(id) ? current.filter((i) => i !== id) : [...current, id];
    onSpecChange({ ...spec, [key]: next });
  };

  const loadTemplate = (templateId: string) => {
    const t = templates.find((t) => t.id === templateId);
    if (!t) return;
    onSpecChange({
      genreId: t.genreId,
      emotionId: t.emotionId,
      instrumentIds: [...t.instrumentIds],
      excludeInstrumentIds: [],
      energyId: t.energyId,
      tempo: null,
      structureId: null,
      vocals: t.vocals,
      description: t.extraPrompt,
    });
  };

  return (
    <section id="generator" className="relative py-20 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Prompt Generator</h2>
          <p className="text-slate-400">Configure your musical vision and generate an optimized Suno prompt</p>
          <p dir="rtl" className="text-sm text-slate-600 mt-2">چشم‌انداز موسیقایی خود را تنظیم و پرامپت بهینه دریافت کنید</p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setMode('beginner')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${mode === 'beginner' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Beginner
            </button>
            <button
              onClick={() => setMode('advanced')}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${mode === 'advanced' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Quick templates */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-300">Quick Templates</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => loadTemplate(t.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400
                           hover:bg-slate-800 hover:text-white hover:border-slate-700 transition-all"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
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
                { id: 'female', label: 'Female vocals' },
                { id: 'male', label: 'Male vocals' },
              ].map((v) => (
                <Chip key={v.id} active={spec.vocals === v.id} onClick={() => onSpecChange({ ...spec, vocals: v.id as MusicSpec['vocals'] })}>
                  {v.label}
                </Chip>
              ))}
            </div>
          </Field>

          {/* Description */}
          <Field icon={<span className="text-sm">✍</span>} label="Describe your idea (optional)" labelFa="ایده خود را توصیف کنید">
            <textarea
              value={spec.description}
              onChange={(e) => onSpecChange({ ...spec, description: e.target.value })}
              placeholder="A lonely person walking alone at night after a breakup..."
              dir="auto"
              rows={3}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-slate-200
                         placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors resize-none"
            />
          </Field>

        {/* Advanced fields */}
        {mode === 'advanced' && (
          <>
            <Field icon={<ListMusic className="w-4 h-4" />} label="Tempo" labelFa="تمپو">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'very-slow', label: 'Very Slow' },
                  { id: 'slow', label: 'Slow' },
                  { id: 'moderate', label: 'Moderate' },
                  { id: 'fast', label: 'Fast' },
                  { id: 'very-fast', label: 'Very Fast' },
                ].map((t) => (
                  <Chip key={t.id} active={spec.tempo === t.id} onClick={() => onSpecChange({ ...spec, tempo: t.id as MusicSpec['tempo'] })}>
                    {t.label}
                  </Chip>
                ))}
              </div>
            </Field>

            <Field icon={<ListMusic className="w-4 h-4" />} label="Structure" labelFa="ساختار">
              <div className="flex flex-wrap gap-2">
                {structures.map((s) => (
                  <Chip key={s.id} active={spec.structureId === s.id} onClick={() => onSpecChange({ ...spec, structureId: s.id })}>
                    {s.name}
                  </Chip>
                ))}
              </div>
            </Field>
          </>
        )}

        {/* Conflicts */}
        {conflicts.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-amber-300">Detected Conflicts</h4>
            </div>
            <ul className="space-y-1">
              {conflicts.map((c, i) => (
                <li key={i} className="text-xs text-amber-200/70">{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Generate button */}
        <div className="flex justify-center">
          <button
            onClick={onGenerate}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-base
                       hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20
                       flex items-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            Generate Suno Prompt
          </button>
        </div>
      </div>
    </section>
  );
}

function Field({ icon, label, labelFa, children }: { icon: React.ReactNode; label: string; labelFa: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
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
