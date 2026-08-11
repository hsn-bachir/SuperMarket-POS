import { Eye, Trash2, CreditCard } from "lucide-react";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";

export default function PaymentTable({ payments, onView, onPay, onDelete }) {
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
      render: (row) => (
        <span
          className={
            row.status === "PENDING"
              ? "text-yellow-400 font-medium"
              : row.status === "POSTED"
                ? "text-green-400 font-medium"
                : row.status === "CANCELLED"
                  ? "text-red-400 font-medium"
                  : ""
          }
        >
          {row.status}
        </span>
      ),
    },

    {
      key: "actions",
      title: "Actions",

      render: (row) => (
        <div className="flex gap-2">
          {/* Pay pending payment */}

          {row.status === "PENDING" && (
            <Button
              variant="primary"
              className="px-3"
              onClick={() => onPay(row)}
            >
              <CreditCard size={16} />
              <span className="ml-1">Pay</span>
            </Button>
          )}

          {/* View */}

          <Button
            variant="secondary"
            className="px-3"
            onClick={() => onView(row.id)}
          >
            <Eye size={16} />
          </Button>

          {/* Delete */}

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
