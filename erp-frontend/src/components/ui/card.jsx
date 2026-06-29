export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-xl
        border
        border-gray-300
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-[var(--shadow-sm)]
        p-6
        transition-all
        duration-200
        hover:shadow-[var(--shadow-md)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
