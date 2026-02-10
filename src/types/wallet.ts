export interface WalletBalance {
  wallet_id: number;
  user_type: string;
  user_id: number;
  current_balance: number;
  is_active: boolean;
}

export interface TeamWallet {
  wallet_id: number;
  user_type: string;
  user_id: number;
  user_name: string;
  user_phone: string;
  current_balance: number;
  is_active: boolean;
  created_at: string;
}

export interface CollectionTrail {
  transaction_id: number;
  collection_id: number;
  shop_id: number;
  shop_name: string;
  shop_owner: string;
  route_id: number;
  route_name: string;
  zone_id: number;
  zone_name: string;
  collection_amount: number;
  collection_date: string;
  status: string;
}

export interface WalletTransaction {
  id: number;
  transaction_type: string;
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference_type: string;
  reference_id: number;
  initiated_by_type: string;
  initiated_by_id: number;
  related_wallet_id: number;
  metadata: Record<string, unknown>;
  created_at: string;
  collection_trails?: CollectionTrail[];
  trail_count?: number;
  shop_name?: string;
  shop_id?: number;
  shop_owner?: string;
  route_id?: number;
  route_name?: string;
  zone_id?: number;
  zone_name?: string;
  initiated_by_name?: string;
  related_user_type?: string;
  related_user_id?: number;
  related_user_name?: string;
}

export interface CollectRequest {
  from_user_type: string;
  from_user_id: number;
  amount: number;
  description: string;
  metadata: Record<string, unknown>;
}
