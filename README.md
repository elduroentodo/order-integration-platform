# Order Integration Platform

A TypeScript portfolio project that simulates the path of a wholesale order from a retailer to a warehouse.

## Operational problem

An external retailer may submit orders more than once when a network response fails. An integration service must validate incoming data, make duplicate requests safe, record what happened, and give the next system a consistent order format.

## Working flow

```text
Retailer / API client
  → POST /orders
  → JSON parsing + runtime validation
  → duplicate-ID protection
  → in-memory order store
  → HTTP response with an unambiguous status code
```

## Current API

| Method | Endpoint | Purpose | Expected response |
| --- | --- | --- | --- |
| `GET` | `/health` | Confirms the service is running. | `200 OK` |
| `POST` | `/orders` | Validates and stores a new order. | `201 Created` |
| `GET` | `/orders/:id` | Retrieves an order stored during the current server run. | `200 OK` or `404 Not Found` |

The API returns `400 Bad Request` for invalid JSON or invalid order data, and `409 Conflict` when a client resubmits an already-used order ID.

## Run locally

Requires Node.js 24+.

```bash
npm install
npm run check
npm run dev
```

In a second terminal:

```bash
curl -i -X POST http://127.0.0.1:3000/orders \
  -H 'content-type: application/json' \
  --data @examples/valid-order.json
```

Then retrieve it:

```bash
curl -i http://127.0.0.1:3000/orders/po-10001
```

## Key integration concepts

- **API contract:** A shared agreement on the JSON fields an order must contain.
- **Runtime validation:** External data is treated as `unknown` until it passes checks.
- **Idempotency:** Repeating an order submission with the same ID does not create a second record.
- **Status codes:** `201`, `400`, `404`, and `409` tell an API client precisely what happened.
- **Health endpoint:** A basic operational check for a person, deployment platform, or monitor.

## Current scope and next milestones

The current store is deliberately in memory, so it resets when the server restarts. That makes the initial API behavior visible before adding infrastructure.

Next milestones:

1. Replace in-memory storage with PostgreSQL and database constraints.
2. Add durable processing status, retries, and reconciliation.
3. Transform the normalized order for a simulated warehouse API.
4. Add tests, structured logs, and health/operational documentation.

## Portfolio talking point

> I designed an order-integration API around a clear contract, validation at the system boundary, idempotent order intake, and explicit HTTP outcomes. The project is being extended toward durable storage and event-driven warehouse delivery.

See [Learning Notes](LEARNING_NOTES.md) for a plain-language explanation of the concepts.
