import { Boxes, Truck, ShoppingCart, TriangleAlert } from "lucide-react";

import StatCard from "@/components/ui/StatCard";

export default function DashboardStats({ dashboard }) {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Products"
        value={dashboard.total_products}
        subtitle="Active products"
        icon={Boxes}
      />

      <StatCard
        title="Suppliers"
        value={dashboard.total_suppliers}
        subtitle="Registered suppliers"
        icon={Truck}
      />

      <StatCard
        title="Sales"
        value={dashboard.total_sales}
        subtitle="Completed sales"
        icon={ShoppingCart}
      />

      <StatCard
        title="Low Stock"
        value={dashboard.low_stock_count}
        subtitle="Require attention"
        icon={TriangleAlert}
      />
    </div>
  );
}
