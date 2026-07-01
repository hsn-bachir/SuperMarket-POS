export function calculateTotals(cart) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  return {
    subtotal,
    total: subtotal,
  };
}