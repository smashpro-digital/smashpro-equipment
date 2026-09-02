import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import type { CalculatedPackage, Equipment, PassportScores } from "../types/equipment";

export function WindowSticker({ item, packages, scores, compact = false, showActions = true }: { item: Equipment; packages: CalculatedPackage[]; scores: PassportScores; compact?: boolean; showActions?: boolean }) {
  const [qr, setQr] = useState("");
  const stickerRef = useRef<HTMLElement>(null);
  const url = `https://smashpro.app/equipment${item.publicPath}`;
  useEffect(() => { void QRCode.toDataURL(url, { width: 420, margin: 1, color: { dark: "#07100c", light: "#ffffff" }, errorCorrectionLevel: "H" }).then(setQr); }, [url]);
  const value = item.valuation.status === "current" && item.valuation.amount ? new Intl.NumberFormat("en-US", { style: "currency", currency: item.valuation.currency, maximumFractionDigits: 0 }).format(item.valuation.amount) : "Pending verified valuation";
  const downloadPng = async () => { if (!stickerRef.current) return; const dataUrl = await toPng(stickerRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" }); const link = document.createElement("a"); link.download = `${item.fleetId}-window-sticker.png`; link.href = dataUrl; link.click(); };
  return <section className={`${compact ? "window-sticker-wrap is-compact" : "section shell window-sticker-wrap"}`} id="window-sticker">{showActions ? <div className="sticker-actions"><div><p className="eyebrow">Digital birth certificate</p><h2>Equipment Window Sticker</h2></div><div><a href="#window-sticker">View Full</a><button type="button" onClick={() => window.print()}>Download PDF</button><button type="button" onClick={() => void downloadPng()}>Download PNG</button><button type="button" onClick={() => window.print()}>Print</button></div></div> : null}
    <article className="window-sticker" ref={stickerRef} data-window-sticker-certificate>
      <header><div><span>SmashPro Fleet</span><h2>{item.identity.model}</h2><p>{item.identity.edition}</p></div><div className="sticker-passport"><small>Permanent Passport ID</small><strong>{item.identity.passportId}</strong></div>{qr ? <img src={qr} alt={`QR code opening the ${item.fleetId} equipment passport`} /> : null}</header>
      <div className="sticker-identity"><div><span>Fleet ID</span><strong>{item.fleetId}</strong></div><div><span>Finish</span><strong>{item.identity.finish ?? "Not published"}</strong></div><div><span>Estimated Fleet Value</span><strong>{value}</strong></div></div>
      <div className="sticker-body"><section><h3>Factory Specifications</h3><dl>{item.specifications.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}</dl></section><aside>
        <h3>Factory Options</h3>{item.factoryOptions.filter(({ publicDisplay }) => publicDisplay).length ? <ul>{item.factoryOptions.filter(({ publicDisplay }) => publicDisplay).map(({ id, name }) => <li key={id}>{name}</li>)}</ul> : <p>None published</p>}
        <h3>Installed Packages</h3>{packages.length ? <ul>{packages.map(({ id, name }) => <li key={id}>{name}</li>)}</ul> : <p>No package currently qualified</p>}
        <h3>Attachments Included</h3><ul>{item.attachments.filter(({ status }) => status === "installed").map(({ id, name }) => <li key={id}>{name}</li>)}</ul>
        {item.includedItems.length ? <><h3>Included Accessories</h3><ul>{item.includedItems.map(({ id, name }) => <li key={id}>{name}</li>)}</ul></> : null}
      </aside></div>
      <footer><div><span>Documentation Score</span><strong>{scores.documentation}/100</strong></div><div><span>Maintenance Score</span><strong>{scores.maintenance}/100</strong></div><p>Scan to verify this machine's living equipment passport.</p></footer>
    </article>
  </section>;
}
