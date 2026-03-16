// =========================================================
// ZEDAGRO — Backend API Client
// Base URL: http://localhost:8000 (FastAPI)
// =========================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Generic Fetchers ─────────────────────────────────────────────────────────

export async function fetchFromApi<T = unknown>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}

export async function postToApi<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}

export async function patchToApi<T = unknown>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
}

// ─── Typed API helpers ────────────────────────────────────────────────────────

import type {
    Farmer,
    FISPVoucher,
    Payment,
    LogisticsTrip,
    StorageDepot,
    FraudAlert,
} from "./data";

export const zedagroApi = {
    // Farmers
    getFarmers: () => fetchFromApi<Farmer[]>("/farmers"),
    createFarmer: (d: Omit<Farmer, "id">) => postToApi<Farmer>("/farmers", d),

    // FISP Vouchers
    getVouchers: () => fetchFromApi<FISPVoucher[]>("/vouchers"),

    // Payments
    getPayments: () => fetchFromApi<Payment[]>("/payments"),

    // Logistics
    getLogistics: () => fetchFromApi<LogisticsTrip[]>("/logistics"),
    createLogistics: (d: any) => postToApi<LogisticsTrip>("/logistics", d),
    assignLogistics: (id: number, d: { truckId: string; driverId: string; driver: string }) =>
        patchToApi<LogisticsTrip>(`/logistics/${id}/assign`, d),
    updateLogisticsStatus: (id: number, d: { status: string; progress?: number; eta?: string }) =>
        patchToApi<LogisticsTrip>(`/logistics/${id}/status`, d),

    // Storage Depots
    getStorage: () => fetchFromApi<StorageDepot[]>("/storage"),

    // Fraud Alerts
    getFraudAlerts: () => fetchFromApi<FraudAlert[]>("/fraud-alerts"),

    // Seed
    seedData: () => postToApi<{ message: string }>("/seed-data", {}),

    // Health
    health: () => fetchFromApi<{ message: string }>("/"),
};
