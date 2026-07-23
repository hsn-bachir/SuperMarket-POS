import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

import { getProducts } from "@/features/products/api/productsApi";

export default function ProductSearch({ cart, setCart }) {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!listRef.current || highlighted < 0) return;

    const element = listRef.current.children[highlighted];

    element?.scrollIntoView({
      block: "nearest",
    });
  }, [highlighted]);

  async function loadProducts() {
    try {
      const res = await getProducts({
        page_size: 1000,
      });

      setProducts(res.data.results ?? res.data);
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
          cost_price: Number(product.cost_price),
          quantity: 1,
          stock: product.stock,
        },
      ]);
    }

    setSearch("");
    setOpen(false);
    setHighlighted(-1);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return [];

    return products
      .filter((product) => {
        const term = search.toLowerCase();

        return (
          product.name.toLowerCase().includes(term) ||
          product.barcode.includes(search)
        );
      })
      .slice(0, 8);
  }, [products, search]);

  function handleKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        if (!open || filteredProducts.length === 0) return;

        e.preventDefault();

        setHighlighted((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : 0,
        );

        break;

      case "ArrowUp":
        if (!open || filteredProducts.length === 0) return;

        e.preventDefault();

        setHighlighted((prev) =>
          prev > 0 ? prev - 1 : filteredProducts.length - 1,
        );

        break;

      case "Enter":
        e.preventDefault();

        if (open && highlighted >= 0) {
          addProduct(filteredProducts[highlighted]);
          return;
        }

        const value = search.trim();

        if (!value) return;

        const product = products.find(
          (p) =>
            p.barcode === value || p.name.toLowerCase() === value.toLowerCase(),
        );

        if (product) {
          addProduct(product);
        }

        break;

      case "Escape":
        setOpen(false);
        setHighlighted(-1);
        break;

      default:
        break;
    }
  }

  return (
    <div ref={wrapperRef} className="space-y-4">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-gray-400" />

        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Scan barcode or search..."
          className="
            h-11
            w-full
            rounded-xl
            border
            border-gray-300
            pl-10
            pr-4
            outline-none
            focus:border-[var(--primary)]
          "
        />
      </div>

      {open && filteredProducts.length > 0 && (
        <div ref={listRef} className="grid gap-3">
          {filteredProducts.map((product, index) => (
            <button
              key={product.id}
              onClick={() => addProduct(product)}
              onMouseEnter={() => setHighlighted(index)}
              disabled={product.stock <= 0}
              className={`
                rounded-xl
                border
                p-4
                text-left
                transition
                hover:border-[var(--primary)]
                disabled:cursor-not-allowed
                disabled:opacity-50

                ${highlighted === index ? "border-[var(--primary)]" : ""}
              `}
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
