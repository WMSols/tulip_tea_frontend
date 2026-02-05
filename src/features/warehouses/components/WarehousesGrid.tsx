import { Warehouse as WarehouseIcon, MapPin, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "../utils/formatters";
import { getWarehouseStatusVariant, getWarehouseStatusLabel } from "../utils/helpers";
import type { Warehouse } from "../types";

interface WarehousesGridProps {
  warehouses: Warehouse[];
  isLoading: boolean;
  onManage: (warehouse: Warehouse) => void;
}

export default function WarehousesGrid({
  warehouses,
  isLoading,
  onManage,
}: WarehousesGridProps) {
  if (isLoading) {
    return <div className="text-muted-foreground">Loading warehouses...</div>;
  }

  if (warehouses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No warehouses found. Create your first warehouse to get started.
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {warehouses.map((warehouse) => (
        <div key={warehouse.id} className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <WarehouseIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {warehouse.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {warehouse.address}
                </p>

                <div className="flex flex-wrap gap-1 mt-2">
                  <StatusBadge status="info" label={`Zone #${warehouse.zone_id}`} />
                  <StatusBadge
                    status={getWarehouseStatusVariant(warehouse.is_active)}
                    label={getWarehouseStatusLabel(warehouse.is_active)}
                  />
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onManage(warehouse)}
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Created: {formatDate(warehouse.created_at)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => onManage(warehouse)}
            >
              Manage
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
