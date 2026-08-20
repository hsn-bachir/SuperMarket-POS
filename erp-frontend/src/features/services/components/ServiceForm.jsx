import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormInput from "@/components/forms/FormInput";
import FormSection from "@/components/forms/FormSection";
import FormActions from "@/components/forms/FormActions";

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="General Information">
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Service Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <div className="md:col-span-2">
            <FormInput
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Active Service
            </label>
          </div>
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
