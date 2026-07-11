export default function Invoice({ sale }) {
  return (
    <div className="mx-auto my-10 max-w-3xl bg-white p-10 text-gray-900 print:my-0 print:max-w-none">
      {/* Header */}
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

      {/* Details */}
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

      {/* Items */}
      <table className="mt-10 w-full border-collapse">
        <thead>
          <tr className="border-b text-left text-sm text-gray-500">
            <th className="py-3">#</th>

            <th>Product</th>

            <th>Qty</th>

            <th>Price</th>

            <th className="text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          {sale.items.map((item, index) => (
            <tr key={item.id} className="border-b last:border-none">
              <td className="py-4 text-sm">{index + 1}</td>

              <td className="py-4 font-medium">{item.product.name}</td>

              <td>{item.quantity}</td>

              <td>
                {sale.currency} {item.unit_price}
              </td>

              <td className="text-right font-medium">
                {sale.currency} {item.subtotal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
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

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-gray-500">
        <p>Thank you for your business</p>

        <p className="mt-1">ERP POS System</p>
      </div>

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
