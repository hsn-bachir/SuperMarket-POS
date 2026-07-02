import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/Loader";

import { getSale } from "../api/salesApi";

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSale();
  }, []);

  async function loadSale() {
    try {
      const res = await getSale(id);
      setSale(res.data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title={`Sale ${sale.invoice_number}`}
        subtitle="Sale details"
      />

      <SectionCard title="General Information">
        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Invoice" value={sale.invoice_number} />
          <Info label="Date" value={sale.sale_date} />

          <Info label="Currency" value={sale.currency} />
          <Info label="Exchange Rate" value={sale.exchange_rate} />

          <Info label="Payment" value={sale.payment_method} />
          <Info label="Total" value={`$${sale.total}`} />
        </div>
      </SectionCard>

      <SectionCard title="Items" className="mt-6">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="py-3">Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {sale.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{item.product_name}</td>

                <td>{item.quantity}</td>

                <td>${item.unit_price}</td>

                <td>${item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => navigate(`/sales/${sale.id}/edit`)}>
          Edit Sale
        </Button>
      </div>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="font-semibold">{value}</p>
    </div>
  );
}
