export default function FormInput({ label, error, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}

      <input
        className={`
          h-10
          w-full
          rounded-lg
          border
          border-[var(--border)]
          bg-white
          px-3
          text-sm
          outline-none
          transition-colors
          focus:border-[var(--primary)]
          ${className}
        `}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
}
