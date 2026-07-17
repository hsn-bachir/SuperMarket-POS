import EmptyState from "@/components/ui/EmptyState";

import CartItem from "./CartItem";

export default function CartTable({ cart, setCart }) {
  function increase(id) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.quantity >= item.stock) return item;

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  }

  function decrease(id) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function updateQuantity(id, quantity) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          const newQuantity = Math.max(1, Math.min(quantity, item.stock));

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function remove(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Cart is Empty"
        description="Scan a barcode or search for a product."
      />
    );
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          increase={increase}
          decrease={decrease}
          updateQuantity={updateQuantity}
          remove={remove}
        />
      ))}
    </div>
  );
}
