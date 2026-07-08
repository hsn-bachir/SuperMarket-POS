import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Package } from "lucide-react";

import { Dialog } from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import ProductCombobox from "@/components/forms/ProductCombobox";

import { getProducts } from "@/features/products/api/productsApi";
import { createAdjustment } from "../api/inventoryApi";

const initialForm = {
  product_id: "",
  quantity: "",
  reason: "",
};

export default function AdjustmentDialog({ open, onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  async function loadProducts() {
    try {
      const res = await getProducts({
        page_size: 1000, // load all products for dropdown
      });

      setProducts(res.data.results ?? []);
    } catch {
      toast.error("Unable to load products.");
    }
  }

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await createAdjustment({
        product_id: Number(form.product_id),
        quantity: Number(form.quantity),
        reason: form.reason.trim(),
      });

      toast.success("Inventory adjusted successfully.");

      setForm(initialForm);

      onSuccess?.();
      onClose();
    } catch {
      toast.error("Unable to adjust inventory.");
    } finally {
      setLoading(false);
    }
  }

  const isValid =
    form.product_id &&
    form.quantity &&
    Number(form.quantity) !== 0 &&
    form.reason.trim();

  return (
    <Dialog open={open} title="Inventory Adjustment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border bg-gray-50 dark:bg-zinc-900 p-4 flex gap-3">
          <Package className="mt-1 text-blue-600" size={20} />

          <div>
            <p className="font-medium text-white">Manual Stock Adjustment</p>

            <p className="text-sm text-gray-500">
              Use positive quantities to increase stock and negative quantities
              to decrease stock.
            </p>
          </div>
        </div>

        <ProductCombobox
          value={form.product_id}
          onChange={(id) =>
            setForm((prev) => ({
              ...prev,
              product_id: id,
            }))
          }
        />

        <FormInput
          label="Quantity Adjustment"
          name="quantity"
          type="number"
          placeholder="+10 or -5"
          value={form.quantity}
          onChange={handleChange}
        />

        <FormInput
          label="Reason"
          name="reason"
          placeholder="Damaged items, stock count correction..."
          value={form.reason}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={!isValid || loading}>
            {loading ? "Saving..." : "Adjust Stock"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
