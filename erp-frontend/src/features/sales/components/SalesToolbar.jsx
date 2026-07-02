import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import FilterSelect from "@/components/ui/FilterSelect";
import Button from "@/components/ui/Button";

export default function SalesToolbar({ search, setSearch }) {
  const navigate = useNavigate();

  return (
    <Toolbar
      actions={
        <Button onClick={() => navigate("/pos")}>
          <Plus size={18} />
          New Sale
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search invoice..."
      />

      <FilterSelect
        options={[
          {
            value: "",
            label: "All Payments",
          },
          {
            value: "CASH",
            label: "Cash",
          },
          {
            value: "CARD",
            label: "Card",
          },
        ]}
      />
    </Toolbar>
  );
}
