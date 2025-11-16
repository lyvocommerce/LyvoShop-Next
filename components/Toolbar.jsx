import React, { useEffect, useRef } from 'react';
import { SortButton } from './SortButton.jsx';

export function Toolbar({ q, onChangeQ, onOpenFilters, sort, onOpenSort }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const toolbar = document.getElementById('toolbar');
    const container = document.querySelector('.container');
    if (!toolbar || !container) return;
    const onScroll = () => {
      const y = container.scrollTop;
      if (y > 24) toolbar.classList.add('chips-collapsed');
      else toolbar.classList.remove('chips-collapsed');
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex items-center gap-3" ref={containerRef}>
      {/* Поиск */}
      <div className="flex items-center h-12 flex-1 rounded-xl border border-[var(--border)] bg-white px-4">
        <input
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
          placeholder="Search products"
          className="w-full outline-none placeholder:text-neutral-400 text-[15px]"
          aria-label="Search"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/>
          <path d="M21 21l-3.6-3.6"/>
        </svg>
      </div>

      {/* Сортировка */}
      <SortButton sort={sort} onOpenSort={onOpenSort} />

      {/* Фильтры */}
      <button
        onClick={onOpenFilters}
        className="h-12 w-12 grid place-items-center rounded-xl border border-[var(--border)] bg-white hover:bg-neutral-50 active:scale-[0.99] transition"
        aria-label="Filters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M6 12h12M10 18h4" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}