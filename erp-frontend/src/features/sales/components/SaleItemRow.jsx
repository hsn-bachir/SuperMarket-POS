import { Trash2 } from "lucide-react";

import FormSelect from "@/components/forms/FormSelect";
import FormInput from "@/components/forms/FormInput";
import Button from "@/components/ui/Button";

export default function SaleItemRow({
  index,
  item,
  products,
  onChange,
  onRemove,
}) {
  const subtotal =
    (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);

  return (
    <tr className="border-b">
      <td className="p-2 w-[40%]">
        <FormSelect
          name="product"
          value={item.product}
          onChange={(e) => onChange(index, "product", Number(e.target.value))}
          options={[
            {
              value: "",
              label: "Select product",
            },
            ...products.map((p) => ({
              value: p.id,
              label: p.name,
            })),
          ]}
        />
      </td>

      <td className="p-2 w-28">
        <FormInput
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onChange(index, "quantity", e.target.value)}
        />
      </td>

      <td className="p-2 w-36">
        <FormInput
          type="number"
          step="0.01"
          value={item.unit_price}
          onChange={(e) => onChange(index, "unit_price", e.target.value)}
        />
      </td>

      <td className="p-2 text-right font-medium">{subtotal.toFixed(2)}</td>

      <td className="p-2 w-14">
        <Button variant="danger" type="button" onClick={() => onRemove(index)}>
          <Trash2 size={16} />
        </Button>
      </td>
    </tr>
  );
}
