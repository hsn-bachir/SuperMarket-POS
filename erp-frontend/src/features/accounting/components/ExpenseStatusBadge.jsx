export default function ExpenseStatusBadge({ status }) {
  const styles = {
    draft: "bg-yellow-100 text-yellow-800",
    posted: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        styles[status?.toLowerCase()] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
