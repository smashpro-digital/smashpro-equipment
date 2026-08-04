import type { ReactNode } from "react";

interface Props { href: string; children: ReactNode; variant?: "primary" | "outline" | "quiet"; external?: boolean; }

export function ButtonLink({ href, children, variant = "primary", external = false }: Props) {
  return <a className={`button button--${variant}`} href={href} {...(external ? { rel: "noreferrer" } : {})}>{children}<span aria-hidden="true">↗</span></a>;
}
