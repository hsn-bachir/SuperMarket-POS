import { NavLink } from "react-router-dom";
import clsx from "clsx";

export default function SidebarItem({ icon: Icon, title, path }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150",

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
