export function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;

    const lineTotal = quantity * price;
    return sum + lineTotal;
  }, 0);

  return {
    subtotal,
    total: subtotal,
  };
}