import clsx from "clsx";

export default function KpiCard({
  title,
  value,
  icon: Icon,
  color = "bg-blue-600",
}) {
  return (
    <div
      className="
        bg-[var(--sidebar-bg)]
        border
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-lg
        transition-all
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="text-3xl text-white font-bold mt-3">{value}</h2>
        </div>

        <div
          className={clsx(
            "w-14 h-14 rounded-xl flex items-center justify-center text-white",
            color,
          )}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}
