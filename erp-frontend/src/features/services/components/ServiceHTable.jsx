import { FileText, Wrench, Hash, DollarSign, Calendar } from "lucide-react";

import DataTable from "@/components/ui/DataTable";

export default function ServiceTable({ history }) {
  const columns = [
    {
      key: "invoice_number",
      title: "Invoice",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.invoice_number || "N/A"}
        </span>
      ),
    },

    {
      key: "service_name",
      title: "Service",
      render: (row) => (
        <span className="flex items-center gap-2">
          <Wrench size={16} className="text-gray-400" />
          {row.service_name || "N/A"}
        </span>
      ),
    },

    {
      key: "quantity",
      title: "Quantity",
      render: (row) => <span>{Number(row.quantity).toLocaleString()}</span>,
    },

    {
      key: "unit_price",
      title: "Unit Price",
      render: (row) => (
        <span className="font-medium">{Number(row.unit_price).toFixed(2)}</span>
      ),
    },

    {
      key: "total",
      title: "Total",
      render: (row) => (
        <span className="font-semibold text-emerald-600">
          {Number(row.total).toFixed(2)}
        </span>
      ),
    },

    {
      key: "sale_date",
      title: "Date",
      render: (row) => (
        <span className="text-gray-600">
          {row.sale_date ? new Date(row.sale_date).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} data={history} />;
}
