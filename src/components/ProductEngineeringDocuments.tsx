import type { CatalogProduct } from "../types/catalog";

export function ProductEngineeringDocuments({ product }: { product: CatalogProduct }) {
  const specifications = product.specifications ?? [];
  const designPackages = product.designPackages ?? [];
  const customizationOptions = product.customizationOptions ?? [];
  if (!specifications.length && !designPackages.length && !customizationOptions.length) return null;

  return <section className="product-engineering" id="engineering-documents" aria-labelledby="engineering-documents-title"><div className="pcm-shell">
    <div className="pcm-section__head"><p className="pcm-kicker">Controlled product record</p><h2 id="engineering-documents-title">Specifications and design files.</h2><p className="pcm-lead">Catalog specifications retain their evidence status. Public exports are revisioned separately from editable engineering source files.</p></div>
    {specifications.length ? <dl className="product-specifications">{specifications.map((specification) => <div key={specification.id}><dt><span>{specification.group}</span>{specification.label}</dt><dd><strong>{specification.value}</strong><small>{specification.verification.replace("-", " ")} · {specification.source}{specification.revision ? ` · ${specification.revision}` : ""}</small></dd></div>)}</dl> : null}
    {customizationOptions.map((option) => <aside className="product-customization" key={option.id}>
      <div><p className="pcm-kicker">Planned build option</p><h3>{option.title}</h3><p>{option.description}</p></div>
      <div><dl><div><dt>Build type</dt><dd>{option.buildType.replace("-", " ")}</dd></div><div><dt>Availability</dt><dd>{option.availability.replace("-", " ")}</dd></div></dl><p className="product-customization__label">Configurable fields</p><ul>{option.configurableFields.map((field) => <li key={field}>{field}</li>)}</ul></div>
    </aside>)}
    {designPackages.map((designPackage) => <article className="product-design-package" key={designPackage.id}>
      {designPackage.previewImage ? <img src={designPackage.previewImage} alt={designPackage.previewAlt ?? ""} loading="lazy" decoding="async" width="3380" height="689" /> : null}
      <div><p className="pcm-kicker">{designPackage.kind} · {designPackage.revision}</p><h3>{designPackage.title}</h3><p>{designPackage.description}</p><dl><div><dt>Status</dt><dd>{designPackage.status.replace("-", " ")}</dd></div><div><dt>Scope</dt><dd>{designPackage.scope}</dd></div></dl><div className="product-design-files">{designPackage.files.map((file) => <a key={file.url} href={file.url} download={file.downloadName} target="_blank" rel="noopener noreferrer">{file.label}<span>{file.format.toUpperCase()}</span></a>)}</div></div>
    </article>)}
  </div></section>;
}
