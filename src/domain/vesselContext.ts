// Separate, code-reviewed public context catalogue. Never enters ShipmentState or evidence ingestion.
export type ContextSource = { url: string; attribution: string; checkedAt: string; classification: 'publicly-corroborated' | 'reported-schedule'; publicVisible: true };
export type VesselContext = {
  classification: 'context-only'; publicVisible: true; cargoAssociation: 'unconfirmed';
  vessel: { name: string; imo: string; mmsi: string; callSign: string; flag: string; type: string; lengthMetres: number; beamMetres: number };
  identitySources: ContextSource[]; voyage: { reference: string; source: ContextSource };
  corridor: { classification: 'illustrative-projection'; summary: string; stages: string[] };
  observation: null | { observedAt: string; speedKnots: number | null; heading: number | null; destination: string | null; source: ContextSource; publicReuseApproved: true; license: string };
};
const obj = (v: unknown): Record<string, unknown> => { if (!v || typeof v !== 'object' || Array.isArray(v)) throw Error('Invalid context'); return v as Record<string, unknown>; };
const str = (v: unknown): string => { if (typeof v !== 'string' || !v.trim() || v.length > 500) throw Error('Invalid context text'); return v; };
const num = (v: unknown, max: number): number => { if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > max) throw Error('Invalid context number'); return v; };
const timestamp = (v: unknown): string => { const s=str(v); if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(s) || !Number.isFinite(Date.parse(s))) throw Error('Exact UTC time required'); return s; };
const source = (v: unknown): ContextSource => { const s=obj(v), url=new URL(str(s.url)); if(url.protocol!=='https:' || url.username || url.password || url.search || url.hash || /\/(admin|api|private|documents?|evidence)(\/|$)/i.test(decodeURIComponent(url.pathname)) || s.publicVisible!==true || !['publicly-corroborated','reported-schedule'].includes(String(s.classification))) throw Error('Non-public context source'); return {url:url.href,attribution:str(s.attribution),checkedAt:timestamp(s.checkedAt),classification:s.classification as ContextSource['classification'],publicVisible:true}; };
export function parseVesselContext(input: unknown): VesselContext | null {
  try {
    const c=obj(input),v=obj(c.vessel),voyage=obj(c.voyage),route=obj(c.corridor);
    if(c.classification!=='context-only'||c.publicVisible!==true||c.cargoAssociation!=='unconfirmed'||route.classification!=='illustrative-projection')return null;
    if(!/^\d{7}$/.test(str(v.imo))||!/^\d{9}$/.test(str(v.mmsi))||!Array.isArray(c.identitySources)||!c.identitySources.length||c.identitySources.length>5||!Array.isArray(route.stages)||route.stages.length<2||route.stages.length>6)return null;
    const identitySources=c.identitySources.map(source);if(identitySources.some(s=>s.classification!=='publicly-corroborated'))return null;
    const voyageSource=source(voyage.source);if(voyageSource.classification!=='reported-schedule')return null;
    let observation: VesselContext['observation']=null;
    if(c.observation) { try { const o=obj(c.observation); if(o.publicReuseApproved===true) observation={observedAt:timestamp(o.observedAt),speedKnots:o.speedKnots==null?null:num(o.speedKnots,60),heading:o.heading==null?null:num(o.heading,360),destination:o.destination==null?null:str(o.destination),source:source(o.source),license:str(o.license),publicReuseApproved:true}; } catch { /* Fail closed on optional live context, retain static metadata. */ } }
    return {classification:'context-only',publicVisible:true,cargoAssociation:'unconfirmed',vessel:{name:str(v.name),imo:str(v.imo),mmsi:str(v.mmsi),callSign:str(v.callSign),flag:str(v.flag),type:str(v.type),lengthMetres:num(v.lengthMetres,500),beamMetres:num(v.beamMetres,100)},identitySources,voyage:{reference:str(voyage.reference),source:voyageSource},corridor:{classification:'illustrative-projection',summary:str(route.summary),stages:route.stages.map(str)},observation};
  } catch { return null; }
}
