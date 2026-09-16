"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/context/LocaleContext";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const { t } = useT();
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password") ?? "");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.error === "Admin is not configured" ? t("admin.disabled") : "Unauthorized");
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-3xl">{t("admin.login")}</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input name="password" type="password" placeholder={t("admin.password")} className="w-full rounded-2xl border border-line bg-surface px-4 py-3" />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button>{t("admin.enter")}</Button>
      </form>
    </div>
  );
}
