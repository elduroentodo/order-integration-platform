export interface Order {
  id: string;
  customerId: string;
  currency: "USD" | "COP";
  items: OrderItem[];
}

export interface OrderItem {
  sku: string;
  quantity: number;
}
