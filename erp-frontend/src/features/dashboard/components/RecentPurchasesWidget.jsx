import SectionCard from "@/components/ui/SectionCard";

function calculatePurchaseTotal(purchase) {
  if (!purchase?.items) return 0;

  return purchase.items.reduce((sum, item) => {
    return sum + Number(item.quantity) * Number(item.cost_price);
  }, 0);
}

export default function RecentPurchasesWidget({ data = [] }) {
  return (
    <SectionCard title="Recent Purchases">
      {data.length === 0 ? (
        <div className="text-sm text-gray-400">No purchases yet</div>
      ) : (
        <div className="space-y-2">
          {data.map((p) => {
            const total = calculatePurchaseTotal(p);

            return (
              <div
                key={p.id}
                className="flex justify-between text-sm border-b py-2"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{p.invoice_number}</span>
                  <span className="text-xs text-gray-400">
                    {p.purchase_date}
                  </span>
                </div>

                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
