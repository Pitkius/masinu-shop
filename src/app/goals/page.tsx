"use client";

import Link from "next/link";
import { goals } from "@/data/categories";
import { useGarage } from "@/context/GarageContext";
import { useT } from "@/context/LocaleContext";
import { VehiclePicker } from "@/components/vehicle/VehiclePicker";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const nameKey: Record<string, string> = {
  "more-power": "goals.morePower",
  "better-sound": "goals.betterSound",
  "aggressive-look": "goals.aggressiveLook",
  "better-handling": "goals.betterHandling",
  "better-lighting": "goals.betterLighting",
  "interior-upgrade": "goals.interior",
  restoration: "goals.restoration",
};

export default function GoalsPage() {
  const { t } = useT();
  const { activeVehicle } = useGarage();
  const [picker, setPicker] = useState(false);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="text-4xl sm:text-6xl">{t("goals.title")}</h1>
      {!activeVehicle ? <Button className="mt-6" variant="secondary" onClick={() => setPicker(true)}>{t("header.selectCar")}</Button> : null}
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Link key={goal.slug} href={`/shop?goal=${goal.tag}${activeVehicle ? `&vehicle=${activeVehicle.vehicleId}` : ""}`} className="border border-line p-8 transition hover:border-accent">
            <h2 className="text-2xl">{t(nameKey[goal.slug])}</h2>
            <p className="mt-2 text-sm text-muted">{goal.description}</p>
          </Link>
        ))}
      </div>
      <VehiclePicker open={picker} onClose={() => setPicker(false)} />
    </div>
  );
}
