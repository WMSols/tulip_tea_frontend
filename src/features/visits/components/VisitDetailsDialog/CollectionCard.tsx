import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { DailyCollectionDto } from "@/types/visits";
import { formatDateTime } from "../../utils/formatters";

interface CollectionCardProps {
  collection: DailyCollectionDto;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Daily Collection</p>
          <p className="font-semibold text-foreground leading-6">
            Collection #{collection.id}
          </p>
          <p className="text-xs text-muted-foreground">
            Order{" "}
            <span className="font-medium tabular-nums text-foreground">
              #{collection.order_id}
            </span>
            {" · "}
            {collection.shop_name}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2">
          <StatusBadge status="neutral" label={collection.status} />
          <span className="text-sm font-semibold tabular-nums">
            {collection.amount}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="rounded-lg border border-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground w-36">
                  Collection Date
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {formatDateTime(collection.collection_date)}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">
                  Order Booker
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {collection.order_booker_name}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">
                  Delivery Man
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {collection.delivery_man_name}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">Amount</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {collection.amount}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">
                  Outstanding Balance
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {collection.shop_outstanding_balance}
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="px-3 py-2 text-muted-foreground">
                  Credit Limit
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {collection.shop_credit_limit}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 text-muted-foreground">
                  Available Credit
                </td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">
                  {collection.shop_available_credit}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {collection.photo_proof && (
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-2">Photo proof</p>
            <img
              src={collection.photo_proof}
              alt="Collection proof"
              className="rounded-lg border border-border max-h-40 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
