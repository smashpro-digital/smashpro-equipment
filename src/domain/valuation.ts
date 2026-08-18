/** Server-only valuation contract. Do not import this module into public UI entry points. */
export interface PrivateValuationInputs {
  purchasePrice: number;
  totalUpgradeInvestment: number;
  currentReplacementCost: number;
  currentMarketValue: number;
  retainedFactoryOptionValue: number;
  retainedUpgradeValue: number;
  editionPremium: number;
  depreciationAmount: number;
  maintenanceScore: number;
  documentationScore: number;
  operatingHours: number;
  rentalRevenueGenerated: number;
  maintenanceInvestment: number;
}

export interface ValuationResult { estimatedFleetValue: number; maintenanceMultiplier: number; documentationMultiplier: number; netAssetRoi: number; totalInvestment: number; hasPaidForItself: boolean; methodologyVersion: "passport-v2"; }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function calculateFleetValue(input: PrivateValuationInputs): ValuationResult {
  const maintenanceMultiplier = 0.8 + clamp(input.maintenanceScore, 0, 100) * 0.002;
  const documentationMultiplier = 0.9 + clamp(input.documentationScore, 0, 100) * 0.001;
  const hourAdjustment = Math.max(0, input.operatingHours) * 0.35;
  const basis = Math.max(0, input.currentMarketValue + input.retainedFactoryOptionValue + input.retainedUpgradeValue + input.editionPremium - input.depreciationAmount - hourAdjustment);
  const estimatedFleetValue = Math.round(basis * maintenanceMultiplier * documentationMultiplier);
  const totalInvestment = input.purchasePrice + input.totalUpgradeInvestment + input.maintenanceInvestment;
  const netAssetRoi = input.rentalRevenueGenerated + estimatedFleetValue - totalInvestment;
  return { estimatedFleetValue, maintenanceMultiplier, documentationMultiplier, netAssetRoi, totalInvestment, hasPaidForItself: input.rentalRevenueGenerated >= totalInvestment, methodologyVersion: "passport-v2" };
}
