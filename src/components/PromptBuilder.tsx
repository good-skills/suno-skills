import { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Terminal } from 'lucide-react';
import { categories } from '@/data/promptLibrary';

interface PromptBuilderProps {
  selections: Record<string, string | null>;
  onClear: () => void;
}

export function PromptBuilder({ selections, onClear }: PromptBuilderProps) {
  const [copied, setCopied] = useState(false);

  const parts = categories
    .filter((c) => selections[c.id])
    .map((c) => selections[c.id]!);

  const prompt = parts.join(', ');
  const hasContent = parts.length > 0;

  const handleCopy = () => {
    if (!hasContent) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="sticky top-6 rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
        <Terminal className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-semibold text-white">Prompt Preview</h3>
        <span className="ml-auto text-xs text-slate-500">{parts.length} modules</span>
      </div>

      {/* Prompt text area */}
      <div className="p-5 min-h-[140px]">
        {hasContent ? (
          <p className="text-sm text-slate-300 leading-relaxed font-mono">
            {prompt}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center h-[100px] text-center">
            <p className="text-sm text-slate-600 mb-1">No modules selected yet</p>
            <p dir="rtl" className="text-xs text-slate-700">هنوز ماژولی انتخاب نشده است</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-5 py-4 border-t border-slate-800">
        <button
          onClick={handleCopy}
          disabled={!hasContent}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
            bg-white text-slate-900 hover:bg-slate-100 transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
        <button
          onClick={onClear}
          disabled={!hasContent}
          className="px-4 py-2.5 rounded-lg text-sm font-medium
            bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
