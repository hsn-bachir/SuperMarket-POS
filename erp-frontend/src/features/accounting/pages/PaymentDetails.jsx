import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/ui/Loader";
import SectionCard from "@/components/ui/SectionCard";

import { getPayment } from "../api/paymentApi";

export default function PaymentDetails() {
  const { id } = useParams();

  const [payment, setPayment] = useState(null);

  useEffect(() => {
    loadPayment();
  }, []);

  async function loadPayment() {
    const res = await getPayment(id);

    setPayment(res.data);
  }

  if (!payment) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader title={payment.number} subtitle={payment.payment_type} />

      <SectionCard title="Payment Information">
        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Number" value={payment.number} />
          <Info label="Date" value={payment.date} />
          <Info label="Type" value={payment.payment_type} />
          <Info label="Method" value={payment.payment_method} />
          <Info label="Amount" value={payment.amount} />
          <Info label="Status" value={payment.status} />
          <Info label="Reference" value={payment.external_reference || "-"} />
          <Info label="Object ID" value={payment.object_id} />
        </div>
      </SectionCard>

      <SectionCard title="Description">
        {payment.description || "No description."}
      </SectionCard>
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
