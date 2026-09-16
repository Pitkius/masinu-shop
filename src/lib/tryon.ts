export type TryOnRequest = {
  vehicleId: string;
  productId: string;
  imageDataUrl: string;
};

export type TryOnResult = {
  provider: string;
  status: "ok" | "error";
  original: string;
  modified: string | null;
  mock: boolean;
  message: string;
};

export interface TryOnProvider {
  id: string;
  visualize(input: TryOnRequest): Promise<TryOnResult>;
}

export class MockTryOnProvider implements TryOnProvider {
  id = "mock";
  async visualize(input: TryOnRequest): Promise<TryOnResult> {
    return {
      provider: this.id,
      status: "ok",
      original: input.imageDataUrl,
      modified: input.imageDataUrl,
      mock: true,
      message: "Preview only — AI image provider is not connected.",
    };
  }
}

export class UnconfiguredTryOnProvider implements TryOnProvider {
  id = "none";
  async visualize(): Promise<TryOnResult> {
    return {
      provider: this.id,
      status: "error",
      original: "",
      modified: null,
      mock: false,
      message: "No visualization provider is configured for production.",
    };
  }
}

export function getTryOnProvider(): TryOnProvider {
  const configured = process.env.TRYON_PROVIDER ?? "mock";
  if (configured === "mock") return new MockTryOnProvider();
  if (process.env.TRYON_API_URL && process.env.TRYON_API_KEY) {
    return {
      id: "remote",
      async visualize() {
        return {
          provider: "remote",
          status: "error",
          original: "",
          modified: null,
          mock: false,
          message: "Remote visualization endpoint is declared but not implemented for this provider yet.",
        };
      },
    };
  }
  return new UnconfiguredTryOnProvider();
}
