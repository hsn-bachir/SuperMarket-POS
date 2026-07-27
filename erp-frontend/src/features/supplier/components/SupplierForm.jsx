import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";

export default function SupplierForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: initialValues.name || "",
    phone: initialValues.phone || "",
    address: initialValues.address || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Supplier Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Company Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <FormInput
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/suppliers")}
        >
          Cancel
        </Button>

        <Button type="submit">{loading ? "Saving..." : "Save Supplier"}</Button>
      </div>
    </form>
  );
}
