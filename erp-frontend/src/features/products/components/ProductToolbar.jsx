import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Toolbar from "@/components/ui/Toolbar";
import SearchInput from "@/components/ui/SearchInput";
import FilterSelect from "@/components/ui/FilterSelect";
import Button from "@/components/ui/Button";

import { getCategories } from "../../category/api/categoryApi";

export default function ProductToolbar({
  search,
  setSearch,

  category,
  setCategory,

  status,
  setStatus,
}) {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await getCategories();
      setCategories(res.data.results ?? res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Toolbar
      actions={
        <Button onClick={() => navigate("/products/new")}>
          <Plus size={18} />
          Add Product
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />

      <FilterSelect
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={[
          {
            value: "",
            label: "All Categories",
          },

          ...categories.map((c) => ({
            value: c.id,
            label: c.name,
          })),
        ]}
      />

      <FilterSelect
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={[
          {
            value: "",
            label: "All Status",
          },
          {
            value: "true",
            label: "Active",
          },
          {
            value: "false",
            label: "Inactive",
          },
        ]}
      />
    </Toolbar>
  );
}
