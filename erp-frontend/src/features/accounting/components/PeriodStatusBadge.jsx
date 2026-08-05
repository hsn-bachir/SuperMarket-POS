export default function PeriodStatusBadge({ status }) {
  const styles = {
    OPEN: "bg-green-100 text-green-700",

    CLOSED: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${styles[status] ?? "bg-gray-100 text-gray-700"}
      `}
    >
      {status}
    </span>
  );
}
