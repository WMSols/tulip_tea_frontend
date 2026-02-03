import { Store, Phone, MapPin, CreditCard, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UiShop } from "../../types";
import { formatCurrency, capitalize } from "../../utils/formatters";
import {
  getShopBadgeStatus,
  getMapsLink,
  isBalanceOverdue,
} from "../../utils/helpers";

interface ViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shop: UiShop | null;
  onApprove: (shopId: number) => void;
  onReject: (shopId: number) => void;
}

export function ViewDialog({
  isOpen,
  onClose,
  shop,
  onApprove,
  onReject,
}: ViewDialogProps) {
  if (!shop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle>Shop Details</DialogTitle>
          <DialogDescription>View complete shop information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{shop.name}</h3>
              <p className="text-muted-foreground">{shop.ownerName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </p>
              <p className="font-medium">{shop.phone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </p>
              <a
                href={getMapsLink(shop.gps)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                View on Map
              </a>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Zone / Route</p>
              <p className="font-medium">
                {shop.zone} / {shop.routes.map((r) => r.name).join(", ") || "-"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge
                status={getShopBadgeStatus(shop.status)}
                label={capitalize(shop.status)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Credit Limit
              </p>
              <p className="font-medium">{formatCurrency(shop.creditLimit)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Outstanding Balance
              </p>
              <p
                className={`font-medium ${
                  isBalanceOverdue(shop.balance)
                    ? "text-destructive"
                    : "text-success"
                }`}
              >
                {formatCurrency(shop.balance)}
              </p>
            </div>
          </div>

          {shop.status === "pending" && (
            <div className="space-y-2 pt-4 border-t">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Image className="w-3 h-3" /> CNIC Verification
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">CNIC Front</p>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">CNIC Back</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {shop.status === "pending" ? (
            <>
              <Button
                variant="outline"
                onClick={() => onReject(shop.id)}
                className="text-destructive"
              >
                Reject
              </Button>
              <Button
                onClick={() => onApprove(shop.id)}
                className="bg-success text-success-foreground"
              >
                Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
