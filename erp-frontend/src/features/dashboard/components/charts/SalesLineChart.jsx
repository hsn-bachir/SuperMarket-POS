import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import SectionCard from "@/components/ui/SectionCard";

export default function SalesLineChart({ data }) {
  return (
    <SectionCard
      title="Sales Trend"
      description="Track sales performance over time."
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
                color: "#10b981",
                fontWeight: 600,
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Sales",
              ]}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                fill: "#10b981",
                strokeWidth: 0,
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: "#34d399",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
