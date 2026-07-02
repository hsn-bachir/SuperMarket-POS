import { Minus, Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";

export default function CartItem({ item, increase, decrease, remove }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>

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
            className="w-10 h-10 p-0"
            onClick={() => decrease(item.id)}
          >
            <Minus size={18} />
          </Button>

          <span className="w-10 text-center text-lg font-semibold">
            {item.quantity}
          </span>

          <Button
            variant="secondary"
            className="w-10 h-10 p-0"
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
