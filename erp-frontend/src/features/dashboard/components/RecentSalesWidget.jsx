import SectionCard from "@/components/ui/SectionCard";

export default function RecentSalesWidget({ data = [] }) {
  return (
    <SectionCard title="Recent Sales">
      {data.length === 0 ? (
        <div className="text-sm text-gray-400">No sales yet</div>
      ) : (
        <div className="space-y-2">
          {data.map((s) => (
            <div
              key={s.id || s.invoice_number}
              className="flex justify-between text-sm border-b py-2"
            >
              <div className="flex flex-col">
                <span className="font-medium">{s.invoice_number}</span>
                <span className="text-xs text-gray-400">{s.sale_date}</span>
              </div>
              <span className="font-semibold">${s.total}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
