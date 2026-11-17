import type { FleetHoursState, PublicReading } from "../hooks/usePublicFleetHours";

const meterLabels = { engine_hours: "Engine hours", operating_hours: "Operating hours", mileage: "Mileage", cycles: "Cycles" };
const sourceLabels = {
  owner_reported: "Owner reported",
  physical_observation: "Physical observation",
  meter_photo: "Meter photo",
  maintenance_record: "Maintenance record",
  service_record: "Service record",
  manufacturer_document: "Manufacturer document",
  telematics: "Telematics",
};

export function fleetHoursSummary(state: FleetHoursState): string {
  if (state.status === "loading") return "Loading reading…";
  if (state.status === "unavailable") return "Reading unavailable";
  return `${state.reading.value} ${state.reading.unit} · ${state.reading.verification}${state.status === "stale" ? " · stale" : ""}`;
}

function ReadingDetails({ reading }: { reading: PublicReading }) {
  return <div className="public-fleet-hours__reading">
    <strong>{meterLabels[reading.meter_type]}: {reading.value} {reading.unit}</strong>
    <p>Source: {sourceLabels[reading.source]} · Verification: {reading.verification}</p>
    <p>Observed: {reading.observed_at ?? "Unknown"} · Last reported: {reading.received_at}</p>
  </div>;
}

function ReadingHistory({ readings }: { readings: PublicReading[] }) {
  return <section className="public-fleet-hours__history" aria-label="Public meter reading history">
    <h4>Public meter reading history</h4>
    {readings.length ? <ol>{readings.map((reading, index) => <li key={`${reading.approved_at}-${index}`}><ReadingDetails reading={reading} /></li>)}</ol> : <p>No public meter history available.</p>}
  </section>;
}

export function PublicFleetHours({ state, history = false }: { state: FleetHoursState; history?: boolean }) {
  if (state.status === "loading") return <div className="public-fleet-hours"><p role="status">{fleetHoursSummary(state)}</p></div>;
  if (state.status === "unavailable") return <div>
    <div className="public-fleet-hours"><p role="status">{fleetHoursSummary(state)}</p></div>
    {history && <ReadingHistory readings={state.history} />}
  </div>;
  return <div className="public-fleet-hours">
    {state.status === "stale" && <p role="status"><strong>Stale cached reading</strong> · Live reading unavailable.</p>}
    <ReadingDetails reading={state.reading} />
    {history && <ReadingHistory readings={state.history} />}
  </div>;
}
