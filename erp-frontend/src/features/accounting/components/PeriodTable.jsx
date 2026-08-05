import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";

import PeriodStatusBadge from "./PeriodStatusBadge";

export default function PeriodTable({ periods, onClose, onReopen }) {
  const columns = [
    {
      key: "name",
      title: "Name",
    },

    {
      key: "start_date",
      title: "Start",
    },

    {
      key: "end_date",
      title: "End",
    },

    {
      key: "status",
      title: "Status",
      render: (row) => <PeriodStatusBadge status={row.status} />,
    },

    {
      key: "closed_by",
      title: "Closed By",
      render: (row) => row.closed_by || "-",
    },

    {
      key: "actions",
      title: "Actions",

      render: (row) =>
        row.status === "OPEN" ? (
          <Button
            variant="danger"
            className="px-3"
            onClick={() => onClose(row.id)}
          >
            Close
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="px-3"
            onClick={() => onReopen(row.id)}
          >
            Reopen
          </Button>
        ),
    },
  ];

  return <DataTable columns={columns} data={periods} />;
}
