import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import FilterSelect from "@/components/ui/FilterSelect";
import Button from "@/components/ui/Button";

export default function UserToolbar({
  search,
  setSearch,
  role,
  setRole,
  status,
  setStatus,
}) {
  const navigate = useNavigate();

  return (
    <Toolbar
      actions={
        <Button onClick={() => navigate("/users/new")}>
          <Plus size={18} />
          Add User
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
      />

      <FilterSelect
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={[
          { value: "", label: "All Roles" },
          { value: "Admin", label: "Admin" },
          { value: "Manager", label: "Manager" },
          { value: "Cashier", label: "Cashier" },
        ]}
      />

      <FilterSelect
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={[
          { value: "", label: "All Status" },
          { value: "true", label: "Active" },
          { value: "false", label: "Inactive" },
        ]}
      />
    </Toolbar>
  );
}
