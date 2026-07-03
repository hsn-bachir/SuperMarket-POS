import SectionCard from "@/components/ui/SectionCard";

export default function InventoryCard({ inventory }) {
  return (
    <SectionCard title="Inventory Summary">
      <div className="space-y-4">
        <Row label="Products" value={inventory.total_products} />

        <Row label="Units" value={inventory.total_units} />

        <Row label="Value" value={`$${inventory.inventory_value}`} />
      </div>
    </SectionCard>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
