import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import SalesToolbar from "../components/SalesToolbar";
import SalesTable from "../components/SalesTable";

import { getSales, deleteSale } from "../api/salesApi";

export default function Sales() {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {
    try {
      const res = await getSales();

      setSales(res.data);
    } catch (err) {
      toast.error("Unable to load sales.");
    } finally {
      setLoading(false);
    }
  }

  function handleView(id) {
    navigate(`/sales/${id}`);
  }

  function handleEdit(id) {
    navigate(`/sales/${id}/edit`);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deleteSale(deleteId);

      setSales((prev) => prev.filter((sale) => sale.id !== deleteId));

      toast.success("Sale deleted.");

      setDeleteId(null);
    } catch {
      toast.error("Unable to delete sale.");
    } finally {
      setDeleting(false);
    }
  }

  const filteredSales = sales.filter((sale) =>
    sale.invoice_number.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader title="Sales" subtitle="Manage completed sales." />

      <SalesToolbar search={search} setSearch={setSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : filteredSales.length === 0 ? (
        <EmptyState title="No Sales" description="No completed sales yet." />
      ) : (
        <SalesTable
          sales={filteredSales}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Sale"
        description="Deleting this sale will restore inventory stock."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
