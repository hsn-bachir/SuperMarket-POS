import SectionCard from "@/components/ui/SectionCard";

export default function PeriodStats({ periods, current }) {
  const total = periods.length;

  const open = periods.filter((p) => p.status === "OPEN").length;

  const closed = periods.filter((p) => p.status === "CLOSED").length;

  const stats = [
    {
      title: "Current Period",
      value: current?.name || "-",
    },
    {
      title: "Total Periods",
      value: total,
    },
    {
      title: "Open",
      value: open,
    },
    {
      title: "Closed",
      value: closed,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      {stats.map((stat) => (
        <SectionCard key={stat.title}>
          <p className="text-sm text-gray-500">{stat.title}</p>

          <h3 className="mt-2 text-2xl font-bold">{stat.value}</h3>
        </SectionCard>
      ))}
    </div>
  );
}
