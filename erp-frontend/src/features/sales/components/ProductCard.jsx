import Button from "@/components/ui/Button";

export default function ProductCard({ product, onAdd }) {
  const stock = Number(product.stock);

  const outOfStock = stock <= 0;

  return (
    <div
      className="
      rounded-xl
      border
      bg-white
      p-4
      shadow-sm
      flex
      flex-col
      gap-3
    "
    >
      <div>
        <h3 className="font-semibold">{product.name}</h3>

        <p className="text-sm text-gray-500">{product.barcode}</p>
      </div>

      <div className="flex justify-between">
        <span className="font-medium">${product.selling_price}</span>

        <span
          className={
            stock <= 0
              ? "text-red-600"
              : stock <= product.minimum_stock
                ? "text-yellow-600"
                : "text-green-600"
          }
        >
          Stock {stock}
        </span>
      </div>

      <Button disabled={outOfStock} onClick={() => onAdd(product)}>
        {outOfStock ? "Out of Stock" : "Add"}
      </Button>
    </div>
  );
}
