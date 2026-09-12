import { useEffect, useState } from "react";
import { loadShipment, type ShipmentResult } from "../domain/shipment";

export function useShipment() {
  const [result, setResult] = useState<ShipmentResult>({ data: null, status: "loading" });
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    let storage: Storage | undefined;
    try { storage = window.sessionStorage; } catch { /* Optional cache. */ }
    const endpoint = import.meta.env.VITE_SHIPMENT_ENDPOINT || "/api/fleet/shipment/SP-ARDHI-26";
    void loadShipment(endpoint, storage).then(value => { if (active) setResult(value); });
    const timer = setInterval(() => setRefresh(n => n + 1), 6 * 3600000);
    return () => { active = false; clearInterval(timer); };
  }, [refresh]);
  return { ...result, refresh: () => setRefresh(n => n + 1) };
}
