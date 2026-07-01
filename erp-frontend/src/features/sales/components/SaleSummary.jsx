import Button from "@/components/ui/Button";

export default function SaleSummary({
  items,

  loading,

  onSubmit,
}) {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,

    0,
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,

    0,
  );

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Summary</h2>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span>Items</span>

          <strong>{totalItems}</strong>
        </div>

        <div className="flex justify-between text-xl">
          <span>Total</span>

          <strong>{total.toFixed(2)}</strong>
        </div>
      </div>

      <Button className="mt-8 w-full" onClick={onSubmit}>
        {loading ? "Creating..." : "Complete Sale"}
      </Button>
    </div>
  );
}
