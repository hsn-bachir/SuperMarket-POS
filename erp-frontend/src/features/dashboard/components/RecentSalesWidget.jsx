import SectionCard from "@/components/ui/SectionCard";
import Badge from "@/components/ui/Badge";
import DataTable from "@/components/ui/DataTable";

export default function RecentSalesWidget() {
  const columns = [
    {
      key: "invoice",
      title: "Invoice",
    },
    {
      key: "customer",
      title: "Customer",
    },
    {
      key: "total",
      title: "Total",
    },
    {
      key: "status",
      title: "Status",
      render: () => <Badge variant="success">Completed</Badge>,
    },
  ];

  const data = [
    {
      invoice: "INV-1021",
      customer: "Walk-in",
      total: "$42",
    },
    {
      invoice: "INV-1020",
      customer: "Ahmed",
      total: "$95",
    },
    {
      invoice: "INV-1019",
      customer: "Hardware Store",
      total: "$340",
    },
    {
      invoice: "INV-1018",
      customer: "Walk-in",
      total: "$18",
    },
  ];

  return (
    <SectionCard title="Recent Sales" subtitle="Temporary mock data">
      <DataTable columns={columns} data={data} />
    </SectionCard>
  );
}
