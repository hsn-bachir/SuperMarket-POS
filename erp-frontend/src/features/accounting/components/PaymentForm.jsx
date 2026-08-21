import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";

import getErrorMessage from "@/utils/getErrorMessage";

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

  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
        object_id: Number(form.object_id),
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Payment Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <FormSelect
            label="Payment Type"
            name="payment_type"
            value={form.payment_type}
            onChange={handleChange}
            disabled={loading}
            options={[
              { value: "CUSTOMER", label: "Customer" },
              { value: "SUPPLIER", label: "Supplier" },
              { value: "EXPENSE", label: "Expense" },
            ]}
            required
          />

          <FormInput
            label="Content Type"
            name="content_type"
            value={form.content_type}
            onChange={handleChange}
            disabled={loading}
          />

          <FormInput
            label="Object ID"
            name="object_id"
            value={form.object_id}
            onChange={handleChange}
            disabled={loading}
          />

          <FormSelect
            label="Payment Method"
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            disabled={loading}
            options={[
              { value: "CASH", label: "Cash" },
              { value: "CARD", label: "Card" },
              { value: "BANK", label: "Bank" },
            ]}
          />

          <FormInput
            label="Amount"
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <FormInput
            label="External Reference"
            name="external_reference"
            value={form.external_reference}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mt-5">
          <FormInput
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/accounting/payments")}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Payment"}
        </Button>
      </div>
    </form>
  );
}
