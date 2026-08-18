import { Order } from "./order.js";

/**
 * Turns untrusted external input into a safe Order, or explains what is invalid.
 */
export function validateOrder(input: unknown): Order {
  if (!isRecord(input)) throw new Error("Order body must be a JSON object.");
  if (typeof input.id !== "string" || input.id.length === 0) {
    throw new Error("Order id must be a non-empty string.");
  }
  if (typeof input.customerId !== "string" || input.customerId.length === 0) {
    throw new Error("customerId must be a non-empty string.");
  }
  if (input.currency !== "USD" && input.currency !== "COP") {
    throw new Error("currency must be USD or COP.");
  }
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error("items must contain at least one line item.");
  }

  const items = input.items.map((item, index) => {
    if (!isRecord(item) || typeof item.sku !== "string" || item.sku.length === 0) {
      throw new Error(`items[${index}].sku must be a non-empty string.`);
    }
    if (typeof item.quantity !== "number" || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error(`items[${index}].quantity must be a positive whole number.`);
    }
    return { sku: item.sku, quantity: item.quantity };
  });

  return { id: input.id, customerId: input.customerId, currency: input.currency, items };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
