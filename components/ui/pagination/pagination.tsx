const Pagination = ({ page, totalPages, t, setPage }) => {
  // Normalize empty state
  const noData = !totalPages || totalPages < 1;
  const safeTotalPages = noData ? 1 : totalPages;

  const canPrev = page > 1 && !noData;
  const canNext = page < safeTotalPages && !noData;

  // Generate page numbers (maximum 5 buttons)
  const pages = Array.from({ length: safeTotalPages }, (_, i) => i + 1);
  const startIndex = Math.max(0, page - 3);
  const visible = pages.slice(startIndex, startIndex + 5);

  return (
    <div className="flex flex-wrap items-center justify-between p-3 border-t border-slate-200">
      
      {/* PAGE INFO */}
      <p className="block text-sm text-slate-500">
        {t("pagination.page", {
          page: noData ? 1 : page,
          totalPages: safeTotalPages,
        })}
      </p>

      {/* PAGINATION BUTTONS */}
      <div className="flex gap-1">
        
        {/* PREVIOUS */}
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setPage(page - 1)}
          className="rounded border border-slate-300 py-2.5 px-3 text-xs font-semibold 
                     text-slate-600 transition-all hover:bg-slate-100 disabled:opacity-40 
                     disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          {t("pagination.prev")}
        </button>

        {/* PAGE NUMBERS */}
        <div className="flex items-center gap-1" data-testid="pager">
          {visible.map((n) => (
            <button
              key={n}
              disabled={noData || n === page}
              onClick={() => setPage(n)}
              className={`rounded border border-slate-300 py-2.5 px-3 text-xs font-semibold transition-all 
                          ${
                            n === page
                              ? "bg-slate-800 text-white border-slate-800"
                              : "text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                          }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* NEXT */}
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setPage(page + 1)}
          className="rounded border border-slate-300 py-2.5 px-3 text-xs font-semibold 
                     text-slate-600 transition-all hover:bg-slate-100 disabled:opacity-40 
                     disabled:hover:bg-transparent disabled:cursor-not-allowed"
        >
          {t("pagination.next")}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
