import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormSearchSelect from "@/components/forms/FormSearchSelect";

import getErrorMessage from "@/utils/getErrorMessage";
import { getExpenseCategories } from "../api/expenseApi";

export default function ExpenseForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: initialValues.date ?? new Date().toISOString().slice(0, 10),
    category: initialValues.category || "",
    payment_method: initialValues.payment_method || "CASH",
    amount: initialValues.amount || "",
    reference: initialValues.reference || "",
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
        category: Number(form.category),
        amount: Number(form.amount),
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
        <h2 className="mb-6 text-lg font-semibold">Expense Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Expense Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <FormSearchSelect
            label="Expense Category"
            value={form.category}
            disabled={loading}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                category: e.target.value,
              }));
              setError("");
            }}
            loadOptions={async (search) => {
              const res = await getExpenseCategories();

              return (res.data.results ?? res.data)
                .filter((c) =>
                  c.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((c) => ({
                  value: c.id,
                  label: c.name,
                }));
            }}
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
              { value: "CREDIT", label: "Credit" },
            ]}
            required
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
            label="Reference"
            name="reference"
            value={form.reference}
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
          onClick={() => navigate("/accounting/expenses")}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Expense"}
        </Button>
      </div>
    </form>
  );
}
