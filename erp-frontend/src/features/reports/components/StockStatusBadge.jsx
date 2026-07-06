export default function StockStatusBadge({ days }) {
  let label = "Healthy";
  let color =
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

  if (days >= 180) {
    label = "Critical";
    color = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  } else if (days >= 60) {
    label = "Aging";
    color =
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}
