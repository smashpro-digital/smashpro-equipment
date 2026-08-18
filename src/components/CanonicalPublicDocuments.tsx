import { useEffect, useState } from "react";

type PublicDocument = {
  document_id: number;
  title: string;
  document_type: string;
  source_type: string;
  document_url: string;
};

export function CanonicalPublicDocuments({ assetCode }: { assetCode: string }) {
  const [documents, setDocuments] = useState<PublicDocument[]>([]);

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_PUBLIC_EQUIPMENT_API_BASE || "https://smashpro.app/api").replace(/\/$/, "");
    const url = `${apiBase}/tech_companion.php?resource=fleet_public_asset_passport&asset_code=${encodeURIComponent(assetCode)}`;
    fetch(url)
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => setDocuments(Array.isArray(payload?.documents) ? payload.documents : []))
      .catch(() => setDocuments([]));
  }, [assetCode]);

  if (!documents.length) return null;

  return <div className="canonical-public-documents">
    <p className="eyebrow">Factory documentation</p>
    <div className="download-list">
      {documents.map((document) => <a key={document.document_id} href={document.document_url.startsWith("/") ? `https://smashpro.app${document.document_url}` : document.document_url} target="_blank" rel="noreferrer">
        {document.title}<span>{document.document_type.replaceAll("_", " ")} · {document.source_type}</span>
      </a>)}
    </div>
  </div>;
}
