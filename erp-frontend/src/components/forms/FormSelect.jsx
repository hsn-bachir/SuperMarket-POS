export default function FormSelect({
  label,
  options = [],
  placeholder = "Select...",
  error,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <select
        className={`
    h-10
    w-full
    rounded-sm
    border
    border-gray-300
    bg-white
    px-3
    text-sm
    text-gray-900
    placeholder:text-gray-400
    outline-none
    transition-all
    focus:border-gray-600
    focus:ring-2
    focus:ring-gray-600/20
    disabled:cursor-not-allowed
    disabled:bg-gray-100
    disabled:text-gray-500
    disabled:opacity-100
    ${className}
  `}
        required={required}
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
