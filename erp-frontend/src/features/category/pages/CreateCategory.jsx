import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createCategory } from "../api/categoryApi";

import PageHeader from "@/components/ui/PageHeader";
import CategoryForm from "../components/CategoryForm";

export default function CreateCategory() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createCategory(data);
      toast.success("Category created successfully.");
      navigate("/category");
    } catch (err) {
      console.error(err);
      toast.error("Unable to create category.");
    }
  }

  return (
    <>
      <PageHeader
        title="Create Category"
        subtitle="Add a new category to your inventory."
      />

      <CategoryForm onSubmit={handleSubmit} />
    </>
  );
}
