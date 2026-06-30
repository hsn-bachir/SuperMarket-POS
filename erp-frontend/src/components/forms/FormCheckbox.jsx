export default function FormCheckbox({ label, className = "", ...props }) {
  return (
    <label
      className={`
        flex
        items-center
        gap-3
        cursor-pointer
        ${className}
      `}
    >
      <input
        type="checkbox"
        className="
          h-4
          w-4
          accent-[var(--primary)]
        "
        {...props}
      />

      <span className="text-sm">{label}</span>
    </label>
  );
}
