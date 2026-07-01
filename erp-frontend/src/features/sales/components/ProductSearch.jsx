import { useEffect, useState } from "react";

import SearchInput from "@/components/ui/SearchInput";

import { getProducts } from "@/features/products/api/productsApi";

export default function ProductSearch({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await getProducts();
    setProducts(res.data);
  }

  const filtered = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search),
    )
    .slice(0, 20);

  function addProduct(product) {
    const exists = cart.find((i) => i.product === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.product === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );

      return;
    }

    setCart([
      ...cart,
      {
        product: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: Number(product.selling_price),
      },
    ]);
  }

  return (
    <>
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by barcode or product..."
      />

      <div className="mt-4 max-h-96 overflow-y-auto border rounded-lg">
        {filtered.map((product) => (
          <button
            key={product.id}
            onClick={() => addProduct(product)}
            className="w-full px-4 py-3 hover:bg-slate-50 border-b flex justify-between"
          >
            <span>{product.name}</span>

            <span>${product.selling_price}</span>
          </button>
        ))}
      </div>
    </>
  );
}
