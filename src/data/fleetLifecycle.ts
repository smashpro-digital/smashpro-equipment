/** Fleet lifecycle projection: append-only event identity, no operational writes.
 * Digital HQ is authoritative for service, cost, warranty and approval.
 * WordPress is editorial. A public passport is a reviewed projection only.
 */
export type FleetEventType = 'repair' | 'upgrade' | 'maintenance' | 'field_test';
export type FleetEventStatus = 'reported' | 'diagnosing' | 'repair_pending' | 'repaired' | 'verified' | 'planned' | 'ordered' | 'installed' | 'testing_pending' | 'completed';
export type FleetEvidence = { kind: 'photo' | 'video' | 'supplier' | 'inspection'; label: string; url?: string; reviewed: boolean };
export type FleetLifecycleEvent = {
  id: string; assetId: string; type: FleetEventType; status: FleetEventStatus;
  title: string; occurredOn: string; summary: string; componentIds: string[];
  relatedEventIds: string[]; evidence: FleetEvidence[];
  article?: { state: 'draft' | 'published'; url?: string; title: string };
  approval: 'pending' | 'reviewed'; serviceRelease: 'blocked' | 'pending' | 'approved';
};
export const ardhiLifecycleEvents: readonly FleetLifecycleEvent[] = [
  {
    id:'DEF-003',assetId:'SP-ARDHI-26',type:'repair',status:'repair_pending',
    title:'Thrown rubber track',occurredOn:'2026-11-08',
    summary:'Owner photographed track displaced from undercarriage. Cause and repair unverified. Awaiting OEM tension and reinstallation procedure.',
    componentIds:['rubber-track','undercarriage'],relatedEventIds:[],
    evidence:[{kind:'photo',label:'Owner track incident photo, WP media 967',reviewed:true},{kind:'photo',label:'Owner track incident photo, WP media 966',reviewed:true}],
    article:{state:'draft',title:'Field Repair 003 | Thrown track: real-world recovery'},
    approval:'pending',serviceRelease:'blocked'
  },
  {
    id:'DEF-001',assetId:'SP-ARDHI-26',type:'repair',status:'verified',
    title:'Throttle travel restored',occurredOn:'2026-11-08',
    summary:'Owner removed dust with leaf blower, applied WD-40 Specialist Dry Lube and verified full throttle travel. Cause not conclusively established.',
    componentIds:['throttle-control'],relatedEventIds:['FIELD-DIRT-DAY-001'],
    evidence:[{kind:'inspection',label:'Owner full-travel verification',reviewed:true}],
    approval:'reviewed',serviceRelease:'pending'
  },
  {
    id:'DEF-002',assetId:'SP-ARDHI-26',type:'repair',status:'repaired',
    title:'Quick-change pin retaining hardware',occurredOn:'2026-11-03',
    summary:'Missing screw replaced and additional screws fitted to both pins. Independent lock-engagement verification remains pending.',
    componentIds:['quick-change-lock'],relatedEventIds:[],
    evidence:[{kind:'photo',label:'Owner repair photographs',reviewed:true}],
    approval:'pending',serviceRelease:'pending'
  },
  {
    id:'UPG-BKT-006',assetId:'SP-ARDHI-26',type:'upgrade',status:'testing_pending',
    title:'Six-tooth bucket configuration',occurredOn:'2026-11-07',
    summary:'Six-tooth digging configuration installed; performance testing and attachment safety sign-off remain pending.',
    componentIds:['SP-ATT-BKT-001'],relatedEventIds:[],
    evidence:[{kind:'photo',label:'Owner six-tooth installation and field photos',reviewed:true}],
    approval:'pending',serviceRelease:'pending'
  }
];
export function publicLifecycleForAsset(assetId:string, events:readonly FleetLifecycleEvent[]=ardhiLifecycleEvents) {
  return events.filter(e=>e.assetId===assetId).map(e=>({
    ...e,
    evidence:e.evidence.filter(v=>v.reviewed && (!v.url || /^(https:\/\/smashpro\.app\/|\/equipment\/)/.test(v.url))),
    article:e.article?.state==='published' && e.article.url && /^https:\/\/smashpro\.app\//.test(e.article.url) ? e.article : undefined
  }));
}
