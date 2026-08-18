import { Order } from "../domain/order.js";

/**
 * Temporary process-memory storage. PostgreSQL replaces this in the next milestone.
 */
const orders = new Map<string, Order>();

export function saveOrder(order: Order): boolean {
  if (orders.has(order.id)) return false;
  orders.set(order.id, order);
  return true;
}

export function findOrderById(id: string): Order | undefined {
  return orders.get(id);
}
