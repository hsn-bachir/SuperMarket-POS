import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";

import ExpenseToolbar from "../components/ExpenseToolbar";
import ExpenseTable from "../components/ExpenseTable";

import { getExpenses, deleteExpense } from "../api/expenseApi";

export default function ExpenseList() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, [search, page]);

  async function loadExpenses() {
    try {
      setLoading(true);

      const res = await getExpenses(page, search);

      setExpenses(res.data.results ?? []);

      setCount(res.data.count ?? 0);
    } catch (err) {
      console.error(err);

      toast.error("Unable to load expenses.");
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deleteExpense(deleteId);

      setExpenses((prev) => prev.filter((expense) => expense.id !== deleteId));

      toast.success("Expense deleted.");

      setDeleteId(null);
    } catch (err) {
      console.error(err);

      toast.error("Unable to delete expense.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Track and manage business expenses."
      />

      <ExpenseToolbar search={search} setSearch={setSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No Expenses Found"
          description="There are no expenses matching your search."
        />
      ) : (
        <ExpenseTable
          expenses={expenses}
          onView={(id) => navigate(`/accounting/expenses/${id}`)}
          onDelete={handleDelete}
        />
      )}

      <Pagination page={page} setPage={setPage} count={count} />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Expense"
        description="This action cannot be undone. Are you sure you want to delete this expense?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
