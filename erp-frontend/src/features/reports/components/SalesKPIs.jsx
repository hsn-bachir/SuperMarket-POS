import SalesKpiCard from "./SalesKpiCard";

export default function SalesKPIs({ profitLoss, cogs }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <SalesKpiCard
        title="Revenue"
        value={profitLoss.revenue}
        subtitle="Total Sales"
        type="revenue"
      />

      <SalesKpiCard
        title="Gross Profit"
        value={profitLoss.gross_profit}
        subtitle={`${Number(profitLoss.gross_margin).toFixed(1)}% Margin`}
        type="gross"
      />

      <SalesKpiCard
        title="Net Profit"
        value={profitLoss.net_profit}
        subtitle={`${Number(profitLoss.net_margin).toFixed(1)}% Margin`}
        type="net"
      />

      <SalesKpiCard
        title="COGS"
        value={cogs.cogs}
        subtitle="Cost of Goods Sold"
        type="cogs"
      />
    </div>
  );
}
