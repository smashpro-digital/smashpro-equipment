import { publicPassports } from "virtual:passport-public";
import { EquipmentPassport } from "../components/EquipmentPassport";
import { NotFoundPage } from "./NotFoundPage";
export function GenericPassportRoute({ assetId }: { assetId: string }) {
  const passport = publicPassports.find((p) => p.asset.id === assetId);
  return passport ? (
    <EquipmentPassport passport={passport} />
  ) : (
    <NotFoundPage />
  );
}
export const genericPassportRoutes = publicPassports.map((p) => ({
  path: p.asset.public_path,
  assetId: p.asset.id,
}));
