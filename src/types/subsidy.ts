/** Order item within a subsidy/pending-approval order */
export interface SubsidyOrderItemDto {
  id: number;
  order_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export type SubsidyStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | (string & {});

/** Order from GET /orders/pending-subsidy-approval */
export interface PendingSubsidyOrderDto {
  id: number;
  shop_id: number;
  shop_name: string;
  order_booker_id: number | null;
  order_booker_name: string | null;
  distributor_id: number;
  delivery_man_id: number | null;
  delivery_man_name: string | null;
  visit_id: number | null;
  total_amount: number;
  status: string;
  scheduled_date: string | null;
  order_items: SubsidyOrderItemDto[];
  delivery_remarks: string | null;
  delivery_images: string[];
  created_at: string;
  updated_at: string | null;
  calculated_total_amount: number;
  final_total_amount: number;
  subsidy_status: SubsidyStatus;
  subsidy_approved_by: string | null;
  subsidy_approved_at: string | null;
  subsidy_rejection_reason: string | null;
  order_resolution_type: string | null;
  subsidy_id: number | null;
  subsidy_info: unknown | null;
  original_amount: number;
  payment_collected_before_delivery: boolean;
  payment_collected_amount: number | null;
  payment_collected_at: string | null;
}

/** Body for PUT /orders/{order_id}/reject-subsidy */
export interface RejectSubsidyRequest {
  subsidy_rejection_reason: string;
}
