"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import { GarageProvider } from "@/context/GarageContext";
import { LocaleProvider } from "@/context/LocaleContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LocaleProvider>
        <GarageProvider>
          <CartProvider>{children}</CartProvider>
        </GarageProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}
