import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import FilterSelect from "@/components/ui/FilterSelect";
import Button from "@/components/ui/Button";

export default function SalesToolbar({
  search,
  setSearch,
  payment,
  setPayment,
  setPage,
}) {
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
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search invoice..."
      />

      <FilterSelect
        value={payment}
        onChange={(e) => {
          setPayment(e.target.value);
          setPage(1);
        }}
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
          {
            value: "TRANSFER",
            label: "Transfer",
          },
        ]}
      />
    </Toolbar>
  );
}
