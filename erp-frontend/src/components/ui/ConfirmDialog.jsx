import { AlertTriangle } from "lucide-react";

import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  description,

  onConfirm,
  onCancel,

  loading = false,

  // Customization
  icon: Icon = AlertTriangle,

  confirmText = "Confirm",

  loadingText = "Processing...",

  confirmVariant = "primary",

  iconClassName = "bg-gray-100 text-gray-600",
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Content */}

        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}

            <div
              className={`
                                flex h-11 w-11 shrink-0
                                items-center justify-center
                                rounded-full
                                ${iconClassName}
                            `}
            >
              <Icon className="h-5 w-5" />
            </div>

            {/* Text */}

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-gray-300 bg-gray-50 px-6 py-4">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? loadingText : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
