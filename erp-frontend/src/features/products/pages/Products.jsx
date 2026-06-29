import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/Loader";

import ProductToolbar from "../components/ProductToolbar";
import ProductTable from "../components/ProductTable";

import { getProducts } from "../api/productsApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(term) ||
      product.barcode.includes(search)
    );
  });

  return (
    <>
      <PageHeader title="Products" subtitle="Manage your inventory products." />

      <ProductToolbar search={search} setSearch={setSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description="There are no products matching your search."
        />
      ) : (
        <ProductTable products={filteredProducts} />
      )}
    </>
  );
}
