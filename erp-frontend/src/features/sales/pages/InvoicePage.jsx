import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import api from "../../../api/axios";
import Invoice from "../components/Invoice";
import getErrorMessage from "@/utils/getErrorMessage";

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
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return <Invoice sale={sale} />;
}
