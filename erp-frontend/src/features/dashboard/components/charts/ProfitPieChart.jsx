import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import SectionCard from "@/components/ui/SectionCard";

const COLORS = ["#60a5fa", "#818cf8"];

export default function ProfitPieChart({ data }) {
  return (
    <SectionCard title="Sales vs Purchases">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
