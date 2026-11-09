/** Fleet lifecycle projection: append-only event identity, no operational writes.
 * Digital HQ is authoritative for service, cost, warranty and approval.
 * WordPress is editorial. A public passport is a reviewed projection only.
 */
export type FleetEventType = 'repair' | 'upgrade' | 'maintenance' | 'field_test';
export type FleetEventStatus = 'reported' | 'diagnosing' | 'repair_pending' | 'repaired' | 'verified' | 'planned' | 'ordered' | 'installed' | 'testing_pending' | 'completed';
export type FleetEvidence = { kind: 'photo' | 'video' | 'supplier' | 'inspection'; label: string; url?: string; reviewed: boolean };
export type FleetLifecycleEvent = {
  id: string; assetId: string; type: FleetEventType; status: FleetEventStatus;
  title: string; occurredOn: string | null; reportedOn: string | null; summary: string; componentIds: string[];
  relatedEventIds: string[]; evidence: FleetEvidence[];
  article?: { state: 'draft' | 'published'; postId?: number; url?: string; title: string } | null;
  approval: 'pending' | 'reviewed'; serviceRelease: 'blocked' | 'pending' | 'approved';
};
export const ardhiLifecycleEvents: readonly FleetLifecycleEvent[] = [
  {
    id:'DEF-003',assetId:'SP-ARDHI-26',type:'repair',status:'repair_pending',
    title:'Thrown rubber track',occurredOn:'2026-11-08',reportedOn:null,
    summary:'Owner photographed track displaced from undercarriage. Cause and repair unverified. Awaiting OEM tension and reinstallation procedure.',
    componentIds:['rubber-track','undercarriage'],relatedEventIds:[],
    evidence:[{kind:'photo',label:'Owner track incident photo, WP media 967',reviewed:true},{kind:'photo',label:'Owner track incident photo, WP media 966',reviewed:true}],
    article:{state:'draft',postId:969,title:'Field Repair 003 | Thrown Track: Real-World Recovery'},
    approval:'pending',serviceRelease:'blocked'
  },
  {
    id:'DEF-001',assetId:'SP-ARDHI-26',type:'repair',status:'verified',
    title:'Throttle travel restored',occurredOn:'2026-11-08',reportedOn:null,
    summary:'Owner removed dust with leaf blower, applied WD-40 Specialist Dry Lube and verified full throttle travel. Cause not conclusively established.',
    componentIds:['throttle-control'],relatedEventIds:['FIELD-DIRT-DAY-001'],
    evidence:[{kind:'inspection',label:'Owner full-travel verification',reviewed:true}],
    approval:'reviewed',serviceRelease:'pending'
  },
  {
    id:'DEF-002',assetId:'SP-ARDHI-26',type:'repair',status:'repaired',
    title:'Quick-change pin retaining hardware',occurredOn:null,reportedOn:'2026-11-08',
    summary:'Owner reported replacing the missing retaining screw and adding screws to both pins. The repair date was not separately recorded; independent lock-engagement verification remains pending.',
    componentIds:['quick-change-lock'],relatedEventIds:[],
    evidence:[{kind:'photo',label:'Owner repair photographs',reviewed:true}],
    approval:'pending',serviceRelease:'pending'
  },
  {
    id:'UPG-BKT-006',assetId:'SP-ARDHI-26',type:'upgrade',status:'testing_pending',
    title:'Six-tooth bucket configuration',occurredOn:'2026-11-07',reportedOn:null,
    summary:'Six-tooth digging configuration installed; performance testing and attachment safety sign-off remain pending.',
    componentIds:['SP-ATT-BKT-001'],relatedEventIds:[],
    evidence:[{kind:'photo',label:'Owner six-tooth installation and field photos',reviewed:true}],
    approval:'pending',serviceRelease:'pending'
  }
];
export function publicLifecycleForAsset(assetId:string, events:readonly FleetLifecycleEvent[]=ardhiLifecycleEvents) {
  return events.filter(e=>e.assetId===assetId).map(e=>{
    const evidence=e.evidence
      .filter(v=>v.reviewed && (!v.url || /^(https:\/\/smashpro\.app\/(equipment\/|wp-content\/uploads\/)|\/equipment\/)/.test(v.url)))
      .map(v=>({kind:v.kind,label:v.label,reviewed:true as const,...(v.url?{url:v.url}:{})}));
    const article=e.article?.state==='published' && e.article.url && /^https:\/\/smashpro\.app\/[a-zA-Z0-9/_-]+\/?$/.test(e.article.url)
      ? {state:'published' as const,url:e.article.url,title:e.article.title}
      : undefined;
    return {
      id:e.id,assetId:e.assetId,type:e.type,status:e.status,title:e.title,
      occurredOn:e.occurredOn,reportedOn:e.reportedOn??null,summary:e.summary,
      componentIds:e.componentIds.filter(id=>typeof id==='string'),
      relatedEventIds:e.relatedEventIds.filter(id=>typeof id==='string'),
      evidence,...(article?{article}:{}),approval:e.approval,serviceRelease:e.serviceRelease
    };
  });
}
export function isFleetLifecycleEvent(value:unknown):value is FleetLifecycleEvent {
  if (!value || typeof value!=='object') return false;
  const event=value as Record<string,unknown>;
  const isRecord=(item:unknown):item is Record<string,unknown>=>!!item && typeof item==='object' && !Array.isArray(item);
  const article=event.article;
  return event.assetId==='SP-ARDHI-26'
    && typeof event.id==='string'
    && ['repair','upgrade','maintenance','field_test'].includes(String(event.type))
    && ['reported','diagnosing','repair_pending','repaired','verified','planned','ordered','installed','testing_pending','completed'].includes(String(event.status))
    && typeof event.title==='string'
    && (event.occurredOn===null || typeof event.occurredOn==='string')
    && (event.reportedOn===null || typeof event.reportedOn==='string')
    && typeof event.summary==='string'
    && Array.isArray(event.componentIds) && event.componentIds.every(id=>typeof id==='string')
    && Array.isArray(event.relatedEventIds) && event.relatedEventIds.every(id=>typeof id==='string')
    && Array.isArray(event.evidence)
    && event.evidence.every(item=>isRecord(item) && ['photo','video','supplier','inspection'].includes(String(item.kind)) && typeof item.label==='string' && typeof item.reviewed==='boolean' && (item.url===undefined || typeof item.url==='string'))
    && (article===undefined || article===null || (isRecord(article) && ['draft','published'].includes(String(article.state)) && typeof article.title==='string' && (article.postId===undefined || (Number.isSafeInteger(article.postId) && Number(article.postId)>0)) && (article.url===undefined || typeof article.url==='string')))
    && (event.approval==='pending' || event.approval==='reviewed')
    && ['blocked','pending','approved'].includes(String(event.serviceRelease));
}
export function mergePublicLifecycleEvents(assetId:string, databaseEvents:readonly FleetLifecycleEvent[]|null) {
  const editorial=publicLifecycleForAsset(assetId);
  if (!databaseEvents) return editorial;
  const reviewed=databaseEvents.filter(event=>event.assetId===assetId && event.approval==='reviewed');
  const retainedBlockers=editorial.filter(event=>event.serviceRelease==='blocked' && !reviewed.some(db=>db.id===event.id && db.serviceRelease==='blocked'));
  const database=reviewed.filter(event=>!retainedBlockers.some(blocked=>blocked.id===event.id));
  const fallback=editorial.filter(event=>!reviewed.some(db=>db.id===event.id) && !retainedBlockers.some(blocked=>blocked.id===event.id));
  return [...database,...fallback,...retainedBlockers].sort((a,b)=>(b.occurredOn??b.reportedOn??'').localeCompare(a.occurredOn??a.reportedOn??'')||a.id.localeCompare(b.id));
}
