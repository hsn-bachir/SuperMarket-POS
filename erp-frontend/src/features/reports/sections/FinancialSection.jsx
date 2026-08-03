import { useEffect, useState } from "react";

import { loadAccountingReports } from "../services/accountingReports";

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
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return <div className="py-20 text-center">Loading...</div>;
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
