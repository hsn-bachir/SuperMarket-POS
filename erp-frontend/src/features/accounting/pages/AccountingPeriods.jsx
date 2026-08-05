import { useEffect, useState } from "react";

import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import CurrentPeriodCard from "../components/CurrentPeriodCard";
import PeriodTable from "../components/PeriodTable";

import {
  getCurrentPeriod,
  getPeriods,
  closePeriod,
  reopenPeriod,
} from "../api/accountingPeriodApi";

export default function AccountingPeriods() {
  const [current, setCurrent] = useState(null);
  const [periods, setPeriods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selected, setSelected] = useState(null);
  const [action, setAction] = useState(null);

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

      toast.error("Unable to load accounting periods.");
    } finally {
      setLoading(false);
    }
  }

  function requestAction(id, type) {
    setSelected(id);
    setAction(type);
  }

  async function confirmAction() {
    try {
      setProcessing(true);

      if (action === "close") {
        await closePeriod(selected);

        toast.success("Period closed successfully.");
      } else {
        await reopenPeriod(selected);

        toast.success("Period reopened successfully.");
      }

      await loadData();

      setSelected(null);
      setAction(null);
    } catch (err) {
      console.error(err);

      toast.error("Operation failed.");
    } finally {
      setProcessing(false);
    }
  }

  function cancelAction() {
    setSelected(null);
    setAction(null);
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title="Accounting Periods"
        subtitle="Manage accounting periods and period closing."
      />

      {current && (
        <CurrentPeriodCard
          period={current}
          onClose={() => requestAction(current.id, "close")}
        />
      )}

      <PeriodTable
        periods={periods}
        onClose={(id) => requestAction(id, "close")}
        onReopen={(id) => requestAction(id, "reopen")}
      />

      <ConfirmDialog
        open={selected !== null}
        title={action === "close" ? "Close Period" : "Reopen Period"}
        description={
          action === "close"
            ? "Closing this period will prevent new transactions in this period. Continue?"
            : "Reopening this period will allow transactions again. Continue?"
        }
        onConfirm={confirmAction}
        onCancel={cancelAction}
        loading={processing}
      />
    </>
  );
}
