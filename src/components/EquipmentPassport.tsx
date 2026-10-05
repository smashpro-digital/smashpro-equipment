import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import type { Equipment } from "../types/equipment";
import type {
  PassportPublicProjection,
  PassportRecord,
  SectionKey,
} from "../domain/passportAutomation";
import { lifecycleStageStatus } from "../domain/passportAutomation";
import { passportTemplates } from "../domain/passportTemplates";
import { PageFrame } from "./PageFrame";
import { PassportHero } from "./PassportHero";
import { PassportEvidenceRecord } from "./PassportEvidenceRecord";
import { PassportDocumentRecord } from "./PassportDocumentRecord";
import { FleetLifecycleProgress } from "./FleetLifecycleProgress";
import { SeoSchema } from "./SeoSchema";
type Props = {
  passport: PassportPublicProjection;
};
const rows = (p: PassportPublicProjection, kind: PassportRecord["kind"]) =>
  p.records.filter((r) => r.kind === kind);
const stateLabel = (state: string) => state.replaceAll("_", " ");
/** Compatibility adapter for printable document/SEO, constructed ONLY from public data. */
function documentItem(p: PassportPublicProjection): Equipment {
  const a = p.asset,
    hero = p.records.find((r) => r.id === a.hero_media_id);
  return {
    fleetId: a.fleet_id,
    slug: a.slug,
    publicPath: a.public_path,
    name: a.name,
    manufacturer: a.manufacturer,
    category: a.asset_class,
    showroomGroup: "field-fleet",
    showroomOrder: 1,
    meaning: "",
    slogan: "",
    overview: a.overview,
    capabilityStatement: a.overview,
    heroImage: hero?.url ?? "",
    status: "planned",
    statusLabel: a.status_label,
    statusDetail: a.status_detail,
    identity: {
      passportId: a.passport_id,
      model: a.fleet_id,
      factoryModel: a.oem_model,
      edition: a.edition,
      modelYear: a.model_year,
      assetClass: a.asset_class,
    },
    specifications: rows(p, "specification").map((s) => ({
      label: s.title,
      value: s.value ?? "",
      confirmed: s.evidence_state === "verified",
      group: s.group_label ?? s.group_id,
      source: s.source_ref,
    })),
    factoryOptions: [],
    upgrades: [],
    packageRules: [],
    attachments: [],
    includedItems: [],
    documents: [],
    serviceHistory: [],
    timeline: [],
    media: [],
    scores: { documentation: 0, maintenance: 0 },
    valuation: { currency: "USD", status: "pending" },
    capabilities: [],
    idealUses: [],
    restrictions: p.build.restrictions,
    gallery: [],
    requirements: [],
  };
}
function Overview({ passport: p }: Props) {
  return (
    <div className="liftmate-current-state">
      {p.build.gates.map((g, i) => (
        <article key={g.id} className={i === 0 ? "is-current" : ""}>
          <span>{g.label}</span>
          <strong>{g.title}</strong>
          <p>{g.detail}</p>
        </article>
      ))}
    </div>
  );
}
function Identity({ passport: p }: Props) {
  const a = p.asset,
    oem = p.records.find(
      (r) => r.group_id === "identity" && r.kind === "media",
    );
  return (
    <dl className="liftmate-identity">
      <div className="liftmate-identity__oem">
        {oem?.url && (
          <span className="liftmate-identity__thumbnail">
            <img
              src={oem.url}
              alt={oem.alt}
              width="1200"
              height="1200"
              loading="lazy"
            />
          </span>
        )}
        <div>
          <dt>OEM platform</dt>
          <dd>
            {a.manufacturer} {a.oem_model}
          </dd>
          {oem && <small>{oem.title}</small>}
        </div>
      </div>
      {[
        ["SmashPro identity", a.fleet_id],
        ["Edition", a.edition],
        ["Model year", a.model_year],
        ["Passport ID", a.passport_id],
        ["Evidence state", a.status_label],
      ].map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
function Configuration({ passport: p }: Props) {
  return (
    <>
      <div className="liftmate-configuration">
        {rows(p, "configuration").map((r) => (
          <article key={r.id}>
            <span
              className={`liftmate-state is-${r.evidence_state}`}
              data-evidence-state={r.evidence_state}
            >
              {stateLabel(r.evidence_state)}
            </span>
            <h3>{r.title}</h3>
            <p>{r.detail}</p>
          </article>
        ))}
      </div>
      <div
        className="liftmate-state-key"
        aria-label="Configuration evidence states"
      >
        {[
          "requested",
          "review_pending",
          "approved",
          "installed",
          "field_validated",
        ].map((s) => (
          <span
            key={s}
            className={
              rows(p, "configuration").some((r) => r.evidence_state === s)
                ? "is-active"
                : ""
            }
          >
            {stateLabel(s)}
          </span>
        ))}
      </div>
    </>
  );
}
function Partners({ passport: p }: Props) {
  return (
    <div className="liftmate-partnership">
      <div>
        {rows(p, "partner").map((r) => (
          <article key={r.id}>
            <h3>{r.title}</h3>
            <p>
              <strong>OEM platform:</strong> {r.value}
            </p>
            <p>
              <strong>Relationship state:</strong> {r.detail}
            </p>
            <small>{stateLabel(r.evidence_state)}</small>
          </article>
        ))}
        {rows(p, "relationship")
          .filter((r) => r.url)
          .map((r) => (
            <a className="liftmate-primary-link" key={r.id} href={r.url}>
              {r.title} <span aria-hidden="true">→</span>
            </a>
          ))}
      </div>
      <aside>
        <span>Two connected chapters</span>
        <strong>Story / editorial</strong>
        <i aria-hidden="true">↕</i>
        <strong>Technical Passport / lifecycle</strong>
        <small>No private commercial terms are published.</small>
      </aside>
    </div>
  );
}
function Journey({ passport: p }: Props) {
  const stages = passportTemplates[p.asset.build_type].lifecycleStages.map(
    (s) => {
      const status = lifecycleStageStatus(p, s.id);
      return { ...s, status, progress: status === "complete" ? 100 : 0 };
    },
  );
  const current = stages.findIndex((s) => s.status === "current"),
    copy = p.build.sections.journey;
  return (
    <FleetLifecycleProgress
      stages={stages}
      metrics={[
        {
          id: "recorded",
          label: "Recorded public events",
          value: rows(p, "evidence").length,
        },
        {
          id: "approved",
          label: "Approved modifications",
          value: rows(p, "configuration").filter((r) =>
            ["approved", "installed", "field_validated"].includes(
              r.evidence_state,
            ),
          ).length,
        },
        {
          id: "validated",
          label: "Completed field tests",
          value: rows(p, "field_test").filter(
            (r) => r.test_state === "validated",
          ).length,
        },
      ]}
      currentStage={stages[current]?.label ?? "Evidence pending"}
      nextStage={stages[current + 1]?.label ?? "Evidence pending"}
      eyebrow={copy?.eyebrow}
      title={copy?.title}
      description={
        copy?.description ??
        "Stages advance only with supporting public evidence."
      }
    />
  );
}
function Specifications({ passport: p }: Props) {
  const specs = rows(p, "specification");
  return (
    <div className="liftmate-spec-groups">
      {[...new Set(specs.map((s) => s.group_id ?? "Specifications"))].map(
        (group) => (
          <article key={group}>
            <h3>
              {specs.find((s) => (s.group_id ?? "Specifications") === group)
                ?.group_label ?? group}
            </h3>
            <dl>
              {specs
                .filter((s) => (s.group_id ?? "Specifications") === group)
                .map((s) => (
                  <div key={s.id}>
                    <dt>{s.title}</dt>
                    <dd>
                      {s.value}
                      <small>
                        {s.evidence_state === "verified"
                          ? "Published / allocated"
                          : "Confirmation pending"}
                      </small>
                      {s.source_ref && <small>{s.source_ref}</small>}
                    </dd>
                  </div>
                ))}
            </dl>
          </article>
        ),
      )}
    </div>
  );
}
function FieldTests({ passport: p }: Props) {
  return (
    <>
      <div className="liftmate-test-grid">
        {rows(p, "field_test").map((r, i) => (
          <article key={r.id} data-test-state={r.test_state}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <small>{r.value ?? stateLabel(r.test_state ?? "planned")}</small>
            <h3>{r.title}</h3>
            <p>{r.detail}</p>
          </article>
        ))}
      </div>
      <div className="liftmate-boundary">
        <strong>Operating boundary</strong>
        <ul>
          {p.build.restrictions.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        {rows(p, "relationship")
          .filter((r) => r.group_id === "fieldTests")
          .map((r) => (
            <p key={r.id}>
              {r.title}: {r.detail}
            </p>
          ))}
      </div>
    </>
  );
}
function Media({ passport: p }: Props) {
  const media = rows(p, "media").filter((r) => r.group_id !== "identity");
  return (
    <div className="liftmate-media-archive">
      {media
        .filter((r) => r.url)
        .map((r) => (
          <figure
            key={r.id}
            data-media-kind={r.media_kind}
            data-evidence-state={r.evidence_state}
          >
            {r.media_type === "video" ? (
              <video
                src={r.url}
                controls
                preload="metadata"
                aria-label={r.alt}
              />
            ) : (
              <img
                src={r.url}
                alt={r.alt}
                width={r.width}
                height={r.height}
                loading="lazy"
                style={{ objectFit: "contain" }}
              />
            )}
            <figcaption>
              <strong>
                {r.title} · {stateLabel(r.evidence_state)}
              </strong>
              <span>{r.detail}</span>
            </figcaption>
          </figure>
        ))}
      {passportTemplates[p.asset.build_type].mediaDestinations
        .filter((d) => !media.some((r) => r.media_kind === d.id && r.url))
        .map((d) => (
          <article key={d.id}>
            <span>Awaiting evidence</span>
            <h3>{d.label}</h3>
            <p>
              Awaiting verified partner/factory evidence. This chapter activates
              only when verified public media is received.
            </p>
          </article>
        ))}
    </div>
  );
}
function Documents({ passport: p }: Props) {
  const docs = rows(p, "document");
  return (
    <>
      <PassportDocumentRecord item={documentItem(p)} />
      <div className="liftmate-document-slots">
        {docs.map((r) => (
          <article key={r.id}>
            <span>{stateLabel(r.evidence_state)}</span>
            <h3>{r.title}</h3>
            <p>{r.detail}</p>
            {r.url ? (
              <a href={r.url}>Open document</a>
            ) : (
              <p>No downloadable file is published.</p>
            )}
          </article>
        ))}
        {passportTemplates[p.asset.build_type].documentDestinations
          .filter((d) => !docs.some((r) => r.document_kind === d.id))
          .map((d) => (
            <article key={d.id}>
              <span>Pending public record</span>
              <h3>{d.label}</h3>
              <p>No downloadable file is published.</p>
            </article>
          ))}
      </div>
    </>
  );
}
function History({ passport: p }: Props) {
  return (
    <div className="liftmate-evidence-list">
      {rows(p, "evidence").map((r, i) => (
        <PassportEvidenceRecord
          key={r.id}
          id={`history-${r.id}`}
          date={r.occurred_at ?? "Date not published"}
          phase={stateLabel(r.evidence_state)}
          title={r.title}
          label="Documented · Open record"
          defaultOpen={i === 0}
        >
          <p>{r.detail}</p>
          {r.decision && <p>{r.decision}</p>}
          {r.supplier && <p>{r.supplier}</p>}
          {r.photos?.map((src) => (
            <img key={src} src={src} alt={r.title} loading="lazy" />
          ))}
          <dl>
            <div>
              <dt>Evidence state</dt>
              <dd>{stateLabel(r.evidence_state)}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{r.source_ref ?? stateLabel(r.source_type)}</dd>
            </div>
          </dl>
        </PassportEvidenceRecord>
      ))}
    </div>
  );
}
function StageRecords({ passport: p }: Props) {
  return (
    <div className="liftmate-evidence-list">
      {rows(p, "lifecycle_event").map((r) => (
        <article key={r.id}>
          <h3>{r.title}</h3>
          <p>{r.detail}</p>
          <small>{stateLabel(r.evidence_state)}</small>
        </article>
      ))}
    </div>
  );
}
export const passportSections: Record<SectionKey, ComponentType<Props>> = {
  overview: Overview,
  identity: Identity,
  partners: Partners,
  configuration: Configuration,
  journey: Journey,
  shipping: StageRecords,
  specifications: Specifications,
  fieldTests: FieldTests,
  media: Media,
  documents: Documents,
  commissioning: StageRecords,
  history: History,
};
export function visiblePassportSections(p: PassportPublicProjection) {
  const kind: Partial<Record<SectionKey, PassportRecord["kind"]>> = {
    partners: "partner",
    configuration: "configuration",
    specifications: "specification",
    fieldTests: "field_test",
    media: "media",
    documents: "document",
    history: "evidence",
  };
  return passportTemplates[p.asset.build_type].sections.filter(
    (s) =>
      s.emptyStatePolicy === "pending" ||
      ["overview", "identity", "journey"].includes(s.key) ||
      (kind[s.key]
        ? rows(p, kind[s.key]!).length > 0
        : p.records.some(
            (r) => r.kind === "lifecycle_event" && r.group_id === s.key,
          )),
  );
}
export function EquipmentPassport({ passport: p }: Props) {
  const a = p.asset,
    hero = p.records.find((r) => r.id === a.hero_media_id),
    sections = visiblePassportSections(p);
  return (
    <PageFrame>
      <SeoSchema item={documentItem(p)} />
      <div
        className="liftmate-passport"
        data-passport-renderer="generic"
        data-build-type={a.build_type}
      >
        <nav className="shell breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Equipment</Link>
          <span>/</span>
          <span aria-current="page">Passport {a.fleet_id}</span>
        </nav>
        {hero?.url && (
          <PassportHero
            titleId="passport-title"
            image={hero.url}
            alt={hero.alt ?? ""}
            width={hero.width}
            height={hero.height}
            className="liftmate-hero"
          >
            <p className="eyebrow">{p.build.hero_eyebrow}</p>
            <h1 id="passport-title">{a.fleet_id}</h1>
            <p className="liftmate-hero__platform">
              {a.manufacturer} {a.oem_model}
            </p>
            <p className="lead">{a.edition}</p>
            <div className="liftmate-hero__status">
              <span>{a.status_label}</span>
              <p>{a.status_detail}</p>
            </div>
            <div className="ardhi-v2-hero__actions">
              {sections
                .filter((s) => s.heroAction)
                .map((s) => (
                  <a key={s.id} href={`#${s.id}`}>
                    {s.heroAction}
                  </a>
                ))}
            </div>
            <small>{p.build.hero_caption}</small>
          </PassportHero>
        )}
        <nav
          className="passport-rail liftmate-rail"
          aria-label={`${a.fleet_id} Passport sections`}
        >
          <div className="shell">
            <strong>{a.fleet_id}</strong>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ))}
          </div>
        </nav>
        {sections.map((s) => {
          const Component = passportSections[s.key],
            copy = p.build.sections[s.key];
          if (s.key === "journey")
            return (
              <div key={s.id} id={s.id}>
                <Component passport={p} />
              </div>
            );
          return (
            <section
              key={s.id}
              className={`section shell passport-section-${s.key}`}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{copy?.eyebrow ?? s.label}</p>
                  <h2 id={`${s.id}-title`} style={{ whiteSpace: "pre-line" }}>
                    {copy?.title ?? s.label}
                  </h2>
                </div>
                {copy?.description && <p>{copy.description}</p>}
              </div>
              <Component passport={p} />
            </section>
          );
        })}
      </div>
    </PageFrame>
  );
}
