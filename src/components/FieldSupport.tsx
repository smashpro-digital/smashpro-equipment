import { useState } from 'react';
import { ButtonLink } from './ButtonLink';
import partner from '../data/surecan-public.json';
import '../styles/field-support.css';

function ProductPhoto({ product }: { product: typeof partner.products[number] }) {
  const [failed, setFailed] = useState(false);
  return <a className="field-support__photo" href={product.source_url} target="_blank" rel="sponsored noopener noreferrer" aria-label={`View official SURE-CAN photos: ${product.name}, ${product.color}`}>
    {failed ? <span>View official product photography ↗</span> : <img src={product.image_url} alt={product.image_alt} width="500" height="500" loading="lazy" decoding="async" onError={() => setFailed(true)} />}
  </a>;
}

export function FieldSupport() {
  return <section className="section shell field-support" id="field-support" aria-labelledby="field-support-title">
    <header className="field-support__heading">
      <div><p className="eyebrow">SmashPro Equipment · Official partner</p><h2 id="field-support-title">Field Support<br />&amp; Consumables</h2><p>Fuel-specific safety cans and a separate non-fuel race jug. Choose the right container for what you carry.</p></div>
      <div className="field-support__brand"><img src="https://static.wixstatic.com/media/fb5240_b009aaec017642aa9bb4e00401b22b5b~mv2.png/v1/fill/w_430,h_182,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SureCan%20Main%20Logo%20White%20PNG.png" width="215" height="91" alt="SURE-CAN" loading="lazy" /><p>{partner.designation}</p></div>
    </header>
    <div className="field-support__offer"><div><p className="eyebrow">Ambassador offer</p><h3>Save 10% with SMASHPRO</h3><p>Enter code <strong className="field-support__code">{partner.discount_code}</strong> at SURE-CAN checkout.</p></div><ButtonLink href={partner.affiliate_url} sponsored>Shop SURE-CAN</ButtonLink></div>
    <p className="field-support__disclosure">{partner.disclosure}</p>
    <div className="field-support__grid">{partner.products.map(product => <article className="field-support__card" key={product.sku}>
      <ProductPhoto product={product} />
      <div className="field-support__details"><p className="eyebrow">{product.color} · {product.capacity}</p><h3>{product.name}</h3><p className="field-support__use">{product.use}</p><p className="field-support__sku">SKU {product.sku}</p><div className="field-support__price"><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(product.price)}</strong><span>Manufacturer listed retail</span></div><a className="field-support__product-link" href={product.source_url} target="_blank" rel="sponsored noopener noreferrer">Product details &amp; official photos <span aria-hidden="true">↗</span></a></div>
    </article>)}</div>
    <footer className="field-support__notes"><p>Prices checked October 23, 2026. Current pricing, stock and offer eligibility are confirmed by SURE-CAN at checkout. The “5 Gallon” Fast Flow Race Jug has a manufacturer-stated 5.5-gallon capacity; it is not a gasoline can.</p><p>{partner.sample_disclosure}</p></footer>
  </section>;
}
