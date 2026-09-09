import { useState } from 'react';
import { Camera, PersonStanding, Hand, Footprints, Sun, Smile, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { categories, colorMap, type PromptCategory } from '@/data/promptLibrary';

const iconMap: Record<string, typeof Camera> = {
  camera: Camera,
  person: PersonStanding,
  hand: Hand,
  footprints: Footprints,
  sun: Sun,
  face: Smile,
};

interface CategoryCardProps {
  category: PromptCategory;
  selectedLabel: string | null;
  onSelect: (option: string) => void;
}

function CategoryCard({ category, selectedLabel, onSelect }: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const colors = colorMap[category.color];
  const Icon = iconMap[category.icon] ?? Camera;

  return (
    <div className={`rounded-2xl border ${colors.border} bg-slate-900/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-slate-900/80`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{category.title}</h3>
            <p dir="rtl" className="text-xs text-slate-500 mt-0.5">{category.titleFa}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedLabel && (
            <span className={`text-xs px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} font-medium hidden sm:inline-block`}>
              {selectedLabel}
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>

      {/* Description */}
      <div className="px-5 pb-3">
        <p className="text-sm text-slate-400">{category.description}</p>
        <p dir="rtl" className="text-xs text-slate-600 mt-0.5">{category.descriptionFa}</p>
      </div>

      {/* Options */}
      {expanded && (
        <div className="px-5 pb-5 flex flex-wrap gap-2">
          {category.options.map((opt) => {
            const isSelected = selectedLabel === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => onSelect(opt.prompt)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? `${colors.bg} ${colors.text} ring-1 ${colors.ring}`
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
              >
                <span className="flex items-center gap-1.5">
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface LibraryShowcaseProps {
  selections: Record<string, string | null>;
  onSelect: (categoryId: string, option: string) => void;
}

export function LibraryShowcase({ selections, onSelect }: LibraryShowcaseProps) {
  return (
    <section id="library" className="relative py-24 px-6 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Prompt Modules</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Each category contains curated prompt fragments. Expand a module and select elements to build your prompt.
          </p>
          <p dir="rtl" className="text-sm text-slate-600 mt-2">
            هر دسته شامل قطعات پرامپت انتخاب‌شده است. یک ماژول را باز کنید و عناصر را انتخاب کنید.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid gap-4 md:gap-5">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              selectedLabel={selections[cat.id] ? cat.options.find(o => o.prompt === selections[cat.id])?.label ?? null : null}
              onSelect={(opt) => onSelect(cat.id, opt)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
