import SectionCard from "@/components/ui/SectionCard";

export default function BusinessSummary({ stockRisk, salesActivity }) {
  return (
    <SectionCard title="Business Summary">
      <div className="space-y-4">
        <div className="p-3 rounded bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Stock Risk</p>
          <p className="text-lg font-semibold">
            Low: {stockRisk[0].value} / Dead: {stockRisk[1].value}
          </p>
        </div>

        <div className="p-3 rounded bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Activity</p>
          <p className="text-lg font-semibold">
            Sales: {salesActivity[0].value} / Purchases:{" "}
            {salesActivity[1].value}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
