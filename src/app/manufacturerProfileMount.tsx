import { createRoot, type Root } from "react-dom/client";
import { ManufacturerProfile, type ManufacturerProfileData } from "../components/ManufacturerProfile";

const infrontProfile: ManufacturerProfileData = {
  displayName: "Shandong Infront Machinery Co., Ltd.",
  brand: "Infront",
  model: "YF380",
  location: "Jining, Shandong, China",
  website: "https://www.chinaiift.com",
  representative: { name: "Hailey Li", title: "Sales Manager" },
  logoSrc: "/equipment/images/infront-official-logo.svg",
  marketplaceRating: {
    platform: "Alibaba",
    score: 4.9,
    reviews: 15,
    years: 6,
    observedAt: "Sep 2026",
  },
};

let profileRoot: Root | undefined;

function mountManufacturerProfile() {
  if (document.querySelector("[data-manufacturer-profile-mount]")) return;
  const passport = document.querySelector<HTMLElement>(".ardhi-passport-ledger");
  const manufacturerDocument = passport?.querySelector<HTMLElement>(".document-card");
  if (!passport || !manufacturerDocument) return;

  const mount = document.createElement("div");
  mount.dataset.manufacturerProfileMount = "infront";
  manufacturerDocument.insertAdjacentElement("afterend", mount);
  profileRoot = createRoot(mount);
  profileRoot.render(<ManufacturerProfile profile={infrontProfile} />);
}

export function installManufacturerProfileMount() {
  mountManufacturerProfile();
  const observer = new MutationObserver(() => mountManufacturerProfile());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("pagehide", () => {
    observer.disconnect();
    profileRoot?.unmount();
    profileRoot = undefined;
  }, { once: true });
}
