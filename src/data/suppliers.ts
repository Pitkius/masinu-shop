export type SupplierRecord = {
  id: string;
  name: string;
  apiType: "rest" | "csv" | "mock";
  apiUrl: string | null;
  credentialsReference: string | null;
  status: "ACTIVE" | "PAUSED" | "DISABLED";
};

export const suppliers: SupplierRecord[] = [
  {
    id: "eu-parts",
    name: "EU Parts Hub",
    apiType: "mock",
    apiUrl: null,
    credentialsReference: "SUPPLIER_EU_PARTS_API_KEY",
    status: "ACTIVE",
  },
  {
    id: "nordic-drop",
    name: "Nordic Dropship",
    apiType: "mock",
    apiUrl: null,
    credentialsReference: "SUPPLIER_NORDIC_API_KEY",
    status: "PAUSED",
  },
];
