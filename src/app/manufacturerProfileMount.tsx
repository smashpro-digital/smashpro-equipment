import { createRoot, type Root } from "react-dom/client";
import { ManufacturerProfile, type ManufacturerProfileData } from "../components/ManufacturerProfile";

const infrontLogo = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220"><rect width="260" height="220" rx="14" fill="#fff"/><g transform="translate(28 18)"><path d="M22 64V34L66 8l44 26v36h-15V43L66 26 37 43v21z" fill="#f26a00"/><path d="M84 58h41c8 0 14 6 14 14v27H84z" fill="#f26a00"/><path d="M53 52h29v47H43V66c0-8 4-14 10-14zm8 10c-4 0-7 3-7 7v18h16V62z" fill="#111"/><rect x="18" y="96" width="128" height="18" rx="9" fill="#111"/><rect x="10" y="112" width="148" height="39" rx="18" fill="#111"/><circle cx="38" cy="131.5" r="9" fill="#fff"/><circle cx="70" cy="131.5" r="9" fill="#fff"/><circle cx="102" cy="131.5" r="9" fill="#fff"/><circle cx="134" cy="131.5" r="9" fill="#fff"/><circle cx="16" cy="88" r="8" fill="#111"/></g><text x="24" y="198" font-family="Arial,Helvetica,sans-serif" font-size="55" font-weight="800" letter-spacing="-3" fill="#111">infront</text><circle cx="27" cy="157" r="6" fill="#f26a00"/></svg>`)}`;

const infrontProfile: ManufacturerProfileData = {
  displayName: "Shandong Infront Machinery Co., Ltd.",
  location: "Jining City, Shandong, China",
  address: "No. 52, Jinyu Road, Jining City, Shandong, China 272000",
  website: "https://www.chinaiift.com",
  email: "sales36@chinaiift.com",
  logoSrc: infrontLogo,
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
