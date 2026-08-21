import { useEffect, useState } from "react";
import { getServices, deleteService } from "../api/serviceApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";
import ServiceTable from "../components/ServiceTable";
import ServiceToolbar from "../components/ServiceToolbar";
import Pagination from "@/components/ui/Pagination";
import getErrorMessage from "@/utils/getErrorMessage";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, [page, search]);

  async function loadServices() {
    try {
      setLoading(true);
      const res = await getServices(page, search);

      // Handles DRF paginated responses, array responses, or empty fallbacks
      const data = res.data?.results ?? res.data ?? [];
      setServices(Array.isArray(data) ? data : []);
      setCount(res.data?.count ?? (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      toast.error(getErrorMessage(err));
      setServices([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id) {
    navigate(`/services/${id}/edit`);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await deleteService(deleteId);
      toast.success("Service deleted.");
      await loadServices();
      setDeleteId(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Manage your offered services and rates."
      />

      <ServiceToolbar search={search} setSearch={setSearch} setPage={setPage} />

      {loading ? (
        <LoadingSpinner />
      ) : (services?.length ?? 0) === 0 ? (
        <EmptyState
          title="No Services Found"
          description="There are no services available."
        />
      ) : (
        <>
          <ServiceTable
            services={services}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          <Pagination page={page} setPage={setPage} count={count} />
        </>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Service"
        description="This action cannot be undone. Are you sure you want to delete this service?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}