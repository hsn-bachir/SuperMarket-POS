import SectionCard from "@/components/ui/SectionCard";

export default function RecentPurchasesWidget({ data = [] }) {
  return (
    <SectionCard title="Recent Purchases">
      {data.length === 0 ? (
        <div className="text-sm text-gray-400">No purchases yet</div>
      ) : (
        <div className="space-y-2">
          {data.map((p, i) => (
            <div key={i} className="flex justify-between text-sm border-b py-2">
              <span>{p.invoice_number}</span>
              <span>{p.purchase_date}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
