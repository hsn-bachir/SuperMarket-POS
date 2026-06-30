import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";

import SupplierForm from "../components/SupplierForm";

import { getSupplier, updateSupplier } from "../api/supplierApi";

export default function EditSupplier() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplier();
  }, []);

  async function loadSupplier() {
    try {
      const res = await getSupplier(id);

      setSupplier(res.data);
    } catch (err) {
      toast.error("Unable to load supplier.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data) {
    try {
      await updateSupplier(id, data);

      toast.success("Supplier updated successfully.");

      navigate("/suppliers");
    } catch (err) {
      toast.error("Unable to update supplier.");
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title="Edit Supplier"
        subtitle="Update supplier information."
      />

      <SupplierForm initialValues={supplier} onSubmit={handleSubmit} />
    </>
  );
}
