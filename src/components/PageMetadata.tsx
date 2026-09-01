import { useEffect } from "react";

interface PageMetadataProps { title: string; description: string; canonical: string; }

export function PageMetadata({ title, description, canonical }: PageMetadataProps) {
  useEffect(() => {
    document.title = title;
    const descriptionElement = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canonicalElement = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    descriptionElement?.setAttribute("content", description);
    canonicalElement?.setAttribute("href", canonical);
  }, [canonical, description, title]);
  return null;
}
