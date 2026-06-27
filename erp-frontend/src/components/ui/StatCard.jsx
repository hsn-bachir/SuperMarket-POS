import Card from "./Card";

export default function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card className="hover:shadow-md transition-all border-gray-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{title}</p>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>

          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
            <Icon size={22} className="text-[var(--primary)]" />
          </div>
        )}
      </div>
    </Card>
  );
}
