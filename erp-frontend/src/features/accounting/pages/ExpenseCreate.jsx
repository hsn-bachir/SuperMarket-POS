import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";

import ExpenseForm from "../components/ExpenseForm";

import { createExpense } from "../api/expenseApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function CreateExpense() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createExpense(data);

      toast.success("Expense created successfully.");

      navigate("/accounting/expenses");
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    }
  }

  return (
    <>
      <PageHeader
        title="Create Expense"
        subtitle="Record a new business expense."
      />

      <ExpenseForm onSubmit={handleSubmit} />
    </>
  );
}
