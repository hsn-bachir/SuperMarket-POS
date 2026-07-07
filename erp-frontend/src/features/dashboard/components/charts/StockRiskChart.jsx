import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import SectionCard from "@/components/ui/SectionCard";

export default function StockRiskChart({ data }) {
  return (
    <SectionCard
      title="Stock Risk"
      description="Products at risk of stock shortages."
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{
                fill: "#9ca3af",
                fontSize: 12,
              }}
              axisLine={{
                stroke: "#374151",
              }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#9ca3af",
                fontSize: 12,
              }}
              axisLine={{
                stroke: "#374151",
              }}
              tickLine={false}
            />

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
                color: "#fb923c",
                fontWeight: 600,
              }}
            />

            <Bar dataKey="value" fill="#fb923c" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
