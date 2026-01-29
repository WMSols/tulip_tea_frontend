import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/zones": "Zones Management",
  "/routes": "Routes Management",
  "/staff": "Staff Management",
  "/shops": "Shops Management",
  "/credit": "Credit Management",
  "/warehouses": "Warehouses & Inventory",
  "/products": "Products Catalog",
  "/visits": "Field Visits",
};

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-background flex w-full">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardNavbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
