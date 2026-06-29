import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">{title}</h2>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-3 p-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="danger" disabled={loading} onClick={onConfirm}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
