import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";

export default function ServiceToolbar({ search, setSearch, setPage }) {
  const navigate = useNavigate();
  return (
    <Toolbar
      actions={
        <Button onClick={() => navigate("/services/new")}>
          <Plus size={18} />
          Add Service
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          if (setPage) setPage(1);
        }}
        placeholder="Search services..."
      />
    </Toolbar>
  );
}
