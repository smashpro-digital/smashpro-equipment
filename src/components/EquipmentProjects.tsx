import { useEffect, useMemo, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import { recommendedServices } from "../domain/recommendations";

type EquipmentService = {
  id: number;
  slug: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  attachment_required?: string | null;
  attachment_required_id?: string | null;
  required_capability_ids?: string[] | string | null;
  quote_required?: number;
  availability_status?: string | null;
  prebooking_enabled?: number;
  availability_date?: string | null;
  pricing_mode?: string | null;
};

const ATTRIBUTION_KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content"];
function track(event:string,detail:Record<string,unknown>={}){if(typeof window!=="undefined"){const target=window as unknown as {dataLayer?:Array<Record<string,unknown>>};target.dataLayer=target.dataLayer||[];target.dataLayer.push({event,...detail});}}

function estimateUrl(service: EquipmentService | null, fleetId: string) {
  const params = new URLSearchParams();
  if (typeof window !== "undefined") {
    const source = new URLSearchParams(window.location.search);
    ATTRIBUTION_KEYS.forEach((key) => {
      const value = source.get(key);
      if (value) params.set(key, value.slice(0, 160));
    });
    params.set("landing_page", window.location.pathname);
    if(document.referrer)params.set("referrer",document.referrer.slice(0,500));
  }
  params.set("equipment_source", fleetId);
  params.set("equipment_required", fleetId);
  if (service?.slug) params.set("service", service.slug);
  return `/book/?${params.toString()}`;
}

export function EquipmentProjects({ fleetId, equipmentName, capabilityIds = [], attachmentIds = [] }: { fleetId: string; equipmentName: string; capabilityIds?: string[]; attachmentIds?: string[] }) {
  const [services, setServices] = useState<EquipmentService[]>([]);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/customer/catalog.php?view=list&active_only=1&include_custom=0`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("catalog unavailable")))
      .then((payload) => {const source:EquipmentService[]=Array.isArray(payload?.services)?payload.services:[];const rows=recommendedServices({fleetId,capabilityIds,attachmentIds},source);setServices(rows);setLoaded(true);track("equipment_services_loaded",{equipment_id:fleetId,service_count:rows.length});})
      .catch((error) => {
        if (error?.name !== "AbortError") {setFailed(true);setLoaded(true);}
      });
    return () => controller.abort();
  }, [fleetId, capabilityIds, attachmentIds]);

  const acceptingProjects = useMemo(
    () => services.some((service) => Number(service.prebooking_enabled) === 1),
    [services]
  );
  const customerEstimateUrl = estimateUrl(services[0] ?? null, fleetId);

  return <section className="equipment-projects" id="projects"><div className="shell">
    <div className="section-heading"><div><p className="eyebrow">What {equipmentName} Can Help With</p><h2>Equipment-powered property projects.</h2></div><div className="project-availability"><span>{acceptingProjects ? "Now Accepting Upcoming Projects" : "Project availability by review"}</span><p>Project listings do not confirm availability. Scheduling follows deposit, transport, equipment, and attachment readiness.</p></div></div>
    <div className="project-cta"><div><p className="eyebrow">Have a Property Project?</p><h2>Put {fleetId} to work on your property.</h2><p>Request an estimate so SmashPro can review access, scope, materials, configuration, and preferred timing.</p></div><ButtonLink href={customerEstimateUrl} onClick={()=>track("equipment_customer_estimate_clicked",{equipment_id:fleetId,service_slug:services[0]?.slug||""})}>Get a Project Estimate</ButtonLink></div>
    {services.length ? <div className="project-grid">{services.map((service) => <article key={`${service.id}-${service.slug}`}>
      <span>{service.attachment_required ? `${service.attachment_required} configuration` : "Configuration confirmed during review"}</span>
      <h3>{service.name}</h3><p>{service.tagline || service.description}</p>
      <strong>{service.quote_required ? "Custom Estimate" : "Estimate required"}</strong>
      <ButtonLink href={estimateUrl(service, fleetId)} onClick={()=>track("equipment_service_selected",{equipment_id:fleetId,service_slug:service.slug})}>Get Estimate</ButtonLink>
    </article>)}</div> : failed ? <p className="empty-state">Project services are temporarily unavailable. The equipment passport remains available below.</p> : loaded ? <p className="empty-state">Project recommendations have not been published for this equipment yet. Explore SmashPro Services for other ways we can help.</p> : <p className="empty-state">Loading current project services…</p>}
    <div className="contractor-availability"><div><p className="eyebrow">Contractor workflow</p><h3>Need fleet access?</h3><p>Contractor availability remains subject to eligibility, readiness, insurance, and operating requirements.</p></div><ButtonLink href="https://smashpro.app/contact" variant="outline" onClick={()=>track("contractor_availability_clicked",{equipment_id:fleetId})}>Request Availability</ButtonLink></div>
  </div></section>;
}
