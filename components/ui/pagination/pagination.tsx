const Pagination = ({ page, totalPages, t, setPage }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between p-3 border-t border-slate-200">
      <p className="block text-sm text-slate-500">
        {t("pagination.page", { page, totalPages })}
      </p>

      <div className="flex gap-1">
        {/* Prev button */}
        <button
          className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50"
          type="button"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1} 
        >
          {t("pagination.prev")}
        </button>
        <div className="flex items-center gap-1" data-testid="pager">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
            .map((n) => (
              <button
                key={n}
                className={`rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold transition-all active:opacity-[0.85] ${
                  n === page
                    ? "bg-slate-800 text-white border-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => setPage(n)}
                disabled={n === page}
              >
                {n}
              </button>
            ))}
        </div>

      
        <button
          className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:bg-slate-100 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50"
          type="button"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages} 
        >
          {t("pagination.next")}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
