const AdminPagination = ({ page, totalPages, t }) => {
    return (
        <div className="flex items-center justify-between p-3">
            <p className="block text-sm text-slate-500">
                {t("pagination.page", { page, totalPages})} 
            </p>
            <div className="flex gap-1">
                <button
                    className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button">
                    {t("pagination.prev")} 
                </button>
                <button
                    className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button">
                    {t("pagination.next")} 
                </button>
            </div>
        </div>
    )
}

export default AdminPagination