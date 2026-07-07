import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = ["#34d399", "#10b981", "#059669", "#047857", "#065f46"];

export default function TopProfitChart({ data }) {
  const chartData = data.slice(0, 10);
  console.log("TopProfitChart data:", chartData);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="border-b border-gray-700 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-100">
          Top Profit Products
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Products generating the highest profit.
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
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: "12px 16px",
              }}
              labelStyle={{
                color: "#f9fafb",
                fontWeight: 600,
                marginBottom: "6px",
              }}
              itemStyle={{
                color: "#34d399",
                fontWeight: 600,
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Profit",
              ]}
              cursor={{
                fill: "#1f2937",
                opacity: 0.5,
              }}
            />

            <Bar dataKey="total_profit" radius={[0, 10, 10, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
