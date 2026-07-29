import { calculateTotals } from "../utils/calculateTotals";

export default function CartTotals({ cart }) {
  const totals = calculateTotals(cart);

  return (
    <div
      className="
        rounded-xl
        bg-gray-50
        border
        p-4
      "
    >
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Items</span>

        <span className="font-medium">{cart.length}</span>
      </div>

      <div className="mt-2 flex justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>

        <span>${totals.subtotal.toFixed(2)}</span>
      </div>

      <div
        className="
          mt-4
          flex
          justify-between
          items-center
          border-t
          pt-4
        "
      >
        <span className="text-lg font-semibold">Total</span>

        <span
          className="
            text-3xl
            font-bold
            text-[var(--primary)]
          "
        >
          ${totals.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
