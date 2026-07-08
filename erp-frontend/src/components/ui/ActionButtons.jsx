import { Pencil, Trash2, Eye } from "lucide-react";

export default function ActionButtons({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {onView && (
        <button
          onClick={onView}
          className="
            rounded-lg
            p-2
            text-slate-500
            transition
            hover:bg-blue-50
            hover:text-blue-600
          "
          title="View"
        >
          <Eye size={18} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          className="
            rounded-lg
            p-2
            text-slate-500
            transition
            hover:bg-amber-50
            hover:text-amber-600
          "
          title="Edit"
        >
          <Pencil size={18} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="
            rounded-lg
            p-2
            text-slate-500
            transition
            hover:bg-red-50
            hover:text-red-600
          "
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
