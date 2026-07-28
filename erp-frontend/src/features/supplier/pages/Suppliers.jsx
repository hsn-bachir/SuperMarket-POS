import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getListSuppliers, deleteSupplier } from "../api/supplierApi";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SupplierToolbar from "../components/SupplierToolbar";
import SupplierTable from "../components/SupplierTable";
import Pagination from "@/components/ui/Pagination";

export default function Suppliers() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, [page, search]);

  async function loadSuppliers() {
    try {
      setLoading(true);

      const res = await getListSuppliers({
        page,
        search,
      });

      setSuppliers(res.data.results);

      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id) {
    navigate(`/suppliers/${id}/edit`);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await deleteSupplier(deleteId);
      await loadSuppliers();
      toast.success("Supplier deleted successfully.");
      setDeleteId(null);
    } catch (err) {
      toast.error("Unable to delete supplier.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader title="Suppliers" subtitle="Manage your suppliers." />

      <SupplierToolbar
        search={search}
        setSearch={setSearch}
        setPage={setPage}
      />

      {loading ? (
        <LoadingSpinner />
      ) : suppliers.length === 0 ? (
        <EmptyState
          title="No Suppliers Found"
          description="There are no suppliers matching your search."
        />
      ) : (
        <>
          <SupplierTable
            suppliers={suppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Supplier"
        description="This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
