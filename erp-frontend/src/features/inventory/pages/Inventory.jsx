import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

import InventoryToolbar from "../components/InventoryToolbar";
import InventoryTable from "../components/InventoryTable";
import AdjustmentDialog from "../components/AdjustmentDialog";

import { getInventory } from "../api/inventoryApi";

export default function Inventory() {
  const [movements, setMovements] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [adjustOpen, setAdjustOpen] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const res = await getInventory();

      setMovements(res.data);
    } finally {
      setLoading(false);
    }
  }

  const filtered = movements.filter((m) => {
    const term = search.toLowerCase();

    return (
      m.product_name.toLowerCase().includes(term) ||
      m.movement_type.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <PageHeader title="Inventory" subtitle="Inventory movement history." />

      <InventoryToolbar
        search={search}
        setSearch={setSearch}
        onAdjustment={() => setAdjustOpen(true)}
      />

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Movements"
          description="No inventory history found."
        />
      ) : (
        <InventoryTable movements={filtered} />
      )}

      <br></br>

      <AdjustmentDialog
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        onSuccess={loadInventory}
      />
    </>
  );
}
