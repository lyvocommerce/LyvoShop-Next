import React, { useEffect } from 'react';
import { norm } from '../services/normalizers.js';
import { filterGroups } from '../config/filterGroups.js';

/**
 * Bottom sheet with filters (совместимо с твоим bottomsheet-lock.js)
 * Props:
 *  - open: boolean
 *  - categories: string[]
 *  - tmpFilters: { category:Set, brand:Set, price:Set, rating:Set }
 *  - toggleTmp(group:string, id:string)
 *  - onClear()
 *  - onApply()
 *  - onClose()
 */
export function FilterSheet({ open, categories, tmpFilters, toggleTmp, onClear, onApply, onClose }) {
  // Держим классы hidden в синхронизации — для совместимости с глобальным скриптом
  useEffect(() => {
    const sheet = document.getElementById('filterSheet');
    const backdrop = document.getElementById('filterBackdrop');
    if (!sheet || !backdrop) return;
    if (open) {
      sheet.classList.remove('hidden');
      backdrop.classList.remove('hidden');
    } else {
      sheet.classList.add('hidden');
      backdrop.classList.add('hidden');
    }
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        id="filterBackdrop"
        className={`${open ? '' : 'hidden'} fixed inset-0 z-40 bg-black/40`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Sheet */}
      <section
        id="filterSheet"
        className={`${open ? '' : 'hidden'} fixed z-50 inset-x-0 bottom-0 mx-auto w-full max-w-[720px] bg-white rounded-t-3xl shadow-xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filterTitle"
      >
        <div className="pt-3 flex justify-center">
          <div id="sheetGrabber" className="h-1.5 w-12 rounded-full bg-neutral-300" />
        </div>

        <header className="px-4 mt-2 mb-2 flex items-center justify-between">
          <h3 id="filterTitle" className="text-[17px] font-semibold">Filters</h3>
          <button
            id="filterClose"
            className="px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-[14px] hover:bg-neutral-50"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        {/* Options */}
        <div id="filterOptions" className="px-4 pb-4 max-h-[60vh] overflow-y-auto scrollbar-none">
          {/* Categories */}
          <div className="mb-4">
            <h4 className="text-[15px] font-semibold mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const id = norm(c);
                const checked = tmpFilters.category.has(id);
                return (
                  <label
                    key={id}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-[14px] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      className="accent-[var(--accent)]"
                      checked={checked}
                      onChange={() => toggleTmp('category', id)}
                    />
                    <span>{c}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Прочие группы (Brand / Price / Rating) */}
          {filterGroups.map((g) => (
            <div key={g.key} className="mb-4">
              <h4 className="text-[15px] font-semibold mb-2">{g.label}</h4>
              <div className="flex flex-wrap gap-2">
                {g.options.map((opt) => {
                  const checked = tmpFilters[g.key].has(opt.id);
                  return (
                    <label
                      key={`${g.key}__${opt.id}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-[14px] cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        className="accent-[var(--accent)]"
                        checked={checked}
                        onChange={() => toggleTmp(g.key, opt.id)}
                      />
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--border)] px-4 py-3 flex gap-3 justify-between">
          <button
            id="filterClear"
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[15px] hover:bg-neutral-50"
            onClick={onClear}
          >
            Clear
          </button>
          <button
            id="filterApply"
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--accent)] text-white text-[15px] hover:opacity-90"
            onClick={onApply}
          >
            Apply
          </button>
        </div>
      </section>
    </>
  );
}