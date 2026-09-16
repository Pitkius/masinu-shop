"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BuildItem, CarBuild, SavedVehicle } from "@/lib/types";

const KEY = "apex-garage-v1";

type GarageState = {
  vehicles: SavedVehicle[];
  activeVehicleId: string | null;
  builds: CarBuild[];
  wishlist: string[];
  photos: Record<string, string[]>;
  installed: Record<string, string[]>;
  recent: string[];
};

const empty: GarageState = {
  vehicles: [],
  activeVehicleId: null,
  builds: [],
  wishlist: [],
  photos: {},
  installed: {},
  recent: [],
};

type GarageContextValue = GarageState & {
  addVehicle: (vehicleId: string, nickname?: string) => void;
  removeVehicle: (id: string) => void;
  setActive: (id: string) => void;
  activeVehicle: SavedVehicle | null;
  toggleWishlist: (productId: string) => void;
  addPhoto: (savedId: string, dataUrl: string) => void;
  addInstalled: (savedId: string, productId: string) => void;
  viewProduct: (slug: string) => void;
  createBuild: (title: string, vehicleId: string) => CarBuild;
  updateBuild: (id: string, patch: Partial<CarBuild>) => void;
  addToBuild: (buildId: string, item: BuildItem) => void;
};

const GarageContext = createContext<GarageContextValue | null>(null);

function uid() {
  return crypto.randomUUID();
}

export function GarageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GarageState>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        queueMicrotask(() => setState({ ...empty, ...JSON.parse(raw) }));
      } catch {
        queueMicrotask(() => setState(empty));
      }
    }
    queueMicrotask(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const addVehicle = useCallback((vehicleId: string, nickname?: string) => {
    const saved: SavedVehicle = { id: uid(), vehicleId, nickname, createdAt: new Date().toISOString() };
    setState((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, saved],
      activeVehicleId: saved.id,
    }));
  }, []);

  const removeVehicle = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((item) => item.id !== id),
      activeVehicleId: prev.activeVehicleId === id ? prev.vehicles.find((item) => item.id !== id)?.id ?? null : prev.activeVehicleId,
    }));
  }, []);

  const setActive = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeVehicleId: id }));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.includes(productId) ? prev.wishlist.filter((id) => id !== productId) : [...prev.wishlist, productId],
    }));
  }, []);

  const addPhoto = useCallback((savedId: string, dataUrl: string) => {
    setState((prev) => ({
      ...prev,
      photos: { ...prev.photos, [savedId]: [...(prev.photos[savedId] ?? []), dataUrl] },
    }));
  }, []);

  const addInstalled = useCallback((savedId: string, productId: string) => {
    setState((prev) => ({
      ...prev,
      installed: {
        ...prev.installed,
        [savedId]: [...new Set([...(prev.installed[savedId] ?? []), productId])],
      },
    }));
  }, []);

  const viewProduct = useCallback((slug: string) => {
    setState((prev) => ({ ...prev, recent: [slug, ...prev.recent.filter((item) => item !== slug)].slice(0, 12) }));
  }, []);

  const createBuild = useCallback((title: string, vehicleId: string) => {
    const build: CarBuild = {
      id: uid(),
      title,
      vehicleId,
      visibility: "private",
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({ ...prev, builds: [build, ...prev.builds] }));
    return build;
  }, []);

  const updateBuild = useCallback((id: string, patch: Partial<CarBuild>) => {
    setState((prev) => ({
      ...prev,
      builds: prev.builds.map((build) => (build.id === id ? { ...build, ...patch, updatedAt: new Date().toISOString() } : build)),
    }));
  }, []);

  const addToBuild = useCallback((buildId: string, item: BuildItem) => {
    setState((prev) => ({
      ...prev,
      builds: prev.builds.map((build) =>
        build.id === buildId
          ? {
              ...build,
              items: [...build.items.filter((entry) => entry.productId !== item.productId), item],
              updatedAt: new Date().toISOString(),
            }
          : build,
      ),
    }));
  }, []);

  const activeVehicle = state.vehicles.find((item) => item.id === state.activeVehicleId) ?? null;

  const value = useMemo(
    () => ({
      ...state,
      addVehicle,
      removeVehicle,
      setActive,
      activeVehicle,
      toggleWishlist,
      addPhoto,
      addInstalled,
      viewProduct,
      createBuild,
      updateBuild,
      addToBuild,
    }),
    [state, addVehicle, removeVehicle, setActive, activeVehicle, toggleWishlist, addPhoto, addInstalled, viewProduct, createBuild, updateBuild, addToBuild],
  );

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error("useGarage must be used within GarageProvider");
  return ctx;
}
