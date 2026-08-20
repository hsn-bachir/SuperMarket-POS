import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createService } from "../api/serviceApi";

import PageHeader from "@/components/ui/PageHeader";
import ServiceForm from "../components/ServiceForm";

export default function CreateService() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createService(data);
      toast.success("Service created successfully.");
      navigate("/services");
    } catch (err) {
      console.error(err);
      toast.error("Unable to create service.");
    }
  }

  return (
    <>
      <PageHeader
        title="Create Service"
        subtitle="Add a new service offering."
      />

      <ServiceForm onSubmit={handleSubmit} />
    </>
  );
}
