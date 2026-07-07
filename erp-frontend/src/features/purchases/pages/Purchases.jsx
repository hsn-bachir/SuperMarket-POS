import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

import PurchaseToolbar from "../components/PurchaseToolbar";
import PurchaseTable from "../components/PurchaseTable";
import Pagination from "@/components/ui/Pagination";
import { getPurchases } from "../api/purchasesApi";

export default function Purchases() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

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
    } finally {
      setLoading(false);
    }
  }

  function handleView(id) {
    navigate(`/purchases/${id}`);
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
          <PurchaseTable purchases={purchases} onView={handleView} />
          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}
    </>
  );
}
