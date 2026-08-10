import {
  ArrowUpRight,
  CalendarDays,
  CircleCheck,
  LockKeyhole,
} from "lucide-react";

import Button from "@/components/ui/Button";
import PeriodStatusBadge from "./PeriodStatusBadge";

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getDaysRemaining(endDate) {
  if (!endDate) return null;

  const today = new Date();
  const end = new Date(`${endDate}T23:59:59`);

  const difference = end.getTime() - today.getTime();

  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

export default function CurrentPeriodCard({ period, onClose }) {
  const daysRemaining = getDaysRemaining(period.end_date);
  const isOpen = period.status === "OPEN";

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      {/* Status Accent */}
      <div
        className={`h-1 ${
          isOpen
            ? "bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500"
            : "bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600"
        }`}
      />

      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                isOpen
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              <CalendarDays size={25} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Current Period
                </span>

                <PeriodStatusBadge status={period.status} />
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                {period.name}
              </h2>

              <p className="mt-1.5 text-sm text-gray-400">
                {formatDate(period.start_date)}

                <span className="mx-2 text-gray-600">→</span>

                {formatDate(period.end_date)}
              </p>
            </div>
          </div>

          {isOpen && (
            <Button variant="danger" onClick={onClose} className="shrink-0">
              <LockKeyhole size={15} className="mr-2" />
              Close Period
            </Button>
          )}
        </div>

        {/* Period Information */}
        <div className="mt-8 grid overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/60 sm:grid-cols-3">
          <InfoItem label="Start Date" value={formatDate(period.start_date)} />

          <InfoItem
            label="End Date"
            value={formatDate(period.end_date)}
            bordered
          />

          <div className="border-t border-gray-700 px-5 py-4 sm:border-l sm:border-t-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Period Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              {isOpen ? (
                <>
                  <CircleCheck size={16} className="text-emerald-400" />

                  <span className="text-sm font-semibold text-white">
                    Posting enabled
                  </span>
                </>
              ) : (
                <>
                  <LockKeyhole size={16} className="text-gray-500" />

                  <span className="text-sm font-semibold text-gray-300">
                    Posting locked
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {isOpen && daysRemaining !== null && (
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              {daysRemaining === 0
                ? "Period ends today."
                : `${daysRemaining} days remaining in this period.`}
            </p>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              Active
              <ArrowUpRight size={14} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoItem({ label, value, bordered = false }) {
  return (
    <div
      className={`px-5 py-4 ${
        bordered ? "border-t border-gray-700 sm:border-l sm:border-t-0" : ""
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
