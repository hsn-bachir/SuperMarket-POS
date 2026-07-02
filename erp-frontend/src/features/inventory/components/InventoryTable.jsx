import DataTable from "@/components/ui/DataTable";
import MovementBadge from "./MovementBadge";

export default function InventoryTable({ movements }) {
  const columns = [
    {
      key: "product",
      title: "Product",
      render: (row) => row.product_name,
    },

    {
      key: "movement_type",
      title: "Type",
      render: (row) => <MovementBadge type={row.movement_type} />,
    },

    {
      key: "quantity",
      title: "Quantity",
      render: (row) => (
        <span
          className={
            row.quantity > 0
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {row.quantity > 0 ? "+" : ""}
          {row.quantity}
        </span>
      ),
    },

    {
      key: "reference_type",
      title: "Reference",
    },

    {
      key: "reference_id",
      title: "Reference ID",
    },

    {
      key: "created_at",
      title: "Date",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
  ];

  return <DataTable columns={columns} data={movements} />;
}
