import { useState } from "react"
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";

const CategoryModal = ({ isOpen, setIsOpen, t }) => {
    const [fields, setFields] = useState({
        name: "",
        slug: "",
    });

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState({
        name: false,
        slug: false,
    });


 

    const handleSubmit = () => {
        if (fields?.name == "") setError(prev => ({ ...prev, name: true }))
        if (fields?.slug == "") setError(prev => ({ ...prev, slug: true }))

        if (error.name || error.slug) {
            return false
        } else {
            setSubmitting(true)

            // inviteAdmin.mutate({
            //     name: fields?.name,
            //     slug: lastName,
            // }, {
            //     onSuccess: (d) => {
            //         setFields({ name: "", slug: "" })
            //         setSubmitting(false)
            //         setIsOpen(!isOpen)
            //         toast.success(t("invite.success"))
            //     },
            //     onError: (e) => {
            //         console.log(e);
            //         toast.success(t("invite.error"))
            //     }
            // })
        }
    }

    return (
        <div data-dialog-backdrop="dialog" data-dialog-backdrop-close="true" className={`absolute ${isOpen || 'hidden'} left-0 top-0 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300`}>
            <div data-dialog="dialog"
                className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
                <div className="flex flex-col p-6">
                    <h4
                        className="text-2xl mb-1 font-semibold text-slate-700">
                        {t("create.title")}
                    </h4>
                    <p className="mb-3 mt-1 text-slate-400">
                        {t("create.description")}
                    </p>

                    <InputField
                        label={t("create.form.name.label")}
                        placeholder={t("create.form.name.placeholder")}
                        error={error.name}
                        errorMesage={t("create.form.name.error")}
                        value={fields?.name}
                        onChange={(e) => {
                            setFields(prev => ({ ...prev, name: e.target.value }))
                            setError(prev => ({ ...prev, name: e.target.value == "" ? true : false }))
                        }}
                    />

                     <InputField
                        label={t("create.form.slug.label")}
                        placeholder={t("create.form.slug.placeholder")}
                        error={error.name}
                        errorMesage={t("create.form.slug.error")}
                        value={fields?.name}
                        onChange={(e) => {
                            setFields(prev => ({ ...prev, slug: e.target.value }))
                            setError(prev => ({ ...prev, slug: e.target.value == "" ? true : false }))
                        }}
                    />


                </div>
                <div className="p-6 pt-0">
                    <div className="flex space-x-2">
                        <button
                            className="w-full mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            disabled={submitting}
                            data-dialog-close="true"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {t("create.form.button.cancel")}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-dialog-close="true">
                            {submitting ? `${t("create.form.button.creating")}` : `${t("create.form.button.create")}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryModal
