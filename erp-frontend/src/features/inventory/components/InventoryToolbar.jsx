import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";

export default function InventoryToolbar({ search, setSearch, onAdjustment }) {
  const navigate = useNavigate();

  return (
    <Toolbar
      actions={
        <Button onClick={onAdjustment}>
          <Plus size={18} />
          Adjustment
        </Button>
      }
    >
      <SearchInput
        placeholder="Search inventory..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Toolbar>
  );
}
