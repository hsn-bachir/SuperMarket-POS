import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RevenueVsCogsChart({ profitLoss }) {
  const data = [
    {
      name: "Revenue",
      value: Number(profitLoss.revenue),
    },
    {
      name: "COGS",
      value: Number(profitLoss.cogs),
    },
  ];

  return (
    <div className="rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <h2 className="text-xl font-semibold text-gray-100">Revenue vs COGS</h2>

      <p className="mt-1 text-sm text-gray-400">
        Compare total revenue against cost of goods sold.
      </p>

      <div className="mt-6 h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />

                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "12px",
                color: "#f9fafb",
              }}
              cursor={{
                stroke: "#4b5563",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              fill="url(#revenueGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
