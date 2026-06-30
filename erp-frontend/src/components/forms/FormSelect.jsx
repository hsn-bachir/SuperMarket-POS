export default function FormSelect({
  label,
  options = [],
  placeholder = "Select...",
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}

      <select
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
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
}
