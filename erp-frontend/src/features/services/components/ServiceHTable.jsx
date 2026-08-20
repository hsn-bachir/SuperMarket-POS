import { Tag, DollarSign, Calendar } from "lucide-react";

export default function ServiceTable({ history }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                Service
              </span>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                Price
              </span>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Date
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {history.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {row.service_name || row.service || "N/A"}
              </td>
              <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                ${Number(row.price).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                {row.created_at || row.effective_from
                  ? new Date(
                      row.created_at || row.effective_from,
                    ).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
