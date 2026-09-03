export type EquipmentLifecyclePhase = "transit" | "on-job";

export type EquipmentJobAssignment = {
  jobId: string;
  equipmentSlug: string;
  status: "scheduled" | "checked-in" | "checked-out";
  scheduledStart?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  projectedHours?: number;
  actualHours?: number;
};

export type LifecycleMetric = {
  id: string;
  label: string;
  value: string;
  detail?: string;
};

export type TransitMetricContext = {
  approximateDistanceMiles: number;
  journeyStage: number;
  journeyStageCount: number;
  journeyStageLabel: string;
  arrivalDate: string;
  productionCompleteDate: string;
};

const DAY_MS = 86_400_000;

const daysBetween = (start: Date, end: Date) => Math.max(0, Math.ceil((end.getTime() - start.getTime()) / DAY_MS));

const formatShortDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function buildTransitMetrics(context: TransitMetricContext, now = new Date()): LifecycleMetric[] {
  const arrival = new Date(context.arrivalDate);
  const productionComplete = new Date(context.productionCompleteDate);

  return [
    {
      id: "distance",
      label: "Approx. distance",
      value: `${Math.round(context.approximateDistanceMiles).toLocaleString()} mi`,
    },
    {
      id: "stage",
      label: "Journey stage",
      value: `${context.journeyStage} / ${context.journeyStageCount}`,
      detail: context.journeyStageLabel,
    },
    {
      id: "remaining",
      label: "Days remaining",
      value: String(daysBetween(now, arrival)),
      detail: `To ${formatShortDate(arrival)} estimate`,
    },
    {
      id: "production-age",
      label: "Since production",
      value: String(daysBetween(productionComplete, now)),
      detail: `Since ${formatShortDate(productionComplete)}`,
    },
  ];
}

export function buildJobMetrics(assignment: EquipmentJobAssignment, now = new Date()): LifecycleMetric[] {
  const projectedHours = assignment.projectedHours ?? 0;
  const actualHours = assignment.actualHours ?? 0;
  const jobStart = assignment.checkedInAt ?? assignment.scheduledStart;
  const jobEnd = assignment.checkedOutAt ? new Date(assignment.checkedOutAt) : now;
  const utilization = projectedHours > 0 ? Math.round((actualHours / projectedHours) * 100) : 0;

  return [
    {
      id: "days-on-job",
      label: "Days on job",
      value: jobStart ? String(daysBetween(new Date(jobStart), jobEnd)) : "0",
      detail: assignment.status === "checked-in" ? "Currently checked in" : assignment.status === "checked-out" ? "Job complete" : "Scheduled",
    },
    {
      id: "projected-hours",
      label: "Projected hours",
      value: projectedHours.toFixed(1),
    },
    {
      id: "actual-hours",
      label: "Actual hours",
      value: actualHours.toFixed(1),
    },
    {
      id: "utilization",
      label: "Utilization",
      value: projectedHours > 0 ? `${utilization}%` : "—",
      detail: projectedHours > 0 ? "Actual vs projected" : "Awaiting job estimate",
    },
  ];
}

export type EquipmentJobGateway = {
  getActiveAssignment(equipmentSlug: string): Promise<EquipmentJobAssignment | null>;
  checkIn(jobId: string, equipmentSlug: string, checkedInAt?: string): Promise<EquipmentJobAssignment>;
  checkOut(jobId: string, equipmentSlug: string, actualHours: number, checkedOutAt?: string): Promise<EquipmentJobAssignment>;
};
