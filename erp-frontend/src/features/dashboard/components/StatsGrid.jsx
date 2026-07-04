import {
  Package,
  Truck,
  ShoppingCart,
  Boxes,
  AlertTriangle,
  Archive,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid({ dashboard }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Products"
        value={dashboard.total_products}
        subtitle="Active products"
        icon={<Package size={26} />}
        color="blue"
      />

      <StatCard
        title="Suppliers"
        value={dashboard.total_suppliers}
        subtitle="Registered suppliers"
        icon={<Truck size={26} />}
        color="cyan"
      />

      <StatCard
        title="Sales"
        value={dashboard.total_sales}
        subtitle="Completed sales"
        icon={<ShoppingCart size={26} />}
        color="emerald"
      />

      <StatCard
        title="Purchases"
        value={dashboard.total_purchases}
        subtitle="Purchase invoices"
        icon={<Boxes size={26} />}
        color="purple"
      />

      <StatCard
        title="Inventory Value"
        value={dashboard.inventory_value}
        subtitle="Current stock value"
        icon={<DollarSign size={26} />}
        color="amber"
      />

      <StatCard
        title="Today's Sales"
        value={dashboard.today_sales}
        subtitle="Today's revenue"
        icon={<TrendingUp size={26} />}
        color="teal"
      />

      <StatCard
        title="Low Stock"
        value={dashboard.low_stock_count}
        subtitle="Need reorder"
        icon={<AlertTriangle size={26} />}
        color="red"
      />

      <StatCard
        title="Dead Stock"
        value={dashboard.dead_stock_count}
        subtitle="Unsold inventory"
        icon={<Archive size={26} />}
        color="slate"
      />
    </div>
  );
}
