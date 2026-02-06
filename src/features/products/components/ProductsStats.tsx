import { Package, Eye, EyeOff } from "lucide-react";
import type { ProductStats } from "../types";

interface ProductsStatsProps {
  stats: ProductStats;
}

export default function ProductsStats({ stats }: ProductsStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Products</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Eye className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neutral/10">
            <EyeOff className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.inactive}</p>
            <p className="text-sm text-muted-foreground">Inactive</p>
          </div>
        </div>
      </div>
    </div>
  );
}
