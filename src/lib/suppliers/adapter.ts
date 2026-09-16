import { allProducts } from "@/lib/catalog";
import { suppliers } from "@/data/suppliers";
import type { SupplierAdapter, SupplierProductRecord } from "./types";

function productsFor(supplierId: string): SupplierProductRecord[] {
  return allProducts()
    .filter((product) => product.supplierId === supplierId && product.supplierSku)
    .map((product) => ({
      supplierSku: product.supplierSku as string,
      title: product.title,
      costCents: Math.round(product.price * 0.62),
      stock: product.stock,
      shippingTime: `${product.shipping.timeFromDays}-${product.shipping.timeToDays} days`,
      images: product.images,
    }));
}

export class MockSupplierAdapter implements SupplierAdapter {
  constructor(public id: string) {}

  async getProducts() {
    return productsFor(this.id);
  }

  async getProduct(sku: string) {
    return productsFor(this.id).find((item) => item.supplierSku === sku) ?? null;
  }

  async checkStock(sku: string) {
    return (await this.getProduct(sku))?.stock ?? null;
  }

  async getPrice(sku: string) {
    return (await this.getProduct(sku))?.costCents ?? null;
  }

  async createOrder(input: { items: { supplierSku: string; quantity: number }[]; customerEmail: string }) {
    if (!input.items.length) throw new Error("Order has no items");
    return { orderRef: `MOCK-${this.id}-${Date.now()}`, status: "ACCEPTED_MOCK" };
  }

  async getTracking() {
    return null;
  }
}

const registry = new Map<string, SupplierAdapter>();

export function getSupplierAdapter(id: string): SupplierAdapter | null {
  const existing = registry.get(id);
  if (existing) return existing;
  const record = suppliers.find((item) => item.id === id);
  if (!record) return null;
  const adapter = new MockSupplierAdapter(record.id);
  registry.set(id, adapter);
  return adapter;
}

export function listSupplierAdapters() {
  return suppliers.map((item) => getSupplierAdapter(item.id)).filter((item): item is SupplierAdapter => Boolean(item));
}
