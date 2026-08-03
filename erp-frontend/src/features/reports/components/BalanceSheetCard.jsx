import ReportHeader from "./ReportHeader";

export default function BalanceSheetCard({ data, filters }) {
  return (
    <div className="overflow-visible rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <ReportHeader
        title="Balance Sheet"
        description="Assets, liabilities, and equity position."
        exportName="/accounting/balance-sheet/"
        filters={filters}
      />

      <div className="p-6">
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

        <div className="mt-6 text-center">
          {data.balance_check ? (
            <span className="font-semibold text-green-500">
              ✓ Balance Sheet Balanced
            </span>
          ) : (
            <span className="font-semibold text-red-500">
              ✗ Balance Sheet Out of Balance
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, rows, total }) {
  return (
    <div className="rounded-xl bg-gray-800 p-4">
      <h3 className="mb-3 font-semibold text-gray-100">{title}</h3>

      {rows.map((row) => (
        <div key={row.account_id} className="flex justify-between py-1">
          <span className="text-gray-300">{row.name}</span>

          <span className="font-medium text-gray-100">{row.amount}</span>
        </div>
      ))}

      <div className="mt-3 flex justify-between border-t border-gray-700 pt-3 font-bold">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  );
}
