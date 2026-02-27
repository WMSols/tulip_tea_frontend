import { Store, Phone, MapPin, CreditCard, Image, UserCheck, Wallet, Building2, User } from "lucide-react";
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
  onReject: (shop: UiShop) => void;
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
      <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Shop Details</DialogTitle>
          <DialogDescription>View complete shop information</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 overflow-y-auto max-h-[65vh] pr-1">
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

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Assigned Order Booker
              </p>
              <p className="font-medium">
                {shop.assignedOrderBookerName || (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Wallet className="w-3 h-3" /> Available Credit
              </p>
              <p
                className={`font-medium ${
                  shop.creditLimit - shop.balance <= 0
                    ? "text-destructive"
                    : "text-success"
                }`}
              >
                {formatCurrency(Math.max(shop.creditLimit - shop.balance, 0))}
              </p>
            </div>
          </div>

          {shop.status === "pending" && (
            <div className="space-y-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Image className="w-3 h-3" /> CNIC Verification
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Front</p>
                  {shop.cnicFrontPhoto ? (
                    <a href={shop.cnicFrontPhoto} target="_blank" rel="noopener noreferrer">
                      <img
                        src={shop.cnicFrontPhoto}
                        alt="CNIC Front"
                        className="aspect-video w-full object-cover rounded-lg border border-border hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    </a>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Not provided</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">Back</p>
                  {shop.cnicBackPhoto ? (
                    <a href={shop.cnicBackPhoto} target="_blank" rel="noopener noreferrer">
                      <img
                        src={shop.cnicBackPhoto}
                        alt="CNIC Back"
                        className="aspect-video w-full object-cover rounded-lg border border-border hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    </a>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Not provided</p>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground flex items-center gap-1 pt-2">
                <Building2 className="w-3 h-3" /> Shop Exterior
              </p>
              <div className="space-y-1.5">
                {shop.shopExteriorPhoto ? (
                  <a href={shop.shopExteriorPhoto} target="_blank" rel="noopener noreferrer">
                    <img
                      src={shop.shopExteriorPhoto}
                      alt="Shop Exterior"
                      className="aspect-video w-full object-cover rounded-lg border border-border hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </a>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Not provided</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground flex items-center gap-1 pt-2">
                <User className="w-3 h-3" /> Owner Photo
              </p>
              <div className="space-y-1.5">
                {shop.ownerPhoto ? (
                  <a href={shop.ownerPhoto} target="_blank" rel="noopener noreferrer">
                    <img
                      src={shop.ownerPhoto}
                      alt="Owner"
                      className="aspect-video w-full object-cover rounded-lg border border-border hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  </a>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Not provided</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {shop.status === "pending" ? (
            <>
              <Button
                variant="outline"
                onClick={() => onReject(shop)}
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
