import SectionCard from "@/components/ui/SectionCard";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";

export default function LowStockWidget() {
  const columns = [
    {
      key: "name",
      title: "Product",
    },
    {
      key: "stock",
      title: "Stock",
      render: (row) => <Badge variant="warning">{row.stock} left</Badge>,
    },
  ];

  const data = [
    { name: "Hammer", stock: 2 },
    { name: "Milk", stock: 4 },
    { name: "Rice", stock: 1 },
    { name: "PVC Pipe", stock: 3 },
  ];

  return (
    <SectionCard title="Low Stock Alerts" subtitle="Temporary mock data">
      <DataTable columns={columns} data={data} />
    </SectionCard>
  );
}
