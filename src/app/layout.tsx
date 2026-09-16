import type { Metadata } from "next";
import { Syne, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/layout/Header";
import { Footer, MobileNav } from "@/components/layout/Chrome";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "APEX — Build your car. Your way.",
    template: "%s · APEX",
  },
  description: "Premium automotive parts and tuning. Select your car, find compatible parts, build and buy.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-bg text-foreground antialiased">
        <Providers>
          <div className="flex min-h-full flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
