"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "@/context/CartContext";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { vehicles, vehicleLabel } from "@/data/vehicles";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { SearchBox } from "@/components/search/SearchBox";

export function Header() {
  const { t, locale, setLocale } = useT();
  const { count } = useCart();
  const { vehicles: saved, activeVehicle, setActive, removeVehicle } = useGarage();
  const { theme, setTheme } = useTheme();
  const [picker, setPicker] = useState(false);
  const [carOpen, setCarOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = vehicles.find((item) => item.id === activeVehicle?.vehicleId);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
          <button className="lg:hidden" onClick={() => setMenu((v) => !v)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="text-lg tracking-[0.28em]">
            {t("brand")}
          </Link>
          <nav className="hidden items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-muted lg:flex">
            <Link href="/shop" className="hover:text-foreground">{t("nav.shop")}</Link>
            <Link href="/goals" className="hover:text-foreground">{t("nav.goals")}</Link>
            <Link href="/garage" className="hover:text-foreground">{t("nav.garage")}</Link>
            <Link href="/finder" className="hover:text-foreground">{t("nav.finder")}</Link>
          </nav>
          <div className="hidden flex-1 lg:block">
            <SearchBox />
          </div>
          <button
            onClick={() => (active ? setCarOpen((v) => !v) : setPicker(true))}
            className="hidden max-w-[220px] truncate text-left text-[11px] uppercase tracking-[0.16em] md:block"
          >
            {active ? `${t("header.myCar")}: ${vehicleLabel(active, false)}` : t("header.selectCar")}
          </button>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Theme">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button onClick={() => setLocale(locale === "en" ? "lt" : "en")} className="text-[11px] uppercase tracking-[0.16em]">
            {locale}
          </button>
          <Link href="/cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-[10px] text-black">{count}</span> : null}
          </Link>
        </div>
        {menu ? (
          <div className="space-y-3 border-t border-line px-4 py-4 text-[11px] uppercase tracking-[0.18em] lg:hidden">
            <SearchBox compact />
            <Link href="/shop" className="block">{t("nav.shop")}</Link>
            <Link href="/goals" className="block">{t("nav.goals")}</Link>
            <Link href="/garage" className="block">{t("nav.garage")}</Link>
            <Link href="/finder" className="block">{t("nav.finder")}</Link>
            <button onClick={() => setPicker(true)}>{t("header.selectCar")}</button>
          </div>
        ) : null}
        {carOpen && activeVehicle ? (
          <div className="mx-auto max-w-7xl px-4 pb-4 lg:px-8">
            <div className="rounded-3xl border border-line bg-surface p-4 text-sm">
              {saved.map((item) => {
                const vehicle = vehicles.find((entry) => entry.id === item.vehicleId);
                if (!vehicle) return null;
                return (
                  <div key={item.id} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0">
                    <button onClick={() => setActive(item.id)} className="text-left">
                      <p>{vehicleLabel(vehicle)}</p>
                      <p className="text-xs text-muted">{vehicle.engineCode}</p>
                    </button>
                    <button className="text-xs text-muted" onClick={() => removeVehicle(item.id)}>
                      {t("header.removeCar")}
                    </button>
                  </div>
                );
              })}
              <div className="mt-3 flex gap-4 text-[11px] uppercase tracking-[0.16em]">
                <button onClick={() => { setCarOpen(false); setPicker(true); }}>{t("header.changeCar")}</button>
                <button onClick={() => { setCarOpen(false); setPicker(true); }}>{t("header.addCar")}</button>
              </div>
            </div>
          </div>
        ) : null}
      </header>
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </>
  );
}
