import { Warehouse as WarehouseIcon, Users, MapPin } from "lucide-react";
import type { WarehouseStats } from "../types";

interface WarehousesStatsProps {
  stats: WarehouseStats;
}

export default function WarehousesStats({ stats }: WarehousesStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <WarehouseIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Warehouses</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Users className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Users className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-info/10">
            <MapPin className="w-5 h-5 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.zones}</p>
            <p className="text-sm text-muted-foreground">Zones</p>
          </div>
        </div>
      </div>
    </div>
  );
}
