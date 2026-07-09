import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";

import { getSuppliers } from "@/features/supplier/api/supplierApi";
import { getProducts } from "@/features/products/api/productsApi";

export default function PurchaseForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    supplier: initialValues.supplier || "",
    currency: initialValues.currency || "USD",
    exchange_rate: initialValues.exchange_rate || 1,
    purchase_date:
      initialValues.purchase_date || new Date().toISOString().slice(0, 10),

    items: initialValues.items || [
      {
        product: "",
        quantity: 1,
        cost_price: "",
      },
    ],
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [supplierRes, productRes] = await Promise.all([
        getSuppliers(),
        getProducts(),
      ]);

      setSuppliers(supplierRes.data.results ?? supplierRes.data);
      setProducts(productRes.data.results ?? productRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "currency") {
      setForm((prev) => ({
        ...prev,
        currency: value,
        exchange_rate: value === "USD" ? 1 : prev.exchange_rate,
      }));

      return;
    }

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
          cost_price: "",
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

      exchange_rate: Number(form.exchange_rate),

      items: form.items.map((item) => ({
        product: Number(item.product),
        quantity: Number(item.quantity),
        cost_price: Number(item.cost_price),
      })),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Purchase Information</h2>

        <div className="grid md:grid-cols-2 gap-5">
          <FormSelect
            label="Supplier"
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            options={[
              {
                value: "",
                label: "Select Supplier",
              },

              ...suppliers.map((s) => ({
                value: s.id,
                label: s.name,
              })),
            ]}
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

          <FormInput
            label="Purchase Date"
            type="date"
            name="purchase_date"
            value={form.purchase_date}
            onChange={handleChange}
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
              <FormSelect
                label="Product"
                value={item.product}
                onChange={(e) => updateItem(index, "product", e.target.value)}
                options={[
                  {
                    value: "",
                    label: "Select Product",
                  },

                  ...products.map((p) => ({
                    value: p.id,
                    label: p.name,
                  })),
                ]}
              />

              <FormInput
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />

              <FormInput
                label="Cost Price"
                type="number"
                value={item.cost_price}
                onChange={(e) =>
                  updateItem(index, "cost_price", e.target.value)
                }
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
