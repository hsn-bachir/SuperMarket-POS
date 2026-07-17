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
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>

          <p className="text-sm text-gray-500">Barcode: {item.barcode}</p>

          <p className="mt-2 text-sm">${item.price.toFixed(2)} each</p>

          <p className="text-sm text-gray-500">Stock: {item.stock}</p>
        </div>

        <Button
          variant="danger"
          className="px-3"
          onClick={() => remove(item.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="h-10 w-10 p-0"
            onClick={() => decrease(item.id)}
          >
            <Minus size={18} />
          </Button>

          <input
            type="text"
            inputMode="numeric"
            min={1}
            max={item.stock}
            value={item.quantity}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              updateQuantity(item.id, Number(e.target.value) || 1)
            }
            className="h-10 w-20 rounded-lg border border-gray-300 text-center font-semibold outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button
            variant="secondary"
            className="h-10 w-10 p-0"
            onClick={() => increase(item.id)}
            disabled={item.quantity >= item.stock}
          >
            <Plus size={18} />
          </Button>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Subtotal</p>

          <p className="text-xl font-bold">
            ${(item.quantity * item.price).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
