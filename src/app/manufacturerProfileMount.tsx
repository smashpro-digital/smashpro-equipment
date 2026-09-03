import { createRoot, type Root } from "react-dom/client";
import { ManufacturerProfile, type ManufacturerProfileData } from "../components/ManufacturerProfile";

const infrontProfile: ManufacturerProfileData = {
  displayName: "Shandong Infront Machinery Co., Ltd.",
  location: "Jining City, Shandong, China",
  address: "No. 52, Jinyu Road, Jining City, Shandong, China 272000",
  website: "https://www.chinaiift.com",
  email: "sales36@chinaiift.com",
  logoSrc: "/equipment/images/infront-official-logo-pure.svg",
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
  const specifications = passport?.querySelector<HTMLElement>("#specifications");
  if (!passport || !specifications) return;

  const mount = document.createElement("div");
  mount.dataset.manufacturerProfileMount = "infront";
  specifications.insertAdjacentElement("afterend", mount);
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
