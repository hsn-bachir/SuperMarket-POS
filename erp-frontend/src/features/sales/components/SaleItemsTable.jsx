import Button from "@/components/ui/Button";

import { Trash2 } from "lucide-react";

export default function SaleItemsTable({
  items,

  setItems,
}) {
  function updateQuantity(index, value) {
    const copy = [...items];

    copy[index].quantity = Number(value);

    setItems(copy);
  }

  function remove(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="py-3 text-left">Product</th>

          <th>Qty</th>

          <th>Price</th>

          <th>Total</th>

          <th />
        </tr>
      </thead>

      <tbody>
        {items.map((item, index) => (
          <tr key={index} className="border-b">
            <td className="py-4">{item.product_name}</td>

            <td>
              <input
                type="number"
                min="1"
                className="w-20 rounded border px-2 py-1"
                value={item.quantity}
                onChange={(e) => updateQuantity(index, e.target.value)}
              />
            </td>

            <td>{item.unit_price}</td>

            <td>{(item.quantity * item.unit_price).toFixed(2)}</td>

            <td>
              <Button
                variant="danger"
                className="px-3"
                onClick={() => remove(index)}
              >
                <Trash2 size={16} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
