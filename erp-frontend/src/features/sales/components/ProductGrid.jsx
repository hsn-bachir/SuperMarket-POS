import ProductCard from "./ProductCard";

export default function ProductGrid({ products, onAdd }) {
  return (
    <div
      className="
      grid
      grid-cols-2
      lg:grid-cols-3
      gap-4
    "
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
