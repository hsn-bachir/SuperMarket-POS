import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";

export default function FormActions({
  cancelTo,
  loading = false,
  submitText = "Save",
}) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-3">
      <Button
        type="button"
        variant="secondary"
        onClick={() => navigate(cancelTo)}
      >
        Cancel
      </Button>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitText}
      </Button>
    </div>
  );
}
