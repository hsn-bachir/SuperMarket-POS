import { Eye, Pencil, Trash2, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";

import PaymentBadge from "./PaymentBadge";

export default function SalesTable({ sales, onView, onEdit, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    {
      key: "invoice_number",
      title: "Invoice",
    },

    {
      key: "sale_date",
      title: "Date",
    },

    {
      key: "payment_method",
      title: "Payment",
      render: (row) => <PaymentBadge method={row.payment_method} />,
    },

    {
      key: "currency",
      title: "Paid Currency",
    },

    {
      key: "total",
      title: "Total USD",
      render: (row) => `${row.total}`,
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
            variant="secondary"
            className="px-3"
            onClick={() => onEdit(row.id)}
          >
            <Pencil size={16} />
          </Button>

          <Button
            variant="secondary"
            className="px-3"
            onClick={() => window.open(`/sales/${row.id}/invoice`, "_blank")}
          >
            <Printer size={16} />
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

  return <DataTable columns={columns} data={sales} />;
}
