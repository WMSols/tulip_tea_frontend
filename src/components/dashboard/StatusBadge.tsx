import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
}

const statusStyles: Record<StatusType, string> = {
  success: "status-badge-success",
  warning: "status-badge-warning",
  danger: "status-badge-danger",
  info: "status-badge-info",
  neutral: "bg-muted text-muted-foreground",
};

const dotStyles: Record<StatusType, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span className={cn("status-badge", statusStyles[status])}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dotStyles[status])} />
      {label}
    </span>
  );
}
