import { useEffect, useRef, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

import InventoryToolbar from "../components/InventoryToolbar";
import InventoryTable from "../components/InventoryTable";
import AdjustmentDialog from "../components/AdjustmentDialog";

import { getInventory } from "../api/inventoryApi";

export default function Inventory() {
  const [movements, setMovements] = useState([]);

  const [page, setPage] = useState(1);

  const [count, setCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [adjustOpen, setAdjustOpen] = useState(false);

  const adjustmentRef = useRef(null);

  useEffect(() => {
    loadInventory();
  }, [page, search]);

  async function loadInventory() {
    try {
      setLoading(true);

      const res = await getInventory({
        page,
        search,
      });

      setMovements(res.data.results);
      setCount(res.data.count);
    } finally {
      setLoading(false);
    }
  }

  function openAdjustment() {
    setAdjustOpen(true);

    setTimeout(() => {
      adjustmentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" subtitle="Inventory movement history." />

      <InventoryToolbar
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        onAdjustment={openAdjustment}
      />

      {loading ? (
        <LoadingSpinner />
      ) : movements.length === 0 ? (
        <EmptyState
          title="No Movements"
          description="No inventory history found."
        />
      ) : (
        <>
          <InventoryTable movements={movements} />

          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}

      <div ref={adjustmentRef} className="pt-6">
        <AdjustmentDialog
          open={adjustOpen}
          onClose={() => setAdjustOpen(false)}
          onSuccess={() => {
            setPage(1);
            loadInventory();
          }}
        />
      </div>
    </div>
  );
}
