import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";

import SupplierForm from "../components/SupplierForm";

import { createSupplier } from "../api/supplierApi";

export default function CreateSupplier() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createSupplier(data);

      toast.success("Supplier created successfully.");

      navigate("/suppliers");
    } catch (err) {
      console.error(err);

      toast.error("Unable to create supplier.");
    }
  }

  return (
    <>
      <PageHeader title="Create Supplier" subtitle="Add a new supplier." />

      <SupplierForm onSubmit={handleSubmit} />
    </>
  );
}
