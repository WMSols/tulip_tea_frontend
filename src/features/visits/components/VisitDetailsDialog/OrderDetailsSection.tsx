import type { OrderDto } from "@/types/visits";

interface OrderDetailsSectionProps {
  orderId: number | null;
  orderData: OrderDto | undefined;
  isOrderFetching: boolean;
  isOrderError: boolean;
}

export function OrderDetailsSection({
  orderId,
  orderData,
  isOrderFetching,
  isOrderError,
}: OrderDetailsSectionProps) {
  if (!orderId) return null;

  const order: OrderDto | undefined =
    orderData && orderData.id === orderId ? orderData : undefined;

  return (
    <div className="p-4 rounded-lg bg-muted/30 space-y-2">
      <p className="text-sm text-muted-foreground">Order Details</p>

      {isOrderFetching && (
        <p className="text-sm text-muted-foreground">Loading order...</p>
      )}
      {isOrderError && (
        <p className="text-sm text-destructive">Failed to load order.</p>
      )}

      {order && (
        <>
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-medium">#{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium">{order.status}</span>
          </div>

          {/* Items Table */}
          <div className="space-y-2 pt-2">
            <p className="text-sm text-muted-foreground">Items</p>

            <div className="rounded-lg border border-border overflow-hidden bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Product</th>
                    <th className="px-3 py-2 text-right font-medium">Qty</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Unit Price
                    </th>
                    <th className="px-3 py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.order_items.length === 0 ? (
                    <tr className="border-t border-border">
                      <td
                        colSpan={4}
                        className="px-3 py-3 text-center text-muted-foreground"
                      >
                        No items
                      </td>
                    </tr>
                  ) : (
                    order.order_items.map((it) => (
                      <tr key={it.id} className="border-t border-border">
                        <td className="px-3 py-2">
                          <div className="truncate">{it.product_name}</div>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {it.quantity}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {it.unit_price}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-medium">
                          {it.total_price}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot>
                  <tr className="border-t border-border bg-muted/20">
                    <td
                      colSpan={3}
                      className="px-3 py-2 text-right font-medium"
                    >
                      Grand Total
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-semibold">
                      {order.total_amount}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
