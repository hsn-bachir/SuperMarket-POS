import ReportHeader from "./ReportHeader";

export default function BalanceSheetCard({ data, filters }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-2xl">
      <ReportHeader
        title="Balance Sheet"
        description="Assets, liabilities, and equity position."
        exportName="/accounting/balance-sheet/"
        filters={filters}
      />

      <div className="p-8">
        <div className="grid gap-6 xl:grid-cols-3">
          <Section
            title="Assets"
            rows={data.assets}
            total={data.total_assets}
          />

          <Section
            title="Liabilities"
            rows={data.liabilities}
            total={data.total_liabilities}
          />

          <Section
            title="Equity"
            rows={data.equity}
            total={data.total_equity}
          />
        </div>

        {/* Balance Status */}
        <div className="mt-8 flex justify-center">
          {data.balance_check ? (
            <div className="rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-semibold text-green-400 shadow-lg">
              ✓ Balance Sheet Balanced
            </div>
          ) : (
            <div className="rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 shadow-lg">
              ✗ Balance Sheet Out of Balance
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, rows, total }) {
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
                {row.name}
              </span>

              <span className="font-semibold tabular-nums text-white">
                {row.amount}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Total */}
      <div className="border-t border-blue-500/20 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 px-6 py-5">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold tracking-wide text-blue-100">
            Total {title}
          </span>

          <span className="rounded-xl border border-blue-400/20 bg-white/10 px-4 py-2 text-xl font-bold tabular-nums text-white shadow-md backdrop-blur-sm">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}
