"use client";

import { useMemo, useState } from "react";
import { generateBudgetBuild } from "@/lib/finder";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { formatMoney } from "@/lib/money";
import { goals } from "@/data/categories";
import { useCart } from "@/context/CartContext";

const budgets = [
  { key: "under500", cents: 50000 },
  { key: "under1000", cents: 100000 },
  { key: "under2000", cents: 200000 },
  { key: "performance", cents: 500000 },
];

export default function BudgetPage() {
  const { t } = useT();
  const { activeVehicle } = useGarage();
  const { addMany } = useCart();
  const [picker, setPicker] = useState(false);
  const [budget, setBudget] = useState(100000);
  const [goal, setGoal] = useState("aggressive-look");
  const result = useMemo(() => {
    if (!activeVehicle) return null;
    return generateBudgetBuild({ vehicleId: activeVehicle.vehicleId, goal, budgetCents: budget });
  }, [activeVehicle, budget, goal]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl">{t("budget.title")}</h1>
      <div className="mt-8 flex flex-wrap gap-3">
        {budgets.map((item) => (
          <Button key={item.key} variant={budget === item.cents ? "primary" : "secondary"} onClick={() => setBudget(item.cents)}>
            {t(`budget.${item.key}`)}
          </Button>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {goals.map((item) => (
          <button key={item.slug} onClick={() => setGoal(item.tag)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] ${goal === item.tag ? "border-accent" : "border-line"}`}>
            {item.name}
          </button>
        ))}
      </div>
      {!activeVehicle ? (
        <EmptyState className="mt-10" title={t("header.selectCar")} actions={<Button onClick={() => setPicker(true)}>{t("header.selectCar")}</Button>} />
      ) : !result?.products.length ? (
        <EmptyState className="mt-10" title={t("budget.empty")} />
      ) : (
        <>
          <p className="mt-8 text-sm text-muted">{formatMoney(result.total)} / {formatMoney(budget)}</p>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {result.products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <Button className="mt-8" onClick={() => addMany(result.products.map((p) => p.id))}>{t("build.addAll")}</Button>
        </>
      )}
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
