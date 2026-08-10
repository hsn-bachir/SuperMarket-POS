import {
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  LockOpen,
} from "lucide-react";

import DataTable from "@/components/ui/DataTable";
import PeriodStatusBadge from "./PeriodStatusBadge";

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function PeriodTable({ periods, onClose, onReopen }) {
  const columns = [
    {
      key: "name",
      title: "Accounting Period",
      render: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              row.status === "OPEN"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            <CalendarDays size={16} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {row.name}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              {formatDate(row.start_date)}
              <span className="mx-1.5 text-gray-700">→</span>
              {formatDate(row.end_date)}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "start_date",
      title: "Start",
      render: (row) => (
        <span className="text-sm tabular-nums text-gray-400">
          {formatDate(row.start_date)}
        </span>
      ),
    },

    {
      key: "end_date",
      title: "End",
      render: (row) => (
        <span className="text-sm tabular-nums text-gray-400">
          {formatDate(row.end_date)}
        </span>
      ),
    },

    {
      key: "status",
      title: "Status",
      render: (row) => <PeriodStatusBadge status={row.status} />,
    },

    {
      key: "closed_by",
      title: "Closed By",
      render: (row) => (
        <div className="text-sm">
          {row.closed_by ? (
            <span className="font-medium text-gray-300">{row.closed_by}</span>
          ) : (
            <span className="text-gray-600">Not closed</span>
          )}
        </div>
      ),
    },

    {
      key: "actions",
      title: "",
      render: (row) => (
        <div className="flex justify-end">
          {row.status === "OPEN" ? (
            <button
              type="button"
              onClick={() => onClose(row.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 active:scale-95"
            >
              <LockKeyhole size={14} />
              Close
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onReopen(row.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-400 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300 active:scale-95"
            >
              <LockOpen size={14} />
              Reopen
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-700 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <CalendarDays size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Period History</h2>

            <p className="mt-0.5 text-xs text-gray-500">
              Review and manage your accounting periods.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-3.5 py-1.5 text-xs font-medium text-gray-400">
          <CheckCircle2 size={14} className="text-emerald-400" />

          <span>
            {periods.length} {periods.length === 1 ? "period" : "periods"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={periods}
          emptyMessage="No accounting periods have been created yet."
        />
      </div>
    </section>
  );
}
