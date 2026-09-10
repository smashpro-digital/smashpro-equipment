import { useEffect, useRef, useState } from "react";
import type { Equipment } from "../types/equipment";
import { calculatePackages, calculatePassportScores } from "../domain/passport";
import { WindowSticker } from "./WindowSticker";

export function PassportDocumentRecord({ item }: { item: Equipment }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const follow = () => { if (["#window-sticker", "#mzigo-configuration-document"].includes(window.location.hash)) setOpen(true); };
    follow(); window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, []);
  useEffect(() => { if (open && !dialog.current?.open) dialog.current?.showModal(); }, [open]);
  return <article className="passport-generated-record" id="mzigo-configuration-document">
    <div><p className="eyebrow">Generated from this passport</p><h3>Equipment configuration record</h3><p>Identity, documented configuration and pending specification values in one printable record. This is not a signed factory certificate.</p></div>
    <button type="button" onClick={() => setOpen(true)}>Open configuration record</button>
    <dialog className="passport-document-dialog" ref={dialog} aria-label={`${item.fleetId} configuration record`} onClose={() => setOpen(false)}>
      {open && <><header><strong>{item.fleetId} · Configuration record</strong><button type="button" autoFocus onClick={() => dialog.current?.close()}>Close record</button></header><div className="passport-document-scroll"><WindowSticker item={item} packages={calculatePackages(item.upgrades, item.packageRules)} scores={calculatePassportScores(item)} compact evidenceMode /></div></>}
    </dialog>
  </article>;
}
