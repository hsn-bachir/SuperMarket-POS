import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormInput from "@/components/forms/FormInput";
import FormSection from "@/components/forms/FormSection";
import FormActions from "@/components/forms/FormActions";

export default function CategoryForm({
  initialValues = {},
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: initialValues.name || "",
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
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FormSection title="General Information">
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      <FormActions
        cancelTo="/category"
        loading={loading}
        submitText="Save Category"
      />
    </form>
  );
}
