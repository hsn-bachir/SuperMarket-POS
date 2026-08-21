import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import PurchaseToolbar from "../components/PurchaseToolbar";
import PurchaseTable from "../components/PurchaseTable";
import Pagination from "@/components/ui/Pagination";
import { getPurchases, deletePurchase } from "../api/purchasesApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function Purchases() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadPurchases();
  }, [page, search]);

  async function loadPurchases() {
    try {
      setLoading(true);

      const res = await getPurchases({
        page,
        search,
      });

      setPurchases(res.data.results);

      setCount(res.data.count);
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleView(id) {
    navigate(`/purchases/${id}`);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deletePurchase(deleteId);

      await loadPurchases();
      toast.success("Purchase deleted.");

      setDeleteId(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader title="Purchases" subtitle="Manage supplier purchases." />

      <PurchaseToolbar
        search={search}
        setSearch={setSearch}
        setPage={setPage}
      />
      {loading ? (
        <LoadingSpinner />
      ) : purchases.length === 0 ? (
        <EmptyState
          title="No Purchases"
          description="No purchase invoices found."
        />
      ) : (
        <>
          <PurchaseTable
            purchases={purchases}
            onView={handleView}
            onDelete={handleDelete}
          />
          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Purchase"
        description="Deleting this purchase will restore inventory stock."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
