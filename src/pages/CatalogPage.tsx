import { useMemo, useState } from "react";
import { ButtonLink } from "../components/ButtonLink";
import { CatalogProductCard } from "../components/CatalogProductCard";
import { PageFrame } from "../components/PageFrame";
import { PageMetadata } from "../components/PageMetadata";
import { ProductStatusBadge, catalogStatusLabels } from "../components/ProductStatusBadge";
import { catalogProducts } from "../data/catalog";
import type { CatalogStatus } from "../types/catalog";

type CatalogFilter = "all" | CatalogStatus;
const pipeline = ["Problem", "Design", "Prototype", "Field Test", "Production Candidate", "Catalog Release"];

export function CatalogPage() {
  const [filter, setFilter] = useState<CatalogFilter>("all");
  const featured = catalogProducts.find((product) => product.featured) ?? catalogProducts[0];
  const statuses = [...new Set(catalogProducts.map((product) => product.status))];
  const filteredProducts = useMemo(() => filter === "all" ? catalogProducts : catalogProducts.filter((product) => product.status === filter), [filter]);

  return (
    <PageFrame>
      <PageMetadata title="SmashPro Equipment Catalog | Engineered Hardware & Product Development" description="Explore SmashPro Equipment products, prototypes, and hardware systems developed from real vehicle, shop, fabrication, and field challenges." canonical="https://smashpro.app/equipment/catalog/" />
      <div className="catalog-page">
        <section className="catalog-hero">
          <div className="catalog-hero__grid" aria-hidden="true" />
          <div className="shell catalog-hero__inner">
            <div><p className="catalog-eyebrow">SmashPro Equipment</p><h1>Engineered for the work.<br /><span>Built from the work.</span></h1></div>
            <div><p>SmashPro products begin with a real operating problem, move through documented design and field testing, and reach this catalog only when their purpose and development status can be stated clearly.</p><div className="catalog-actions"><ButtonLink href="#products">Explore products</ButtonLink><ButtonLink href="/equipment/catalog/sp-pcm-001/" variant="outline">Follow product development</ButtonLink></div></div>
          </div>
        </section>

        {featured && <section className="catalog-feature" aria-labelledby="featured-product-title">
          <div className="shell catalog-feature__grid">
            <div className="catalog-feature__image"><img src={featured.image} alt={featured.imageAlt} width="1200" height="800" decoding="async" /></div>
            <div className="catalog-feature__copy"><p className="catalog-eyebrow">Featured product development</p><ProductStatusBadge status={featured.status} /><p className="catalog-product-id">{featured.id} · {featured.revision}</p><h2 id="featured-product-title">{featured.name}</h2><p>{featured.description}</p><dl><div><dt>Platform</dt><dd>{featured.platform}</dd></div><div><dt>Application</dt><dd>{featured.application}</dd></div><div><dt>Availability</dt><dd>Development record · Not for sale</dd></div></dl><ButtonLink href={featured.href}>Open the development record</ButtonLink></div>
          </div>
        </section>}

        <section className="catalog-products" id="products" aria-labelledby="catalog-products-title">
          <div className="shell"><div className="catalog-section-head"><div><p className="catalog-eyebrow">Product catalog</p><h2 id="catalog-products-title">Documented systems and equipment.</h2></div><p>Every listing identifies its current lifecycle stage. Product IDs are distinct from SmashPro Fleet asset IDs.</p></div>
            <div className="catalog-filters" aria-label="Filter products by development status"><button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All <span>{catalogProducts.length}</span></button>{statuses.map((status) => <button type="button" key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}>{catalogStatusLabels[status]} <span>{catalogProducts.filter((product) => product.status === status).length}</span></button>)}</div>
            <div className="catalog-product-grid" aria-live="polite">{filteredProducts.map((product) => <CatalogProductCard product={product} key={product.id} />)}</div>
          </div>
        </section>

        <section className="catalog-pipeline" id="pipeline" aria-labelledby="catalog-pipeline-title"><div className="shell"><p className="catalog-eyebrow">Development pipeline</p><div className="catalog-section-head"><h2 id="catalog-pipeline-title">From field problem to catalog release.</h2><p>Status is evidence, not decoration. A listing advances only as design, testing, repeatability, and release readiness are documented.</p></div><ol>{pipeline.map((stage, index) => <li key={stage}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong></li>)}</ol></div></section>

        <section className="catalog-garage" aria-labelledby="catalog-garage-title"><div className="shell catalog-garage__grid"><div><p className="catalog-eyebrow">Built in the Garage</p><h2 id="catalog-garage-title">The work creates the product brief.</h2></div><div><p>SP-PCM-001 began inside Project Rebirth with one practical need: a reliable battery disconnect. Solving its placement, protection, monitoring, distribution, and serviceability turned a garage requirement into a documented product-development program.</p><a className="catalog-text-link" href="/equipment/catalog/sp-pcm-001/">Read the Project Rebirth origin story <span aria-hidden="true">→</span></a></div></div></section>
      </div>
    </PageFrame>
  );
}
