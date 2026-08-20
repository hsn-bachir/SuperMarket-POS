import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Wrench } from "lucide-react";

import { getServices } from "../../services/api/serviceApi";

export default function ServiceSearch({ cart, setCart }) {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [loading, setLoading] = useState(false);

  // Selected service waiting for a price
  const [selectedService, setSelectedService] = useState(null);
  const [price, setPrice] = useState("");

  // Debounced API call
  useEffect(() => {
    const timer = setTimeout(() => {
      loadServices(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Focus search on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close dropdown on outside click
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

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current || highlighted < 0) return;

    const element = listRef.current.children[highlighted];

    element?.scrollIntoView({
      block: "nearest",
    });
  }, [highlighted]);

  async function loadServices(searchTerm = "") {
    try {
      setLoading(true);

      const res = await getServices(1, searchTerm);

      setServices(res.data.results ?? res.data ?? []);
    } catch (err) {
      console.error(err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  function selectService(service) {
    setSelectedService(service);
    setPrice("");
    setOpen(false);
    setHighlighted(-1);
  }

  function addServiceToCart() {
    const parsedPrice = Number(price);

    if (!selectedService) return;

    if (!price || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return;
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === selectedService.id &&
          item.type === "service" &&
          Number(item.price) === parsedPrice,
      );

      if (existing) {
        return prev.map((item) =>
          item.id === selectedService.id &&
          item.type === "service" &&
          Number(item.price) === parsedPrice
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: selectedService.id,
          name: selectedService.name,
          price: parsedPrice,
          quantity: 1,
          type: "service",
          stock: Infinity,
        },
      ];
    });

    setSelectedService(null);
    setPrice("");
    setSearch("");

    setTimeout(() => {
      inputRef.current?.focus({
        preventScroll: true,
      });
    }, 0);
  }

  function handlePriceKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addServiceToCart();
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setSelectedService(null);
      setPrice("");

      setTimeout(() => {
        inputRef.current?.focus({
          preventScroll: true,
        });
      }, 0);
    }
  }

  const filteredServices = useMemo(() => {
    return services.slice(0, 8);
  }, [services]);

  function handleKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        if (!open || filteredServices.length === 0) return;

        e.preventDefault();

        setHighlighted((prev) =>
          prev < filteredServices.length - 1 ? prev + 1 : 0,
        );

        break;

      case "ArrowUp":
        if (!open || filteredServices.length === 0) return;

        e.preventDefault();

        setHighlighted((prev) =>
          prev > 0 ? prev - 1 : filteredServices.length - 1,
        );

        break;

      case "Enter":
        e.preventDefault();

        if (open && highlighted >= 0) {
          selectService(filteredServices[highlighted]);
          return;
        }

        const value = search.trim().toLowerCase();

        if (!value) return;

        const exactMatch = services.find(
          (service) => service.name.toLowerCase() === value,
        );

        if (exactMatch) {
          selectService(exactMatch);
        } else if (filteredServices.length > 0) {
          selectService(filteredServices[0]);
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
          placeholder="Search services..."
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

      {/* SERVICE LIST */}
      {open && (
        <div ref={listRef} className="grid gap-2">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-400">
              Loading services...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No services found.
            </div>
          ) : (
            filteredServices.map((service, index) => (
              <button
                type="button"
                key={service.id}
                onClick={() => selectService(service)}
                onMouseEnter={() => setHighlighted(index)}
                className={`
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  p-4
                  text-left
                  transition
                  hover:border-slate-400
                  hover:bg-slate-50
                  ${highlighted === index ? "border-slate-500 bg-slate-50" : ""}
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="h-4 w-4 text-emerald-600" />

                  <h3 className="text-sm font-medium text-slate-800">
                    {service.name}
                  </h3>
                </div>

                {service.description && (
                  <p className="mt-1 pl-6 text-xs text-slate-400">
                    {service.description}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* PRICE */}
      {selectedService && (
        <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">
              {selectedService.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Enter the price for this service
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-sm text-slate-400">
                $
              </span>

              <input
                autoFocus
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={handlePriceKeyDown}
                placeholder="0.00"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  pl-7
                  pr-3
                  text-sm
                  font-medium
                  outline-none
                  focus:border-slate-500
                  focus:ring-2
                  focus:ring-slate-100
                "
              />
            </div>

            <button
              type="button"
              onClick={addServiceToCart}
              disabled={
                !price || !Number.isFinite(Number(price)) || Number(price) < 0
              }
              className="
                h-10
                rounded-lg
                bg-slate-900
                px-4
                text-sm
                font-medium
                text-white
                transition
                hover:bg-slate-800
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Add
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedService(null);
              setPrice("");

              setTimeout(() => {
                inputRef.current?.focus({
                  preventScroll: true,
                });
              }, 0);
            }}
            className="mt-2 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
