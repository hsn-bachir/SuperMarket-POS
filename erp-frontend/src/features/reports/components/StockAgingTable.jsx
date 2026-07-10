import { useMemo, useState } from "react";

import StockStatusBadge from "./StockStatusBadge";
import Pagination from "@/components/ui/Pagination";
import TableHeader from "./TableHeader";

export default function StockAgingTable({ data, count, page, setPage }) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return data.filter((item) =>
      item.product_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <div className="overflow-visible rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <TableHeader
        title="Stock Aging Report"
        description="Monitor slow-moving inventory and identify products that haven't been sold recently."
        search={search}
        setSearch={setSearch}
        exportName="/reports/stock-aging/"
      />

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
                Value
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                Last Sale
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                Days
              </th>

              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((item) => (
                <tr
                  key={item.product_id}
                  className="
                    border-b
                    border-gray-800
                    transition-colors
                    hover:bg-gray-800/50
                  "
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-100">
                      {item.product_name}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-gray-200">
                    {item.stock}
                  </td>

                  <td className="px-6 py-4 text-right font-medium text-gray-200">
                    ${Number(item.inventory_value).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-400">
                    {item.last_sale_date ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-center font-medium text-gray-300">
                    {item.days_since_last_sale ?? "-"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <StockStatusBadge
                        days={item.days_since_last_sale ?? 999}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-20 text-center text-gray-500"
                >
                  No products found.
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
