'use client';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className = 'px-5',
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={`
        flex items-center
        justify-between
        border-t border-zinc-200
        py-4

        dark:border-white/10

        ${className}
      `}
    >
      <button
        onClick={() =>
          onPageChange(
            Math.max(1, page - 1),
          )
        }
        disabled={page === 1}
        className="
          flex items-center
          gap-1
          rounded-xl
          border border-zinc-200
          px-3 py-2
          text-sm
          font-medium
          text-zinc-600
          transition-colors

          hover:bg-zinc-100
          hover:text-black

          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:bg-transparent

          dark:border-white/10
          dark:text-zinc-400

          dark:hover:bg-white/[0.04]
          dark:hover:text-white
        "
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <p
        className="
          text-sm
          text-zinc-500
        "
      >
        Page {page} of {totalPages}
      </p>

      <button
        onClick={() =>
          onPageChange(
            Math.min(totalPages, page + 1),
          )
        }
        disabled={page === totalPages}
        className="
          flex items-center
          gap-1
          rounded-xl
          border border-zinc-200
          px-3 py-2
          text-sm
          font-medium
          text-zinc-600
          transition-colors

          hover:bg-zinc-100
          hover:text-black

          disabled:cursor-not-allowed
          disabled:opacity-40
          disabled:hover:bg-transparent

          dark:border-white/10
          dark:text-zinc-400

          dark:hover:bg-white/[0.04]
          dark:hover:text-white
        "
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
