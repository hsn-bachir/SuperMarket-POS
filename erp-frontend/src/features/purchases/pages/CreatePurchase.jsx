import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";

import PurchaseForm from "../components/PurchaseForm";

import { createPurchase } from "../api/purchasesApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function CreatePurchase() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createPurchase(data);

      toast.success("Purchase created successfully.");

      navigate("/purchases");
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));
    }
  }

  return (
    <>
      <PageHeader
        title="Create Purchase"
        subtitle="Record a new supplier purchase."
      />

      <PurchaseForm onSubmit={handleSubmit} />
    </>
  );
}
