import ReportHeader from "./ReportHeader";

export default function IncomeStatementCard({ data, filters }) {
  const isProfit = Number(data.net_profit) >= 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-2xl">
      <ReportHeader
        title="Income Statement"
        description="Revenue, expenses, and profitability overview."
        exportName="/accounting/income-statement/"
        filters={filters}
      />

      <div className="p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <StatementSection
            title="Revenue"
            rows={data.revenue}
            totalLabel="Total Revenue"
            total={data.total_revenue}
            color="green"
          />

          <StatementSection
            title="Expenses"
            rows={data.expenses}
            totalLabel="Total Expenses"
            total={data.total_expenses}
            color="red"
          />
        </div>

        {/* Net Profit */}
        <div
          className={`mt-8 rounded-2xl border p-6 shadow-lg ${
            isProfit
              ? "border-emerald-500/20 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900"
              : "border-red-500/20 bg-gradient-to-r from-red-900 via-rose-900 to-red-900"
          }`}
        >
          <div className="text-center">
            <p
              className={`text-sm font-medium uppercase tracking-wider ${
                isProfit ? "text-emerald-200" : "text-red-200"
              }`}
            >
              Net {isProfit ? "Profit" : "Loss"}
            </p>

            <p
              className={`mt-2 text-4xl font-bold tabular-nums ${
                isProfit ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {data.net_profit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatementSection({ title, rows, totalLabel, total, color = "blue" }) {
  const footerStyles =
    color === "green"
      ? {
          bg: "bg-gradient-to-r from-emerald-900 via-green-900 to-emerald-900",
          border: "border-emerald-500/20",
          text: "text-emerald-100",
        }
      : color === "red"
        ? {
            bg: "bg-gradient-to-r from-red-900 via-rose-900 to-red-900",
            border: "border-red-500/20",
            text: "text-red-100",
          }
        : {
            bg: "bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900",
            border: "border-blue-500/20",
            text: "text-blue-100",
          };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-2xl">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800/90 px-6 py-5">
        <h3 className="text-xl font-bold tracking-wide text-white">{title}</h3>
      </div>

      {/* Accounts */}
      <div className="space-y-2 px-5 py-5">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-700 py-8 text-center text-sm text-gray-500">
            No accounts found
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.account_id}
              className="flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-700/50"
            >
              <span className="text-sm font-medium text-gray-300">
                {row.code} - {row.name}
              </span>

              <span className="font-semibold tabular-nums text-white">
                {row.amount}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      <div
        className={`border-t px-6 py-5 ${footerStyles.bg} ${footerStyles.border}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-base font-semibold tracking-wide ${footerStyles.text}`}
          >
            {totalLabel}
          </span>

          <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xl font-bold tabular-nums text-white shadow-md backdrop-blur-sm">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
