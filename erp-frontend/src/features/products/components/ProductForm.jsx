import { useEffect, useState } from "react";
import { getCategories } from "../../category/api/categoryApi";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

export default function ProductForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }
  const [form, setForm] = useState({
    barcode: initialValues.barcode || "",
    name: initialValues.name || "",
    category: initialValues.category || "",
    cost_price: initialValues.cost_price || "",
    selling_price: initialValues.selling_price || "",
    minimum_stock: initialValues.minimum_stock || 0,
    is_active: initialValues.is_active ?? true,
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      ...form,
      category: form.category ? Number(form.category) : null,
      cost_price: form.cost_price === "" ? null : Number(form.cost_price),
      selling_price:
        form.selling_price === "" ? null : Number(form.selling_price),
      minimum_stock: Number(form.minimum_stock),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">General Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Barcode"
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
          />

          <Input
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="
      h-10 w-full rounded-lg border px-3 outline-none
      focus:border-[var(--primary)]
    "
            >
              <option value="">Select category</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Cost Price"
            name="cost_price"
            type="number"
            value={form.cost_price}
            onChange={handleChange}
          />

          <Input
            label="Selling Price"
            name="selling_price"
            type="number"
            value={form.selling_price}
            onChange={handleChange}
          />

          <Input
            label="Minimum Stock"
            name="minimum_stock"
            type="number"
            value={form.minimum_stock}
            onChange={handleChange}
          />
        </div>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active Product
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/products")}
        >
          Cancel
        </Button>

        <Button type="submit">{loading ? "Saving..." : "Save Product"}</Button>
      </div>
    </form>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        className="
          h-10
          w-full
          rounded-lg
          border
          border-[var(--border)]
          px-3
          outline-none
          focus:border-[var(--primary)]
        "
        {...props}
      />
    </div>
  );
}
