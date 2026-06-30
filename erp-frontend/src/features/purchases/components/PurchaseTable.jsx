import { Eye } from "lucide-react";

import DataTable from "@/components/ui/DataTable";
import Button from "@/components/ui/Button";
import PurchaseStatusBadge from "./PurchaseStatusBadge";

export default function PurchaseTable({ purchases, onView }) {
  const columns = [
    {
      key: "invoice_number",
      title: "Invoice",
    },

    {
      key: "supplier_name",
      title: "Supplier",
    },

    {
      key: "purchase_date",
      title: "Date",
    },

    {
      key: "currency",
      title: "Currency",
      render: (row) => <PurchaseStatusBadge currency={row.currency} />,
    },

    {
      key: "items",
      title: "Items",
      render: (row) => row.items.length,
    },

    {
      key: "actions",
      title: "Actions",

      render: (row) => (
        <Button
          variant="secondary"
          className="px-3"
          onClick={() => onView(row.id)}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={purchases} />;
}
