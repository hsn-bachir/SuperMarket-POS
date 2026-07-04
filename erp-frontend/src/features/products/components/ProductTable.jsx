import { Pencil, Trash2 } from "lucide-react";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import ProductStatusBadge from "./ProductStatusBadge";

export default function ProductTable({ products, onEdit, onDelete }) {
  const columns = [
    {
      key: "barcode",
      title: "Barcode",
    },

    {
      key: "name",
      title: "Product",
    },

    {
      key: "category",
      title: "Category",
      render: (row) => row.category || "-",
    },

    {
      key: "cost_price",
      title: "Cost",
    },

    {
      key: "selling_price",
      title: "Price",
    },

    {
      key: "stock",
      title: "Stock",
    },

    {
      key: "status",
      title: "Status",
      render: (row) => <ProductStatusBadge active={row.is_active} />,
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

  return <DataTable columns={columns} data={products} />;
}
