import Button from "@/components/ui/Button";
import SaleItemRow from "./SaleItemRow";

export default function SaleItemsTable({
  items,
  products,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="font-semibold">Sale Items</h2>

        <Button type="button" onClick={onAdd}>
          Add Item
        </Button>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Price</th>
            <th className="p-3 text-right">Subtotal</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
            <SaleItemRow
              key={index}
              index={index}
              item={item}
              products={products}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
