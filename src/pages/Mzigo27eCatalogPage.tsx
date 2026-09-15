import { ButtonLink } from "../components/ButtonLink";
import { PageFrame } from "../components/PageFrame";
import { PageMetadata } from "../components/PageMetadata";
import { mzigo27eCatalog } from "../data/mzigo27eCatalog";

export function Mzigo27eCatalogPage() {
  return (
    <PageFrame>
      <PageMetadata
        title="SP-MZIGO-27E Electric Material Carrier | SmashPro Equipment"
        description="View the SP-MZIGO-27E future electric material carrier catalog concept and its current evidence status."
        canonical="https://smashpro.app/equipment/catalog/sp-mzigo-27e/"
      />
      <article className="mzigo27e-catalog-page">
        <section className="mzigo27e-catalog-hero" aria-labelledby="mzigo27e-title">
          <div className="shell mzigo27e-catalog-hero__inner">
            <div className="mzigo27e-catalog-hero__copy">
              <p className="catalog-eyebrow">{mzigo27eCatalog.status}</p>
              <h1 id="mzigo27e-title">{mzigo27eCatalog.id}</h1>
              <h2>{mzigo27eCatalog.name}</h2>
              <p>SP-MZIGO-27E is a future market direction informed by the SP-MZIGO-26E Founders Edition and the SP-MTC-001 Rev A platform record.</p>
              <p>No production build, final specification, pricing, reservation status, or availability is established by this concept rendering.</p>
              <div className="catalog-actions">
                <ButtonLink href="/equipment/catalog/">View Equipment Catalog</ButtonLink>
                <ButtonLink href="/equipment/sp-mzigo-26.html#product-platform" variant="outline">View the source platform</ButtonLink>
              </div>
            </div>
            <figure className="mzigo27e-catalog-hero__media">
              <img src={mzigo27eCatalog.hero.src} alt={mzigo27eCatalog.hero.alt} width="941" height="1672" decoding="async" fetchPriority="high" />
              <figcaption>Catalog concept · approved for this SP-MZIGO-27E page only · not factory evidence</figcaption>
            </figure>
          </div>
        </section>
        <section className="mzigo27e-catalog-context" aria-labelledby="mzigo27e-context-title">
          <div className="shell">
            <p className="catalog-eyebrow">Evidence boundary</p>
            <h2 id="mzigo27e-context-title">A future direction, kept separate from the built machine.</h2>
            <div className="mzigo27e-catalog-context__grid">
              <article><h3>SP-MZIGO-26E</h3><p>The Founders Edition is the physical factory-built fleet asset. Its photographs and lifecycle evidence remain in its Equipment Passport.</p></article>
              <article><h3>SP-MTC-001 Rev A</h3><p>The canonical product-platform record captures reusable architecture and development gates.</p></article>
              <article><h3>SP-MZIGO-27E</h3><p>This catalog rendering communicates a proposed future direction. Engineering and release claims remain pending evidence.</p></article>
            </div>
          </div>
        </section>
      </article>
    </PageFrame>
  );
}
