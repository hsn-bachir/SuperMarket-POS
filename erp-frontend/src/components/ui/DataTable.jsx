import Loader from "./Loader";
import EmptyState from "./EmptyState";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = "No data found",
  emptyDescription = "There is nothing to display.",
}) {
  if (loading) {
    return <Loader />;
  }

  if (!loading && data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-gray-300 bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 transition-colors hover:bg-[var(--surface-hover)]"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm text-[var(--text-primary)]"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
