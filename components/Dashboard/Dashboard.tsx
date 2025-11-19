import LocalizedLink from "@/lib/localizedLink";
import { useDashboard } from "@/lib/react-query/queries/user/dashboard";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardSkeleton from "../ui/skeleton/DashboardSkeleton";
const MIN_LOADING_MS = 350;
const Dashboard = ({ t }) => {
  const useD = useDashboard();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const start = Date.now();

    setLoading(true);
    useD.mutate(
      {},
      {
        onSuccess: (d) => {
          if (!mounted) return;
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            const r = Object.entries(d.data.count).map(([key, value]) => ({
              title: key,
              items: Object.entries(value).map(([k, v]) => ({
                key: k,
                value: v,
              })),
            }));
            setDashboard(r);
            setLoading(false);
          }, remaining);
        },
        onError: (e) => {
          setLoading(false);
          console.log(e);
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            setLoading(false);
          }, remaining);
        },
      }
    );
     return () => {
      mounted = false;
    };
  }, [t]);

  return (
    <>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="fade-in">
          {dashboard?.map((dash, i) => (
          
              <div key={dash.title + i} className="relative mx-4 mt-12 overflow-hidden text-slate-700 rounded-none bg-clip-border">
                <div className="flex items-center justify-between ">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {t(`count.${dash.title}.title`)}
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mt-6">
                  {dash.items?.map((d, i) => (
                    <div
                      key={i}
                      // href={`sd`}
                      className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-6 items-center justify-center hover:bg-gray-50 transition"
                    >
                      <div className="p-4">
                        <Users />
                      </div>
                      <h4 className="mb-2 text-3xl font-extrabold">
                        {d.value}
                      </h4>
                      <p className="text-gray-500">
                        {t(`count.${dash.title}.${d.key}`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            
          ))}
        </div>
      )}
    </>
  );
};

export default Dashboard;
