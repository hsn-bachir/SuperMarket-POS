import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getService, updateService } from "../api/serviceApi";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import ServiceForm from "../components/ServiceForm";

export default function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadService();
  }, [id]);

  async function loadService() {
    try {
      const res = await getService(id);
      setService(res.data);
    } catch (err) {
      toast.error("Unable to load service.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data) {
    try {
      await updateService(id, data);
      toast.success("Service updated successfully.");
      navigate("/services");
    } catch (err) {
      toast.error("Unable to update service.");
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title="Edit Service"
        subtitle="Update service information and pricing."
      />

      <ServiceForm initialValues={service} onSubmit={handleSubmit} />
    </>
  );
}
