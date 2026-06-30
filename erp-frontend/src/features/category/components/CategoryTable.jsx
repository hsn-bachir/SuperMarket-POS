import { Pencil, Trash2 } from "lucide-react";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";

export default function CategoryTable({ categories, onEdit, onDelete }) {
  const columns = [
    {
      key: "name",
      title: "Name",
    },

    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="px-3"
            onClick={() => onEdit(row.id)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="danger"
            className="px-3"
            onClick={() => onDelete(row.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={categories} />;
}
