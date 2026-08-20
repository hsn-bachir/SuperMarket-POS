import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";

import ServiceToolbar from "../components/ServiceHToolbar";
import ServiceTable from "../components/ServiceHTable";

import { getServicePriceHistories } from "../api/serviceApi";

export default function ServiceHistory() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadServiceHistory();
  }, [page, search]);

  async function loadServiceHistory() {
    try {
      setLoading(true);

      const res = await getServicePriceHistories(page, search);

      setHistory(res.data.results || []);
      setCount(res.data.count || 0);
    } catch (err) {
      setHistory([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Services" subtitle="Service price history and logs." />

      <ServiceToolbar
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        onRefresh={loadServiceHistory}
      />

      {loading ? (
        <LoadingSpinner />
      ) : history.length === 0 ? (
        <EmptyState
          title="No Service History"
          description="No service price logs found."
        />
      ) : (
        <>
          <ServiceTable history={history} />

          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}
    </div>
  );
}
