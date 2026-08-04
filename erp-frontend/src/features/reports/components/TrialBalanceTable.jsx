import ReportHeader from "./ReportHeader";

export default function TrialBalanceTable({ data, filters }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-2xl">
      <ReportHeader
        title="Trial Balance"
        description="Verification of debit and credit account balances."
        exportName="/accounting/trial-balance/"
        filters={filters}
      />

      <div className="p-8">
        <div className="overflow-hidden rounded-2xl border border-gray-700 shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Code
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Debit
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Credit
                </th>
              </tr>
            </thead>

            <tbody>
              {data.accounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                data.accounts.map((row) => (
                  <tr
                    key={row.account_id}
                    className="border-t border-gray-800 transition-all duration-200 hover:bg-gray-800/60"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-blue-300">
                      {row.code}
                    </td>

                    <td className="px-6 py-4 font-medium text-white">
                      {row.name}
                    </td>

                    <td className="px-6 py-4 text-right font-medium tabular-nums text-emerald-300">
                      {row.debit}
                    </td>

                    <td className="px-6 py-4 text-right font-medium tabular-nums text-red-300">
                      {row.credit}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            <tfoot>
              <tr className="border-t border-blue-500/20 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900">
                <td
                  colSpan={2}
                  className="px-6 py-5 text-base font-semibold tracking-wide text-blue-100"
                >
                  Total
                </td>

                <td className="px-6 py-5 text-right">
                  <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xl font-bold tabular-nums text-white shadow-md backdrop-blur-sm">
                    {data.total_debit}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xl font-bold tabular-nums text-white shadow-md backdrop-blur-sm">
                    {data.total_credit}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Balance Status */}
        <div className="mt-8 flex justify-center">
          {data.is_balanced ? (
            <div className="rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-semibold text-green-400 shadow-lg">
              ✓ Trial Balance Balanced
            </div>
          ) : (
            <div className="rounded-full border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 shadow-lg">
              ✗ Trial Balance Not Balanced
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
