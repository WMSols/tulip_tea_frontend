import { Eye, CheckCircle, XCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { UiShop } from "../types";
import { formatCurrency } from "../utils/formatters";
import { getShopBadgeStatus, isBalanceOverdue } from "../utils/helpers";
import { capitalize } from "../utils/formatters";

interface ShopsTableProps {
  data: UiShop[];
  isLoading: boolean;
  isVerifying: boolean;
  onView: (shop: UiShop) => void;
  onApprove: (shopId: number) => void;
  onReject: (shopId: number) => void;
  onReassign: (shop: UiShop) => void;
}

export function ShopsTable({
  data,
  isLoading,
  isVerifying,
  onView,
  onApprove,
  onReject,
  onReassign,
}: ShopsTableProps) {
  const columns = [
    { key: "name", label: "Shop Name", sortable: true },
    { key: "ownerName", label: "Owner" },
    { key: "phone", label: "Phone", className: "hidden md:table-cell" },
    {
      key: "zone",
      label: "Zone",
      render: (shop: UiShop) => <StatusBadge status="info" label={shop.zone} />,
    },
    {
      key: "routes",
      label: "Routes",
      className: "hidden lg:table-cell",
      render: (shop: UiShop) => {
        if (!shop.routes.length) return "-";

        return (
          <div className="flex flex-wrap gap-1">
            {shop.routes
              .sort((a, b) => a.sequence - b.sequence)
              .map((route) => (
                <span
                  key={route.id}
                  className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700"
                >
                  {route.name}
                </span>
              ))}
          </div>
        );
      },
    },
    {
      key: "balance",
      label: "Balance",
      render: (shop: UiShop) => (
        <span
          className={
            isBalanceOverdue(shop.balance)
              ? "text-destructive font-medium"
              : "text-success font-medium"
          }
        >
          {formatCurrency(shop.balance)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (shop: UiShop) => (
        <StatusBadge
          status={getShopBadgeStatus(shop.status)}
          label={capitalize(shop.status)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      actions={(shop: UiShop) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onView(shop)}>
            <Eye className="w-4 h-4" />
          </Button>

          {shop.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                disabled={isVerifying}
                onClick={() => onApprove(shop.id)}
              >
                {isVerifying ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-success border-t-transparent" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                disabled={isVerifying}
                onClick={() => onReject(shop.id)}
              >
                {isVerifying ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
              </Button>
            </>
          )}

          {shop.status === "active" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onReassign(shop)}
            >
              <Users className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    />
  );
}
