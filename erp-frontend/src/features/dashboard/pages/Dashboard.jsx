import { DollarSign, ShoppingCart, Package, TriangleAlert } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import SectionCard from "@/components/ui/SectionCard";
import Badge from "@/components/ui/Badge";

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of today's business performance."
      />

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Revenue Today"
          value="$12,480"
          subtitle="+12% from yesterday"
          icon={DollarSign}
        />

        <StatCard
          title="Sales Today"
          value="164"
          subtitle="Completed orders"
          icon={ShoppingCart}
        />

        <StatCard
          title="Products"
          value="1,254"
          subtitle="Active products"
          icon={Package}
        />

        <StatCard
          title="Low Stock"
          value="18"
          subtitle="Require attention"
          icon={TriangleAlert}
        />
      </div>

      {/* SECOND ROW */}

      <div className="grid xl:grid-cols-3 gap-6 mb-8">
        {/* SALES */}

        <div className="xl:col-span-2">
          <SectionCard title="Sales Overview" subtitle="Last 7 days">
            <div className="h-80 rounded-xl bg-slate-50 border flex items-center justify-center text-slate-400">
              Sales Chart (Recharts)
            </div>
          </SectionCard>
        </div>

        {/* LOW STOCK */}

        <SectionCard
          title="Low Stock Alerts"
          subtitle="Products below minimum stock"
        >
          <div className="space-y-4">
            <ProductRow name="Hammer" stock={2} />

            <ProductRow name="Milk 1L" stock={4} />

            <ProductRow name="PVC Pipe" stock={1} />

            <ProductRow name="Rice 5kg" stock={3} />
          </div>
        </SectionCard>
      </div>

      {/* THIRD ROW */}

      <SectionCard title="Recent Sales" subtitle="Latest completed invoices">
        <table className="w-full">
          <thead className="text-left border-b">
            <tr>
              <th className="py-3">Invoice</th>

              <th>Customer</th>

              <th>Total</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <SaleRow invoice="#1021" customer="Walk-in" total="$42.00" />

            <SaleRow invoice="#1020" customer="Ahmed" total="$95.00" />

            <SaleRow
              invoice="#1019"
              customer="Hardware Store"
              total="$340.00"
            />

            <SaleRow invoice="#1018" customer="Walk-in" total="$18.00" />
          </tbody>
        </table>
      </SectionCard>
    </>
  );
}

function ProductRow({ name, stock }) {
  return (
    <div className="flex justify-between items-center">
      <span>{name}</span>

      <Badge variant="warning">{stock} left</Badge>
    </div>
  );
}

function SaleRow({ invoice, customer, total }) {
  return (
    <tr className="border-b">
      <td className="py-4 font-medium">{invoice}</td>

      <td>{customer}</td>

      <td>{total}</td>

      <td>
        <Badge variant="success">Completed</Badge>
      </td>
    </tr>
  );
}
