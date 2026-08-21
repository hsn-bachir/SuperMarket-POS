import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getCategory, updateCategory } from "../api/categoryApi";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import CategoryForm from "../components/CategoryForm";
import getErrorMessage from "@/utils/getErrorMessage";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategory();
  }, []);

  async function loadCategory() {
    try {
      const res = await getCategory(id);
      setCategory(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data) {
    try {
      await updateCategory(id, data);
      toast.success("Category updated successfully.");
      navigate("/category");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title="Edit Category"
        subtitle="Update category information."
      />

      <CategoryForm initialValues={category} onSubmit={handleSubmit} />
    </>
  );
}
