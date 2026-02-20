import { Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CREDIT_TABS } from "../utils/constants";
import type { CreditLimitRequest, CreditTab } from "../types";

interface CreditTableProps {
  activeTab: CreditTab;
  onTabChange: (tab: CreditTab) => void;
  filteredRequests: CreditLimitRequest[];
  pendingCount: number;
  onViewRemarks: (remarks: string, shopName: string) => void;
  onEdit: (request: CreditLimitRequest) => void;
  onApprove: (request: CreditLimitRequest) => void;
  onReject: (request: CreditLimitRequest) => void;
  onDelete: (request: CreditLimitRequest) => void;
}

export default function CreditTable({
  activeTab,
  onTabChange,
  filteredRequests,
  pendingCount,
  onViewRemarks,
  onEdit,
  onApprove,
  onReject,
  onDelete,
}: CreditTableProps) {
  const columns = [
    { key: "shop_name", label: "Shop" },
    {
      key: "old_credit_limit",
      label: "Current",
      render: (r: CreditLimitRequest) =>
        `₨${r.old_credit_limit.toLocaleString()}`,
    },
    {
      key: "requested_credit_limit",
      label: "Requested",
      render: (r: CreditLimitRequest) => (
        <span className="text-primary font-medium">
          ₨{r.requested_credit_limit.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (r: CreditLimitRequest) => (
        <StatusBadge
          status={
            r.status === "approved"
              ? "success"
              : r.status === "pending"
                ? "warning"
                : "danger"
          }
          label={r.status.toUpperCase()}
        />
      ),
    },
    {
      key: "remarks",
      label: "Remarks",
      render: (r: CreditLimitRequest) => {
        if (r.status === "pending") {
          return <span className="text-muted-foreground">-</span>;
        }
        if (!r.remarks) {
          return (
            <span className="text-muted-foreground text-sm">No remarks</span>
          );
        }
        return (
          <div className="flex items-center justify-between w-[220px]">
            <span className="text-sm truncate pr-2">{r.remarks}</span>
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0"
              onClick={() => onViewRemarks(r.remarks || "", r.shop_name)}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as CreditTab)}
      >
        <TabsList>
          {CREDIT_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label === "Pending" && pendingCount > 0
                ? `Pending (${pendingCount})`
                : tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DataTable
        data={filteredRequests}
        columns={columns}
        actions={(request) => {
          const isPendingOrApproved =
            request.status === "pending" || request.status === "approved";
          const isDisapproved = request.status === "disapproved";
          if (!isPendingOrApproved && !isDisapproved) return null;
          return (
            <div className="flex gap-2">
              {isPendingOrApproved && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(request)}
                    title="Edit Request"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  {request.status === "pending" && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onApprove(request)}
                      >
                        <CheckCircle className="w-4 h-4 text-success" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onReject(request)}
                      >
                        <XCircle className="w-4 h-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </>
              )}
              {isDisapproved && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(request)}
                  title="Delete request"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        }}
      />
    </>
  );
}
