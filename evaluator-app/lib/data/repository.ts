import {
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_PRODUCTS_EVIDENCE,
  MOCK_LAPSED_CASES,
} from "./mockData";
import { Customer, Order, ProductEvidence, LapsedCategoryCase } from "../types/data";

export function getAllCustomers(): Customer[] {
  return MOCK_CUSTOMERS;
}

export function getCustomerById(customerId: string): Customer | undefined {
  return MOCK_CUSTOMERS.find((c) => c.id === customerId);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return MOCK_ORDERS.filter((o) => o.customer_id === customerId);
}

export function getLapsedOrderForCustomer(customerId: string): Order | undefined {
  return MOCK_ORDERS.find(
    (o) => o.customer_id === customerId && o.is_lapsed_category_order
  );
}

export function getProductEvidence(productId: string): ProductEvidence | undefined {
  return MOCK_PRODUCTS_EVIDENCE[productId];
}

export function getLapsedCases(): LapsedCategoryCase[] {
  return MOCK_LAPSED_CASES;
}

export function getLapsedCaseById(caseId: string): LapsedCategoryCase | undefined {
  return MOCK_LAPSED_CASES.find((c) => c.id === caseId);
}
