import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import Button from "@/components/ui/Button";

export default function ExpenseToolbar({ search, setSearch }) {
  const navigate = useNavigate();

  return (
    <Toolbar
      actions={
        <Button onClick={() => navigate("/accounting/expenses/new")}>
          <Plus size={18} />
          Add Expense
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search expenses..."
      />
    </Toolbar>
  );
}
