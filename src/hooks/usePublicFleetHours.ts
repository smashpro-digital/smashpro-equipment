import { useEffect, useState } from "react";

const ASSET = "SP-ARDHI-26";
const ENDPOINT = `/dashboard/api/public_fleet_hours.php?asset=${ASSET}`;
const CACHE_KEY = "public-fleet-hours:SP-ARDHI-26:v1";

type MeterType = "engine_hours" | "operating_hours" | "mileage" | "cycles";
type Unit = "h" | "mi" | "cycles";
type Source =
  | "owner_reported"
  | "physical_observation"
  | "meter_photo"
  | "maintenance_record"
  | "service_record"
  | "manufacturer_document"
  | "telematics";
type Verification = "pending" | "verified";

export interface PublicReading {
  value: string;
  meter_type: MeterType;
  unit: Unit;
  source: Source;
  verification: Verification;
  observed_at: string | null;
  received_at: string;
  approved_at: string;
}

interface Projection {
  ok: true;
  asset_id: typeof ASSET;
  status: "available" | "unavailable";
  reading: PublicReading | null;
  history: PublicReading[];
}

export type FleetHoursState =
  | { status: "loading" }
  | { status: "unavailable"; history: PublicReading[] }
  | { status: "available" | "stale"; reading: PublicReading; history: PublicReading[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDate(value: unknown): value is string {
  return typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}(?:[T ][0-9:.]+(?:Z|[+-]\d{2}:\d{2})?)?$/.test(value) &&
    Number.isFinite(Date.parse(value));
}

function parseReading(value: unknown): PublicReading | null {
  if (!isRecord(value) || typeof value.value !== "string" || !/^\d+(?:\.\d+)?$/.test(value.value) ||
      typeof value.meter_type !== "string" || !["engine_hours", "operating_hours", "mileage", "cycles"].includes(value.meter_type) ||
      typeof value.source !== "string" || ![
        "owner_reported",
        "physical_observation",
        "meter_photo",
        "maintenance_record",
        "service_record",
        "manufacturer_document",
        "telematics",
      ].includes(value.source) ||
      typeof value.verification !== "string" || !["pending", "verified"].includes(value.verification) ||
      !(value.observed_at === null || isDate(value.observed_at)) ||
      !isDate(value.received_at) || !isDate(value.approved_at)) return null;
  const expectedUnit = value.meter_type === "mileage" ? "mi" : value.meter_type === "cycles" ? "cycles" : "h";
  if (value.unit !== expectedUnit) return null;
  return {
    value: value.value,
    meter_type: value.meter_type as MeterType,
    unit: expectedUnit,
    source: value.source as Source,
    verification: value.verification as Verification,
    observed_at: value.observed_at,
    received_at: value.received_at,
    approved_at: value.approved_at,
  };
}

function parseProjection(value: unknown): Projection | null {
  if (!isRecord(value) || value.ok !== true || value.asset_id !== ASSET ||
      typeof value.status !== "string" || !["available", "unavailable"].includes(value.status) || !Array.isArray(value.history)) return null;
  const history = value.history.map(parseReading);
  if (history.some((entry) => entry === null)) return null;
  const reading = value.reading === null ? null : parseReading(value.reading);
  if ((value.status === "available" && !reading) || (value.status === "unavailable" && value.reading !== null)) return null;
  return { ok: true, asset_id: ASSET, status: value.status as Projection["status"], reading, history: history as PublicReading[] };
}

function readCache(): Projection | null {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    return stored ? parseProjection(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

function updateCache(projection: Projection | null) {
  try {
    if (projection?.status === "available") localStorage.setItem(CACHE_KEY, JSON.stringify(projection));
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage is optional; the live public reading remains usable.
  }
}

export function usePublicFleetHours(): FleetHoursState {
  const [state, setState] = useState<FleetHoursState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(ENDPOINT, { signal: controller.signal, credentials: "omit", cache: "no-store", headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Public fleet hours unavailable");
        let payload: unknown;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }
        if (controller.signal.aborted) return;
        const projection = parseProjection(payload);
        updateCache(projection);
        setState(projection?.status === "available" && projection.reading
          ? { status: "available", reading: projection.reading, history: projection.history }
          : { status: "unavailable", history: projection?.history ?? [] });
      } catch {
        if (controller.signal.aborted) return;
        const cached = readCache();
        setState(cached?.status === "available" && cached.reading
          ? { status: "stale", reading: cached.reading, history: cached.history }
          : { status: "unavailable", history: [] });
      }
    }
    void load();
    return () => controller.abort();
  }, []);

  return state;
}
