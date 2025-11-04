import { UserPlus } from "lucide-react"
import { Checkbox } from "../ui/checkbox"

const UserHeader = ({ totalItems, setInviteAdminModelOpen, inviteAdminModelOpen, t, verified, setVerified, active, setActive, deleted, setDeleted }) => {
    return (
        <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
            <div className="flex items-center justify-between ">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{t("title")} ({totalItems})</h3>
                </div>
                <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                    <Checkbox id="verified" label={t("filter.verified")} checked={verified} onChange={() => setVerified(verified ? null : true)} />
                    <Checkbox id="active" label={t("filter.active")} checked={active} onChange={() => setActive(active ? null : true)} />
                    <Checkbox id="deleted" label={t("filter.deleted")} checked={deleted} onChange={() => setDeleted(!deleted)} />
                    <button
                        className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                        onClick={() => setInviteAdminModelOpen(!inviteAdminModelOpen)}
                    >
                        <UserPlus className="w-4 h-4" />
                        {t("invite.title")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserHeader