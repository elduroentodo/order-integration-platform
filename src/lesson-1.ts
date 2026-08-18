import { validateOrder } from "./domain/validate-order.js";

const incomingOrder: unknown = {
  id: "po-10001",
  customerId: "retailer-northstar",
  currency: "USD",
  items: [{ sku: "JEDI-ROBE-BROWN-M", quantity: 2 }]
};

console.log(JSON.stringify(validateOrder(incomingOrder), null, 2));
