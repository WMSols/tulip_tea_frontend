import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatDateTime } from "../../utils/formatters";
import { getDeliveryManName } from "../../utils/formatters";
import type { WarehouseDeliveryMan, DeliveryMan } from "../../types";

interface DeliveryMenSectionProps {
  assignedDeliveryMen: WarehouseDeliveryMan[];
  availableDeliveryMen: DeliveryMan[];
  assignDeliveryManId: string;
  isAssignedFetching: boolean;
  isAssigning: boolean;
  isRemoving: boolean;
  onAssignIdChange: (id: string) => void;
  onAssign: () => void;
  onRequestRemove: (dm: WarehouseDeliveryMan) => void;
}

export default function DeliveryMenSection({
  assignedDeliveryMen,
  availableDeliveryMen,
  assignDeliveryManId,
  isAssignedFetching,
  isAssigning,
  isRemoving,
  onAssignIdChange,
  onAssign,
  onRequestRemove,
}: DeliveryMenSectionProps) {
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Delivery Staff
        </div>
        <div className="text-xs text-muted-foreground">
          {isAssignedFetching
            ? "Refreshing..."
            : `${assignedDeliveryMen.length} assigned`}
        </div>
      </div>

      {/* Assign new delivery man */}
      <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
        <div className="space-y-2">
          <Label>Assign Delivery Man</Label>
          <Select value={assignDeliveryManId} onValueChange={onAssignIdChange}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select delivery man" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {availableDeliveryMen.map((dm) => (
                <SelectItem key={dm.id} value={String(dm.id)}>
                  {getDeliveryManName(dm)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          disabled={!assignDeliveryManId || isAssigning}
          onClick={onAssign}
          className="bg-primary text-primary-foreground"
        >
          {isAssigning ? "Assigning..." : "Assign"}
        </Button>
      </div>

      {/* List of assigned delivery men */}
      <div className="mt-4 space-y-2">
        <Label>Assigned Delivery Men</Label>

        {assignedDeliveryMen.length === 0 ? (
          <div className="text-sm text-muted-foreground italic">
            None assigned
          </div>
        ) : (
          <div className="space-y-2">
            {assignedDeliveryMen.map((dm) => (
              <div
                key={dm.id}
                className="p-3 rounded-lg border border-border bg-background/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status="success" label={dm.name} />
                    <span className="text-xs text-muted-foreground">
                      ID: {dm.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Zone: {dm.zone_id}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Phone: {dm.phone} • Assigned:{" "}
                    {formatDateTime(dm.assigned_at)}
                  </div>
                </div>

                <Button
                  variant="outline"
                  disabled={isRemoving}
                  onClick={() => onRequestRemove(dm)}
                  className="sm:self-center"
                >
                  {isRemoving ? "Removing..." : "Remove"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
