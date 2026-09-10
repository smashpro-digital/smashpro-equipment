import type { ReactNode } from "react";

/** Shared documentary hero shell using ARDHI's established visual rules. */
export function PassportHero({ titleId, image, alt, className = "", children }: {
  titleId: string; image: string; alt: string; className?: string; children: ReactNode;
}) {
  return <section className={`ardhi-v2-hero${className ? ` ${className}` : ""}`} aria-labelledby={titleId}>
    <img src={image} alt={alt} fetchPriority="high" />
    <div className="ardhi-v2-hero__shade" />
    <div className="shell ardhi-v2-hero__copy">{children}</div>
  </section>;
}
