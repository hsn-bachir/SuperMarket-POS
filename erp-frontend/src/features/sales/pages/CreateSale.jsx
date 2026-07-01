import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";

import SaleHeader from "../components/SaleHeader";
import ProductSearch from "../components/ProductSearch";
import SaleItemsTable from "../components/SaleItemsTable";
import SaleSummary from "../components/SaleSummary";

import { createSale } from "../api/salesApi";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function CreateSale() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [sale, setSale] = useState({
    invoice_number: "",
    currency: "USD",
    exchange_rate: 1,
    payment_method: "CASH",
    sale_date: today(),
    items: [],
  });

  function addProduct(product) {
    const exists = sale.items.find((item) => item.product === product.id);

    if (exists) {
      setSale((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      }));

      return;
    }

    setSale((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: product.id,
          product_name: product.name,
          quantity: 1,
          unit_price: Number(product.selling_price),
        },
      ],
    }));
  }

  function setItems(items) {
    setSale((prev) => ({
      ...prev,
      items,
    }));
  }

  async function handleSubmit() {
    if (!sale.invoice_number.trim()) {
      toast.error("Invoice number is required.");
      return;
    }

    if (sale.items.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }

    try {
      setLoading(true);

      await createSale({
        invoice_number: sale.invoice_number,
        currency: sale.currency,
        exchange_rate: Number(sale.exchange_rate),
        payment_method: sale.payment_method,
        sale_date: sale.sale_date,

        items: sale.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      });

      toast.success("Sale completed successfully.");

      navigate("/sales");
    } catch (err) {
      console.error(err);

      toast.error("Unable to create sale.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Create Sale" subtitle="Create a new customer sale." />

      <div className="space-y-6">
        <SaleHeader sale={sale} setSale={setSale} />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6">
            <ProductSearch onSelect={addProduct} />
          </div>

          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">Sale Items</h2>

              <SaleItemsTable items={sale.items} setItems={setItems} />
            </div>

            <SaleSummary
              items={sale.items}
              loading={loading}
              onSubmit={handleSubmit}
            />

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => navigate("/sales")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
