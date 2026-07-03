import SectionCard from "@/components/ui/SectionCard";

export default function DashboardStats({ data }) {
  const stats = [
    { label: "Products", value: data.total_products },
    { label: "Suppliers", value: data.total_suppliers },
    { label: "Sales", value: data.total_sales },
    { label: "Purchases", value: data.total_purchases },
  ];

  return (
    <SectionCard>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-xl font-semibold">{s.value}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
