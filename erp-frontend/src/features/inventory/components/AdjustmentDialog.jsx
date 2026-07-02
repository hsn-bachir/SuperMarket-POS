import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Dialog } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";

import { getProducts } from "@/features/products/api/productsApi";
import { createAdjustment } from "../api/inventoryApi";

export default function AdjustmentDialog({ open, onClose, onSuccess }) {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    reason: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await getProducts();
    setProducts(res.data);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await createAdjustment({
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        reason: form.reason,
      });

      toast.success("Inventory adjusted successfully.");

      onSuccess();

      onClose();

      setForm({
        product_id: "",
        quantity: "",
        reason: "",
      });
    } catch {
      toast.error("Unable to adjust inventory.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} title="Inventory Adjustment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSelect
          label="Product"
          name="product_id"
          value={form.product_id}
          onChange={handleChange}
          options={[
            ...products.map((p) => ({
              value: p.id,
              label: p.name,
            })),
          ]}
        />

        <FormInput
          label="Quantity"
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
        />

        <FormInput
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            {loading ? "Saving..." : "Adjust Stock"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
