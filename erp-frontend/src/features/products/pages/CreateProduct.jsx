import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import ProductForm from "../components/ProductForm";

import { createProduct } from "../api/productsApi";

import getErrorMessage from "@/utils/getErrorMessage";

export default function CreateProduct() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createProduct(data);

      toast.success("Product created successfully.");

      navigate("/products");
    } catch (err) {
      console.error("Create product error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      toast.error(getErrorMessage(err));
    }
  }

  return (
    <>
      <PageHeader
        title="Create Product"
        subtitle="Add a new product to your inventory."
      />

      <ProductForm onSubmit={handleSubmit} />
    </>
  );
}
