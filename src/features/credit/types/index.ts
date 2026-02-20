import type {
  CreditLimitRequest,
  UpdateCreditLimitRequest,
  ApproveRejectCreditLimitRequest,
} from "@/types/creditLimit";

export type {
  CreditLimitRequest,
  UpdateCreditLimitRequest,
  ApproveRejectCreditLimitRequest,
};

export type CreditTab = "all" | "pending" | "approved" | "disapproved";

export type CreditActionType = "approve" | "disapproved";
