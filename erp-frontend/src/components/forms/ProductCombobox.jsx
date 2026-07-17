import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Search } from "lucide-react";

import { getProducts } from "@/features/products/api/productsApi";

export default function ProductCombobox({
  value,
  onChange,
  label = "Product",
  placeholder = "Search product name or barcode...",
}) {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  useEffect(() => {
    loadProducts();
  }, []);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === Number(value));
  }, [products, value]);

  useEffect(() => {
    if (selectedProduct) {
      setSearch(selectedProduct.name);
    }
  }, [selectedProduct]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);

        if (selectedProduct) {
          setSearch(selectedProduct.name);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedProduct]);

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

      setProducts(res.data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return [];

    return products
      .filter((product) => {
        const term = search.toLowerCase();

        return (
          product.name.toLowerCase().includes(term) ||
          product.barcode?.includes(search)
        );
      })
      .slice(0, 8);
  }, [products, search]);

  function selectProduct(product) {
    onChange(product.id);

    setSearch(product.name);

    setOpen(false);
    setHighlighted(-1);
  }

  function handleKeyDown(e) {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();

        setHighlighted((prev) =>
          prev < filteredProducts.length - 1 ? prev + 1 : 0,
        );

        break;

      case "ArrowUp":
        e.preventDefault();

        setHighlighted((prev) =>
          prev > 0 ? prev - 1 : filteredProducts.length - 1,
        );

        break;

      case "Enter":
        e.preventDefault();

        const scannedValue = search.trim();

        if (!scannedValue) return;

        const exactProduct = products.find(
          (product) =>
            product.barcode === scannedValue ||
            product.name.toLowerCase() === scannedValue.toLowerCase(),
        );

        if (exactProduct) {
          selectProduct(exactProduct);
          return;
        }

        if (highlighted >= 0) {
          selectProduct(filteredProducts[highlighted]);
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
    <div ref={wrapperRef} className="relative space-y-2">
      <label className="text-sm font-medium text-gray-900">{label}</label>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        <input
          ref={inputRef}
          value={search}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setHighlighted(-1);
            setOpen(true);
          }}
          className="
            h-11
            w-full
            rounded-xl
            border
            border-gray-700

            pl-10
            pr-4
            text-gray-800
            placeholder:text-gray-500
            outline-none
            transition-all

            hover:border-gray-600

            focus:border-gray-500
            focus:ring-2
            focus:ring-gray-600/50
          "
        />
      </div>

      {open && (
        <div
          ref={listRef}
          className="
            absolute
            z-50
            mt-2
            max-h-80
            w-full
            overflow-y-auto
            overflow-x-hidden

            rounded-2xl
            border
            border-gray-700

            bg-gray-900

            shadow-[0_12px_40px_rgba(0,0,0,0.45)]
          "
        >
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No matching products found
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onClick={() => selectProduct(product)}
                onMouseEnter={() => setHighlighted(index)}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  border-b
                  border-gray-800
                  px-4
                  py-3
                  text-left
                  transition-all

                  ${
                    highlighted === index
                      ? "bg-gray-800"
                      : "hover:bg-gray-800/60"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-500/15
                      text-emerald-400
                    "
                  >
                    <Package size={18} />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-100">
                        {product.name}
                      </p>

                      {!product.is_active && (
                        <span className="rounded-lg bg-rose-500/15 px-2 py-1 text-xs font-medium text-rose-400">
                          Inactive
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">{product.barcode}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-100">
                    ${Number(product.selling_price).toFixed(2)}
                  </p>

                  <p
                    className={`text-xs font-medium ${
                      product.stock <= 0
                        ? "text-rose-400"
                        : product.stock <= product.minimum_stock
                          ? "text-orange-400"
                          : "text-emerald-400"
                    }`}
                  >
                    Stock: {product.stock}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
