import { useState, useCallback, useEffect, useRef } from 'react';
import { Hero } from '@/components/Hero';
import { Generator } from '@/components/Generator';
import { OutputPanel } from '@/components/OutputPanel';
import { KnowledgeShowcase } from '@/components/KnowledgeShowcase';
import { Footer } from '@/components/Footer';
import { AiSettingsPanel } from '@/components/AiSettingsPanel';
import { generatePrompt, type MusicSpec, type PromptResult } from '@/utils/promptEngine';
import { generateAiPrompt, generateAiVariants, type AiVariant } from '@/utils/aiPrompt';
import { useAiSettings, PROVIDERS, type ActiveAi } from '@/utils/llm';
import {
  specFromIdea, buildBlueprint, applyRefine, saveSong, loadSavedSongs, deleteSavedSong,
  type SongBlueprint, type SavedSong, type RefineAction,
} from '@/utils/blueprint';
import {
  generateSunoPrompt, refineBlueprint, blueprintToDisplay, compilePrompt,
  type PipelineMode, type PipelineStage, type CriticReport, type BlueprintSchema,
} from '@/utils/pipeline';

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

const SURPRISE_CONCEPTS: string[] = [
  'A nostalgic 80s synthwave song about driving alone at night.',
  'Persian alternative rock about missing someone.',
  'Epic cinematic soundtrack for a final battle.',
  'A hopeful folk song about starting over in a new city.',
  'Dark lo-fi beat for late-night studying, vinyl crackle, no vocals.',
  'An intimate piano piece that slowly turns into a triumphant orchestral finale.',
  'A dreamy electronic track about floating above the clouds at sunrise.',
  'A smooth jazz café tune for a rainy Sunday morning.',
];

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
  const [blueprint, setBlueprint] = useState<SongBlueprint | null>(null);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [enhancing, setEnhancing] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [refining, setRefining] = useState(false);
  const [variants, setVariants] = useState<AiVariant[]>([]);
  const [activeVariantKey, setActiveVariantKey] = useState<string | null>(null);
  const [attribution, setAttribution] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [compileError, setCompileError] = useState(false);
  const [savedSongs, setSavedSongs] = useState<SavedSong[]>(() => loadSavedSongs());
  const [songSaved, setSongSaved] = useState(false);

  // Pipeline state
  const [aiMode, setAiMode] = useState<PipelineMode>('fast');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiStage, setAiStage] = useState<PipelineStage | null>(null);
  const [critic, setCritic] = useState<CriticReport | null>(null);
  const [refined, setRefined] = useState(false);
  const [pipelineMode, setPipelineMode] = useState<PipelineMode | null>(null);
  const [schemaBlueprint, setSchemaBlueprint] = useState<BlueprintSchema | null>(null);

  const stageTimers = useRef<number[]>([]);

  const ai = useAiSettings();

  useEffect(() => {
    return () => stageTimers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const clearStageTimers = useCallback(() => {
    stageTimers.current.forEach((t) => window.clearTimeout(t));
    stageTimers.current = [];
  }, []);

  const scrollToOutput = useCallback(() => {
    setTimeout(() => {
      document.getElementById('output')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const applyBlueprint = useCallback((bp: SongBlueprint) => {
    setBlueprint(bp);
    setSelectedTitle((prev) => (bp.titleCandidates.includes(prev) ? prev : bp.titleCandidates[0] ?? prev));
  }, []);

  // ------------------------------------------------------------------
  // Rule-based instant compile (fallback engine)
  // ------------------------------------------------------------------
  const handleGenerate = useCallback(() => {
    clearStageTimers();
    setCompiling(true);
    setStageIndex(0);
    setCompileError(false);
    setCritic(null);
    setRefined(false);
    setPipelineMode(null);
    stageTimers.current = [
      window.setTimeout(() => setStageIndex(1), 350),
      window.setTimeout(() => setStageIndex(2), 750),
      window.setTimeout(() => setStageIndex(3), 1150),
      window.setTimeout(() => {
        try {
          const merged = specFromIdea(spec, spec.description);
          const r = generatePrompt(merged);
          if (!r.prompt.trim()) throw new Error('empty prompt');
          const bp = buildBlueprint(merged, r);
          setResult(r);
          setBlueprint(bp);
          setSchemaBlueprint(null);
          setSelectedTitle(bp.titleCandidates[0] ?? 'Untitled Idea');
          setVariants([]);
          setActiveVariantKey(null);
          setAttribution(null);
          setSongSaved(false);
          setCompileError(false);
        } catch {
          setCompileError(true);
        } finally {
          setCompiling(false);
          setStageIndex(0);
          scrollToOutput();
        }
      }, 1500),
    ];
  }, [spec, clearStageTimers, scrollToOutput]);

  // ------------------------------------------------------------------
  // LLM pipeline: Intent → Compiler → Critic → (Refine)
  // ------------------------------------------------------------------
  const handleGenerateAi = useCallback(async () => {
    setAiBusy(true);
    setAiStage(null);
    setCompileError(false);
    setCritic(null);
    setRefined(false);
    setPipelineMode(null);
    try {
      const pipelineResult = await generateSunoPrompt(spec.description, aiMode, ai.active, (stage) => setAiStage(stage));
      const bp = blueprintToDisplay(pipelineResult.blueprint, pipelineResult.prompt, pipelineResult.mode);
      setSchemaBlueprint(pipelineResult.blueprint);
      setResult(null);
      applyBlueprint(bp);
      setSelectedTitle(pipelineResult.titleCandidates[0] ?? bp.title);
      setCritic(pipelineResult.critic);
      setRefined(pipelineResult.refined);
      setPipelineMode(pipelineResult.mode);
      setVariants([]);
      setActiveVariantKey(null);
      setAttribution(`${pipelineResult.modelLabel} · ${pipelineResult.mode === 'best' ? 'critic-gated' : 'fast'} pipeline`);
      setSongSaved(false);
    } catch (e) {
      setCompileError(true);
      setAttribution(e instanceof Error ? e.message : 'Pipeline failed');
    } finally {
      setAiBusy(false);
      setAiStage(null);
      scrollToOutput();
    }
  }, [spec.description, aiMode, ai.active, applyBlueprint, scrollToOutput]);

  const handleSurprise = useCallback(() => {
    const concept = SURPRISE_CONCEPTS[Math.floor(Math.random() * SURPRISE_CONCEPTS.length)];
    setSpec((prev) => specFromIdea({ ...prev, description: concept }, concept));
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // ------------------------------------------------------------------
  // Refine — blueprint-level for pipeline output, spec-level otherwise
  // ------------------------------------------------------------------
  const handleRefine = useCallback(
    (action: RefineAction) => {
      setRefining(true);

      // Pipeline path: edit the structured blueprint, recompile once
      if (schemaBlueprint) {
        (async () => {
          try {
            const refinedBp = refineBlueprint(schemaBlueprint, action);
            const prompt = await compilePrompt(refinedBp, ai.active);
            setSchemaBlueprint(refinedBp);
            applyBlueprint(blueprintToDisplay(refinedBp, prompt, pipelineMode ?? 'fast'));
            setCritic(null);
            setRefined(false);
            setAttribution(`${ai.active.model} · refined blueprint`);
            setSongSaved(false);
            setCompileError(false);
          } catch {
            setCompileError(true);
          } finally {
            setRefining(false);
            scrollToOutput();
          }
        })();
        return;
      }

      // Rule-engine path
      const nextSpec = applyRefine(spec, action);
      setSpec(nextSpec);
      window.setTimeout(() => {
        try {
          const merged = specFromIdea(nextSpec, nextSpec.description);
          const r = generatePrompt(merged);
          if (!r.prompt.trim()) throw new Error('empty prompt');
          setResult(r);
          setBlueprint(buildBlueprint(merged, r));
          setSchemaBlueprint(null);
          setVariants([]);
          setActiveVariantKey(null);
          setAttribution(null);
          setSongSaved(false);
          setCompileError(false);
        } catch {
          setCompileError(true);
        }
        setRefining(false);
        scrollToOutput();
      }, 250);
    },
    [spec, schemaBlueprint, pipelineMode, ai.active, applyBlueprint, scrollToOutput]
  );

  const handleAiEnhance = useCallback(async () => {
    const merged = specFromIdea(spec, spec.description);
    const fallback = generatePrompt(merged);
    setResult(fallback);
    setVariants([]);
    setActiveVariantKey(null);
    setEnhancing(true);
    try {
      const enhanced = await generateAiPrompt(merged, fallback, ai.active);
      setResult(enhanced);
      setBlueprint(buildBlueprint(merged, enhanced));
      setAttribution(`${PROVIDERS.find((p) => p.id === ai.active.providerId)?.name ?? ai.active.providerId} · ${ai.active.model}`);
    } catch (e) {
      setCompileError(true);
      setResult({
        ...fallback,
        warnings: [...fallback.warnings, `AI enhancement failed: ${e instanceof Error ? e.message : 'unknown error'}`],
      });
      setAttribution(null);
    } finally {
      setEnhancing(false);
      scrollToOutput();
    }
  }, [spec, ai.active, scrollToOutput]);

  const handleCompare = useCallback(async () => {
    const merged = specFromIdea(spec, spec.description);
    const fallback = generatePrompt(merged);
    setResult(fallback);
    setComparing(true);
    setVariants([]);
    setActiveVariantKey(null);
    try {
      const targets = buildCompareTargets(ai.active);
      const results = await generateAiVariants(merged, fallback, targets);
      setVariants(results);
      const firstOk = results.find((v) => v.result);
      if (firstOk?.result) {
        setResult(firstOk.result);
        setBlueprint(buildBlueprint(merged, firstOk.result));
        setActiveVariantKey(`${firstOk.providerId}:${firstOk.model}`);
        setAttribution(`${firstOk.providerName} · ${firstOk.model}`);
      }
    } finally {
      setComparing(false);
      scrollToOutput();
    }
  }, [spec, ai.active, scrollToOutput]);

  const handleSelectVariant = useCallback(
    (key: string) => {
      const [providerId, ...modelParts] = key.split(':');
      const model = modelParts.join(':');
      const variant = variants.find((v) => v.providerId === providerId && v.model === model);
      if (variant?.result) {
        setResult(variant.result);
        setBlueprint(buildBlueprint(specFromIdea(spec, spec.description), variant.result));
        setActiveVariantKey(key);
        setAttribution(`${variant.providerName} · ${variant.model}`);
      }
    },
    [variants, spec]
  );

  const handleReset = useCallback(() => {
    setResult(null);
    setBlueprint(null);
    setSchemaBlueprint(null);
    setVariants([]);
    setActiveVariantKey(null);
    setAttribution(null);
    setCompileError(false);
    setSongSaved(false);
    setCritic(null);
    setRefined(false);
    setPipelineMode(null);
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleExplore = useCallback(() => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSaveSong = useCallback(() => {
    if (!blueprint) return;
    const song: SavedSong = {
      id: `${Date.now()}`,
      title: selectedTitle,
      blurb: `${blueprint.genre} · ${blueprint.mood}`,
      date: new Date().toISOString(),
      spec,
    };
    setSavedSongs(saveSong(song));
    setSongSaved(true);
  }, [blueprint, selectedTitle, spec]);

  const handleOpenSong = useCallback((id: string) => {
    const song = savedSongs.find((s) => s.id === id);
    if (!song) return;
    setSpec(song.spec);
    setResult(null);
    setBlueprint(null);
    setSchemaBlueprint(null);
    setCompileError(false);
    setSongSaved(true);
    setCritic(null);
    setRefined(false);
    setPipelineMode(null);
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, [savedSongs]);

  const handleDeleteSong = useCallback((id: string) => {
    setSavedSongs(deleteSavedSong(id));
  }, []);

  const handleRetry = useCallback(() => {
    setCompileError(false);
    // Retry the path that failed last
    if (attribution?.includes('pipeline') || pipelineMode !== null) {
      handleGenerateAi();
    } else {
      handleGenerate();
    }
  }, [handleGenerate, handleGenerateAi, attribution, pipelineMode]);

  const providerDef = PROVIDERS.find((p) => p.id === ai.active.providerId);
  const needsKey = providerDef && !providerDef.keyless;

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero onExplore={handleExplore} onSurprise={handleSurprise} />
      <Generator
        spec={spec}
        onSpecChange={setSpec}
        onGenerate={handleGenerate}
        onSurprise={handleSurprise}
        compiling={compiling}
        stageIndex={stageIndex}
        aiMode={aiMode}
        onAiModeChange={setAiMode}
        onGenerateAi={handleGenerateAi}
        aiBusy={aiBusy}
        aiStage={aiStage}
      />
      <div id="output">
        <OutputPanel
          result={result}
          blueprint={blueprint}
          selectedTitle={selectedTitle}
          onSelectTitle={setSelectedTitle}
          onReset={handleReset}
          onRefine={handleRefine}
          refining={refining}
          compileError={compileError}
          onRetry={handleRetry}
          savedSongs={savedSongs}
          songSaved={songSaved}
          onSaveSong={handleSaveSong}
          onOpenSong={handleOpenSong}
          onDeleteSong={handleDeleteSong}
          critic={critic}
          refined={refined}
          pipelineMode={pipelineMode}
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
