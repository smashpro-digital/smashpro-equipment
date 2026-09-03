export type ManufacturerProfileData = {
  displayName: string;
  legalSellerName?: string;
  brand?: string;
  model?: string;
  location?: string;
  website?: string;
  representative?: { name: string; title?: string };
  logoSrc?: string;
  marketplaceRating?: {
    platform: string;
    score: number;
    reviews?: number;
    years?: number;
    observedAt?: string;
  };
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
        {profile.marketplaceRating ? (
          <div className="manufacturer-profile__rating" aria-label={`${profile.marketplaceRating.platform} seller rating ${profile.marketplaceRating.score} out of 5`}>
            <strong>★ {profile.marketplaceRating.score.toFixed(1)}/5</strong>
            <span>{profile.marketplaceRating.platform} seller rating</span>
            {profile.marketplaceRating.reviews ? <small>{profile.marketplaceRating.reviews} reviews</small> : null}
            {profile.marketplaceRating.years ? <small>{profile.marketplaceRating.years} years on platform</small> : null}
            {profile.marketplaceRating.observedAt ? <small>Observed {profile.marketplaceRating.observedAt}</small> : null}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
