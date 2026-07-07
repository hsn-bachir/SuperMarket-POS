import clsx from "clsx";

export default function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "h-11 w-full rounded-xl border px-4",
        "outline-none transition-all duration-200",

        // Theme
        "border-gray-700",
        "text-gray-600",
        "placeholder:text-gray-600",

        // States
        "hover:border-gray-600",
        "focus:border-gray-600",
        "focus:ring-2 focus:ring-gray-600/50",

        // Disabled
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        className,
      )}
      {...props}
    />
  );
}
