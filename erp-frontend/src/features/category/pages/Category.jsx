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
import Pagination from "@/components/ui/Pagination";

import getErrorMessage from "@/utils/getErrorMessage";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadCategory();
  }, [page, search]);

  async function loadCategory() {
    try {
      setLoading(true);

      const res = await getCategories(page, search);

      setCategories(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      toast.error(getErrorMessage(err));
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

      toast.success("Category deleted.");

      await loadCategory();

      setDeleteId(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
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
      ) : categories.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="There are no categories."
        />
      ) : (
        <>
          <CategoryTable
            categories={categories}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Category"
        description="This action cannot be undone. Are you sure you want to delete this category?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
