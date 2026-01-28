export interface CreditLimitRequest {
  id: number;
  shop_id: number;
  shop_name: string;
  requested_by_role: string;
  requested_by_id: number;
  old_credit_limit: number;
  requested_credit_limit: number;
  status: "pending" | "approved" | "rejected";
  approved_by_distributor: number | null;
  approved_at: string | null;
  remarks: string | null;
  created_at: string;
}

export interface UpdateCreditLimitRequest {
  requested_credit_limit: number;
  remarks?: string;
}

export interface ApproveRejectCreditLimitRequest {
  final_credit_limit?: number;
  remarks?: string;
}
