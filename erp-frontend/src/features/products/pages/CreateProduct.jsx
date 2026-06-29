import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";

import ProductForm from "../components/ProductForm";

import { createProduct } from "../api/productsApi";

export default function CreateProduct() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      await createProduct(data);

      toast.success("Product created successfully.");

      navigate("/products");
    } catch (err) {
      console.error(err);

      toast.error("Unable to create product.");
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
