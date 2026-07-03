import SectionCard from "@/components/ui/SectionCard";

export default function BusinessHighlights({ data }) {
  return (
    <SectionCard title="Highlights">
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Best Selling Product</div>
          <div className="font-semibold">
            {data.best_selling_product || "—"}
          </div>
        </div>

        <div>
          <div className="text-gray-500">Top Profit Product</div>
          <div className="font-semibold">{data.top_profit_product || "—"}</div>
        </div>
      </div>
    </SectionCard>
  );
}
