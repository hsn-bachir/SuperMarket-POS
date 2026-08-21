import { useState } from "react";

import FormInput from "@/components/forms/FormInput";
import FormSection from "@/components/forms/FormSection";
import FormActions from "@/components/forms/FormActions";

import getErrorMessage from "@/utils/getErrorMessage";

export default function SupplierForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: initialValues.name || "",
    phone: initialValues.phone || "",
    address: initialValues.address || "",
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await onSubmit(form);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <FormSection title="Supplier Information">
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Company Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <FormInput
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="md:col-span-2">
            <FormInput
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
      </FormSection>

      <FormActions
        cancelTo="/suppliers"
        loading={loading}
        submitText="Save Supplier"
      />
    </form>
  );
}
