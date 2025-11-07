import LocalizedLink from "@/lib/localizedLink"
import { useDashboard } from "@/lib/react-query/queries/user/dashboard"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"

const Dashboard = ({ t }) => {
    const useD = useDashboard()
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        useD.mutate({}, {
            onSuccess: (d) => {
                const r = Object.entries(d.data.count).map(([key, value]) => ({
                    title: key,
                    items: Object.entries(value).map(([k, v]) => ({
                        key: k,
                        value: v
                    }))
                }));
                setDashboard(r)
            },
            onError: (e) => {
                console.log(e)
            }
        })
    }, [t])

    return (
        <>
            {dashboard?.map((dash, i) => (
                <>
                    <div className="relative mx-4 mt-12 overflow-hidden text-slate-700 rounded-none bg-clip-border">
                        <div className="flex items-center justify-between ">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{t(`count.${dash.title}.title`)}</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mt-6">
                            {dash.items?.map((d, i) => (
                                <div
                                    key={i}
                                    // href={`sd`}
                                    className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-6 items-center justify-center hover:bg-gray-50 transition"
                                >
                                    <div className="p-4"><Users /></div>
                                    <h4 className="mb-2 text-3xl font-extrabold">{d.value}</h4>
                                    <p className="text-gray-500">{t(`count.${dash.title}.${d.key}`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ))}
        </>
    )
}

export default Dashboard