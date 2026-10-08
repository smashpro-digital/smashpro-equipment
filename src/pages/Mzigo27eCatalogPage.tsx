import { useState, type FormEvent } from "react";
import { ButtonLink } from "../components/ButtonLink";
import { PageFrame } from "../components/PageFrame";
import { PageMetadata } from "../components/PageMetadata";
import { mzigo27eCatalog } from "../data/mzigo27eCatalog";


function Mzigo27eEarlyAccessForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function joinWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const tracking = new URLSearchParams(window.location.search);
    const payload = {
      product_sku: "SP-MZIGO-27E",
      full_name: String(values.get("full_name") || "").trim(),
      email: String(values.get("email") || "").trim(),
      phone: String(values.get("phone") || "").trim(),
      postal_code: String(values.get("postal_code") || "").trim(),
      quantity_interest: Number(values.get("quantity_interest") || 1),
      intended_use: String(values.get("intended_use") || "").trim(),
      consent_terms: values.get("consent_terms") === "1",
      consent_marketing: values.get("consent_marketing") === "1",
      deposit_interest: false,
      utm_source: tracking.get("utm_source") || "",
      utm_medium: tracking.get("utm_medium") || "",
      utm_campaign: tracking.get("utm_campaign") || "",
    };
    setStatus(null);
    setSubmitting(true);
    try {
      const response = await fetch("/api/equipment_preorder.php", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { ok?: boolean } = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("registration_unavailable");
      form.reset();
      setStatus({
        kind: "success",
        message: "You're on the SP-MZIGO-27E early access list. We'll share updates when verified production details become available.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "We couldn't save your registration right now. Please try again shortly, or contact SmashPro directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="early-access" className="mzigo27e-early-access" aria-labelledby="mzigo27e-early-title">
      <div className="shell mzigo27e-early-access__inner">
        <div>
          <p className="catalog-eyebrow">No deposit required</p>
          <h2 id="mzigo27e-early-title">Get early access to MZIGO.</h2>
          <p>Join the free SP-MZIGO-27E interest list for development announcements, demonstrations, verified specifications and future reservation opportunities.</p>
          <p className="mzigo27e-early-access__disclosure">Joining is not a preorder, reservation, purchase commitment or guaranteed production allocation. Pricing, availability and delivery timing have not been approved.</p>
        </div>
        <form className="mzigo27e-early-access__form" onSubmit={joinWaitlist}>
          <div className="mzigo27e-early-access__fields">
            <label>Full name <input name="full_name" autoComplete="name" maxLength={160} placeholder="Your name" /></label>
            <label>Email address <span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></label>
            <label>Phone (optional) <input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
            <label>ZIP / postal code <input name="postal_code" autoComplete="postal-code" maxLength={24} /></label>
            <label>Units you might need
              <select name="quantity_interest" defaultValue="1">
                <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4+</option>
              </select>
            </label>
            <label>Primary use
              <select name="intended_use" defaultValue="property">
                <option value="property">Property / acreage</option>
                <option value="landscaping">Landscaping</option>
                <option value="commercial">Commercial operations</option>
                <option value="homestead">Homestead</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
          <label className="mzigo27e-early-access__check"><input type="checkbox" name="consent_terms" value="1" required /> I understand this is a free, nonbinding interest list and consent to being contacted about this request. *</label>
          <label className="mzigo27e-early-access__check"><input type="checkbox" name="consent_marketing" value="1" /> Send me optional SmashPro equipment marketing updates.</label>
          <button type="submit" disabled={submitting}>{submitting ? "Joining..." : "Join the Early Access List"}</button>
          <p className="mzigo27e-early-access__privacy">We use your details to manage your request. Marketing updates are optional. No payments are collected.</p>
          <div role="status" aria-live="polite" className={status ? `mzigo27e-early-access__status mzigo27e-early-access__status--${status.kind}` : "mzigo27e-early-access__status"}>{status?.message || ""}</div>
        </form>
      </div>
    </section>
  );
}

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
                <a className="mzigo27e-catalog-join" href="#early-access">Join Early Access List</a>
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
        <Mzigo27eEarlyAccessForm />
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
