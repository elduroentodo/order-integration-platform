# Learning Notes

## API contracts

An API contract is an agreement between systems. Here, an order must have an ID, customer ID, currency, and at least one line item.

## Types and validation

TypeScript interfaces help developers while writing code, but an external HTTP request does not automatically follow those types. The API therefore receives `unknown` data and validates it at runtime.

## Idempotency

Networks can fail after a client sends an order but before it receives the response. The client may retry. Using the order ID as a unique key means the retry cannot create a second order.

## In-memory storage versus a database

A JavaScript `Map` stores records only while this server process is running. PostgreSQL will make the same information durable, queryable, and protected by database constraints.
