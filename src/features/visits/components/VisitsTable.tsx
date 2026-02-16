import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { VisitRow } from "../types";
import { formatTimeOnly } from "../utils/formatters";
import {
  zoneLabel,
  getDeliveryBadgeStatus,
  getVisitDisplayTime,
  formatVisitTypeLabel,
  getVisitTypeBadgeStatus,
} from "../utils/helpers";

interface VisitsTableProps {
  data: VisitRow[];
  isLoading: boolean;
  onViewDetails: (row: VisitRow) => void;
  zoneMap?: Record<number, string>;
}

export function VisitsTable({
  data,
  isLoading,
  onViewDetails,
  zoneMap = {},
}: VisitsTableProps) {
  const columns = [
    {
      key: "time",
      label: "Time",
      sortable: true,
      render: (row: VisitRow) => {
        const iso = getVisitDisplayTime(row);
        return <span className="font-medium">{formatTimeOnly(iso)}</span>;
      },
    },
    {
      key: "staff",
      label: "Staff",
      sortable: true,
      render: (row: VisitRow) => {
        const name =
          row.kind === "shop_visit" ? row.staff_name : row.delivery_man_name;
        return <span>{name}</span>;
      },
    },
    {
      key: "type",
      label: "Type",
      render: (row: VisitRow) => {
        if (row.kind === "delivery") {
          return <StatusBadge status="success" label="Delivery" />;
        }
        if (row.visit_types.length === 0) {
          return <StatusBadge status="neutral" label="Shop Visit" />;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {row.visit_types.map((t) => (
              <StatusBadge
                key={t}
                status={getVisitTypeBadgeStatus(t)}
                label={formatVisitTypeLabel(t)}
              />
            ))}
          </div>
        );
      },
    },
    {
      key: "shop",
      label: "Shop",
      render: (row: VisitRow) => (
        <span className="font-medium text-foreground">{row.shop_name}</span>
      ),
    },
    {
      key: "zone",
      label: "Zone",
      className: "hidden lg:table-cell",
      render: (row: VisitRow) => (
        <StatusBadge
          status="neutral"
          label={zoneMap[row.shop_zone_id] || zoneLabel(row.shop_zone_id)}
        />
      ),
    },
    {
      key: "order_id",
      label: "Order",
      render: (row: VisitRow) => {
        const orderId = row.kind === "delivery" ? row.order_id : row.order_id;
        return orderId ? (
          <span className="font-medium">#{orderId}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (row: VisitRow) => {
        if (row.kind === "delivery") {
          const badgeStatus = getDeliveryBadgeStatus(row.status);
          return <StatusBadge status={badgeStatus as any} label={row.status} />;
        }

        return row.order_id ? (
          <StatusBadge status="success" label="Order Created" />
        ) : (
          <StatusBadge status="neutral" label="Visited" />
        );
      },
    },
  ];

  return (
    <DataTable
      data={isLoading ? [] : data}
      columns={columns}
      actions={(row: VisitRow) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(row)}
            className="text-muted-foreground hover:text-primary"
            aria-label="View details"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )}
    />
  );
}
