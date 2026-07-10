import Pagination from "@/components/ui/Pagination";

export default function ReorderSuggestionsTable({
  data,
  count,
  page,
  setPage,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="border-b border-gray-700 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-100">
          Reorder Suggestions
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Products that should be reordered soon.
        </p>
      </div>

      <div className="max-h-[600px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 border-b border-gray-700 bg-gray-800/95 backdrop-blur">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Current Stock
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Minimum
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Recommended Order
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="
                    border-b
                    border-gray-800
                    transition-colors
                    hover:bg-gray-800/50
                  "
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-100">
                      {item.product}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-red-400">
                      {item.current_stock}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-gray-300">
                    {item.minimum_stock}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-emerald-400">
                      {item.suggested_order}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-20 text-center text-gray-500"
                >
                  No reorder suggestions.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination page={page} setPage={setPage} count={count} />
    </div>
  );
}
