import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SalesToolbar from "../components/SalesToolbar";
import SalesTable from "../components/SalesTable";
import Pagination from "@/components/ui/Pagination";
import { getSales, deleteSale } from "../api/salesApi";

export default function Sales() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadSales();
  }, [page, search, payment]);

  async function loadSales() {
    try {
      setLoading(true);

      const res = await getSales({
        page,
        search,
        payment,
      });

      setSales(res.data.results);

      setCount(res.data.count);
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

      await loadSales();
      toast.success("Sale deleted.");

      setDeleteId(null);
    } catch {
      toast.error("Unable to delete sale.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader title="Sales" subtitle="Manage completed sales." />

      <SalesToolbar
        search={search}
        setSearch={setSearch}
        payment={payment}
        setPayment={setPayment}
        setPage={setPage}
      />

      {loading ? (
        <LoadingSpinner />
      ) : sales.length === 0 ? (
        <EmptyState title="No Sales" description="No completed sales yet." />
      ) : (
        <>
          <SalesTable
            sales={sales}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination page={page} setPage={setPage} count={count} />
        </>
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
