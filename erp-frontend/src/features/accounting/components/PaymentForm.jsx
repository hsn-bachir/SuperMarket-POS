import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";

export default function PaymentForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: initialValues.date || new Date().toISOString().slice(0, 10),

    payment_type: initialValues.payment_type || "SUPPLIER",

    payment_method: initialValues.payment_method || "CASH",

    content_type: initialValues.content_type || "",

    object_id: initialValues.object_id || "",

    amount: initialValues.amount || "",

    external_reference: initialValues.external_reference || "",

    description: initialValues.description || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function submit(e) {
    e.preventDefault();

    onSubmit({
      ...form,
      amount: Number(form.amount),
      object_id: Number(form.object_id),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Payment Information</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <FormInput
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <FormSelect
            label="Payment Type"
            name="payment_type"
            value={form.payment_type}
            onChange={handleChange}
            options={[
              {
                value: "CUSTOMER",
                label: "Customer",
              },
              {
                value: "SUPPLIER",
                label: "Supplier",
              },
              {
                value: "EXPENSE",
                label: "Expense",
              },
            ]}
            required
          />

          <FormInput
            label="Content Type"
            name="content_type"
            value={form.content_type}
            onChange={handleChange}
          />

          <FormInput
            label="Object ID"
            name="object_id"
            value={form.object_id}
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
              {
                value: "BANK",
                label: "Bank",
              },
            ]}
          />

          <FormInput
            label="Amount"
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <FormInput
            label="External Reference"
            name="external_reference"
            value={form.external_reference}
            onChange={handleChange}
          />
        </div>

        <div className="mt-5">
          <FormInput
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/accounting/payments")}
        >
          Cancel
        </Button>

        <Button type="submit">{loading ? "Saving..." : "Save Payment"}</Button>
      </div>
    </form>
  );
}
