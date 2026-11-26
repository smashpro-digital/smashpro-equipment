import { useState, type FormEvent } from "react";
import { liveViewPartners, liveViewProducts } from "../data/liveviewProducts";
import {
  availabilityLabels, buildInterestPayload, callToActionFor, interestCategoryLabels, interestMailto,
  partnerDisclosure, partnerStatusLabels, type InterestCategory, type LiveViewProduct, type PartnerRecord,
} from "../domain/liveviewCommerce";

export const liveViewInterestEnabled = import.meta.env.VITE_LIVEVIEW_PRODUCT_INTEREST === "1";
const checkoutEnabled = false; // commercialCheckout: hard-disabled until commercial approval exists.

export function AvailabilityBadge({ product }: { product: LiveViewProduct }) {
  return <span className={`lv-availability lv-availability--${product.availability.toLowerCase()}`}>{availabilityLabels[product.availability]}</span>;
}

export function LiveViewProductGrid({ products = liveViewProducts }: { products?: LiveViewProduct[] }) {
  return (
    <div className="lv-product-grid">
      {products.map((product) => {
        const cta = callToActionFor(product, checkoutEnabled);
        return (
          <article key={product.sku} className="lv-product">
            <AvailabilityBadge product={product} />
            <h3>{product.name}</h3>
            <p className="lv-product__role">{product.role}</p>
            <p>{product.summary}</p>
            <p className="lv-product__sourcing">{product.sourcing}</p>
            <p className="lv-product__cta">{cta.kind === "interest" ? <><a href="#interest">Register interest</a> · {cta.reason}</> : null}</p>
          </article>
        );
      })}
    </div>
  );
}

export function PartnerCard({ partner }: { partner: PartnerRecord }) {
  return (
    <article className={`lv-partner lv-partner--${partner.status}`}>
      {partner.approvedLogo ? <img src={partner.approvedLogo} alt={`${partner.name} logo`} height={32} /> : <strong className="lv-partner__name">{partner.name}</strong>}
      <span className="lv-partner__status">{partnerStatusLabels[partner.status]}</span>
      <p>{partner.relationship}</p>
      {partner.caseStudyHref ? <a href={partner.caseStudyHref}>Read the evaluation record</a> : null}
      <small>{partnerDisclosure(partner)}</small>
    </article>
  );
}

export function PartnerGrid({ partners = liveViewPartners }: { partners?: PartnerRecord[] }) {
  return <div className="lv-partner-grid">{partners.map((p) => <PartnerCard key={p.id} partner={p} />)}</div>;
}

const categories = Object.keys(interestCategoryLabels) as InterestCategory[];

export function LiveViewInterestForm({ sku, productOptions, campaign }: { sku: "SP-LIVEVEST-01" | "SP-LIVEVIEW"; productOptions: string[]; campaign: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  if (!liveViewInterestEnabled) {
    return (
      <div className="lv-interest lv-interest--contact">
        <p>Tell us how you'd use it. Interest is not a preorder, reservation or purchase.</p>
        <a className="button button--primary" href={interestMailto(sku, campaign)}>Contact SmashPro about {sku}<span aria-hidden="true">↗</span></a>
      </div>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const v = new FormData(form);
    const payload = buildInterestPayload({
      sku, category: String(v.get("category")) as InterestCategory, productInterest: String(v.get("product_interest") || sku),
      fullName: String(v.get("full_name") || ""), email: String(v.get("email") || ""), phone: String(v.get("phone") || ""),
      postalCode: String(v.get("postal_code") || ""), quantity: Number(v.get("quantity_interest") || 1), notes: String(v.get("notes") || ""),
      consentTerms: v.get("consent_terms") === "1", consentMarketing: v.get("consent_marketing") === "1", website: String(v.get("website") || ""),
      search: window.location.search, defaultCampaign: campaign,
    });
    setSubmitting(true); setStatus(null);
    try {
      const response = await fetch("/api/equipment_preorder.php", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result: { ok?: boolean } = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("registration_unavailable");
      form.reset();
      setStatus({ kind: "success", message: "Thanks. You're registered for SmashPro development updates. This is not an order." });
    } catch {
      setStatus({ kind: "error", message: "We couldn't save your interest right now. Please try again, or email smashprohq@gmail.com." });
    } finally { setSubmitting(false); }
  }

  return (
    <form className="lv-interest" onSubmit={submit} noValidate={false}>
      <label>I am a<select name="category" required defaultValue="early-access">{categories.map((c) => <option key={c} value={c}>{interestCategoryLabels[c]}</option>)}</select></label>
      <label>Interested in<select name="product_interest" defaultValue={productOptions[0]}>{productOptions.map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
      <label>Full name<input name="full_name" autoComplete="name" /></label>
      <label>Email<input name="email" type="email" autoComplete="email" required /></label>
      <label>Phone (optional)<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>ZIP code (optional)<input name="postal_code" autoComplete="postal-code" /></label>
      <label>Team size / units<input name="quantity_interest" type="number" min={1} max={20} defaultValue={1} /></label>
      <label className="lv-interest__wide">How would you use it?<textarea name="notes" maxLength={200} rows={3} /></label>
      <label className="lv-interest__hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="lv-interest__check"><input type="checkbox" name="consent_terms" value="1" required /> I understand this is interest registration only — not a preorder, reservation, deposit or purchase.</label>
      <label className="lv-interest__check"><input type="checkbox" name="consent_marketing" value="1" /> Send me SmashPro product development updates.</label>
      <button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Register interest"}</button>
      {status ? <p role="status" className={`lv-interest__status lv-interest__status--${status.kind}`}>{status.message}</p> : null}
    </form>
  );
}
