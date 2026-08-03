import ReportHeader from "./ReportHeader";

export default function CashFlowCard({ data, filters }) {
  return (
    <div className="overflow-visible rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <ReportHeader
        title="Cash Flow Statement"
        description="Operating, investing, and financing cash movements."
        exportName="/accounting/cash-flow/"
        filters={filters}
      />

      <div className="p-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <FlowSection
            title="Operating"
            rows={data.operating}
            total={data.net_operating}
          />

          <FlowSection
            title="Investing"
            rows={data.investing}
            total={data.net_investing}
          />

          <FlowSection
            title="Financing"
            rows={data.financing}
            total={data.net_financing}
          />
        </div>

        <div className="mt-6 rounded-xl bg-gray-800 p-4 text-center">
          <div className="text-sm text-gray-400">Net Cash Change</div>

          <div className="text-2xl font-bold text-gray-100">
            {data.net_cash_change}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowSection({ title, rows, total }) {
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
