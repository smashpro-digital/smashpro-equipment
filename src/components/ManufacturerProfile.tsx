export type ManufacturerProfileData = {
  displayName: string;
  location?: string;
  address?: string;
  website?: string;
  email?: string;
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
  const rating = profile.marketplaceRating;
  return (
    <aside className="manufacturer-profile" aria-label={`Verified manufacturer profile for ${profile.displayName}`}>
      <div className="manufacturer-profile__mark">
        {profile.logoSrc ? <img src={profile.logoSrc} alt="Infront manufacturer logo" loading="lazy" decoding="async" /> : <span aria-hidden="true">MFG</span>}
      </div>

      <div className="manufacturer-profile__body">
        <div className="manufacturer-profile__verified"><span aria-hidden="true">✓</span> Verified Manufacturer</div>
        <h3>{profile.displayName}</h3>
        {profile.location ? <p className="manufacturer-profile__location">{profile.location}</p> : null}

        {rating ? (
          <div className="manufacturer-profile__rating" aria-label={`${rating.platform} seller rating ${rating.score} out of 5`}>
            <div><strong>★ {rating.score.toFixed(1)}/5</strong><span>{rating.platform} seller rating</span></div>
            {rating.reviews ? <div><strong>{rating.reviews}</strong><span>reviews</span></div> : null}
            {rating.years ? <div><strong>{rating.years} years</strong><span>on platform</span></div> : null}
          </div>
        ) : null}

        <div className="manufacturer-profile__contact">
          {profile.address ? <div><b aria-hidden="true">⌖</b><span>{profile.address}</span></div> : null}
          {profile.website ? <div><b aria-hidden="true">◎</b><a href={profile.website} target="_blank" rel="noopener noreferrer">www.chinaiift.com</a></div> : null}
          {profile.email ? <div><b aria-hidden="true">✉</b><a href={`mailto:${profile.email}`}>{profile.email}</a></div> : null}
        </div>
        {rating?.observedAt ? <small className="manufacturer-profile__observed">Marketplace rating observed {rating.observedAt}</small> : null}
      </div>
    </aside>
  );
}
