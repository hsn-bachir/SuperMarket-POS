import clsx from "clsx";

export default function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "rounded-xl bg-white border border-[var(--border)] shadow-sm p-6 border-gray-300",
        className,
      )}
    >
      {children}
    </div>
  );
}
