import Button from "./Button";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>

        {subtitle && (
          <p className="text-[var(--text-secondary)] mt-1">{subtitle}</p>
        )}
      </div>

      {action}
    </div>
  );
}
