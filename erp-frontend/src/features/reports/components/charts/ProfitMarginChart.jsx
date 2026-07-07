import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

export default function ProfitMarginChart({ profitLoss }) {
  const grossMargin = Number(profitLoss.gross_margin || 0);
  const netMargin = Number(profitLoss.net_margin || 0);

  const data = [
    {
      name: "Gross Margin",
      value: grossMargin,
      fill: "#10b981",
    },
    {
      name: "Net Margin",
      value: netMargin,
      fill: "#6ee7b7",
    },
  ];

  return (
    <div className="rounded-3xl border border-gray-700 bg-gray-900 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <h2 className="mb-1 text-xl font-semibold text-gray-100">
        Profit Margins
      </h2>

      <p className="mb-6 text-sm text-gray-400">
        Gross and net profitability performance.
      </p>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="35%"
            outerRadius="90%"
            barSize={18}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />

            <RadialBar
              background={{ fill: "#1f2937" }}
              dataKey="value"
              cornerRadius={12}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-500" />

            <span className="text-sm text-gray-300">Gross Margin</span>
          </div>

          <span className="font-semibold text-emerald-400">
            {grossMargin.toFixed(1)}%
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-300" />

            <span className="text-sm text-gray-300">Net Margin</span>
          </div>

          <span className="font-semibold text-emerald-300">
            {netMargin.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
