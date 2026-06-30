import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";

export default function PurchaseToolbar({ search, setSearch }) {
  const navigate = useNavigate();

  return (
    <Toolbar
      actions={
        <Button onClick={() => navigate("/purchases/new")}>
          <Plus size={18} />
          New Purchase
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search invoice..."
      />
    </Toolbar>
  );
}
