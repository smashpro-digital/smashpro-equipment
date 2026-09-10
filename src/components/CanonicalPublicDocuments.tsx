import { useEffect, useState } from "react";
type PublicDocument = { document_id: number; title: string; document_type: string; source_type: string; document_url: string };
const publicUrl = (value: string) => { try { const url = new URL(value, "https://smashpro.app"); return ["https:", "http:"].includes(url.protocol) ? url.href : undefined; } catch { return undefined; } };
export function CanonicalPublicDocuments({ assetCode, showStatus = false }: { assetCode: string; showStatus?: boolean }) {
  const [documents, setDocuments] = useState<PublicDocument[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    setStatus("loading"); setDocuments([]);
    const apiBase = (import.meta.env.VITE_PUBLIC_EQUIPMENT_API_BASE || "https://smashpro.app/api").replace(/\/$/, "");
    fetch(`${apiBase}/tech_companion.php?resource=fleet_public_asset_passport&asset_code=${encodeURIComponent(assetCode)}`, { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("Document service unavailable"); return response.json(); })
      .then(payload => {
        if (!Array.isArray(payload?.documents) || payload?.ok === false) throw new Error("Document response unavailable");
        const records = payload.documents.filter((doc: PublicDocument) => doc && typeof doc.title === "string" && typeof doc.document_url === "string" && publicUrl(doc.document_url));
        if (active) { setDocuments(records); setStatus("loaded"); }
      })
      .catch(() => { if (active) setStatus("error"); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [assetCode, attempt]);
  if (!documents.length) {
    if (!showStatus) return null;
    return <div className="passport-document-status" role="status">{status === "loading" ? "Loading public documents…" : status === "error" ? <>Public documents are temporarily unavailable. <button type="button" onClick={() => setAttempt(value => value + 1)}>Retry documents</button></> : "No public factory documents are currently attached. The generated passport record remains available below."}</div>;
  }
  return <div className="canonical-public-documents"><p className="eyebrow">Factory documentation</p><div className="download-list">{documents.map(document => <a key={document.document_id} href={publicUrl(document.document_url)} target="_blank" rel="noreferrer">{document.title}<span>{(document.document_type ?? "document").replaceAll("_", " ")} · {document.source_type ?? "Public record"}</span></a>)}</div></div>;
}
