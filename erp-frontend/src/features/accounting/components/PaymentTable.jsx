import { Eye, Trash2 } from "lucide-react";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";

export default function PaymentTable({ payments, onView, onDelete }) {
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
      key: "payment_type",
      title: "Type",
    },

    {
      key: "payment_method",
      title: "Method",
    },

    {
      key: "amount",
      title: "Amount",
      render: (row) => `$${Number(row.amount).toFixed(2)}`,
    },

    {
      key: "status",
      title: "Status",
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

  return <DataTable columns={columns} data={payments} />;
}
