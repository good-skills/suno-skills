import { useState, useCallback } from 'react';
import { Hero } from '@/components/Hero';
import { Generator } from '@/components/Generator';
import { OutputPanel } from '@/components/OutputPanel';
import { KnowledgeShowcase } from '@/components/KnowledgeShowcase';
import { Footer } from '@/components/Footer';
import { generatePrompt, type MusicSpec, type PromptResult } from '@/utils/promptEngine';

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

function App() {
  const [spec, setSpec] = useState<MusicSpec>(defaultSpec);
  const [result, setResult] = useState<PromptResult | null>(null);

  const handleGenerate = useCallback(() => {
    const r = generatePrompt(spec);
    setResult(r);
    setTimeout(() => {
      document.getElementById('output')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [spec]);

  const handleReset = useCallback(() => {
    setResult(null);
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleExplore = useCallback(() => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero onExplore={handleExplore} />
      <Generator spec={spec} onSpecChange={setSpec} onGenerate={handleGenerate} />
      <div id="output">
        <OutputPanel result={result} onReset={handleReset} />
      </div>
      <KnowledgeShowcase />
      <Footer />
    </div>
  );
}

export default App;
