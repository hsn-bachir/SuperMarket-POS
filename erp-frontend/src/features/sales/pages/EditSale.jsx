import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/Loader";

import FormSelect from "@/components/forms/FormSelect";
import FormInput from "@/components/forms/FormInput";

import { getSale, updateSale } from "../api/salesApi";
import getErrorMessage from "@/utils/getErrorMessage";

export default function EditSale() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    payment_method: "",
    sale_date: "",
  });

  const [sale, setSale] = useState(null);

  useEffect(() => {
    loadSale();
  }, []);

  async function loadSale() {
    try {
      const res = await getSale(id);

      setSale(res.data);

      setForm({
        payment_method: res.data.payment_method,
        sale_date: res.data.sale_date,
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
      setSaving(true);

      await updateSale(id, form);

      toast.success("Sale updated.");

      navigate(`/sales/${id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <PageHeader
        title={`Edit ${sale.invoice_number}`}
        subtitle="Update sale information."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Sale">
          <div className="grid md:grid-cols-2 gap-5">
            <FormInput label="Invoice" value={sale.invoice_number} disabled />

            <FormInput label="Currency" value={sale.currency} disabled />

            <FormInput label="Total" value={sale.total} disabled />

            <FormInput
              label="Exchange Rate"
              value={sale.exchange_rate}
              disabled
            />

            <FormInput
              label="Sale Date"
              name="sale_date"
              type="date"
              value={form.sale_date}
              onChange={handleChange}
            />

            <FormSelect
              label="Payment Method"
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              options={[
                {
                  value: "CASH",
                  label: "Cash",
                },
                {
                  value: "CARD",
                  label: "Card",
                },
              ]}
            />
          </div>
        </SectionCard>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/sales`)}
          >
            Cancel
          </Button>

          <Button type="submit">{saving ? "Saving..." : "Save Changes"}</Button>
        </div>
      </form>
    </>
  );
}
