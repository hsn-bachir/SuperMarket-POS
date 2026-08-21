import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import SectionCard from "@/components/ui/SectionCard";

import { getExpense } from "../api/expenseApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function ExpenseDetails() {
  const { id } = useParams();

  const [expense, setExpense] = useState(null);

  useEffect(() => {
    loadExpense();
  }, [id]);

  async function loadExpense() {
    try {
      const res = await getExpense(id);

      setExpense(res.data);
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    }
  }

  if (!expense) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader title={expense.number} subtitle={expense.category_name} />

      <SectionCard title="Expense Information">
        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Expense Number" value={expense.number} />

          <Info label="Date" value={expense.date} />

          <Info label="Category" value={expense.category_name} />

          <Info label="Supplier" value={expense.supplier_name || "-"} />

          <Info
            label="Payment Method"
            value={expense.payment_method_display ?? expense.payment_method}
          />

          <Info label="Amount" value={`$${expense.amount}`} />

          <Info
            label="Status"
            value={expense.status_display ?? expense.status}
          />

          <Info label="Reference" value={expense.reference || "-"} />

          <Info label="Created By" value={expense.created_by_name || "-"} />
        </div>
      </SectionCard>

      <SectionCard title="Description">
        <p className="text-gray-700 whitespace-pre-wrap">
          {expense.description || "No description provided."}
        </p>
      </SectionCard>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="font-medium">{value}</p>
    </div>
  );
}
