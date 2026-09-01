import type { CatalogProduct } from "../types/catalog";
import { ProductStatusBadge } from "./ProductStatusBadge";

export function CatalogProductCard({ product }: { product: CatalogProduct }) {
  return (
    <article className="catalog-card">
      <a className="catalog-card__media" href={product.href} aria-label={`View ${product.id} ${product.name}`}>
        <img src={product.image} alt={product.imageAlt} loading="lazy" decoding="async" width="1200" height="800" />
      </a>
      <div className="catalog-card__body">
        <div className="catalog-card__meta"><span>{product.category}</span><ProductStatusBadge status={product.status} /></div>
        <p className="catalog-card__id">{product.id}</p>
        <h3><a href={product.href}>{product.name}</a></h3>
        <p>{product.description}</p>
        <a className="catalog-card__link" href={product.href}>View product development <span aria-hidden="true">→</span></a>
      </div>
    </article>
  );
}
