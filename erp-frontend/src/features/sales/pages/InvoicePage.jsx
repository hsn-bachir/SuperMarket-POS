import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../../api/axios";
import Invoice from "../components/Invoice";

export default function InvoicePage() {
  const { id } = useParams();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, []);

  async function loadInvoice() {
    try {
      const response = await api.get(`/sales/${id}/`);

      setSale(response.data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return <Invoice sale={sale} />;
}
