import clsx from "clsx";

const styles = {
  products: {
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    subtitle: "text-blue-400",
  },
  stock: {
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    subtitle: "text-emerald-400",
  },
  value: {
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    subtitle: "text-violet-400",
  },
};

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  type = "products",
}) {
  const style = styles[type];

  return (
    <div
      className="
        rounded-3xl
        border border-gray-700
        bg-gray-900
        p-6
        shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        transition-all
        hover:border-gray-600
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-100">
            {value}
          </h2>

          <p className={clsx("mt-3 text-sm font-medium", style?.subtitle)}>
            {subtitle}
          </p>
        </div>

        <div
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-2xl",
            style?.iconBg,
          )}
        >
          <Icon size={28} className={style?.iconColor} />
        </div>
      </div>
    </div>
  );
}
