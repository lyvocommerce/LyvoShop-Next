import React from 'react';
import { norm } from '../services/normalizers.js';

/**
 * Горизонтальный ряд чипсов под поиском.
 * Props:
 *  - categories: string[]
 *  - selected: string[] (normalized ids)
 *  - onToggle(id)
 *  - onClear()
 */
export function ChipsRow({ categories, selected, onToggle, onClear }) {
  return (
    <div id="chipRow" className="overflow-x-auto scrollbar-none">
      <div className="flex gap-4 min-w-max">
        <button
          type="button"
          className={`h-9 px-4 rounded-xl border text-[15px] whitespace-nowrap ${
            selected.length === 0
              ? 'bg-[var(--text)] border-[var(--text)] text-white'
              : 'bg-white border-[var(--border)] hover:bg-neutral-50'
          }`}
          onClick={onClear}
        >
          All
        </button>

        {categories.map((cat) => {
          const id = norm(cat);
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={`h-9 px-4 rounded-xl border text-[15px] whitespace-nowrap ${
                active
                  ? 'bg-[var(--text)] border-[var(--text)] text-white'
                  : 'bg-white border-[var(--border)] hover:bg-neutral-50'
              }`}
              onClick={() => onToggle(id)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}