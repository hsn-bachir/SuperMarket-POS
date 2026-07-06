import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export default function DeadStockTable({ data }) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-5 border-b border-gray-700 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Dead Stock</h2>

          <p className="mt-1 text-sm text-gray-400">
            Products occupying inventory without selling.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-11
              w-full
              rounded-xl
              border
              border-gray-700
              bg-gray-800
              pl-10
              pr-4
              text-sm
              text-gray-100
              placeholder:text-gray-500
              outline-none
              transition
              focus:border-gray-600
              focus:bg-gray-750
            "
          />
        </div>
      </div>

      <div className="max-h-[600px] overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 border-b border-gray-700 bg-gray-800/95 backdrop-blur">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Stock
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Minimum
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                Last Sale
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                Days
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((item) => (
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
                    <div className="font-medium text-gray-100">{item.name}</div>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-gray-200">
                    {item.current_stock}
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-gray-200">
                    {item.minimum_stock}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-400">
                    {item.last_sale_date ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-red-400">
                      {item.days_since_sale ?? "Never Sold"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-20 text-center text-gray-500"
                >
                  No dead stock found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
