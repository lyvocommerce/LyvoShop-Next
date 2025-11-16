import React from 'react';

const LABELS = {
  '': 'Relevance',
  'price_asc': 'Price: Low → High',
  'price_desc': 'Price: High → Low',
  'rating_desc': 'Rating',
};

export function SortButton({ sort, onOpenSort }) {
  const label = LABELS[sort] ?? LABELS[''];
  return (
    <button
      onClick={onOpenSort}
      className="h-12 px-4 rounded-xl border border-[var(--border)] bg-white hover:bg-neutral-50 active:scale-[0.99] transition text-[15px]"
      aria-label="Sort products"
    >
      {label}
    </button>
  );
}