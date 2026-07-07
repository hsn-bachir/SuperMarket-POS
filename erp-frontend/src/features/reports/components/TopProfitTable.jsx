export default function TopProfitTable({ data }) {
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

      <div className="overflow-auto">
        <table className="w-full">
          <thead className="border-b border-gray-700 bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total Profit
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.product_id}
                  className="
                    border-b
                    border-gray-800
                    transition-colors
                    hover:bg-gray-800/50
                  "
                >
                  <td className="px-6 py-4 font-medium text-gray-100">
                    {item.product_name}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-emerald-400">
                      ${Number(item.total_profit).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-16 text-center text-gray-500"
                >
                  No profit data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
