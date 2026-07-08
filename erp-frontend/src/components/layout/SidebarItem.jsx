import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function SidebarItem({
  icon: Icon,
  title,
  path,
  external = false,
}) {
  if (external) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex
          items-center
          gap-3
          rounded-xl
          px-4
          py-3
          text-slate-300
          transition-all
          duration-150
          hover:bg-[var(--sidebar-hover)]
          hover:text-white
        "
      >
        <Icon size={20} />
        <span className="font-medium">{title}</span>
      </a>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-150",
          isActive
            ? "bg-[var(--sidebar-active)] text-white"
            : "text-slate-300 hover:bg-[var(--sidebar-hover)] hover:text-white",
        )
      }
    >
      <Icon size={20} />
      <span className="font-medium">{title}</span>
    </NavLink>
  );
}
