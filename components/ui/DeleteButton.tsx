import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ onConfirm, t }) {
    const [open, setOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm(); // your handleDelete(id)
        setOpen(false);
    };

    return (
        <>
            {/* Delete button */}
            <button
                onClick={() => setOpen(true)}
                className="relative p-2 max-h-[40px] max-w-[40px] flex items-center justify-center rounded-lg hover:bg-slate-100 transition"
                type="button"
            >
                <Trash2 className="w-5 h-5 text-red-600" />
            </button>

            {/* Dialog Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {t("delete.title")}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            {t("delete.description")}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                {t("delete.cancel")}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                {t("delete.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
