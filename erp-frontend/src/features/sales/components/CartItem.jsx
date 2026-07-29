import { Minus, Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";

export default function CartItem({
  item,
  increase,
  decrease,
  updateQuantity,
  remove,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        px-3
        py-4
        hover:bg-gray-50
      "
    >
      {/* PRODUCT INFO */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold">{item.name}</h3>

        <p className="text-xs text-gray-500">{item.barcode}</p>

        <p className="mt-1 text-sm text-gray-600">
          ${item.price.toFixed(2)} each
        </p>
      </div>

      {/* QUANTITY */}
      {/* QUANTITY */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-lg
      border
      border-gray-300
      bg-white
      hover:bg-gray-100
    "
          onClick={() => decrease(item.id)}
        >
          <Minus size={16} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={item.quantity}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
          className="
      h-9
      w-12
      rounded-lg
      border
      border-gray-300
      text-center
      font-semibold
      outline-none
      focus:border-[var(--primary)]
    "
        />

        <button
          type="button"
          className="
      flex
      h-9
      w-9
      items-center
      justify-center
      rounded-lg
      border
      border-gray-300
      bg-white
      hover:bg-gray-100
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
          onClick={() => increase(item.id)}
          disabled={item.quantity >= item.stock}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* TOTAL */}
      <div className="w-24 text-right">
        <p className="font-semibold">
          ${(item.quantity * item.price).toFixed(2)}
        </p>

        <p className="text-xs text-gray-500">Stock {item.stock}</p>
      </div>

      {/* REMOVE */}
      <button
        type="button"
        className="
    flex
    h-9
    w-9
    items-center
    justify-center
    rounded-lg
    bg-red-500
    text-white
    hover:bg-red-600
  "
        onClick={() => remove(item.id)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
