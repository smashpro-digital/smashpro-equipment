import type { ReactNode } from "react";
import type { CapabilityStory, CommissioningCheck, InquiryStory } from "../types/passportExperience";
import { ButtonLink } from "./ButtonLink";
import type { FleetLifecycleStage } from "./FleetLifecycleProgress";

export function PassportJourney({ stages }: { stages: (FleetLifecycleStage & { date?: string })[] }) {
  return <ol className="passport-journey">{stages.map(stage => <li key={stage.id} data-status={stage.status}><a href={stage.href}><span>{stage.status === "complete" ? "Recorded" : stage.status === "current" ? "Current review" : "Pending"}{stage.date && <> / <time dateTime={stage.date}>{stage.date}</time></>}</span><strong>{stage.label}</strong></a></li>)}</ol>;
}

export function PassportSection({ id, eyebrow, title, description, children }: { id: string; eyebrow: string; title: string; description?: string; children: ReactNode }) {
  return <section id={id} className="section shell passport-experience-section" aria-labelledby={`${id}-title`}>
    <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2 id={`${id}-title`}>{title}</h2></div>{description && <p>{description}</p>}</div>{children}
  </section>;
}

export function PassportCapabilities({ items }: { items: CapabilityStory[] }) {
  return <div className="passport-story-grid">{items.map((item, index) => <article key={item.title}><span className="passport-story-number">{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p className="passport-classification">{item.classification}</p><p>{item.description}</p></article>)}</div>;
}

export function PassportInquiry({ story }: { story: InquiryStory }) {
  return <PassportSection id={story.id} eyebrow={story.eyebrow} title={story.title}>
    <div className="passport-inquiry"><div>{story.readiness && <p className="passport-classification">{story.readiness === "released" ? "Operational release recorded" : "Inquiries open / commissioning pending"}</p>}<p className="large-copy">{story.description}</p></div><div><p>{story.instructions}</p><ButtonLink href={story.href}>{story.action}</ButtonLink></div></div>
  </PassportSection>;
}

export function PassportCommissioning({ checks }: { checks: CommissioningCheck[] }) {
  return <ul className="passport-checks">{checks.map(check => {
    const verified = check.status === "verified" && check.evidence.length > 0;
    return <li key={check.id}><strong>{check.title}</strong><span>{verified ? "Verified with evidence" : "Pending verification"}</span>{check.evidence.map(evidence => <a key={evidence.href} href={evidence.href}>{evidence.title} ({evidence.kind})</a>)}</li>;
  })}</ul>;
}
