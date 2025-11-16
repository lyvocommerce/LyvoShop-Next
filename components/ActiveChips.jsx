import React from 'react';

/**
 * Активные «пилюли» выбранных фильтров.
 * Props:
 *  - selected: string[]
 *  - onRemove(id)
 */
export function ActiveChips({ selected, onRemove }) {
  if (!selected?.length) return null;
  return (
    <div id="activeChips" className="mt-2 flex flex-wrap gap-2">
      {selected.map((id) => (
        <button
          key={id}
          type="button"
          className="px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[13px] flex items-center gap-2"
          onClick={() => onRemove(id)}
        >
          <span>{id}</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ))}
    </div>
  );
}