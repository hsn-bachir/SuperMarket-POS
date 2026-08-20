import EmptyState from "@/components/ui/EmptyState";
import CartItem from "./CartItem";

export default function CartTable({ cart, setCart }) {
  function isSameItem(item, id, type) {
    return item.id === id && item.type === type;
  }

  function increase(id, type) {
    setCart((prev) =>
      prev.map((item) => {
        if (!isSameItem(item, id, type)) {
          return item;
        }

        // Services have no stock limit
        if (item.type !== "service" && item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  }

  function decrease(id, type) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (!isSameItem(item, id, type)) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function updateQuantity(id, type, quantity) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (!isSameItem(item, id, type)) {
            return item;
          }

          const maxQuantity = item.type === "service" ? Infinity : item.stock;

          const newQuantity = Math.max(1, Math.min(quantity, maxQuantity));

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function remove(id, type) {
    setCart((prev) => prev.filter((item) => !isSameItem(item, id, type)));
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        title="Cart is Empty"
        description="Add a product or service to get started."
      />
    );
  }

  return (
    <div className="divide-y divide-slate-200">
      {cart.map((item, index) => (
        <CartItem
          key={`${item.type}-${item.id}-${item.price}-${index}`}
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
