export type PartTransform = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
};

export function tryOnConfigured() {
  return true;
}

export function defaultPartTransform(category: string): PartTransform {
  switch (category) {
    case "exhaust":
      return { x: 0.78, y: 0.72, scale: 0.34, rotate: 0 };
    case "lighting":
      return { x: 0.22, y: 0.48, scale: 0.28, rotate: 0 };
    case "wheels":
      return { x: 0.28, y: 0.74, scale: 0.26, rotate: 0 };
    case "brakes":
      return { x: 0.28, y: 0.74, scale: 0.22, rotate: 0 };
    case "exterior":
      return { x: 0.5, y: 0.4, scale: 0.44, rotate: 0 };
    case "engine":
    case "performance":
      return { x: 0.5, y: 0.5, scale: 0.38, rotate: 0 };
    case "suspension":
      return { x: 0.36, y: 0.72, scale: 0.32, rotate: 0 };
    default:
      return { x: 0.5, y: 0.56, scale: 0.36, rotate: 0 };
  }
}

export function clampTransform(next: PartTransform): PartTransform {
  return {
    x: Math.min(1.05, Math.max(-0.05, next.x)),
    y: Math.min(1.05, Math.max(-0.05, next.y)),
    scale: Math.min(1.25, Math.max(0.08, next.scale)),
    rotate: ((next.rotate % 360) + 360) % 360,
  };
}
