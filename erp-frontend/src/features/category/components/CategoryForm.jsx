import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";

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
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">General Information</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate("/category")}
        >
          Cancel
        </Button>

        <Button type="submit">{loading ? "Saving..." : "Save Category"}</Button>
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
