import React from 'react';

export function Pager({ page, totalPages, onPrev, onNext }) {
  return (
    <>
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="px-4 py-2 rounded-md border border-[var(--border)] bg-white text-[14px] disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-[13px] text-[var(--muted)]">
        Page {page} / {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 rounded-md border border-[var(--border)] bg-white text-[14px] disabled:opacity-40"
      >
        Next
      </button>
    </>
  );
}