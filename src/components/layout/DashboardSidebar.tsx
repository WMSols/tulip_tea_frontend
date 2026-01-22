import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Route,
  Users,
  Store,
  CreditCard,
  Warehouse,
  Package,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: MapPin, label: "Zones", path: "/zones" },
  { icon: Route, label: "Routes", path: "/routes" },
  { icon: Users, label: "Staff", path: "/staff" },
  { icon: Store, label: "Shops", path: "/shops" },
  { icon: CreditCard, label: "Credit", path: "/credit" },
  { icon: Warehouse, label: "Warehouses", path: "/warehouses" },
  // { icon: Package, label: "Products", path: "/products" },
  // { icon: ClipboardCheck, label: "Visits", path: "/visits" },
];

export function DashboardSidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar border-r border-sidebar-border flex flex-col",
          "transition-all duration-300 ease-in-out",
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 lg:w-20 -translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex items-center h-16 border-b border-sidebar-border px-4 flex-shrink-0",
            !isOpen && "lg:justify-center lg:px-2",
          )}
        >
          <div
            onClick={onToggle}
            className="w-10 h-10 min-w-[2.5rem] rounded-xl bg-primary flex items-center justify-center shadow-sm cursor-pointer"
          >
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <h1 className="font-semibold text-lg text-sidebar-foreground whitespace-nowrap tracking-tight">
                Tulip Tea
              </h1>
              <p className="text-xs text-sidebar-muted whitespace-nowrap">
                Distributor Portal
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                      isActive
                        ? "bg-accent text-primary font-medium shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                      !isOpen && "lg:justify-center lg:px-2",
                    )}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                    )}
                    <item.icon
                      className={cn(
                        "w-5 h-5 min-w-[1.25rem] transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-sidebar-muted group-hover:text-sidebar-foreground",
                      )}
                    />
                    {isOpen && (
                      <span className="text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle button - Desktop only */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </aside>
    </>
  );
}
