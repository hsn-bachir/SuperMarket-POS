import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";

export default function SaleHeader({ sale, setSale }) {
  function handleChange(e) {
    setSale((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6">Sale Information</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <FormInput
          label="Invoice Number"
          name="invoice_number"
          value={sale.invoice_number}
          onChange={handleChange}
        />

        <FormInput
          type="date"
          label="Sale Date"
          name="sale_date"
          value={sale.sale_date}
          onChange={handleChange}
        />

        <FormSelect
          label="Currency"
          name="currency"
          value={sale.currency}
          onChange={handleChange}
          options={[
            {
              value: "USD",
              label: "USD",
            },
            {
              value: "LBP",
              label: "LBP",
            },
          ]}
        />

        <FormSelect
          label="Payment Method"
          name="payment_method"
          value={sale.payment_method}
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
    </div>
  );
}
