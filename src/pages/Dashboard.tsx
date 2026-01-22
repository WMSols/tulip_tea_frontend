import {
  MapPin,
  Route,
  Users,
  Store,
  TrendingUp,
  Package,
  CreditCard,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const recentActivities = [
  {
    id: 1,
    type: "shop",
    message: "New shop registration: Gulshan Tea Corner",
    time: "5 min ago",
    status: "pending" as const,
  },
  {
    id: 2,
    type: "credit",
    message: "Credit request approved: Ahmed Traders - ₨25,000",
    time: "1 hour ago",
    status: "success" as const,
  },
  {
    id: 3,
    type: "delivery",
    message: "Delivery completed: Route R-001, 15 shops",
    time: "2 hours ago",
    status: "success" as const,
  },
  {
    id: 4,
    type: "inventory",
    message: "Low stock alert: Premium Green Tea",
    time: "3 hours ago",
    status: "warning" as const,
  },
  {
    id: 5,
    type: "visit",
    message: "Field visit logged: Order Booker Ali Hassan",
    time: "4 hours ago",
    status: "success" as const,
  },
];

const topShops = [
  {
    id: 1,
    name: "Karachi Tea Emporium",
    zone: "Zone A",
    orders: 156,
    revenue: "₨245,000",
  },
  {
    id: 2,
    name: "Ali's Tea House",
    zone: "Zone B",
    orders: 132,
    revenue: "₨198,000",
  },
  {
    id: 3,
    name: "Green Leaf Store",
    zone: "Zone A",
    orders: 118,
    revenue: "₨176,500",
  },
  {
    id: 4,
    name: "Premium Tea Corner",
    zone: "Zone C",
    orders: 105,
    revenue: "₨157,000",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Zones"
          value={12}
          change="+2 this month"
          changeType="positive"
          icon={MapPin}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Active Routes"
          value={48}
          change="+5 this week"
          changeType="positive"
          icon={Route}
          iconColor="bg-info/10 text-info"
        />
        <StatCard
          title="Registered Shops"
          value={324}
          change="+18 pending"
          changeType="neutral"
          icon={Store}
          iconColor="bg-accent/10 text-accent"
        />
        <StatCard
          title="Staff Members"
          value={56}
          change="45 active today"
          changeType="neutral"
          icon={Users}
          iconColor="bg-success/10 text-success"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value="₨485,000"
          change="+12.5% vs yesterday"
          changeType="positive"
          icon={TrendingUp}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Pending Credits"
          value="₨125,000"
          change="8 requests"
          changeType="neutral"
          icon={CreditCard}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Products in Stock"
          value={156}
          change="3 low stock"
          changeType="negative"
          icon={Package}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Today's Visits"
          value={89}
          change="+15 vs avg"
          changeType="positive"
          icon={ClipboardCheck}
          iconColor="bg-info/10 text-info"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="stat-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-accent"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <div className="w-8 h-8 min-w-[2rem] rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {activity.type === "shop" && (
                    <Store className="w-4 h-4 text-primary" />
                  )}
                  {activity.type === "credit" && (
                    <CreditCard className="w-4 h-4 text-secondary-foreground" />
                  )}
                  {activity.type === "delivery" && (
                    <Package className="w-4 h-4 text-success" />
                  )}
                  {activity.type === "inventory" && (
                    <Package className="w-4 h-4 text-warning" />
                  )}
                  {activity.type === "visit" && (
                    <ClipboardCheck className="w-4 h-4 text-info" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <StatusBadge
                  status={
                    activity.status === "pending"
                      ? "warning"
                      : activity.status === "success"
                        ? "success"
                        : "warning"
                  }
                  label={
                    activity.status === "pending"
                      ? "Pending"
                      : activity.status === "success"
                        ? "Done"
                        : "Alert"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="stat-card">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/zones">
              <Button
                variant="outline"
                className="w-full h-20 flex-col gap-2 hover:bg-accent hover:text-primary hover:border-primary/30 transition-all duration-200 rounded-xl"
              >
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-medium">Add Zone</span>
              </Button>
            </Link>
            <Link to="/routes">
              <Button
                variant="outline"
                className="w-full h-20 flex-col gap-2 hover:bg-accent hover:text-primary hover:border-primary/30 transition-all duration-200 rounded-xl"
              >
                <Route className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-medium">Add Route</span>
              </Button>
            </Link>
            <Link to="/staff">
              <Button
                variant="outline"
                className="w-full h-20 flex-col gap-2 hover:bg-accent hover:text-primary hover:border-primary/30 transition-all duration-200 rounded-xl"
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-medium">Add Staff</span>
              </Button>
            </Link>
            <Link to="/shops">
              <Button
                variant="outline"
                className="w-full h-20 flex-col gap-2 hover:bg-accent hover:text-primary hover:border-primary/30 transition-all duration-200 rounded-xl"
              >
                <Store className="w-5 h-5 flex-shrink-0" />
                <span className="text-xs font-medium">View Shops</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Performing Shops */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Top Performing Shops
          </h2>
          <Link to="/shops">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-accent"
            >
              View All
            </Button>
          </Link>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="data-table">
            <thead className="bg-muted/30">
              <tr>
                <th>Shop Name</th>
                <th>Zone</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {topShops.map((shop, index) => (
                <tr key={shop.id}>
                  <td className="font-medium">{shop.name}</td>
                  <td>
                    <StatusBadge status="info" label={shop.zone} />
                  </td>
                  <td>{shop.orders}</td>
                  <td className="font-medium text-primary">{shop.revenue}</td>
                  <td>
                    {index < 2 ? (
                      <span className="flex items-center gap-1 text-success text-sm">
                        <ArrowUpRight className="w-4 h-4" />
                        +12%
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive text-sm">
                        <ArrowDownRight className="w-4 h-4" />
                        -3%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-3">
          {topShops.map((shop, index) => (
            <div key={shop.id} className="p-4 rounded-lg bg-muted/20 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-foreground">{shop.name}</p>
                  <StatusBadge status="info" label={shop.zone} />
                </div>
                {index < 2 ? (
                  <span className="flex items-center gap-1 text-success text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    +12%
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-destructive text-sm">
                    <ArrowDownRight className="w-4 h-4" />
                    -3%
                  </span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Orders: {shop.orders}
                </span>
                <span className="font-medium text-primary">{shop.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
