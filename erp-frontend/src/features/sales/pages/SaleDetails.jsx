import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/Loader";

import { getSale } from "../api/salesApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSale();
  }, [id]);

  async function loadSale() {
    try {
      setLoading(true);

      const res = await getSale(id);

      setSale(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!sale) {
    return null;
  }

  return (
    <>
      <PageHeader
        title={`Sale ${sale.invoice_number}`}
        subtitle="Sale details"
      />

      {/* General Information */}
      <SectionCard title="General Information">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Info label="Invoice" value={sale.invoice_number} />

          <Info label="Date" value={sale.sale_date} />

          <Info label="Currency" value={sale.currency} />

          <Info label="Exchange Rate" value={sale.exchange_rate} />

          <Info label="Payment" value={sale.payment_method} />

          <Info
            label="Total"
            value={`${sale.currency} ${sale.total}`}
            highlight
          />
        </div>
      </SectionCard>

      {/* Sale Items */}
      <SectionCard title="Items" className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200">
              <tr className="text-left text-sm text-slate-500">
                <th className="py-3 pr-4">#</th>

                <th className="py-3 pr-4">Type</th>

                <th className="py-3 pr-4">Item</th>

                <th className="py-3 pr-4">Qty</th>

                <th className="py-3 pr-4">Unit Price</th>

                <th className="py-3 text-right">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {(sale.items || []).map((item, index) => {
                const isService = Boolean(item.service || item.service_id);

                const itemName =
                  item.product?.name ||
                  item.service?.name ||
                  item.product_name ||
                  item.service_name ||
                  "Unknown Item";

                return (
                  <tr
                    key={item.id || index}
                    className="border-b border-slate-100 last:border-none"
                  >
                    <td className="py-4 pr-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="py-4 pr-4">
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-2.5
                          py-0.5
                          text-xs
                          font-medium
                          ${
                            isService
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }
                        `}
                      >
                        {isService ? "Service" : "Product"}
                      </span>
                    </td>

                    <td className="py-4 pr-4 font-medium text-slate-900">
                      {itemName}
                    </td>

                    <td className="py-4 pr-4 text-slate-600">
                      {item.quantity}
                    </td>

                    <td className="py-4 pr-4 text-slate-600">
                      {sale.currency} {item.unit_price}
                    </td>

                    <td className="py-4 text-right font-medium text-slate-900">
                      {sale.currency} {item.subtotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty items fallback */}
        {(sale.items || []).length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            No items found for this sale.
          </div>
        )}
      </SectionCard>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={() => navigate("/sales")}>
          Back
        </Button>

        <Button onClick={() => navigate(`/sales/${sale.id}/edit`)}>
          Edit Sale
        </Button>
      </div>
    </>
  );
}

function Info({ label, value, highlight = false }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>

      <p
        className={`
          mt-1 font-semibold
          ${highlight ? "text-emerald-600" : "text-slate-900"}
        `}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}
