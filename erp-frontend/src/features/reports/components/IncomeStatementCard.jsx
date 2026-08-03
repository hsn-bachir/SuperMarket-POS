import ReportHeader from "./ReportHeader";

export default function IncomeStatementCard({ data, filters }) {
  return (
    <div className="overflow-visible rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <ReportHeader
        title="Income Statement"
        description="Revenue, expenses, and profitability overview."
        exportName="/accounting/income-statement/"
        filters={filters}
      />

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <StatementSection
            title="Revenue"
            rows={data.revenue}
            totalLabel="Total Revenue"
            total={data.total_revenue}
          />

          <StatementSection
            title="Expenses"
            rows={data.expenses}
            totalLabel="Total Expenses"
            total={data.total_expenses}
          />
        </div>

        <div className="mt-6 rounded-xl bg-gray-800 p-5 text-center">
          <div className="text-sm text-gray-400">Net Profit</div>

          <div className="mt-1 text-3xl font-bold text-green-500">
            {data.net_profit}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatementSection({ title, rows, totalLabel, total }) {
  return (
    <div className="rounded-xl bg-gray-800 p-5">
      <h3 className="mb-4 text-base font-semibold text-gray-100">{title}</h3>

      <div className="space-y-1">
        {rows.map((row) => (
          <div
            key={row.account_id}
            className="
              flex
              justify-between
              rounded-lg
              px-2
              py-2
              text-sm
              transition
              hover:bg-gray-700/50
            "
          >
            <span className="text-gray-300">
              {row.code} - {row.name}
            </span>

            <span className="font-medium text-gray-100">{row.amount}</span>
          </div>
        ))}
      </div>

      <div
        className="
          mt-4
          flex
          justify-between
          border-t
          border-gray-700
          pt-4
          font-bold
          text-gray-100
        "
      >
        <span>{totalLabel}</span>

        <span>{total}</span>
      </div>
    </div>
  );
}
