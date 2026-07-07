import { TrendingUp, DollarSign, Wallet, Package } from "lucide-react";

const icons = {
  revenue: DollarSign,
  gross: TrendingUp,
  net: Wallet,
  cogs: Package,
};

const styles = {
  revenue: {
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    subtitle: "text-emerald-400",
  },
  gross: {
    iconBg: "bg-green-500/15",
    iconColor: "text-green-400",
    subtitle: "text-green-400",
  },
  net: {
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-400",
    subtitle: "text-teal-400",
  },
  cogs: {
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    subtitle: "text-rose-400",
  },
};

export default function SalesKpiCard({ title, value, subtitle, type }) {
  const Icon = icons[type];
  const style = styles[type];

  return (
    <div className="rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all hover:border-gray-600">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-100">
            ${Number(value).toLocaleString()}
          </h2>

          <p className={`mt-3 text-sm font-medium ${style.subtitle}`}>
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.iconBg}`}
        >
          <Icon size={28} className={style.iconColor} />
        </div>
      </div>
    </div>
  );
}
