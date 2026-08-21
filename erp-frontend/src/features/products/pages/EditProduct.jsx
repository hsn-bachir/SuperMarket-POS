import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";

import ProductForm from "../components/ProductForm";
import { getProduct, updateProduct } from "../api/productsApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  async function loadProduct() {
    try {
      const res = await getProduct(id);
      setProduct(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data) {
    try {
      await updateProduct(id, data);
      toast.success("Product updated successfully.");
      navigate("/products");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader title="Edit Product" subtitle="Update product information." />
      <ProductForm initialValues={product} onSubmit={handleSubmit} />
    </>
  );
}
