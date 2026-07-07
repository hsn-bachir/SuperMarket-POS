import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getProducts, deleteProduct } from "../api/productsApi";

import PageHeader from "@/components/ui/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";
import ProductToolbar from "../components/ProductToolbar";
import ProductTable from "../components/ProductTable";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [search, category, status, page]);

  async function loadProducts() {
    try {
      setLoading(true);

      const res = await getProducts({
        page,

        search,

        category,

        is_active: status,
      });

      setProducts(res.data.results);

      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id) {
    navigate(`/products/${id}/edit`);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await deleteProduct(deleteId);
      setProducts((prev) => prev.filter((product) => product.id !== deleteId));
      toast.success("Product deleted successfully.");
      setDeleteId(null);
    } catch (err) {
      toast.error("Unable to delete product.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader title="Products" subtitle="Manage your inventory products." />

      <ProductToolbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
      />

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description="There are no products matching your search."
        />
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Product"
        description="This action cannot be undone. Are you sure you want to delete this product?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
