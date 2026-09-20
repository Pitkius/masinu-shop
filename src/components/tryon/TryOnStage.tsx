"use client";

import { useEffect, useRef } from "react";
import type { PartTransform } from "@/lib/tryon";
import { clampTransform } from "@/lib/tryon";
import { useT } from "@/context/LocaleContext";

export function TryOnStage({
  carSrc,
  partSrc,
  transform,
  onTransform,
  compare,
}: {
  carSrc: string;
  partSrc: string | null;
  transform: PartTransform;
  onTransform: (next: PartTransform) => void;
  compare: number;
}) {
  const { t } = useT();
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; origX: number; origY: number } | null>(null);
  const transformRef = useRef(transform);
  transformRef.current = transform;

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      if (!partSrc) return;
      event.preventDefault();
      const current = transformRef.current;
      onTransform(clampTransform({ ...current, scale: current.scale * (event.deltaY > 0 ? 0.94 : 1.06) }));
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [onTransform, partSrc]);

  function clientToStage(clientX: number, clientY: number) {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box || !box.width || !box.height) return { x: 0, y: 0 };
    return { x: (clientX - box.left) / box.width, y: (clientY - box.top) / box.height };
  }

  return (
    <div
      ref={stageRef}
      className="relative cursor-grab overflow-hidden rounded-3xl bg-surface [container-type:inline-size] active:cursor-grabbing touch-none"
      onPointerDown={(event) => {
        if (!partSrc) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const point = clientToStage(event.clientX, event.clientY);
        drag.current = { pointerId: event.pointerId, x: point.x, y: point.y, origX: transform.x, origY: transform.y };
      }}
      onPointerMove={(event) => {
        if (!drag.current || drag.current.pointerId !== event.pointerId) return;
        const point = clientToStage(event.clientX, event.clientY);
        onTransform(
          clampTransform({
            ...transform,
            x: drag.current.origX + (point.x - drag.current.x),
            y: drag.current.origY + (point.y - drag.current.y),
          }),
        );
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={carSrc} alt={t("tryOn.original")} className="block h-auto w-full select-none" draggable={false} />
      {partSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partSrc}
          alt={t("tryOn.modified")}
          draggable={false}
          className="pointer-events-none absolute max-w-none select-none"
          style={{
            left: `${transform.x * 100}%`,
            top: `${transform.y * 100}%`,
            width: `${transform.scale * 100}%`,
            transform: `translate(-50%, -50%) rotate(${transform.rotate}deg)`,
          }}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ width: `${compare}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={carSrc} alt="" className="absolute left-0 top-0 h-full w-[100cqw] max-w-none select-none" draggable={false} />
      </div>
      <span className="pointer-events-none absolute left-4 top-4 text-[11px] uppercase tracking-[0.18em]">{t("tryOn.original")}</span>
      <span className="pointer-events-none absolute right-4 top-4 text-[11px] uppercase tracking-[0.18em]">{t("tryOn.modified")}</span>
    </div>
  );
}
