import { formatCurrencyCompact } from "../utils/formatters";

interface ShopsStatsProps {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  totalOutstanding: number;
}

export function ShopsStats({
  totalCount,
  activeCount,
  pendingCount,
  totalOutstanding,
}: ShopsStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="stat-card">
        <p className="text-2xl font-bold">{totalCount}</p>
        <p className="text-sm text-muted-foreground">Total Shops</p>
      </div>
      <div className="stat-card">
        <p className="text-2xl font-bold">{activeCount}</p>
        <p className="text-sm text-muted-foreground">Active</p>
      </div>
      <div className="stat-card">
        <p className="text-2xl font-bold">{pendingCount}</p>
        <p className="text-sm text-muted-foreground">Pending</p>
      </div>
      <div className="stat-card">
        <p className="text-2xl font-bold">
          {formatCurrencyCompact(totalOutstanding)}
        </p>
        <p className="text-sm text-muted-foreground">Outstanding</p>
      </div>
    </div>
  );
}
