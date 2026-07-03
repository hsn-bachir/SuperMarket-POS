import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Truck,
  Calendar,
  Warehouse,
  AlertTriangle,
  Archive,
} from "lucide-react";

const iconMap = {
  total_products: Package,
  total_sales: TrendingUp,
  total_purchases: ShoppingCart,
  today_sales: TrendingUp,
  month_sales: TrendingUp,
  inventory_value: Warehouse,
  low_stock_count: AlertTriangle,
  dead_stock_count: Archive,
};

export default function StatsGrid({ dashboard }) {
  const stats = [
    { key: "total_products", title: "Total Products" },
    { key: "total_sales", title: "Total Sales" },
    { key: "total_purchases", title: "Total Purchases" },
    { key: "today_sales", title: "Today Sales" },
    { key: "month_sales", title: "This Month Sales" },
    { key: "inventory_value", title: "Inventory Value" },
    { key: "low_stock_count", title: "Low Stock Items" },
    { key: "dead_stock_count", title: "Dead Stock Items" },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.key];
        const value = dashboard?.[stat.key] ?? 0;

        return (
          <div
            key={stat.key}
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-slate-800
              p-6
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-500/40
              hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]
            "
          >
            {/* glow effect */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.title}</p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
                  {typeof value === "number" ? value.toLocaleString() : value}
                </h2>
              </div>

              {Icon && (
                <div className="rounded-xl bg-slate-300/60 p-2">
                  <Icon size={18} className="text-indigo-400" />
                </div>
              )}
            </div>

            {/* subtle bottom accent line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-indigo-500/0 via-indigo-500/30 to-indigo-500/0" />
          </div>
        );
      })}
    </div>
  );
}
