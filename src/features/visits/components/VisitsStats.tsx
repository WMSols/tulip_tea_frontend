import { ClipboardCheck, Package } from "lucide-react";

interface VisitsStatsProps {
  totalCount: number;
  orderBookingCount: number;
  deliveriesCount: number;
}

export function VisitsStats({
  totalCount,
  orderBookingCount,
  deliveriesCount,
}: VisitsStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ClipboardCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-sm text-muted-foreground">Total Records</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-info/10">
            <Package className="w-5 h-5 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">{orderBookingCount}</p>
            <p className="text-sm text-muted-foreground">
              Order Booking Visits
            </p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <ClipboardCheck className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{deliveriesCount}</p>
            <p className="text-sm text-muted-foreground">Deliveries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
