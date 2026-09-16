"use client";

import { UserBuildView } from "@/components/garage/GarageViews";
import { use } from "react";

export default function GarageBuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <UserBuildView id={id} />;
}
