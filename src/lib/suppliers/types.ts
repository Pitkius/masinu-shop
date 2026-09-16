export type SupplierProductRecord = {
  supplierSku: string;
  title: string;
  costCents: number | null;
  stock: number | null;
  shippingTime: string | null;
  images: string[];
};

export type SupplierOrderInput = {
  items: { supplierSku: string; quantity: number }[];
  customerEmail: string;
};

export interface SupplierAdapter {
  id: string;
  getProducts(): Promise<SupplierProductRecord[]>;
  getProduct(sku: string): Promise<SupplierProductRecord | null>;
  checkStock(sku: string): Promise<number | null>;
  getPrice(sku: string): Promise<number | null>;
  createOrder(input: SupplierOrderInput): Promise<{ orderRef: string; status: string }>;
  getTracking(orderRef: string): Promise<{ carrier: string; code: string } | null>;
}

export function credentialsFromEnv(reference: string | null) {
  if (!reference) return null;
  const value = process.env[reference];
  return value ? { reference, present: true } : { reference, present: false };
}
