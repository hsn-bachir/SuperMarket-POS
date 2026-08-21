import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Package } from "lucide-react";
import { getProducts } from "@/features/products/api/productsApi";

export default function ProductSearch({ cart, setCart }) {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Debounced product search
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================
  // Focus search on mount
  // ==========================================

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ==========================================
  // Close dropdown on outside click
  // ==========================================

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // ==========================================
  // Scroll highlighted item into view
  // ==========================================

  useEffect(() => {
    if (!listRef.current || highlighted < 0) return;

    const element = listRef.current.children[highlighted];

    element?.scrollIntoView({
      block: "nearest",
    });
  }, [highlighted]);

  // ==========================================
  // Load products
  // ==========================================

  async function loadProducts(searchTerm = "") {
    try {
      setLoading(true);

      const res = await getProducts(1, searchTerm);

      setProducts(res.data?.results ?? res.data ?? []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // Add product to cart
  // ==========================================

  function addProduct(product) {
    if (product.stock <= 0) return;

    const exists = cart.find(
      (item) => item.id === product.id && item.type !== "service",
    );

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.type !== "service"
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
          type: "product",
        },
      ]);
    }

    setSearch("");
    setOpen(false);
    setHighlighted(-1);

    setTimeout(() => {
      inputRef.current?.focus({
        preventScroll: true,
      });
    }, 0);
  }

  // ==========================================
  // Limit displayed products
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  // ==========================================
  // Keyboard navigation
  // ==========================================

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

      case "Enter": {
        e.preventDefault();

        // Selected item
        if (open && highlighted >= 0) {
          addProduct(filteredProducts[highlighted]);
          return;
        }

        // Exact barcode/name search
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
      }

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
      {/* SEARCH */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-slate-400" />

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
          placeholder="Scan barcode or search products..."
          className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            pl-10
            pr-4
            text-sm
            outline-none
            transition
            focus:border-slate-500
            focus:ring-2
            focus:ring-slate-100
          "
        />
      </div>

      {/* PRODUCT LIST */}
      {open && (
        <div ref={listRef} className="grid gap-2">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-400">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No products found.
            </div>
          ) : (
            filteredProducts.map((product, index) => {
              const outOfStock = product.stock <= 0;

              return (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => addProduct(product)}
                  onMouseEnter={() => setHighlighted(index)}
                  disabled={outOfStock}
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      outOfStock
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
                        : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
                    }
                    ${
                      highlighted === index && !outOfStock
                        ? "border-slate-500 bg-slate-50"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* PRODUCT INFO */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <Package
                          className={`
                            h-4 w-4 shrink-0
                            ${
                              outOfStock ? "text-slate-400" : "text-emerald-600"
                            }
                          `}
                        />

                        <h3 className="truncate text-sm font-medium text-slate-800">
                          {product.name}
                        </h3>
                      </div>

                      {product.barcode && (
                        <p className="mt-1 pl-6 text-xs text-slate-400">
                          {product.barcode}
                        </p>
                      )}
                    </div>

                    {/* PRICE + STOCK */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        ${Number(product.selling_price).toFixed(2)}
                      </p>

                      <p
                        className={`
                          mt-0.5
                          text-xs
                          font-medium
                          ${
                            product.stock > 0
                              ? "text-emerald-600"
                              : "text-red-500"
                          }
                        `}
                      >
                        {product.stock > 0
                          ? `Stock: ${product.stock}`
                          : "Out of stock"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
