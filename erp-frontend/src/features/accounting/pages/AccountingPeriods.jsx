import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  Layers3,
  LockKeyhole,
  Plus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Button from "@/components/ui/Button";

import CurrentPeriodCard from "../components/CurrentPeriodCard";
import PeriodTable from "../components/PeriodTable";
import CreatePeriodDialog from "../components/CreatePeriodDialog";

import {
  getCurrentPeriod,
  getPeriods,
  createPeriod,
  generateNextPeriod,
  closePeriod,
  reopenPeriod,
} from "../api/accountingPeriodApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function AccountingPeriods() {
  const [current, setCurrent] = useState(null);
  const [periods, setPeriods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const [currentRes, periodsRes] = await Promise.all([
        getCurrentPeriod(),
        getPeriods(),
      ]);

      setCurrent(currentRes.data);

      setPeriods(periodsRes.data.results ?? periodsRes.data);
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function requestAction(id, type) {
    setSelected(id);
    setAction(type);
  }

  function cancelAction() {
    if (processing) return;

    setSelected(null);
    setAction(null);
  }

  async function confirmAction() {
    if (!selected || !action) return;

    try {
      setProcessing(true);

      if (action === "close") {
        await closePeriod(selected);

        toast.success("Period closed successfully.");
      } else {
        await reopenPeriod(selected);

        toast.success("Period reopened successfully.");
      }

      setSelected(null);
      setAction(null);

      await loadData();
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  }

  async function handleCreatePeriod(data) {
    try {
      setCreateLoading(true);

      await createPeriod(data);

      toast.success("Accounting period created successfully.");

      setCreateOpen(false);

      await loadData();
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleGenerateNext() {
    try {
      setProcessing(true);

      await generateNextPeriod();

      toast.success("Next accounting period generated successfully.");

      await loadData();
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  }

  const stats = useMemo(() => {
    const open = periods.filter((period) => period.status === "OPEN").length;

    const closed = periods.filter(
      (period) => period.status === "CLOSED",
    ).length;

    return {
      total: periods.length,
      open,
      closed,
    };
  }, [periods]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title="Accounting Periods"
        description="Manage accounting periods and control transaction posting."
      />

      <div className="mb-6 flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={handleGenerateNext}
          disabled={processing}
        >
          <Sparkles size={16} className="mr-2" />
          {processing ? "Generating..." : "Generate Next"}
        </Button>

        <Button onClick={() => setCreateOpen(true)} disabled={processing}>
          <Plus size={16} className="mr-2" />
          Create Period
        </Button>
      </div>

      {current ? (
        <CurrentPeriodCard
          period={current}
          onClose={() => requestAction(current.id, "close")}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No Current Period
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Create an accounting period to start posting transactions.
          </p>

          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            Create Period
          </Button>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          icon={Layers3}
          label="Total Periods"
          value={stats.total}
          iconClass="bg-blue-100 text-blue-600"
        />

        <SummaryCard
          icon={CalendarPlus}
          label="Open Periods"
          value={stats.open}
          iconClass="bg-emerald-100 text-emerald-600"
        />

        <SummaryCard
          icon={LockKeyhole}
          label="Closed Periods"
          value={stats.closed}
          iconClass="bg-gray-100 text-gray-600"
        />
      </div>

      <div className="mt-6">
        <PeriodTable
          periods={periods}
          onClose={(id) => requestAction(id, "close")}
          onReopen={(id) => requestAction(id, "reopen")}
        />
      </div>

      <CreatePeriodDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreatePeriod}
        loading={createLoading}
      />

      <ConfirmDialog
        open={selected !== null}
        title={
          action === "close"
            ? "Close Accounting Period"
            : "Reopen Accounting Period"
        }
        description={
          action === "close"
            ? "Transactions can no longer be posted to this period after it is closed."
            : "Reopening this period will allow transactions to be posted to it again."
        }
        onConfirm={confirmAction}
        onCancel={cancelAction}
        loading={processing}
      />
    </>
  );
}

function SummaryCard({ icon: Icon, label, value, iconClass }) {
  const config = {
    "Total Periods": {
      description: "All accounting periods",
      accent: "bg-blue-500",
      iconBg: "bg-blue-500/10",
      iconText: "text-blue-400",
    },

    "Open Periods": {
      description: "Currently accepting entries",
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-500/10",
      iconText: "text-emerald-400",
    },

    "Closed Periods": {
      description: "Locked for posting",
      accent: "bg-gray-500",
      iconBg: "bg-gray-500/10",
      iconText: "text-gray-400",
    },
  };

  const card = config[label] ?? {
    description: "",
    accent: "bg-blue-500",
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-400",
  };

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-gray-700
        bg-gray-900
        px-6 py-5
        shadow-[0_8px_30px_rgba(0,0,0,0.18)]
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-gray-600
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.25)]
      "
    >
      {/* Accent line */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] ${card.accent} opacity-70`}
      />

      <div className="flex items-center justify-between gap-5">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={`
              flex h-12 w-12 shrink-0 items-center justify-center
              rounded-xl
              ${card.iconBg}
              ${card.iconText}
              transition-transform duration-200
              group-hover:scale-105
            `}
          >
            <Icon size={21} strokeWidth={2} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
              {label}
            </p>

            <p className="mt-1 text-xs text-gray-500">{card.description}</p>
          </div>
        </div>

        {/* Value */}
        <div className="shrink-0 text-right">
          <p className="text-3xl font-bold leading-none tracking-tight text-white tabular-nums">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
