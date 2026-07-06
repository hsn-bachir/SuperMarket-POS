import CountUpModule from "react-countup";
const CountUp = CountUpModule.default;

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}) {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
    red: "from-red-500 to-rose-600",
    purple: "from-violet-500 to-fuchsia-600",
    cyan: "from-cyan-500 to-blue-600",
    teal: "from-teal-500 to-emerald-600",
    slate: "from-slate-600 to-gray-800",
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-[var(--sidebar-bg)] border border-gray-200 dark:border-gray-800 shadow-sm
      hover:shadow-xl
      transition-all
      duration-300
      hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl text-gray-400">{title}</p>
            <h2 className="mt-3 text-2xl text-white font-bold">
              <CountUp
                end={Number(value) || 0}
                separator=","
                decimals={String(value).includes(".") ? 2 : 0}
              />
            </h2>
            <p className="mt-2 text-xs text-white">{subtitle}</p>
          </div>

          <div
            className={`h-14 w-14 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${colors[color]}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
