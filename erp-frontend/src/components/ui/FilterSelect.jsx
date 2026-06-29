export default function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="
        h-10
        rounded-lg
        border
        border-[var(--border)]
        bg-white
        px-4
        outline-none
        focus:border-[var(--primary)]
      "
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
