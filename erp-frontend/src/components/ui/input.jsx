import clsx from "clsx";

export default function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "w-full h-11 rounded-lg border px-3 outline-none transition-all",
        "border-[var(--border)]",
        "bg-white",
        "focus:ring-2 focus:ring-[var(--primary)]",
        className,
      )}
      {...props}
    />
  );
}
