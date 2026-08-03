import {
  getTrialBalance,
  getIncomeStatement,
  getBalanceSheet,
  getCashFlow,
} from "../api/reportsApi";

export async function loadAccountingReports(
  filters = {}
) {
  const [
    trialBalance,
    incomeStatement,
    balanceSheet,
    cashFlow,
  ] = await Promise.all([
    getTrialBalance(filters),
    getIncomeStatement(filters),
    getBalanceSheet(filters),
    getCashFlow(filters),
  ]);

  return {
    trialBalance: trialBalance.data,
    incomeStatement: incomeStatement.data,
    balanceSheet: balanceSheet.data,
    cashFlow: cashFlow.data,
  };
}