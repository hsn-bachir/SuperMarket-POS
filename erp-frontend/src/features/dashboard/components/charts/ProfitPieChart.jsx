import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import SectionCard from "@/components/ui/SectionCard";

const COLORS = [
  "#10b981", // Sales
  "#fb923c", // Purchases
];

export default function ProfitPieChart({ data }) {
  return (
    <SectionCard
      title="Sales vs Purchases"
      description="Distribution of sales and purchase values."
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={3}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: "12px 16px",
              }}
              labelStyle={{
                color: "#f9fafb",
                fontWeight: 600,
              }}
              itemStyle={{
                color: "#d1d5db",
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-300">Sales</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-400" />
          <span className="text-sm text-gray-300">Purchases</span>
        </div>
      </div>
    </SectionCard>
  );
}
