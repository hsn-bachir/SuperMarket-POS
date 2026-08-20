import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  CreditCard,
  DollarSign,
  Loader2,
  Receipt,
} from "lucide-react";

import Button from "@/components/ui/Button";

import { createSale, getDefault } from "../api/salesApi";

export default function PaymentSection({ cart }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    currency: "USD",
    exchange_rate: "1",
    payment_method: "CASH",
    sale_date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadDefault();
  }, []);

  async function loadDefault() {
    try {
      const res = await getDefault();

      setForm((prev) => ({
        ...prev,
        currency: res.data.base_currency,
        exchange_rate: res.data.exchange_rate,
      }));
    } catch {
      toast.error("Unable to load default settings.");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSale() {
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        currency: form.currency,
        exchange_rate: form.exchange_rate,
        payment_method: form.payment_method,
        sale_date: form.sale_date,
        items: cart.map((item) => ({
          product: item.type === "product" ? item.id : null,
          service: item.type === "service" ? item.id : null,
          quantity: item.quantity,
          unit_price: item.price,
          cost_price: item.cost_price || 0,
        })),
      };

      await createSale(payload);

      toast.success("Sale completed successfully.");

      window.location.reload();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to complete sale.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5">
      {/* DATE */}
      <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5">
        <CalendarDays size={14} className="shrink-0 text-slate-400" />

        <input
          type="date"
          name="sale_date"
          value={form.sale_date}
          onChange={handleChange}
          className="w-[112px] bg-transparent text-xs font-medium text-slate-700 outline-none"
        />
      </div>

      {/* CURRENCY */}
      <div className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5">
        <DollarSign size={14} className="text-slate-400" />

        <select
          name="currency"
          value={form.currency}
          onChange={handleChange}
          className="cursor-pointer bg-transparent text-xs font-bold text-slate-700 outline-none"
        >
          <option value="USD">USD</option>
          <option value="LBP">LBP</option>
        </select>
      </div>

      {/* EXCHANGE RATE */}
      <div className="flex h-9 items-center rounded-lg border border-slate-200 bg-white">
        <span className="border-r border-slate-100 px-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Rate
        </span>

        <input
          type="number"
          name="exchange_rate"
          value={form.exchange_rate}
          onChange={handleChange}
          min="0"
          step="any"
          className="w-[72px] bg-transparent px-2 text-xs font-semibold text-slate-700 outline-none"
        />
      </div>

      {/* PAYMENT METHOD */}
      <div className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5">
        <CreditCard size={14} className="text-slate-400" />

        <select
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          className="cursor-pointer bg-transparent text-xs font-semibold text-slate-700 outline-none"
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="CREDIT">Credit</option>
        </select>
      </div>

      {/* CHECKOUT */}
      <Button
        onClick={handleSale}
        disabled={loading || cart.length === 0}
        className="flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Processing
          </>
        ) : (
          <>
            <Receipt size={14} />
            Checkout
          </>
        )}
      </Button>
    </div>
  );
}
