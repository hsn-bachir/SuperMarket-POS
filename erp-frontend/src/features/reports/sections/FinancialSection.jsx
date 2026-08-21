import { useEffect, useState } from "react";
import { toast } from "sonner";

import LoadingSpinner from "@/components/ui/Loader";

import { loadAccountingReports } from "../services/accountingReports";
import getErrorMessage from "@/utils/getErrorMessage";

import TrialBalanceTable from "../components/TrialBalanceTable";
import IncomeStatementCard from "../components/IncomeStatementCard";
import BalanceSheetCard from "../components/BalanceSheetCard";
import CashFlowCard from "../components/CashFlowCard";

export default function AccountingSection({ filters }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [filters]);

  async function load() {
    setLoading(true);

    try {
      const result = await loadAccountingReports(filters);

      setData(result);
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <TrialBalanceTable data={data.trialBalance} filters={filters} />

      <IncomeStatementCard data={data.incomeStatement} filters={filters} />

      <BalanceSheetCard data={data.balanceSheet} filters={filters} />

      <CashFlowCard data={data.cashFlow} filters={filters} />
    </div>
  );
}
