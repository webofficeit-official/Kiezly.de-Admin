const UserPagination = ({ page, totalPages, t, setPage }) => {
    return (
        <div className="flex items-center justify-between p-3">
            <p className="block text-sm text-slate-500">
                {t("pagination.page", { page, totalPages })}
            </p>
            <div className="flex gap-1">
                <button
                    className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => setPage(page - 1)}
                >
                    {t("pagination.prev")}
                </button>
                <div className="flex items-center gap-1" data-testid="pager">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                        .map((n) => (
                            <button
                                key={n}
                                className={`rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${n === page ? "bg-black text-white" : ""
                                    }`}
                                    onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}
                </div>
                <button
                    className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => setPage(page + 1)}
                >
                    {t("pagination.next")}
                </button>
            </div>
        </div>
    )
}

export default UserPagination