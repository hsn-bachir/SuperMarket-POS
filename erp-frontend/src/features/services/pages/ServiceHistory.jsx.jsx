import { useEffect, useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";

import ServiceToolbar from "../components/ServiceHToolbar";
import ServiceTable from "../components/ServiceHTable";

import { getServiceHistory } from "../api/serviceApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function ServiceHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceHistory();
  }, [page, search]);

  async function loadServiceHistory() {
    try {
      setLoading(true);

      const res = await getServiceHistory(page, search);

      // Handles DRF paginated responses,
      // array responses, or empty fallbacks.
      const data = res.data?.results ?? res.data ?? [];

      setHistory(Array.isArray(data) ? data : []);

      setCount(res.data?.count ?? (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      console.error(err);

      toast.error(getErrorMessage(err));

      setHistory([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Service Sales History"
        subtitle="View all services sold through sales invoices."
      />

      <ServiceToolbar search={search} setSearch={setSearch} setPage={setPage} />

      {loading ? (
        <LoadingSpinner />
      ) : history.length === 0 ? (
        <EmptyState
          title="No Service Sales Found"
          description="There are no service sales matching your search."
        />
      ) : (
        <>
          <ServiceTable history={history} />

          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}
    </>
  );
}
