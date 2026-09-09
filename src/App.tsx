import { useState, useCallback } from 'react';
import { Hero } from '@/components/Hero';
import { LibraryShowcase } from '@/components/LibraryShowcase';
import { PromptBuilder } from '@/components/PromptBuilder';
import { Examples } from '@/components/Examples';
import { Footer } from '@/components/Footer';

function App() {
  const [selections, setSelections] = useState<Record<string, string | null>>({});

  const handleSelect = useCallback((categoryId: string, option: string) => {
    setSelections((prev) => {
      const current = prev[categoryId];
      if (current === option) {
        const next = { ...prev };
        next[categoryId] = null;
        return next;
      }
      return { ...prev, [categoryId]: option };
    });
  }, []);

  const handleClear = useCallback(() => {
    setSelections({});
  }, []);

  const handleExplore = useCallback(() => {
    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero onExplore={handleExplore} />

      {/* Library + Builder layout */}
      <section className="relative py-24 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div>
              <LibraryShowcase selections={selections} onSelect={handleSelect} />
            </div>
            <div>
              <PromptBuilder selections={selections} onClear={handleClear} />
            </div>
          </div>
        </div>
      </section>

      <Examples />
      <Footer />
    </div>
  );
}

export default App;
