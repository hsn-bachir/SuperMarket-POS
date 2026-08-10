import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function SidebarItem({
  icon: Icon,
  title,
  path,
  children,
  external = false,
}) {
  const [open, setOpen] = useState(false);

  if (children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="
            w-full
            flex
            items-center
            justify-between
            gap-3
            rounded-xl
            px-4
            py-3
            text-slate-300
            hover:bg-[var(--sidebar-hover)]
            hover:text-white
            transition-all
          "
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon size={18} />}

            <span className="font-medium">{title}</span>
          </div>

          <ChevronDown
            size={16}
            className={clsx("transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="ml-4 mt-1 space-y-1">
            {children.map((child) => (
              <SidebarItem key={child.title} {...child} />
            ))}
          </div>
        )}
      </div>
    );
  }

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
          hover:bg-[var(--sidebar-hover)]
          hover:text-white
          transition-all
        "
      >
        {Icon && <Icon size={18} />}

        <span className="font-medium">{title}</span>
      </a>
    );
  }

  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
          isActive
            ? "bg-[var(--sidebar-active)] text-white"
            : "text-slate-300 hover:bg-[var(--sidebar-hover)] hover:text-white",
        )
      }
    >
      {Icon && <Icon size={18} />}

      <span className="font-medium">{title}</span>
    </NavLink>
  );
}
