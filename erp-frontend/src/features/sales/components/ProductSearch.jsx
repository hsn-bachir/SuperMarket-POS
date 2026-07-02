import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { getProducts } from "@/features/products/api/productsApi";

export default function ProductSearch({ cart, setCart }) {
  const inputRef = useRef(null);

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function loadProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function addProduct(product) {
    if (product.stock <= 0) return;

    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          barcode: product.barcode,
          name: product.name,
          price: Number(product.selling_price),
          quantity: 1,
          stock: product.stock,
        },
      ]);
    }

    setSearch("");

    inputRef.current?.focus();
  }

  function handleEnter(e) {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    const product = products.find(
      (p) =>
        p.barcode === value || p.name.toLowerCase() === value.toLowerCase(),
    );

    if (product) {
      addProduct(product);
    }
  }

  const filtered =
    search.length === 0
      ? []
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.barcode.includes(search),
        );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />

        <input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="Scan barcode or search..."
          className="
            h-11
            w-full
            rounded-xl
            border
            border-[var(--border)]
            pl-10
            pr-4
            outline-none
            focus:border-[var(--primary)]
          "
        />
      </div>

      {filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.slice(0, 8).map((product) => (
            <button
              key={product.id}
              onClick={() => addProduct(product)}
              disabled={product.stock <= 0}
              className="
                rounded-xl
                border
                p-4
                text-left
                transition
                hover:border-[var(--primary)]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{product.name}</h3>

                  <p className="text-sm text-gray-500">{product.barcode}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">${product.selling_price}</p>

                  <p
                    className={`text-sm ${
                      product.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
