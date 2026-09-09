import { useState } from 'react';
import { X, Check, KeyRound, Sparkles, Loader2, AlertTriangle, Zap, ExternalLink } from 'lucide-react';
import { PROVIDERS, testProvider, getStoredModel, type ActiveAi } from '@/utils/llm';

interface AiSettingsPanelProps {
  active: ActiveAi;
  status: { providerId: string; ok: boolean; message: string } | null;
  selectProvider: (providerId: string) => void;
  selectModel: (model: string) => void;
  saveKey: (providerId: string, key: string | null) => void;
  setStatus: (status: { providerId: string; ok: boolean; message: string } | null) => void;
  compareMode: boolean;
  onCompareModeChange: (enabled: boolean) => void;
  onClose: () => void;
}

export function AiSettingsPanel({
  active,
  status,
  selectProvider,
  selectModel,
  saveKey,
  setStatus,
  compareMode,
  onCompareModeChange,
  onClose,
}: AiSettingsPanelProps) {
  const [keyDraft, setKeyDraft] = useState('');
  const [testing, setTesting] = useState(false);
  const selectedDef = PROVIDERS.find((p) => p.id === active.providerId) ?? PROVIDERS[0];

  const runTest = async () => {
    setTesting(true);
    setStatus(null);
    const key = selectedDef.keyless ? undefined : keyDraft.trim() || undefined;
    const result = await testProvider(selectedDef.id, key, getStoredModel(selectedDef.id) ?? undefined);
    setStatus({
      providerId: selectedDef.id,
      ok: result.ok,
      message: result.ok ? `Connected — sample reply: "${result.sample}"` : result.error,
    });
    setTesting(false);
  };

  const handleSaveKey = () => {
    const key = keyDraft.trim();
    saveKey(selectedDef.id, key || null);
    setKeyDraft('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 pb-8 overflow-y-auto bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">AI Engine Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Provider list */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Provider</h3>
            <p className="text-xs text-slate-500 mb-3">
              Two providers are completely free and keyless. The rest use your own API key (BYOK) — stored only in this browser and sent only to that provider.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PROVIDERS.map((p) => {
                const isActive = p.id === active.providerId;
                return (
                  <button
                    key={p.id}
                    onClick={() => selectProvider(p.id)}
                    className={`text-left px-4 py-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-sky-500/10 border-sky-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{p.name}</span>
                      {p.keyless ? (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-green-500/15 text-green-400">Free</span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400">BYOK</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-2">{p.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model picker */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-2">Model</h3>
            <div className="flex flex-wrap gap-2">
              {selectedDef.models.map((m) => (
                <button
                  key={m}
                  onClick={() => selectModel(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    m === active.model
                      ? 'bg-white text-slate-900 border-white'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Key management for BYOK providers */}
          {!selectedDef.keyless && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-200">{selectedDef.name} API key</h3>
                {selectedDef.keyUrl && (
                  <a
                    href={selectedDef.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
                  >
                    get a key <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="sk-... (stored only in this browser)"
                  className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600"
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!keyDraft.trim()}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Saved keys stay in your browser's localStorage — never sent to any server except the provider itself.
              </p>
            </div>
          )}

          {/* Compare mode */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => onCompareModeChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-sky-500"
              />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Compare multiple AI providers
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  When enabled, "Compare AI variants" sends your spec to several free/keyed providers in parallel and shows each one's prompt side by side.
                </span>
              </span>
            </label>
          </div>

          {/* Connection test */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Test connection</h3>
                <p className="text-xs text-slate-500">Send a tiny request to {selectedDef.name} and show the raw reply.</p>
              </div>
              <button
                onClick={runTest}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500/30 transition-all disabled:opacity-60"
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {testing ? 'Testing…' : 'Test'}
              </button>
            </div>
            {status && status.providerId === selectedDef.id && (
              <div className={`mt-3 rounded-lg px-3 py-2 text-xs flex items-start gap-2 ${status.ok ? 'bg-green-500/10 text-green-300 border border-green-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}`}>
                {status.ok ? <Check className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span className="break-all">{status.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
