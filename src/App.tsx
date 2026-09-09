import { useState, useCallback } from 'react';
import { Hero } from '@/components/Hero';
import { Generator } from '@/components/Generator';
import { OutputPanel } from '@/components/OutputPanel';
import { KnowledgeShowcase } from '@/components/KnowledgeShowcase';
import { Footer } from '@/components/Footer';
import { AiSettingsPanel } from '@/components/AiSettingsPanel';
import { generatePrompt, type MusicSpec, type PromptResult } from '@/utils/promptEngine';
import { generateAiPrompt, generateAiVariants, type AiVariant } from '@/utils/aiPrompt';
import { useAiSettings, PROVIDERS, type ActiveAi } from '@/utils/llm';

const defaultSpec: MusicSpec = {
  genreId: 'cinematic',
  emotionId: 'sad',
  instrumentIds: ['piano'],
  excludeInstrumentIds: [],
  energyId: 'low',
  tempo: null,
  structureId: null,
  vocals: 'instrumental',
  description: '',
};

/** Build the ActiveAi target list for compare mode: active provider + keyless ones + any with stored keys. */
function buildCompareTargets(active: ActiveAi): ActiveAi[] {
  const seen = new Set<string>([active.providerId]);
  const targets: ActiveAi[] = [active];

  for (const def of PROVIDERS) {
    if (seen.has(def.id)) continue;
    if (def.id === 'pollinations' || def.id === 'llm7') {
      const target: ActiveAi = { providerId: def.id, model: def.defaultModel, source: 'default' };
      targets.push(target);
      seen.add(def.id);
    }
  }
  return targets;
}

function App() {
  const [spec, setSpec] = useState<MusicSpec>(defaultSpec);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [enhancing, setEnhancing] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [variants, setVariants] = useState<AiVariant[]>([]);
  const [activeVariantKey, setActiveVariantKey] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const ai = useAiSettings();

  const handleGenerate = useCallback(() => {
    const r = generatePrompt(spec);
    setResult(r);
    setVariants([]);
    setActiveVariantKey(null);
    setAttribution(null);
    setTimeout(() => {
      document.getElementById('output')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [spec]);

  const handleAiEnhance = useCallback(async () => {
    const fallback = generatePrompt(spec);
    setResult(fallback);
    setVariants([]);
    setActiveVariantKey(null);
    setEnhancing(true);
    try {
      const enhanced = await generateAiPrompt(spec, fallback, ai.active);
      setResult(enhanced);
      setAttribution(`${PROVIDERS.find((p) => p.id === ai.active.providerId)?.name ?? ai.active.providerId} · ${ai.active.model}`);
    } catch (e) {
      setResult({
        ...fallback,
        warnings: [...fallback.warnings, `AI enhancement failed: ${e instanceof Error ? e.message : 'unknown error'}`],
      });
      setAttribution(null);
    } finally {
      setEnhancing(false);
      document.getElementById('output')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [spec, ai.active]);

  const handleCompare = useCallback(async () => {
    const fallback = generatePrompt(spec);
    setResult(fallback);
    setComparing(true);
    setVariants([]);
    setActiveVariantKey(null);
    try {
      const targets = buildCompareTargets(ai.active);
      const results = await generateAiVariants(spec, fallback, targets);
      setVariants(results);
      const firstOk = results.find((v) => v.result);
      if (firstOk?.result) {
        setResult(firstOk.result);
        setActiveVariantKey(`${firstOk.providerId}:${firstOk.model}`);
        setAttribution(`${firstOk.providerName} · ${firstOk.model}`);
      }
    } finally {
      setComparing(false);
      document.getElementById('output')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [spec, ai.active]);

  const handleSelectVariant = useCallback((key: string) => {
    const [providerId, ...modelParts] = key.split(':');
    const model = modelParts.join(':');
    const variant = variants.find((v) => v.providerId === providerId && v.model === model);
    if (variant?.result) {
      setResult(variant.result);
      setActiveVariantKey(key);
      setAttribution(`${variant.providerName} · ${variant.model}`);
    }
  }, [variants]);

  const handleReset = useCallback(() => {
    setResult(null);
    setVariants([]);
    setActiveVariantKey(null);
    setAttribution(null);
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleExplore = useCallback(() => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const providerDef = PROVIDERS.find((p) => p.id === ai.active.providerId);
  const needsKey = providerDef && !providerDef.keyless;

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero onExplore={handleExplore} />
      <Generator spec={spec} onSpecChange={setSpec} onGenerate={handleGenerate} />
      <div id="output">
        <OutputPanel
          result={result}
          onReset={handleReset}
          onAiEnhance={handleAiEnhance}
          onCompare={compareMode ? handleCompare : undefined}
          enhancing={enhancing}
          comparing={comparing}
          variants={variants}
          activeVariantId={activeVariantKey}
          onSelectVariant={handleSelectVariant}
          aiAttribution={attribution}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>
      <KnowledgeShowcase />
      <Footer />

      {settingsOpen && (
        <AiSettingsPanel
          active={ai.active}
          status={ai.status}
          selectProvider={ai.selectProvider}
          selectModel={ai.selectModel}
          saveKey={ai.saveKey}
          setStatus={ai.setStatus}
          compareMode={compareMode}
          onCompareModeChange={setCompareMode}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {needsKey && !ai.active.apiKey && (
        <div className="fixed bottom-4 right-4 z-40 rounded-xl border border-amber-500/40 bg-amber-500/10 backdrop-blur px-4 py-3 text-xs text-amber-200 max-w-xs">
          {providerDef?.name} needs an API key. Open <button onClick={() => setSettingsOpen(true)} className="underline font-semibold">AI Engine settings</button> to add one, or switch to a free keyless provider.
        </div>
      )}
    </div>
  );
}

export default App;
