import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronRight, X } from "lucide-react";

import Button from "@/components/ui/Button";
import getErrorMessage from "@/utils/getErrorMessage";

const initialForm = {
  name: "",
  start_date: "",
  end_date: "",
};

function formatDate(date) {
  if (!date) return "Select date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function CreatePeriodDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setError("");
    }
  }, [open]);

  const preview = useMemo(() => {
    if (!form.start_date || !form.end_date) {
      return null;
    }

    const start = new Date(`${form.start_date}T00:00:00`);
    const end = new Date(`${form.end_date}T00:00:00`);

    if (end < start) {
      return null;
    }

    const days =
      Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return {
      days,
      start: formatDate(form.start_date),
      end: formatDate(form.end_date),
    };
  }, [form.start_date, form.end_date]);

  if (!open) {
    return null;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter a name for the accounting period.");
      return;
    }

    if (!form.start_date) {
      setError("Please select a start date.");
      return;
    }

    if (!form.end_date) {
      setError("Please select an end date.");
      return;
    }

    if (form.end_date < form.start_date) {
      setError("The end date cannot be before the start date.");
      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-800 px-6 py-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <CalendarDays size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Create Accounting Period
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Define a new period for accounting transactions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-800 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-6 py-6">
            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Period Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. August 2026"
                disabled={loading}
                autoFocus
                className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 hover:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DateField
                label="Start Date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                disabled={loading}
              />

              <DateField
                label="End Date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Preview */}
            <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/70">
              <div className="flex items-center justify-between border-b border-gray-700 px-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    Period Preview
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-white">
                    {form.name || "New Accounting Period"}
                  </p>
                </div>

                {preview && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                    <CheckCircle2 size={13} />
                    {preview.days} {preview.days === 1 ? "day" : "days"}
                  </div>
                )}
              </div>

              <div className="flex items-center px-5 py-4">
                <PreviewDate
                  label="Start"
                  value={preview?.start || formatDate(form.start_date)}
                />

                <ChevronRight
                  size={17}
                  className="mx-5 shrink-0 text-gray-600"
                />

                <PreviewDate
                  label="End"
                  value={preview?.end || formatDate(form.end_date)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-800 bg-gray-900 px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Period"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DateField({ label, name, value, onChange, disabled }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </label>

      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-700 bg-gray-800 px-3.5 py-3 text-sm text-white outline-none transition hover:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function PreviewDate({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-200">{value}</p>
    </div>
  );
}
