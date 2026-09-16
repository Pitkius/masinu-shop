import { allProducts } from "@/lib/catalog";
import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(20) })).min(1),
});

export function quoteItems(items: { productId: string; quantity: number }[]) {
  const lines = items.map((item) => {
    const product = allProducts().find((entry) => entry.id === item.productId);
    if (!product) throw new Error(`Unknown product ${item.productId}`);
    if (product.stock < item.quantity) {
      return { ok: false as const, product, requested: item.quantity };
    }
    return {
      ok: true as const,
      productId: product.id,
      title: product.title,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal: product.price * item.quantity,
      shipping: product.shipping.costCents,
      stock: product.stock,
    };
  });

  const failed = lines.find((line) => !line.ok);
  if (failed && !failed.ok) {
    return { ok: false as const, reason: "STOCK", productId: failed.product.id };
  }

  const valid = lines.filter((line) => line.ok);
  const subtotal = valid.reduce((sum, line) => sum + line.lineTotal, 0);
  const shipping = valid.reduce((max, line) => Math.max(max, line.shipping), 0);
  return {
    ok: true as const,
    items: valid,
    subtotal,
    shipping,
    total: subtotal + shipping,
    currency: "EUR",
  };
}
