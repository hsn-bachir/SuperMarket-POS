import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}) {
  const variants = {
    primary: "bg-[var(--sidebar-bg)] hover:opacity-90 text-white",

    secondary: "bg-white border border-[var(--border)] hover:bg-gray-50",

    danger: "bg-[var(--danger)] text-white hover:opacity-90",
  };

  return (
    <button
      className={clsx(
        `
  inline-flex
  items-center
  justify-center
  gap-2

  h-10
  px-4

  rounded-lg

  text-sm
  font-medium

  transition-all
  duration-150

  shadow-sm
  `,
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
