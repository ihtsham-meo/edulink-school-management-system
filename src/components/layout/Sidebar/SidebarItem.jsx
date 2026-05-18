import { NavLink } from "react-router-dom";

function SidebarItem({
  to,
  icon: Icon,
  label,
  badge,
  badgeColor = "blue",
  collapsed,
}) {
  const badgeStyles = {
    blue: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    red: "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400",
  };

  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 mx-2 rounded-lg text-sm transition-all duration-200 ${
          collapsed ? "justify-center" : ""
        }
       ${
         isActive
           ? "bg-gray-500 text-white font-medium"
           : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
       }`
      }
    >
      {Icon && <Icon size={17} className="shrink-0" />}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge && (
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${badgeStyles[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default SidebarItem;
