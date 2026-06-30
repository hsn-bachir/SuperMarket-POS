export default function FormSection({ title, children }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm">
      {title && <h2 className="mb-6 text-lg font-semibold">{title}</h2>}

      {children}
    </div>
  );
}
