import { useInviteAdmins } from "@/lib/react-query/queries/admins/admins";
import { useState } from "react"

const InviteAdmins = ({ isOpen, setIsOpen, t }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState({
        firstName: false,
        lastName: false,
        email: false
    });

    const inviteAdmin = useInviteAdmins();

    const EMAIL_RE = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    function isEmailValid(email) {
        if (typeof email !== "string") return false;
        const s = email.trim();
        if (s.length === 0) return false;
        return EMAIL_RE.test(s);
    }

    const handleSubmit = () => {
        if (firstName == "") setError(prev => ({ ...prev, firstName: true }))
        if (lastName == "") setError(prev => ({ ...prev, lastName: true }))
        if (email == "" || !isEmailValid(email)) setError(prev => ({ ...prev, email: true }));

        if (error.email || error.firstName || error.lastName) {
            return false
        } else {
            setSubmitting(true)

            inviteAdmin.mutate({
                first_name: firstName,
                last_name: lastName,
                email
            }, {
                onSuccess: (d) => {
                    setFirstName("")
                    setLastName("")
                    setEmail("")
                    setSubmitting(false)
                    setIsOpen(!isOpen)
                },
                onError: (e) => {
                    console.log(e);
                }
            })
        }
    }

    return (
        <div data-dialog-backdrop="dialog" data-dialog-backdrop-close="true" className={`absolute ${isOpen || 'hidden'} left-0 top-0 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300`}>
            <div data-dialog="dialog"
                className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
                <div className="flex flex-col p-6">
                    <h4
                        className="text-2xl mb-1 font-semibold text-slate-700">
                        {t("invite.title")}
                    </h4>
                    <p className="mb-3 mt-1 text-slate-400">
                        {t("invite.description")}
                    </p>

                    <InviteInput
                        label={t("invite.form.firstName.label")}
                        placeholder={t("invite.form.firstName.placeholder")}
                        error={error.firstName}
                        errorMesage={t("invite.form.firstName.error")}
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value)
                            setError(prev => ({ ...prev, firstName: e.target.value == "" ? true : false }))
                        }}
                    />

                    <InviteInput
                        label={t("invite.form.lastName.label")}
                        placeholder={t("invite.form.lastName.placeholder")}
                        error={error.lastName}
                        errorMesage={t("invite.form.lastName.error")}
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value)
                            setError(prev => ({ ...prev, lastName: e.target.value == "" ? true : false }))
                        }}
                    />

                    <InviteInput
                        label={t("invite.form.email.label")}
                        type="email"
                        placeholder={t("invite.form.email.placeholder")}
                        error={error.email}
                        errorMesage={t("invite.form.email.error")}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError(prev => ({ ...prev, email: e.target.value == "" || !isEmailValid(e.target.value) ? true : false }))
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
                            {t("invite.form.button.cancel")}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="w-full mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-dialog-close="true">
                            {submitting ? `${t("invite.form.button.inviting")}` : `${t("invite.form.button.invite")}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InviteAdmins

function InviteInput({ label, placeholder = "", error = false, errorMesage = "", value, onChange, type = 'text' }) {
    return (
        <div className="w-full max-w-sm min-w-[200px] mt-4">
            <label className={`block mb-1 text-sm ${error ? 'text-red-600' : 'text-slate-700'}`}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border ${error ? 'border-red-400' : 'border-slate-200'} rounded px-3 py-2 transition duration-300 ease shadow-sm focus:shadow-md`}
                placeholder={placeholder} />
            {
                error &&
                <p className="text-sm mt-2 font-sans text-red-600">{errorMesage}</p>
            }
        </div>
    )
}