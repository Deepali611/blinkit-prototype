import { Customer, Order, NegativeSignal } from "../types/data";
import { getCustomerById, getOrdersByCustomerId, getAllCustomers } from "../data/repository";

export interface LapseDetectionResult {
  is_eligible: boolean;
  customer_id: string;
  category_id?: string;
  category_name?: string;
  lapsed_order_id?: string;
  product_id?: string;
  product_name?: string;
  days_since_order?: number;
  path_type: "PATH_A_KNOWN_SIGNAL" | "PATH_B_INFERRED_SIGNAL" | null;
  priority: "HIGH" | "MEDIUM" | "NONE";
  negative_signal: NegativeSignal | null;
  reason: string;
  is_holdout: boolean;
}

export function detectLapse(
  customer: Customer,
  orders: Order[],
  thresholdDays: number = 14
): LapseDetectionResult {
  if (!customer.is_lapsed_expander) {
    return {
      is_eligible: false,
      customer_id: customer.id,
      path_type: null,
      priority: "NONE",
      negative_signal: null,
      reason: "Customer profile does not meet Lapsed Category Expander criteria.",
      is_holdout: customer.holdout_group,
    };
  }

  const lapsedOrders = orders.filter((o) => o.is_lapsed_category_order);

  if (lapsedOrders.length === 0) {
    return {
      is_eligible: false,
      customer_id: customer.id,
      path_type: null,
      priority: "NONE",
      negative_signal: null,
      reason: "No single-purchase lapsed category orders found in customer order history.",
      is_holdout: customer.holdout_group,
    };
  }

  const primaryLapsedOrder = lapsedOrders[0];

  if (primaryLapsedOrder.days_ago < thresholdDays) {
    return {
      is_eligible: false,
      customer_id: customer.id,
      lapsed_order_id: primaryLapsedOrder.id,
      category_id: primaryLapsedOrder.category_id,
      category_name: primaryLapsedOrder.category_name,
      product_id: primaryLapsedOrder.product_id,
      product_name: primaryLapsedOrder.product_name,
      days_since_order: primaryLapsedOrder.days_ago,
      path_type: null,
      priority: "NONE",
      negative_signal: primaryLapsedOrder.negative_signal,
      reason: `Order is only ${primaryLapsedOrder.days_ago} days old (minimum threshold is ${thresholdDays} days).`,
      is_holdout: customer.holdout_group,
    };
  }

  const sameCategoryOrders = orders.filter(
    (o) => o.category_id === primaryLapsedOrder.category_id
  );

  if (sameCategoryOrders.length > 1) {
    return {
      is_eligible: false,
      customer_id: customer.id,
      lapsed_order_id: primaryLapsedOrder.id,
      category_id: primaryLapsedOrder.category_id,
      category_name: primaryLapsedOrder.category_name,
      product_id: primaryLapsedOrder.product_id,
      product_name: primaryLapsedOrder.product_name,
      days_since_order: primaryLapsedOrder.days_ago,
      path_type: null,
      priority: "NONE",
      negative_signal: primaryLapsedOrder.negative_signal,
      reason: `Customer has ${sameCategoryOrders.length} orders in ${primaryLapsedOrder.category_name} (repeat buyer, not lapsed single-order expander).`,
      is_holdout: customer.holdout_group,
    };
  }

  const negSignal = primaryLapsedOrder.negative_signal;
  const hasExplicitSignal = negSignal?.has_explicit_signal === true;

  if (hasExplicitSignal) {
    return {
      is_eligible: true,
      customer_id: customer.id,
      lapsed_order_id: primaryLapsedOrder.id,
      category_id: primaryLapsedOrder.category_id,
      category_name: primaryLapsedOrder.category_name,
      product_id: primaryLapsedOrder.product_id,
      product_name: primaryLapsedOrder.product_name,
      days_since_order: primaryLapsedOrder.days_ago,
      path_type: "PATH_A_KNOWN_SIGNAL",
      priority: "HIGH",
      negative_signal: negSignal,
      reason: `Eligible for Path A (Known Signal): Explicit negative signal recorded (${negSignal?.signal_type ?? "negative feedback"}).`,
      is_holdout: customer.holdout_group,
    };
  }

  return {
    is_eligible: true,
    customer_id: customer.id,
    lapsed_order_id: primaryLapsedOrder.id,
    category_id: primaryLapsedOrder.category_id,
    category_name: primaryLapsedOrder.category_name,
    product_id: primaryLapsedOrder.product_id,
    product_name: primaryLapsedOrder.product_name,
    days_since_order: primaryLapsedOrder.days_ago,
    path_type: "PATH_B_INFERRED_SIGNAL",
    priority: "MEDIUM",
    negative_signal: negSignal ?? null,
    reason: "Eligible for Path B (Inferred Signal): No explicit negative signal on record. Single purchase >14 days ago without repeat.",
    is_holdout: customer.holdout_group,
  };
}

export function detectLapseByCustomerId(
  customerId: string,
  thresholdDays: number = 14
): LapseDetectionResult {
  const customer = getCustomerById(customerId);
  if (!customer) {
    return {
      is_eligible: false,
      customer_id: customerId,
      path_type: null,
      priority: "NONE",
      negative_signal: null,
      reason: `Customer ID ${customerId} not found.`,
      is_holdout: false,
    };
  }
  const orders = getOrdersByCustomerId(customerId);
  return detectLapse(customer, orders, thresholdDays);
}

export function getEligibleLapsedExpanders(
  thresholdDays: number = 14
): LapseDetectionResult[] {
  const allCustomers = getAllCustomers();
  return allCustomers
    .map((c) => detectLapseByCustomerId(c.id, thresholdDays))
    .filter((res) => res.is_eligible);
}
