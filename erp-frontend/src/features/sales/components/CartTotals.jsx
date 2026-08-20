import { calculateTotals } from "../utils/calculateTotals";

export default function CartTotals({ cart }) {
  const totals = calculateTotals(cart);

  return (
    <div className="flex items-center gap-4 rounded-lg bg-gray-100 px-4 py-1.5">
      <div className="text-md text-gray-500">
        Items:{" "}
        <span className="font-semibold text-gray-900">{cart.length}</span>
      </div>
      <div className="h-4 w-px bg-gray-300" />
      <div className="text-md text-gray-500">
        Subtotal:{" "}
        <span className="font-semibold text-gray-900">
          ${totals.subtotal.toFixed(2)}
        </span>
      </div>
      <div className="h-4 w-px bg-gray-300" />
      <div className="text-md text-gray-500">
        Total:{" "}
        <span className="font-semibold text-gray-900">
          ${totals.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
