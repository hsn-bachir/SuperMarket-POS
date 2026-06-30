import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import SectionCard from "@/components/ui/SectionCard";
import DataTable from "@/components/ui/DataTable";

import { getPurchase } from "../api/purchasesApi";

export default function PurchaseDetails() {
  const { id } = useParams();

  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    loadPurchase();
  }, []);

  async function loadPurchase() {
    const res = await getPurchase(id);
    setPurchase(res.data);
  }

  if (!purchase) {
    return <LoadingSpinner />;
  }

  const columns = [
    {
      key: "product_name",
      title: "Product",
    },
    {
      key: "quantity",
      title: "Qty",
    },
    {
      key: "cost_price",
      title: "Cost",
    },
    {
      key: "subtotal",
      title: "Subtotal",
    },
  ];

  return (
    <>
      <PageHeader
        title={purchase.invoice_number}
        subtitle={purchase.supplier_name}
      />

      <SectionCard title="Purchase Items">
        <DataTable columns={columns} data={purchase.items} />
      </SectionCard>
    </>
  );
}
