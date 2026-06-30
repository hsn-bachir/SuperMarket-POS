import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getSuppliers, deleteSupplier } from "../api/supplierApi";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import SupplierToolbar from "../components/SupplierToolbar";
import SupplierTable from "../components/SupplierTable";

export default function Suppliers() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    try {
      const res = await getSuppliers();

      setSuppliers(res.data);
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

      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== deleteId),
      );

      toast.success("Supplier deleted successfully.");

      setDeleteId(null);
    } catch (err) {
      toast.error("Unable to delete supplier.");
    } finally {
      setDeleting(false);
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const term = search.toLowerCase();

    return (
      supplier.name.toLowerCase().includes(term) ||
      supplier.contact_person.toLowerCase().includes(term) ||
      supplier.phone.includes(search) ||
      supplier.email.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <PageHeader title="Suppliers" subtitle="Manage your suppliers." />

      <SupplierToolbar search={search} setSearch={setSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : filteredSuppliers.length === 0 ? (
        <EmptyState
          title="No Suppliers Found"
          description="There are no suppliers matching your search."
        />
      ) : (
        <SupplierTable
          suppliers={filteredSuppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
