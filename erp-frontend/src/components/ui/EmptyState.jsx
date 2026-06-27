export default function EmptyState({ title, description }) {
  return (
    <div className="py-16 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
