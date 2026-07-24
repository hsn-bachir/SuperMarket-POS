import { useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import Pagination from "@/components/ui/Pagination";

export default function InventoryValuationTable({
  data,
  count,
  page,
  setPage,
}) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    return data.filter((item) =>
      item.product_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  return (
    <div className="overflow-visible rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <TableHeader
        title="Inventory Valuation"
        description="Financial value of every stocked product."
        search={search}
        setSearch={setSearch}
        exportName="/reports/inventory-valuation/"
      />

      <div>
        <table className="w-full">
          <thead className="border-b border-gray-700 bg-gray-800/95 backdrop-blur">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Barcode
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Product
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                Category
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Stock
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Cost
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                Inventory Value
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
                  <td className="px-6 py-4 text-gray-400">{item.barcode}</td>

                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-100">
                      {item.product_name}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-300">{item.category}</td>

                  <td className="px-6 py-4 text-right font-medium text-gray-200">
                    {item.stock}
                  </td>

                  <td className="px-6 py-4 text-right text-gray-300">
                    ${Number(item.cost_price).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-emerald-400">
                      ${Number(item.inventory_value).toFixed(2)}
                    </span>
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
