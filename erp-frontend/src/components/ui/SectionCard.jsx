import Card from "./Card";

export default function SectionCard({ title, subtitle, action, children }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>

          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </Card>
  );
}
