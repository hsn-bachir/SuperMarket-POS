import ReportHeader from "./ReportHeader";

export default function TrialBalanceTable({ data, filters }) {
  return (
    <div className="overflow-visible rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <ReportHeader
        title="Trial Balance"
        description="Verification of debit and credit account balances."
        exportName="/accounting/trial-balance/"
        filters={filters}
      />

      <div className="p-6">
        <div className="overflow-x-auto rounded-xl border border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-800">
              <tr className="border-b border-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-400">
                  Code
                </th>

                <th className="px-4 py-3 text-left font-semibold text-gray-400">
                  Account
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-400">
                  Debit
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-400">
                  Credit
                </th>
              </tr>
            </thead>

            <tbody>
              {data.accounts.map((row) => (
                <tr
                  key={row.account_id}
                  className="
                    border-b
                    border-gray-800
                    transition
                    hover:bg-gray-800/50
                  "
                >
                  <td className="px-4 py-3 text-gray-300">{row.code}</td>

                  <td className="px-4 py-3 text-gray-100">{row.name}</td>

                  <td className="px-4 py-3 text-right text-gray-300">
                    {row.debit}
                  </td>

                  <td className="px-4 py-3 text-right text-gray-300">
                    {row.credit}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr
                className="
                  bg-gray-800
                  font-bold
                  text-gray-100
                "
              >
                <td colSpan={2} className="px-4 py-4">
                  Totals
                </td>

                <td className="px-4 py-4 text-right">{data.total_debit}</td>

                <td className="px-4 py-4 text-right">{data.total_credit}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-5 text-center">
          {data.is_balanced ? (
            <span
              className="
                inline-flex
                rounded-full
                bg-green-500/10
                px-4
                py-2
                font-semibold
                text-green-400
              "
            >
              ✓ Trial Balance Balanced
            </span>
          ) : (
            <span
              className="
                inline-flex
                rounded-full
                bg-red-500/10
                px-4
                py-2
                font-semibold
                text-red-400
              "
            >
              ✗ Trial Balance Not Balanced
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
