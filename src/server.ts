import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { findOrderById, saveOrder } from "./data/order-store.js";
import { validateOrder } from "./domain/validate-order.js";

const port = 3000;

const server = createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/health") {
    return sendJson(response, 200, { status: "ok" });
  }

  const orderId = request.url?.match(/^\/orders\/([^/]+)$/)?.[1];
  if (request.method === "GET" && orderId) {
    const order = findOrderById(orderId);
    return order
      ? sendJson(response, 200, { order })
      : sendJson(response, 404, { error: "Order not found." });
  }

  if (request.method === "POST" && request.url === "/orders") {
    try {
      const order = validateOrder(await readJsonBody(request));
      if (!saveOrder(order)) {
        return sendJson(response, 409, {
          error: "An order with this id already exists.",
          orderId: order.id
        });
      }
      console.log(`Accepted order ${order.id} for ${order.customerId}`);
      return sendJson(response, 201, { status: "accepted", order });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid request.";
      return sendJson(response, 400, { error: message });
    }
  }

  return sendJson(response, 404, { error: "Route not found." });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Order API listening at http://127.0.0.1:${port}`);
});

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  let rawBody = "";
  for await (const chunk of request) rawBody += chunk;
  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("Request body must contain valid JSON.");
  }
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}
