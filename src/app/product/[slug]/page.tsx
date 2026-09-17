import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { shopProducts } from "@/lib/shop-catalog";
import { allReviews, relatedProducts, setupProducts } from "@/lib/catalog";
import { ProductView } from "@/components/product/ProductView";

export function generateStaticParams() {
  return shopProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: { canonical: `/product/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.seoDescription,
    sku: product.sku,
    mpn: product.mpn,
    brand: { "@type": "Brand", name: product.brand },
    ...(product.images[0] ? { image: product.images } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (product.price / 100).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductView product={product} reviews={allReviews(product.slug)} related={relatedProducts(product)} setup={setupProducts(product)} />
    </>
  );
}
