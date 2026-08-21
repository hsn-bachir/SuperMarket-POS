import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormSearchSelect from "@/components/forms/FormSearchSelect";

import getErrorMessage from "@/utils/getErrorMessage";
import { getSuppliers } from "@/features/supplier/api/supplierApi";
import { getProducts } from "@/features/products/api/productsApi";
import { getDefault } from "@/features/purchases/api/purchasesApi";

export default function PurchaseForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const navigate = useNavigate();
  const [defaults, setDefaults] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    supplier: initialValues.supplier || "",
    currency: "",
    exchange_rate: "",
    payment_method: "CASH",
    purchase_date:
      initialValues.purchase_date || new Date().toISOString().slice(0, 10),

    items: initialValues.items || [
      {
        product: "",
        quantity: 1,
        total_cost: "",
      },
    ],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const defaultRes = await getDefault();

      setDefaults(defaultRes.data);

      setForm((prev) => ({
        ...prev,
        currency: defaultRes.data.base_currency,
        exchange_rate: defaultRes.data.exchange_rate,
      }));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  function updateItem(index, field, value) {
    const items = [...form.items];

    items[index][field] = value;

    setForm((prev) => ({
      ...prev,
      items,
    }));

    setError("");
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: "",
          quantity: 1,
          total_cost: "",
        },
      ],
    }));

    setError("");
  }

  function removeItem(index) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      await onSubmit({
        ...form,
        supplier: Number(form.supplier),
        payment_method: form.payment_method,
        exchange_rate: Number(form.exchange_rate),
        items: form.items.map((item) => ({
          product: Number(item.product),
          quantity: Number(item.quantity),
          cost_price: Number(item.total_cost) / Number(item.quantity),
        })),
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
        <h2 className="mb-6 text-lg font-semibold">Purchase Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <FormSearchSelect
            label="Supplier"
            value={form.supplier}
            disabled={loading}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                supplier: e.target.value,
              }));
              setError("");
            }}
            loadOptions={async (search) => {
              const res = await getSuppliers(1, search);

              return (res.data.results ?? res.data).map((s) => ({
                value: s.id,
                label: s.name,
              }));
            }}
          />

          <FormSelect
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            disabled={loading}
            options={[
              { value: "USD", label: "USD" },
              { value: "LBP", label: "LBP" },
            ]}
            required
          />

          <FormInput
            label="Exchange Rate"
            type="number"
            name="exchange_rate"
            value={form.exchange_rate}
            onChange={handleChange}
            disabled={loading}
            required
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
            label="Purchase Date"
            type="date"
            name="purchase_date"
            value={form.purchase_date}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Purchase Items</h2>

          <Button type="button" onClick={addItem} disabled={loading}>
            Add Item
          </Button>
        </div>

        <div className="space-y-5">
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 items-end gap-4">
              <FormSearchSelect
                label="Product"
                value={item.product}
                disabled={loading}
                onChange={(e) => updateItem(index, "product", e.target.value)}
                loadOptions={async (search) => {
                  const res = await getProducts(1, search);

                  return (res.data.results ?? res.data).map((p) => ({
                    value: p.id,
                    label: p.name,
                  }));
                }}
              />

              <FormInput
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                disabled={loading}
                required
              />

              <FormInput
                label="Total Cost"
                type="number"
                value={item.total_cost}
                onChange={(e) =>
                  updateItem(index, "total_cost", e.target.value)
                }
                disabled={loading}
                required
              />

              <Button
                type="button"
                variant="danger"
                onClick={() => removeItem(index)}
                disabled={loading || form.items.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/purchases")}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Purchase"}
        </Button>
      </div>
    </form>
  );
}
