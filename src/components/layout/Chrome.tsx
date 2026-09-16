"use client";

import Link from "next/link";
import { Home, Search, ShoppingBag, Store, Warehouse } from "lucide-react";
import { useT } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";

export function MobileNav() {
  const { t } = useT();
  const { count } = useCart();
  const items = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/shop", label: t("nav.shop"), icon: Store },
    { href: "/search", label: t("nav.search"), icon: Search },
    { href: "/garage", label: t("nav.garage"), icon: Warehouse },
    { href: "/cart", label: t("nav.cart"), icon: ShoppingBag, badge: count },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="relative flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-[0.14em] text-muted">
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.badge ? <span className="absolute right-4 top-2 rounded-full bg-accent px-1 text-[9px] text-black">{item.badge}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const { t } = useT();
  return (
    <footer className="mt-auto border-t border-line pb-24 pt-12 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm text-muted lg:grid-cols-3 lg:px-8">
        <div>
          <p className="text-foreground tracking-[0.28em]">{t("brand")}</p>
          <p className="mt-3 max-w-sm">{t("tagline")}</p>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-foreground">{t("footer.shop")}</p>
          <Link href="/shop/exterior" className="block">Exterior</Link>
          <Link href="/shop/performance" className="block">Performance</Link>
          <Link href="/shop/wheels" className="block">Wheels</Link>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-foreground">{t("footer.company")}</p>
          <p>{t("footer.shipping")}: EU</p>
          <p>{t("footer.returns")}: 14 days</p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl px-4 text-xs text-muted lg:px-8">
        © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
      </p>
    </footer>
  );
}
