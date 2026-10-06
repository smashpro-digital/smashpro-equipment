export type AtlasMode = 'ocean'|'air'|'road'|'rail'|'jobsite'|'yard'|'warehouse'|'port'|'factory'|'unknown';
export type AtlasFreshness = 'recent'|'delayed'|'stale'|'checkpoint'|'unavailable';
export type AtlasLocationContext = {
  schemaVersion:1;
  assetId:string;
  mode:AtlasMode;
  freshness:AtlasFreshness;
  position:{latitude:number;longitude:number;precision:string;observedAt:string}|null;
  movement:{speed:number|null;speedUnit:string|null;heading:number|null;status:string|null}|null;
  context:{vessel?:string|null;voyage?:string|null;carrier?:string|null;flight?:string|null;jobId?:string|null;vehicleId?:string|null;trailerId?:string|null};
  checkpoint:{label:string;observedAt:string}|null;
  source:{provider:string;url:string;confidence:number}|null;
  presentation:{profile:AtlasMode;preferredBasemap:'satellite'|'roadmap'|'terrain';overlays:string[]};
  history:{available:boolean;observationCount:number;earliestObservationAt:string|null;latestObservationAt:string|null};
  simulated:false;
};

const modes:AtlasMode[]=['ocean','air','road','rail','jobsite','yard','warehouse','port','factory','unknown'];
const freshness:AtlasFreshness[]=['recent','delayed','stale','checkpoint','unavailable'];
const obj=(v:unknown):Record<string,unknown>=>{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid Atlas context');return v as Record<string,unknown>;};
const str=(v:unknown,max=500)=>{if(typeof v!=='string'||v.length>max)throw Error('Invalid Atlas text');return v;};
const num=(v:unknown,min:number,max:number)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('Invalid Atlas number');return v;};
const time=(v:unknown)=>{const s=str(v);if(!/^\d{4}-\d{2}-\d{2}T/.test(s)||!Number.isFinite(Date.parse(s)))throw Error('Invalid Atlas time');return s;};
const maybe=(v:unknown)=>v==null?null:str(v);
const safeUrl=(v:unknown)=>{const raw=str(v,2048),u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||/\/(api|admin|private|internal|evidence|documents?)(\/|$)/i.test(decodeURIComponent(u.pathname)))throw Error('Invalid Atlas source');return raw;};

export function parseAtlasLocationContext(input:unknown,assetId:string):AtlasLocationContext|null {
  if(input==null)return null;
  try{
    const a=obj(input);
    if(a.schemaVersion!==1||a.assetId!==assetId||a.simulated!==false||!modes.includes(a.mode as AtlasMode)||!freshness.includes(a.freshness as AtlasFreshness))return null;
    const presentation=obj(a.presentation),history=obj(a.history),context=obj(a.context);
    if(!modes.includes(presentation.profile as AtlasMode)||!['satellite','roadmap','terrain'].includes(String(presentation.preferredBasemap))||!Array.isArray(presentation.overlays)||presentation.overlays.length>20)return null;
    const position=a.position==null?null:obj(a.position),movement=a.movement==null?null:obj(a.movement),checkpoint=a.checkpoint==null?null:obj(a.checkpoint),source=a.source==null?null:obj(a.source);
    const parsedPosition=position?{latitude:num(position.latitude,-90,90),longitude:num(position.longitude,-180,180),precision:str(position.precision,40),observedAt:time(position.observedAt)}:null;
    const parsedMovement=movement?{speed:movement.speed==null?null:num(movement.speed,0,1000),speedUnit:movement.speedUnit==null?null:str(movement.speedUnit,20),heading:movement.heading==null?null:num(movement.heading,0,360),status:maybe(movement.status)}:null;
    return {
      schemaVersion:1,assetId,mode:a.mode as AtlasMode,freshness:a.freshness as AtlasFreshness,position:parsedPosition,movement:parsedMovement,
      context:{vessel:maybe(context.vessel),voyage:maybe(context.voyage),carrier:maybe(context.carrier),flight:maybe(context.flight),jobId:maybe(context.jobId),vehicleId:maybe(context.vehicleId),trailerId:maybe(context.trailerId)},
      checkpoint:checkpoint?{label:str(checkpoint.label),observedAt:time(checkpoint.observedAt)}:null,
      source:source?{provider:str(source.provider),url:safeUrl(source.url),confidence:num(source.confidence,0,1)}:null,
      presentation:{profile:presentation.profile as AtlasMode,preferredBasemap:presentation.preferredBasemap as AtlasLocationContext['presentation']['preferredBasemap'],overlays:presentation.overlays.map(v=>str(v,80))},
      history:{available:history.available===true,observationCount:num(history.observationCount,0,1000000),earliestObservationAt:history.earliestObservationAt==null?null:time(history.earliestObservationAt),latestObservationAt:history.latestObservationAt==null?null:time(history.latestObservationAt)},
      simulated:false,
    };
  }catch{return null;}
}

export const atlasModeLabel=(mode:AtlasMode)=>({ocean:'Ocean',air:'Air',road:'Road',rail:'Rail',jobsite:'Jobsite',yard:'Yard',warehouse:'Warehouse',port:'Port',factory:'Factory',unknown:'Unknown'}[mode]);
export const atlasFreshnessLabel=(state:AtlasFreshness)=>({recent:'Recent position',delayed:'Delayed position',stale:'Last known',checkpoint:'Verified checkpoint',unavailable:'Location unavailable'}[state]);
