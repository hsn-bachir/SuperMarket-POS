import DataTable from "@/components/ui/DataTable";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function CartTable({
  cart,

  setCart,
}) {
  function updateQuantity(index, value) {
    const items = [...cart];

    items[index].quantity = Number(value);

    setCart(items);
  }

  const columns = [
    {
      title: "Product",

      render: (row) => row.product_name,
    },

    {
      title: "Price",

      render: (row) => `$${row.unit_price}`,
    },

    {
      title: "Qty",

      render: (row) => {
        const index = cart.indexOf(row);

        return (
          <input
            type="number"
            min={1}
            value={row.quantity}
            onChange={(e) => updateQuantity(index, e.target.value)}
            className="w-20 border rounded px-2 h-9"
          />
        );
      },
    },

    {
      title: "Subtotal",

      render: (row) => `$${(row.quantity * row.unit_price).toFixed(2)}`,
    },

    {
      title: "",

      render: (row) => (
        <Button
          variant="danger"
          className="px-3"
          onClick={() =>
            setCart(cart.filter((item) => item.product !== row.product))
          }
        >
          <Trash2 size={16} />
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={cart} />;
}
