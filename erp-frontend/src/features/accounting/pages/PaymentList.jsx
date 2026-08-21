import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";

import PaymentToolbar from "../components/PaymentToolbar";
import PaymentTable from "../components/PaymentTable";

import { getPayments, deletePayment, payPayment } from "../api/paymentApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function PaymentList() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [count, setCount] = useState(0);

  // Delete
  const [deleteId, setDeleteId] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // Pay
  const [payingPayment, setPayingPayment] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [page, search]);

  async function loadPayments() {
    try {
      setLoading(true);

      const res = await getPayments(page, search);

      setPayments(res.data.results ?? []);

      setCount(res.data.count ?? 0);
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
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

      await deletePayment(deleteId);

      setPayments((prev) => prev.filter((payment) => payment.id !== deleteId));

      toast.success("Payment deleted.");

      setDeleteId(null);
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  function handlePay(payment) {
    setPayingPayment(payment);

    // Default payment method
    setPaymentMethod("CASH");
  }

  async function confirmPay() {
    if (!payingPayment) {
      return;
    }

    try {
      setPaying(true);

      const res = await payPayment(payingPayment.id, paymentMethod);

      // Update the payment in the list
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === payingPayment.id ? res.data : payment,
        ),
      );

      toast.success("Payment completed successfully.");

      setPayingPayment(null);
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    } finally {
      setPaying(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Track customer, supplier and expense payments."
      />

      <PaymentToolbar search={search} setSearch={setSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : payments.length === 0 ? (
        <EmptyState
          title="No Payments Found"
          description="There are no payments matching your search."
        />
      ) : (
        <PaymentTable
          payments={payments}
          onView={(id) => navigate(`/accounting/payments/${id}`)}
          onPay={handlePay}
          onDelete={handleDelete}
        />
      )}

      <Pagination page={page} setPage={setPage} count={count} />

      {/* Pay Dialog */}

      <ConfirmDialog
        open={payingPayment !== null}
        title="Pay Payment"
        description={
          payingPayment
            ? `Pay ${payingPayment.amount} for payment #${payingPayment.number}?`
            : ""
        }
        onConfirm={confirmPay}
        onCancel={() => setPayingPayment(null)}
        loading={paying}
      />

      {/* Delete Dialog */}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Payment"
        description="This action cannot be undone. Are you sure you want to delete this payment?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
