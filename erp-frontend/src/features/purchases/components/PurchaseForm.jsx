import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormSearchSelect from "@/components/forms/FormSearchSelect";

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
      console.error(err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function updateItem(index, field, value) {
    const items = [...form.items];

    items[index][field] = value;

    setForm({
      ...form,
      items,
    });
  }

  function addItem() {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          product: "",
          quantity: 1,
          total_cost: "",
        },
      ],
    });
  }

  function removeItem(index) {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  }

  function submit(e) {
    e.preventDefault();

    onSubmit({
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
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Purchase Information</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <FormSearchSelect
            label="Supplier"
            value={form.supplier}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                supplier: e.target.value,
              }))
            }
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
            required
          />

          <FormInput
            label="Exchange Rate"
            type="number"
            name="exchange_rate"
            value={form.exchange_rate}
            onChange={handleChange}
            required
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
                value: "CREDIT",
                label: "Credit",
              },
            ]}
            required
          />

          <FormInput
            label="Purchase Date"
            type="date"
            name="purchase_date"
            value={form.purchase_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-lg">Purchase Items</h2>

          <Button type="button" onClick={addItem}>
            Add Item
          </Button>
        </div>

        <div className="space-y-5">
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-end">
              <FormSearchSelect
                label="Product"
                value={item.product}
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
                required
              />

              <FormInput
                label="Total Cost"
                type="number"
                value={item.total_cost}
                onChange={(e) =>
                  updateItem(index, "total_cost", e.target.value)
                }
                required
              />

              <Button
                type="button"
                variant="danger"
                onClick={() => removeItem(index)}
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
        >
          Cancel
        </Button>

        <Button type="submit">{loading ? "Saving..." : "Save Purchase"}</Button>
      </div>
    </form>
  );
}
