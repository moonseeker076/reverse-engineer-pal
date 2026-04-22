import { useState } from 'react';
import { Target, ChevronRight, Lightbulb } from 'lucide-react';
import { PracticePrompt } from '@/types/speech';
import { PRACTICE_PROMPTS, CATEGORY_LABELS, CATEGORY_COLORS } from '@/data/prompts';

interface Props {
  selected: PracticePrompt;
  onSelect: (p: PracticePrompt) => void;
  disabled?: boolean;
}

type Category = PracticePrompt['category'] | 'all';

const CATEGORIES: Category[] = ['all', 'contractions', 'linking', 'professional', 'sounds'];

export function PracticePrompts({ selected, onSelect, disabled }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered =
    activeCategory === 'all'
      ? PRACTICE_PROMPTS
      : PRACTICE_PROMPTS.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-violet-500" />
        <h2 className="text-base font-semibold text-gray-800">Practice Sentence</h2>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            disabled={disabled}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              activeCategory === cat
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Prompt list */}
      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {filtered.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt)}
            disabled={disabled}
            className={`w-full text-left rounded-xl px-4 py-3 border transition-all group ${
              selected.id === prompt.id
                ? 'border-violet-400 bg-violet-50 shadow-sm'
                : 'border-gray-100 bg-gray-50 hover:border-violet-200 hover:bg-violet-50/50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug">"{prompt.text}"</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{prompt.focus}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[prompt.category]}`}
                >
                  {CATEGORY_LABELS[prompt.category]}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-opacity ${
                    selected.id === prompt.id ? 'text-violet-500 opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tip for selected */}
      {selected.tip && (
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">{selected.tip}</p>
        </div>
      )}
    </div>
  );
}
