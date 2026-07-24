import { useEffect, useState } from "react";

import { getCategories } from "../../category/api/categoryApi";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormCheckbox from "@/components/forms/FormCheckbox";
import FormSection from "@/components/forms/FormSection";
import FormActions from "@/components/forms/FormActions";
import BarcodeInput from "@/components/forms/BarcodeInput";

export default function ProductForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    barcode: initialValues.barcode || "",
    name: initialValues.name || "",
    category: initialValues.category || "",
    cost_price: initialValues.cost_price || "",
    selling_price: initialValues.selling_price || "",
    minimum_stock: initialValues.minimum_stock || 0,
    is_active: initialValues.is_active ?? true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await getCategories();

      setCategories(res.data.results ?? res.data);
    } catch (err) {
      console.error(err);
    }
  }

  function handleChange(e) {
    const { name, value, checked, type } = e.target;

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
      selling_price:
        form.selling_price === "" ? null : Number(form.selling_price),
      minimum_stock: Number(form.minimum_stock),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="General Information">
        <div className="grid gap-5 md:grid-cols-2">
          <BarcodeInput
            label="Barcode"
            value={form.barcode}
            onChange={handleChange}
          />

          <FormInput
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <FormSelect
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Select category"
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />

          <FormInput
            label="Selling Price"
            name="selling_price"
            type="number"
            value={form.selling_price}
            onChange={handleChange}
          />

          <FormInput
            label="Minimum Stock"
            name="minimum_stock"
            type="number"
            value={form.minimum_stock}
            onChange={handleChange}
          />
        </div>

        <FormCheckbox
          className="mt-6"
          label="Active Product"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />
      </FormSection>

      <FormActions
        cancelTo="/products"
        loading={loading}
        submitText="Save Product"
      />
    </form>
  );
}
