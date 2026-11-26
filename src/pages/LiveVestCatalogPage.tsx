import { ButtonLink } from "../components/ButtonLink";
import { LiveViewInterestForm, LiveViewProductGrid, PartnerGrid } from "../components/LiveViewCommerce";
import { PageFrame } from "../components/PageFrame";
import { PageMetadata } from "../components/PageMetadata";
import { liveViewPartners, liveViewProducts } from "../data/liveviewProducts";
import "../styles/livevest.css";

const mountingRequirements = [
  ["Stable chest position", "Camera sits centered at sternum height so the view matches what the technician sees, without bouncing when they bend or kneel."],
  ["Load-rated mount point", "Reinforced panel that carries a body camera without sagging the vest or pulling the collar."],
  ["Quick release", "Camera detaches in one motion for charging or handoff, and can't release by accident during work."],
  ["Unobstructed lens and indicators", "Pockets, straps and reflective tape never cover the lens, microphone, or recording light a customer can see."],
  ["Cable and heat management", "Optional battery-pack pocket and a cable path that keeps cords away from moving equipment."],
];

const features = [
  "ANSI/ISEA-style high-visibility design (certification to be confirmed with a manufacturer)",
  "Multi-pocket layout for phone, notepad, tools and a spare battery",
  "Reinforced camera panel compatible with the proposed QuickDock",
  "Breakaway safety features to be evaluated for equipment operators",
  "SmashPro electric green, purple and black colorway",
];

const evaluationPlan = [
  ["01", "Fit and comfort", "Full workdays across sizes and seasons; heat, weight and freedom of movement."],
  ["02", "Camera stability", "Footage review while walking, climbing ladders, kneeling and operating equipment."],
  ["03", "Visibility", "Reflective performance and color in daylight, dusk and vehicle headlights."],
  ["04", "Durability", "Wash cycles, abrasion, pocket seams and mount-point fatigue."],
  ["05", "Privacy cues", "Customers can see when the camera is present and recording."],
];

const statusSteps = [
  ["Concept defined", "Yes"], ["Mounting requirements drafted", "Yes"], ["Manufacturing partner", "Not selected"],
  ["Prototype", "Not started"], ["Field evaluation", "Not started"], ["Pricing", "Not set"],
];

export function LiveVestCatalogPage() {
  return (
    <PageFrame>
      <PageMetadata title="SP-LiveVest 01 | Camera-Ready Technician Vest Concept | SmashPro" description="SP-LiveVest 01 is a SmashPro concept for a premium high-visibility, camera-ready technician vest. In product development; not for sale." canonical="https://smashpro.app/equipment/catalog/sp-livevest-01/" />
      <div className="livevest">
        <section className="livevest-hero shell" aria-labelledby="livevest-title">
          <div>
            <p className="livevest-eyebrow">SmashPro Equipment · SP-LiveView</p>
            <p className="livevest-concept" role="note">Concept · In product development · Not for sale</p>
            <h1 id="livevest-title">SP-LiveVest 01<span>Stay Visible. Stay Connected.</span></h1>
            <p className="livevest-lead">A premium high-visibility vest designed around one job: keeping a technician's body camera steady, visible and out of the way, so customers can see the work with permission.</p>
            <div className="livevest-actions"><ButtonLink href="#interest">Register interest</ButtonLink><ButtonLink href="#partners" variant="outline">Workwear partnerships</ButtonLink></div>
          </div>
          <figure className="livevest-visual">
            <img src="/equipment/images/sp-livevest-01-concept.svg" alt="Concept illustration of a high-visibility vest with a chest-mounted camera position" width="600" height="720" />
            <figcaption>Concept illustration only. Not a product render or photograph.</figcaption>
          </figure>
        </section>

        <section className="livevest-section shell" aria-labelledby="livevest-concept-title">
          <p className="livevest-eyebrow">01 / The concept</p>
          <h2 id="livevest-concept-title">A vest built around the camera.</h2>
          <p className="livevest-intro">Clipping a body camera to an ordinary safety vest gives a shaky, tilted view and puts strain on thin fabric. SP-LiveVest 01 is our proposal for a multi-pocket vest with a reinforced mounting panel, part of the SP-LiveView connected field-service platform.</p>
          <ul className="livevest-features">{features.map((f) => <li key={f}>{f}</li>)}</ul>
          <p className="livevest-note">Proposed features, not verified specifications.</p>
        </section>

        <section className="livevest-band" aria-labelledby="livevest-mount-title"><div className="livevest-section shell">
          <p className="livevest-eyebrow">02 / Camera mounting requirements</p>
          <h2 id="livevest-mount-title">What the mount has to do.</h2>
          <div className="livevest-grid">{mountingRequirements.map(([t, d]) => <article key={t}><h3>{t}</h3><p>{d}</p></article>)}</div>
        </div></section>

        <section className="livevest-section shell" aria-labelledby="livevest-eval-title">
          <p className="livevest-eyebrow">03 / Field evaluation plan</p>
          <h2 id="livevest-eval-title">How we'll test it.</h2>
          <ol className="livevest-plan">{evaluationPlan.map(([n, t, d]) => <li key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div><em>Not started</em></li>)}</ol>
        </section>

        <section className="livevest-band" aria-labelledby="livevest-status-title"><div className="livevest-section shell">
          <p className="livevest-eyebrow">04 / Development status</p>
          <h2 id="livevest-status-title">Where it stands today.</h2>
          <dl className="livevest-status">{statusSteps.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div></section>

        <section className="livevest-section shell" id="partners" aria-labelledby="livevest-partners-title">
          <p className="livevest-eyebrow">05 / Partnership opportunities</p>
          <h2 id="livevest-partners-title">Looking for a workwear partner.</h2>
          <p className="livevest-intro">We want to prototype SP-LiveVest 01 with an established high-visibility workwear manufacturer. Co-branded and private-label models are both open for discussion.</p>
          <PartnerGrid partners={liveViewPartners} />
        </section>

        <section className="livevest-band" aria-labelledby="livevest-related-title"><div className="livevest-section shell">
          <p className="livevest-eyebrow">06 / Related products and accessories</p>
          <h2 id="livevest-related-title">The connected technician kit.</h2>
          <p className="livevest-intro">Every item carries its current availability state. None of these products can be purchased.</p>
          <LiveViewProductGrid products={liveViewProducts} />
        </div></section>

        <section className="livevest-section shell" id="interest" aria-labelledby="livevest-interest-title">
          <p className="livevest-eyebrow">07 / Interest registration</p>
          <h2 id="livevest-interest-title">Want one, or want to build one?</h2>
          <LiveViewInterestForm sku="SP-LIVEVEST-01" campaign="sp-livevest-01-catalog" productOptions={liveViewProducts.map((p) => p.name)} />
          <p className="livevest-note">SP-LiveVest, SP-LiveView and QuickDock are working names; trademark clearance has not been completed.</p>
        </section>
      </div>
    </PageFrame>
  );
}
