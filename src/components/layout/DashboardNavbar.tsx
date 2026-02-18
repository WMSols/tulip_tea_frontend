import { useState } from "react";
import { useLocation } from "react-router-dom";
import { User, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks/hooks";
import { logout } from "@/Redux/Slices/authSlice";
import { baseApi } from "@/Redux/Api/baseApi";

/** Tags to invalidate per route so refetch shows loading/skeleton on that page */
const REFRESH_TAGS_BY_PATH: Record<string, readonly string[]> = {
  "/": [],
  "/zones": ["Zones"],
  "/routes": ["Routes", "Zones", "OrderBooker", "DeliveryMan", "WeeklyRouteSchedules"],
  "/staff": ["Zones", "OrderBooker", "DeliveryMan"],
  "/shops": ["Shops", "Zones", "Routes", "OrderBooker"],
  "/credit": ["CreditLimitRequests"],
  "/warehouses": ["Warehouses", "Zones", "Products", "DeliveryMan", "WarehouseInventory", "WarehouseDeliveryMen"],
  "/products": ["Products"],
  "/visits": ["ShopVisits", "Deliveries", "Zones"],
  "/wallet": ["WalletBalance", "Wallets", "WalletTransactions"],
  "/subsidy": ["PendingSubsidyOrders"],
};

interface NavbarProps {
  onMenuClick: () => void;
  pageTitle: string;
}

export function DashboardNavbar({ onMenuClick, pageTitle }: NavbarProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { name, role } = useAppSelector((s) => s.auth.user);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRefresh = () => {
    const tags = REFRESH_TAGS_BY_PATH[location.pathname];
    if (!tags?.length) return;
    setIsRefreshing(true);
    dispatch(
      baseApi.util.invalidateTags(
        tags as Parameters<typeof baseApi.util.invalidateTags>[0],
      ),
    );
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const canRefresh = (REFRESH_TAGS_BY_PATH[location.pathname]?.length ?? 0) > 0;

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-foreground hover:bg-muted"
        >
          {/* <Menu className="w-5 h-5" /> */}
        </Button>
        <h1 className="text-lg font-semibold text-foreground hidden sm:block tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {canRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-muted-foreground hover:text-foreground"
            title="Refresh page data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        )}
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 hover:bg-accent"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground capitalize">
                  {name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-card border-border shadow-lg rounded-xl"
          >
            <DropdownMenuLabel className="font-semibold">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive cursor-pointer hover:bg-destructive/10 rounded-lg mx-1"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
