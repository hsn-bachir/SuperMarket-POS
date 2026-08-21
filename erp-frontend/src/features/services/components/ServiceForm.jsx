import { useState } from "react";

import FormInput from "@/components/forms/FormInput";
import FormCheckbox from "@/components/forms/FormCheckbox";
import FormSection from "@/components/forms/FormSection";
import FormActions from "@/components/forms/FormActions";

import getErrorMessage from "@/utils/getErrorMessage";

export default function ServiceForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: initialValues.name || "",
    description: initialValues.description || "",
    is_active: initialValues.is_active ?? true,
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

      <FormSection title="General Information">
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Service Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <div className="md:col-span-2">
            <FormInput
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <FormCheckbox
            className="md:col-span-2"
            label="Active Service"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </FormSection>

      <FormActions
        cancelTo="/services"
        loading={loading}
        submitText="Save Service"
      />
    </form>
  );
}
