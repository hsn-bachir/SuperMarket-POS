import { Eye, Trash2 } from "lucide-react";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";

import ExpenseStatusBadge from "./ExpenseStatusBadge";

export default function ExpenseTable({ expenses, onView, onDelete }) {
  const columns = [
    {
      key: "number",
      title: "Number",
    },

    {
      key: "date",
      title: "Date",
    },

    {
      key: "category_name",
      title: "Category",
    },

    {
      key: "supplier_name",
      title: "Supplier",
      render: (row) => row.supplier_name || "-",
    },

    {
      key: "payment_method",
      title: "Payment",
      render: (row) => row.payment_method_display ?? row.payment_method,
    },

    {
      key: "amount",
      title: "Amount",
      render: (row) => `$${Number(row.amount).toFixed(2)}`,
    },

    {
      key: "status",
      title: "Status",
      render: (row) => (
        <ExpenseStatusBadge status={row.status_display ?? row.status} />
      ),
    },

    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="px-3"
            onClick={() => onView(row.id)}
          >
            <Eye size={16} />
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

  return <DataTable columns={columns} data={expenses} />;
}
