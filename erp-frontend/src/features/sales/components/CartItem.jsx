import { Package, Wrench, Trash2, Minus, Plus } from "lucide-react";

export default function CartItem({
  item,
  increase,
  decrease,
  updateQuantity,
  remove,
}) {
  const isService = item.type === "service";

  const Icon = isService ? Wrench : Package;

  const lineTotal = Number(item.price) * Number(item.quantity);

  return (
    <div className="px-3 py-3 transition hover:bg-slate-50">
      <div className="flex items-center gap-3">
        {/* TYPE ICON */}
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
            ${
              isService
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-600"
            }
          `}
        >
          <Icon size={16} />
        </div>

        {/* NAME */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">
            {item.name}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            {isService ? "Service" : "Product"} · $
            {Number(item.price).toFixed(2)}
          </p>
        </div>

        {/* QUANTITY */}
        <div className="flex h-8 items-center rounded-lg border border-slate-300 bg-white">
          <button
            type="button"
            onClick={() => decrease(item.id, item.type)}
            className="flex h-full w-8 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <Minus size={13} />
          </button>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              updateQuantity(item.id, item.type, Number(e.target.value))
            }
            className="h-full w-9 border-x border-slate-200 text-center text-xs font-medium outline-none"
          />

          <button
            type="button"
            onClick={() => increase(item.id, item.type)}
            className="flex h-full w-8 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* TOTAL */}
        <div className="w-20 text-right">
          <p className="text-sm font-semibold text-slate-900">
            ${lineTotal.toFixed(2)}
          </p>
        </div>

        {/* REMOVE */}
        <button
          type="button"
          onClick={() => remove(item.id, item.type)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          title="Remove"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
