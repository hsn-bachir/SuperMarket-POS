import SectionCard from "@/components/ui/SectionCard";

export default function InventoryValueCard({ value }) {
  return (
    <SectionCard title="Inventory Value">
      <div className="text-3xl font-bold">${Number(value).toFixed(2)}</div>
      <div className="text-sm text-gray-500 mt-2">Total stock valuation</div>
    </SectionCard>
  );
}
