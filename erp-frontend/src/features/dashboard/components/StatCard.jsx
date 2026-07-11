import CountUpModule from "react-countup";

const CountUp = CountUpModule.default;

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = "emerald",
}) {
  const colors = {
    emerald: "bg-emerald-500/15 text-emerald-400",
    amber: "bg-amber-500/15 text-amber-400",
    red: "bg-red-500/15 text-red-400",
    purple: "bg-violet-500/15 text-violet-400",
    cyan: "bg-cyan-500/15 text-cyan-400",
    teal: "bg-teal-500/15 text-teal-400",
    slate: "bg-slate-500/15 text-slate-400",
    blue: "bg-blue-500/15 text-blue-400",
  };

  return (
    <div
      className="
        rounded-3xl
        border border-gray-700
        bg-gray-900
        p-6
        shadow-[0_8px_30px_rgb(0,0,0,0.25)]
        transition-all
        duration-300
        hover:border-gray-600
        hover:-translate-y-1
      "
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white">
            <CountUp
              end={Number(value) || 0}
              separator=","
              decimals={String(value).includes(".") ? 2 : 0}
            />
          </h2>

          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>

        <div
          className={`
            flex h-14 w-14 items-center justify-center
            rounded-2xl
            ${colors[color]}
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
