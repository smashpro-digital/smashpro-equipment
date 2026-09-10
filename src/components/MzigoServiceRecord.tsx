import type { Equipment } from "../types/equipment";
import { PassportEvidenceRecord } from "./PassportEvidenceRecord";

export function MzigoServiceRecord({ item }: { item: Equipment }) {
  return <section className="section shell ardhi-service-record mzigo-service-record" id="service" aria-labelledby="mzigo-service-title">
    <div className="section-heading"><div><p className="eyebrow">Service record</p><h2 id="mzigo-service-title">Service and operational history.</h2></div></div>
    {item.serviceHistory.length ? item.serviceHistory.map(record => <PassportEvidenceRecord key={record.id} id={`mzigo-service-${record.id}`} date={record.performedAt} phase={record.status} title={record.serviceType} label="Open service record"><p>{record.summary}</p>{record.operatingHours !== undefined && <p>Service hours: {record.operatingHours}</p>}</PassportEvidenceRecord>) : <div className="service-record-status"><span>Pre-commissioning</span><strong>Awaiting commissioning</strong><small>No completed service events are published. Service, maintenance and repair records will be added as work is documented.</small></div>}
    <p className="mzigo-readiness">Factory media does not establish readiness for service. Final inspection, arrival checks, operating guidance and site eligibility must be verified before operation. Rental availability has not been announced.</p>
  </section>;
}
