import { UserPlus } from "lucide-react";

const LanguagesHeader = ({ totalItems, modelOpen, setModelOpen, t }) => {
  return (
    <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {t("title")} ({totalItems ?? 0})
          </h3>
        </div>
        <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
          <button
            className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 disabled:opacity-50"
            type="button"
            onClick={() => setModelOpen(!modelOpen)}
          >
            <UserPlus className="w-4 h-4" />
            {t("create.title")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguagesHeader;
