import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

import PurchaseToolbar from "../components/PurchaseToolbar";
import PurchaseTable from "../components/PurchaseTable";

import { getPurchases } from "../api/purchasesApi";

export default function Purchases() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    try {
      const res = await getPurchases();

      setPurchases(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleView(id) {
    navigate(`/purchases/${id}`);
  }

  const filtered = purchases.filter((purchase) =>
    purchase.invoice_number.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader title="Purchases" subtitle="Manage supplier purchases." />

      <PurchaseToolbar search={search} setSearch={setSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Purchases"
          description="No purchase invoices found."
        />
      ) : (
        <PurchaseTable purchases={filtered} onView={handleView} />
      )}
    </>
  );
}
