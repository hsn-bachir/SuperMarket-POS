import { calculateTotals } from "../utils/calculateTotals";

export default function CartTotals({ cart }) {
  const totals = calculateTotals(cart);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">Summary</h2>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Items</span>
          <span>{cart.length}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
