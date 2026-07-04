import { getDashboard } from "../api/dashboardApi";

export async function getDashboardCharts() {
  const res = await getDashboard();
  const d = res.data;

  return {
    total_products: d.total_products,
    total_suppliers: d.total_suppliers,
    total_sales: d.total_sales,
    total_purchases: d.total_purchases,
    today_sales: d.today_sales,
    month_sales: d.month_sales,
    inventory_value: d.inventory_value,
    low_stock_count: d.low_stock_count,
    dead_stock_count: d.dead_stock_count,

    salesTrend: [
      { name: "Today", value: d.today_sales },
      { name: "Month", value: d.month_sales },
    ],

    stockRisk: [
      { name: "Low Stock", value: d.low_stock_count },
      { name: "Dead Stock", value: d.dead_stock_count },
    ],

    salesActivity: [
      { name: "Sales", value: d.total_sales },
      { name: "Purchases", value: d.total_purchases },
    ],
  };
}