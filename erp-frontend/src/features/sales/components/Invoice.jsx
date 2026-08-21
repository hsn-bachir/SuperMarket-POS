export default function Invoice({ sale }) {
  if (!sale) return null;

  return (
    <div className="mx-auto my-10 max-w-3xl bg-white p-10 text-gray-900 print:my-0 print:max-w-none">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold">ERP POS</h1>

          <p className="mt-1 text-sm text-gray-500">Business Suite</p>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-semibold">Sales Invoice</h2>

          <p className="mt-2 text-sm text-gray-500">#{sale.invoice_number}</p>
        </div>
      </div>

      {/* ==========================================
          SALE DETAILS
      ========================================== */}

      <div className="mt-6 grid grid-cols-3 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Date</p>

          <p className="mt-1 font-medium">{sale.sale_date}</p>
        </div>

        <div>
          <p className="text-gray-500">Payment</p>

          <p className="mt-1 font-medium">{sale.payment_method}</p>
        </div>

        <div>
          <p className="text-gray-500">Currency</p>

          <p className="mt-1 font-medium">{sale.currency}</p>
        </div>
      </div>

      {/* ==========================================
          ITEMS
      ========================================== */}

      <table className="mt-10 w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="py-3">#</th>

            <th className="py-3">Item</th>

            <th className="py-3">Type</th>

            <th className="py-3">Qty</th>

            <th className="py-3">Price</th>

            <th className="py-3 text-right">Total</th>
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
              <tr key={item.id || index} className="border-b last:border-none">
                {/* Number */}
                <td className="py-4 text-sm">{index + 1}</td>

                {/* Item */}
                <td className="py-4 font-medium">{itemName}</td>

                {/* Type */}
                <td className="py-4">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2
                      py-0.5
                      text-xs
                      font-medium
                      ${
                        isService
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {isService ? "Service" : "Product"}
                  </span>
                </td>

                {/* Quantity */}
                <td>{item.quantity}</td>

                {/* Unit price */}
                <td>
                  {sale.currency} {item.unit_price}
                </td>

                {/* Subtotal */}
                <td className="text-right font-medium">
                  {sale.currency} {item.subtotal}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ==========================================
          TOTAL
      ========================================== */}

      <div className="mt-8 flex justify-end">
        <div className="w-64 border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>

            <span>
              {sale.currency} {sale.total}
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <div className="mt-16 text-center text-sm text-gray-500">
        <p>Thank you for your business</p>

        <p className="mt-1">ERP POS System</p>
      </div>

      {/* ==========================================
          PRINT BUTTON
      ========================================== */}

      <div className="mt-8 flex justify-center print:hidden">
        <button
          onClick={() => window.print()}
          className="
            rounded-lg
            bg-gray-900
            px-6
            py-2.5
            text-sm
            font-medium
            text-white
            hover:bg-gray-800
          "
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
