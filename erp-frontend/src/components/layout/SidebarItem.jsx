import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function SidebarItem({
  icon: Icon,
  title,
  path,
  children,
  external = false,
}) {
  const location = useLocation();

  const hasChildren = Boolean(children?.length);

  const childIsActive = hasChildren
    ? children.some((child) => {
        if (!child.path) return false;

        return (
          location.pathname === child.path ||
          location.pathname.startsWith(`${child.path}/`)
        );
      })
    : false;

  const [open, setOpen] = useState(childIsActive);

  useEffect(() => {
    if (childIsActive) {
      setOpen(true);
    }
  }, [childIsActive]);

  if (hasChildren) {
    return (
      <div>
        {/* Parent */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={clsx(
            "w-full flex items-center justify-between gap-3",
            "rounded-xl px-4 py-3",
            "transition-all duration-200",
            childIsActive
              ? "bg-white/5 text-white"
              : "text-slate-300 hover:bg-[var(--sidebar-hover)] hover:text-white",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <Icon
                size={18}
                className={clsx(
                  "shrink-0 transition-colors",
                  childIsActive ? "text-emerald-400" : "text-slate-400",
                )}
              />
            )}

            <span className="font-medium truncate">{title}</span>
          </div>

          <ChevronDown
            size={16}
            className={clsx(
              "shrink-0 transition-transform duration-200",
              open && "rotate-180",
              childIsActive ? "text-slate-300" : "text-slate-500",
            )}
          />
        </button>

        {/* Children */}
        {open && (
          <div className="relative ml-5 mt-1 pl-4">
            {/* Vertical connector */}
            <div className="absolute left-0 top-1 bottom-1 w-px bg-white/10" />

            <div className="space-y-1">
              {children.map((child) => (
                <SidebarItem key={child.title} {...child} />
              ))}
            </div>
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
        className={clsx(
          "flex items-center gap-3",
          "rounded-lg px-3 py-2.5",
          "text-slate-400",
          "hover:bg-[var(--sidebar-hover)]",
          "hover:text-white",
          "transition-all duration-200",
        )}
      >
        {Icon && <Icon size={17} className="shrink-0" />}

        <span className="text-sm font-medium">{title}</span>
      </a>
    );
  }

  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        clsx(
          "group relative flex items-center gap-3",
          "rounded-lg px-3 py-2.5",
          "transition-all duration-200",
          isActive
            ? [
                "bg-emerald-500/10",
                "text-white",
                "before:absolute",
                "before:-left-[17px]",
                "before:top-1/2",
                "before:h-5",
                "before:w-0.5",
                "before:-translate-y-1/2",
                "before:rounded-full",
                "before:bg-emerald-400",
              ]
            : [
                "text-slate-400",
                "hover:bg-[var(--sidebar-hover)]",
                "hover:text-white",
              ],
        )
      }
    >
      {({ isActive }) => (
        <>
          {Icon && (
            <Icon
              size={17}
              className={clsx(
                "shrink-0 transition-colors",
                isActive
                  ? "text-emerald-400"
                  : "text-slate-500 group-hover:text-slate-300",
              )}
            />
          )}

          <span className="text-sm font-medium">{title}</span>
        </>
      )}
    </NavLink>
  );
}
