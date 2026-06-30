import { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../api/categoryApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";
import CategoryTable from "../components/CategoryTable";
import CategoryToolbar from "../components/CategoryToolbar";

export default function Category() {
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategory();
  }, []);

  async function loadCategory() {
    try {
      const res = await getCategories();
      setCategory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id) {
    navigate(`/category/${id}/edit`);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await deleteCategory(deleteId);
      setCategory((prev) =>
        prev.filter((category) => category.id !== deleteId),
      );
      toast.success("Category deleted successfully.");
      setDeleteId(null);
    } catch (err) {
      toast.error("Unable to delete category.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Category"
        subtitle="Manage your inventory categories."
      />

      <CategoryToolbar search={search} setSearch={setSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : category.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="There are no cotegories."
        />
      ) : (
        <CategoryTable
          categories={category}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Category"
        description="This action cannot be undone. Are you sure you want to delete this Category?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
