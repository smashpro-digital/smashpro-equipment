import { useEffect, useState } from "react";
import { loadShipment, type ShipmentResult } from "../domain/shipment";

export function useShipment() {
  const [result, setResult] = useState<ShipmentResult>({ data: null, status: "loading" });
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let storage: Storage | undefined;
    try { storage = window.sessionStorage; } catch { /* Optional cache. */ }
    const endpoint = import.meta.env.VITE_SHIPMENT_ENDPOINT || "https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26";
    void loadShipment(endpoint, storage).then(value => {
      if (!active) return;
      setResult(value);
      // Retry dependency outages without requiring a reload or changing evidence.
      timer = setTimeout(() => setRefresh(n => n + 1), value.status === "current" ? 6 * 3600000 : 60000);
    });
    const online = () => setRefresh(n => n + 1);
    window.addEventListener("online", online);
    return () => { active = false; clearTimeout(timer); window.removeEventListener("online", online); };
  }, [refresh]);
  return { ...result, refresh: () => setRefresh(n => n + 1) };
}
