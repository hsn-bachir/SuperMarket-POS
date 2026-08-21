import { useState } from "react";
import { ShoppingCart, Package, Wrench } from "lucide-react";
import { toast } from "sonner";

import CartTable from "../components/CartTable";
import CartTotals from "../components/CartTotals";
import PaymentSection from "../components/PaymentSection";
import ProductSearch from "../components/ProductSearch";
import ServiceSearch from "../components/ServiceSearch";

export default function POS() {
  const [cart, setCart] = useState([]);

  function handleSaleSuccess(sale) {
    toast.success("Sale completed successfully.", {
      description: sale?.invoice_number
        ? `Invoice #${sale.invoice_number} has been created.`
        : "The sale has been recorded successfully.",
    });

    setCart([]);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 shrink-0 border-b border-slate-300 bg-white shadow-sm">
        <div className="flex h-[72px] items-center justify-between px-6">
          {/* BRAND */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShoppingCart size={17} />
            </div>

            <h1 className="text-base font-semibold tracking-tight">POS</h1>
          </div>

          {/* TOTALS + PAYMENT */}
          <div className="flex items-center justify-end gap-4">
            <CartTotals cart={cart} />

            <div className="h-8 w-px bg-slate-300" />

            <PaymentSection cart={cart} onSuccess={handleSaleSuccess} />
          </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <main className="min-h-0 flex-1 overflow-hidden p-4">
        <div className="grid h-full grid-cols-12 gap-4">
          {/* PRODUCTS */}
          <section className="col-span-12 flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm lg:col-span-3">
            <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-slate-300 px-4">
              <Package size={16} className="text-slate-600" />
              <h2 className="text-sm font-semibold">Products</h2>
            </div>

            <div
              className="
              min-h-0 flex-1 overflow-y-auto p-3
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
            >
              <ProductSearch cart={cart} setCart={setCart} />
            </div>
          </section>

          {/* SERVICES */}
          <section className="col-span-12 flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm lg:col-span-3">
            <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-slate-300 px-4">
              <Wrench size={16} className="text-emerald-600" />
              <h2 className="text-sm font-semibold">Services</h2>
            </div>

            <div
              className="
              min-h-0 flex-1 overflow-y-auto p-3
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
            >
              <ServiceSearch cart={cart} setCart={setCart} />
            </div>
          </section>

          {/* CART */}
          <section className="col-span-12 flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm lg:col-span-6">
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-300 px-4">
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={16} className="text-slate-600" />

                <h2 className="text-sm font-semibold">Current Cart</h2>

                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                  {cart.length}
                </span>
              </div>

              {cart.length > 0 && (
                <span className="text-xs font-medium text-emerald-600">
                  Active
                </span>
              )}
            </div>

            <div
              className="
              min-h-0 flex-1 overflow-y-auto
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
            >
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart
                    size={32}
                    strokeWidth={1.4}
                    className="mb-3 text-slate-300"
                  />

                  <h3 className="text-sm font-medium text-slate-600">
                    Cart is empty
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Add a product or service to get started
                  </p>
                </div>
              ) : (
                <div className="p-3">
                  <CartTable cart={cart} setCart={setCart} />
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
