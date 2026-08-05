import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";

import PaymentForm from "../components/PaymentForm";

import { createPayment } from "../api/paymentApi";

export default function CreatePayment() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createPayment(data);

      toast.success("Payment created successfully.");

      navigate("/accounting/payments");
    } catch (err) {
      console.error(err);

      toast.error("Unable to create payment.");
    }
  }

  return (
    <>
      <PageHeader title="Create Payment" subtitle="Record a new payment." />

      <PaymentForm onSubmit={handleSubmit} />
    </>
  );
}
