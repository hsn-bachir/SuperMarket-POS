import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";

import UserToolbar from "../components/UserToolbar";
import UserTable from "../components/UserTable";

import { getUsers, deleteUser } from "../api/usersApi";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [count, setCount] = useState(0);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");

  const [status, setStatus] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  async function loadUsers() {
    try {
      setLoading(true);

      const res = await getUsers({
        page,
        search,
      });

      setUsers(res.data.results);
      setCount(res.data.count);
    } catch {
      toast.error("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id) {
    navigate(`/users/${id}/edit`);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);

      await deleteUser(deleteId);

      toast.success("User deleted.");

      loadUsers();

      setDeleteId(null);
    } catch {
      toast.error("Unable to delete user.");
    } finally {
      setDeleting(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    const roleMatch = !role || user.groups.includes(role);

    const statusMatch = !status || String(user.is_active) === status;

    return roleMatch && statusMatch;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Users" subtitle="Manage system users." />
      </div>

      <UserToolbar
        search={search}
        setSearch={setSearch}
        role={role}
        setRole={setRole}
        status={status}
        setStatus={setStatus}
      />

      {loading ? (
        <LoadingSpinner />
      ) : filteredUsers.length === 0 ? (
        <EmptyState title="No Users" description="No users found." />
      ) : (
        <>
          <UserTable
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination
            page={page}
            setPage={setPage}
            count={count}
            pageSize={10}
          />
        </>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete User"
        description="This action cannot be undone."
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
