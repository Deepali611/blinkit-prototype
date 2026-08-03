export type FailureType =
  | "quality_expiry"
  | "lack_of_reviews"
  | "unresolved_support"
  | "high_value_hesitation";

export type SignalType = "return" | "low_rating" | "support_ticket" | null;

export interface NegativeSignal {
  has_explicit_signal: boolean;
  signal_type: SignalType;
  rating?: number | null;
  support_ticket_status?: "unresolved" | "resolved" | "closed" | null;
  notes?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  usual_categories: string[];
  is_lapsed_expander: boolean;
  holdout_group: boolean;
}

export interface Order {
  id: string;
  customer_id: string;
  product_id: string;
  category_id: string;
  category_name: string;
  product_name: string;
  product_image?: string;
  order_date: string;
  days_ago: number;
  quantity: number;
  price: number;
  is_lapsed_category_order: boolean;
  negative_signal: NegativeSignal | null;
}

export interface ExpiryVerificationData {
  verified_batch: boolean;
  shelf_life_guarantee: string;
  latest_qc_timestamp: string;
  batch_number: string;
}

export interface ReplacementGuarantee {
  hours: number;
  policy_text: string;
  instant_refund_eligible: boolean;
}

export interface ProductEvidence {
  product_id: string;
  category_id: string;
  product_name: string;
  category_name: string;
  brand_name: string;
  reorder_rate: number;
  return_rate: number;
  seller_consistency_score: number;
  seller_name: string;
  seller_rating: number;
  average_rating: number;
  review_count: number;
  aggregate_review_themes: string[];
  expiry_verification_data: ExpiryVerificationData;
  replacement_guarantee: ReplacementGuarantee;
}

export interface LapsedCategoryCase {
  id: string;
  customer: Customer;
  lapsed_order: Order;
  product_evidence: ProductEvidence;
  path_type: "PATH_A_KNOWN_SIGNAL" | "PATH_B_INFERRED_SIGNAL";
  probable_failure_type: FailureType;
}
