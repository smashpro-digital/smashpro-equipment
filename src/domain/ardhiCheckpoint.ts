import type { Shipment } from './shipment';
import { ardhiVerifiedVoyage } from '../data/ardhiVerifiedVoyage';

export type VerifiedCheckpointReference = {
  label: string;
  observedAt: string;
  referencePoint: { latitude: number; longitude: number };
  precision: 'whole-degree';
  note: string;
  source: { label: string; url: string };
};

function contextReviewedAt(data: Shipment): string | null {
  const context = data.vesselContext;
  if (!context) return null;
  return [...context.identitySources.map(source => source.checkedAt), context.voyage.source.checkedAt].sort().at(-1) ?? null;
}

export function selectVerifiedCheckpointReference(data: Shipment | null): VerifiedCheckpointReference | null {
  if (!data?.vesselContext || data.currentPosition) return null;
  const context = data.vesselContext;
  if (context.vessel.name !== ardhiVerifiedVoyage.vesselName || context.voyage.reference !== ardhiVerifiedVoyage.voyageReference) return null;

  const apiHasCheckpoint = context.corridor.stages.some(stage => /Savannah anchorage.*(observed|arriv)/i.test(stage));
  const reviewedAt = contextReviewedAt(data);
  const reviewedFallbackIsNewer = reviewedAt ? Date.parse(ardhiVerifiedVoyage.checkedAt) > Date.parse(reviewedAt) : true;
  if (!apiHasCheckpoint && !reviewedFallbackIsNewer) return null;

  return ardhiVerifiedVoyage.checkpoint;
}
