import { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";
import CategoryTable from "../components/CategoryTable";
import Button from "@/components/ui/Button";

export default function Category() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategory();
  }, []);

  async function loadCategory() {
    try {
      const res = await getCategories();
      setCategory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Category"
        subtitle="Manage your inventory categories."
      />
      <Button onClick={() => navigate("/category/new")}>
        <Plus size={18} />
        Add Category
      </Button>

      {loading ? (
        <LoadingSpinner />
      ) : category.length === 0 ? (
        <EmptyState
          title="No Categories Found"
          description="There are no cotegories."
        />
      ) : (
        <CategoryTable categories={category} />
      )}
    </>
  );
}
