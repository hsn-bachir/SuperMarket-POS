const tabs = [
  {
    id: "inventory",
    label: "Inventory",
  },
  {
    id: "sales",
    label: "Sales",
  },
  {
    id: "financial",
    label: "Financial",
  },
];

export default function ReportsTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-3 text-sm font-medium transition-all
          ${
            active === tab.id
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
