import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";

export default function CategoryToolbar({ search, setSearch }) {
  const navigate = useNavigate();
  return (
    <Toolbar
      actions={
        <Button onClick={() => navigate("/category/new")}>
          <Plus size={18} />
          Add Category
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search categories..."
      />
    </Toolbar>
  );
}
