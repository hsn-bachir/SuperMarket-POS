import SectionCard from "@/components/ui/SectionCard";

export default function InventoryValue({ value }) {
  return (
    <SectionCard title="Inventory Value" subtitle="Current inventory valuation">
      <div className="h-72 rounded-xl border bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[var(--text-secondary)]">Current Value</p>

          <h2 className="mt-3 text-5xl font-bold text-[var(--primary)]">
            ${Number(value).toLocaleString()}
          </h2>
        </div>
      </div>
    </SectionCard>
  );
}
