import { useState } from "react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";

import { createSale } from "../api/salesApi";

export default function PaymentSection({ cart }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    invoice_number: "",
    currency: "USD",
    exchange_rate: 1,
    payment_method: "CASH",
    sale_date: new Date().toISOString().split("T")[0],
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSale() {
    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        invoice_number: form.invoice_number,
        currency: form.currency,
        exchange_rate: form.exchange_rate,
        payment_method: form.payment_method,
        sale_date: form.sale_date,

        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      };

      await createSale(payload);

      toast.success("Sale completed.");
      window.location.reload();
    } catch (err) {
      console.log("ERROR RESPONSE:", err.response?.data);
      console.error(err);
      toast.error("Unable to complete sale.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">Payment</h2>

      <div className="space-y-4">
        <FormInput
          label="Invoice Number"
          name="invoice_number"
          value={form.invoice_number}
          onChange={handleChange}
        />

        <FormInput
          label="Sale Date"
          type="date"
          name="sale_date"
          value={form.sale_date}
          onChange={handleChange}
        />

        <FormSelect
          label="Currency"
          name="currency"
          value={form.currency}
          onChange={handleChange}
          options={[
            {
              value: "USD",
              label: "USD",
            },
            {
              value: "LBP",
              label: "LBP",
            },
          ]}
        />

        <FormInput
          label="Exchange Rate"
          type="number"
          name="exchange_rate"
          value={form.exchange_rate}
          onChange={handleChange}
        />

        <FormSelect
          label="Payment Method"
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          options={[
            {
              value: "CASH",
              label: "Cash",
            },
            {
              value: "CARD",
              label: "Card",
            },
          ]}
        />

        <Button className="w-full" onClick={handleSale}>
          {loading ? "Processing..." : "Complete Sale"}
        </Button>
      </div>
    </div>
  );
}
