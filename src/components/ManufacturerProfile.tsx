export type ManufacturerProfileData = {
  displayName: string;
  legalSellerName?: string;
  brand?: string;
  model?: string;
  location?: string;
  website?: string;
  representative?: { name: string; title?: string };
  logoSrc?: string;
};

export function ManufacturerProfile({ profile }: { profile: ManufacturerProfileData }) {
  return (
    <aside className="manufacturer-profile" aria-label={`Verified manufacturer profile for ${profile.displayName}`}>
      <div className="manufacturer-profile__mark">
        {profile.logoSrc ? <img src={profile.logoSrc} alt={`${profile.brand ?? profile.displayName} manufacturer logo`} loading="lazy" decoding="async" /> : <span aria-hidden="true">MFG</span>}
      </div>
      <div className="manufacturer-profile__body">
        <p className="eyebrow">Verified Manufacturer</p>
        <h3>{profile.displayName}</h3>
        <dl>
          {profile.brand ? <div><dt>Brand</dt><dd>{profile.brand}</dd></div> : null}
          {profile.model ? <div><dt>Factory model</dt><dd>{profile.model}</dd></div> : null}
          {profile.location ? <div><dt>Origin</dt><dd>{profile.location}</dd></div> : null}
          {profile.legalSellerName && profile.legalSellerName !== profile.displayName ? <div><dt>Seller of record</dt><dd>{profile.legalSellerName}</dd></div> : null}
          {profile.representative ? <div><dt>Supplier representative</dt><dd>{profile.representative.name}{profile.representative.title ? ` · ${profile.representative.title}` : ""}</dd></div> : null}
        </dl>
        {profile.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer">Manufacturer website</a> : null}
      </div>
    </aside>
  );
}
