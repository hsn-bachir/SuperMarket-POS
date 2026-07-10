import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SlowMovingChart({ data }) {
  const chartData = data ?? [];

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="border-b border-gray-700 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-100">
          Slow Moving Products
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Products with the lowest sales.
        </p>
      </div>

      <div className="h-[420px] p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: 30,
              right: 20,
            }}
          >
            <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

            <XAxis
              type="number"
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
              type="category"
              dataKey="product_name"
              width={150}
              tick={{
                fill: "#d1d5db",
                fontSize: 12,
              }}
              axisLine={false}
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
                fill: "#1f2937",
              }}
            />

            <Bar
              dataKey="quantity_sold"
              fill="#fb923c"
              radius={[0, 10, 10, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
