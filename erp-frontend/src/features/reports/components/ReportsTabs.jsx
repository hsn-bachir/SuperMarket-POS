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
    <div className="border-b border-gray-700">
      <div className="flex justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-all
            ${
              active === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
