const ATTRIBUTION_KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content"] as const;

export interface EstimateUrlOptions {
  fleetId: string;
  serviceSlug?: string;
  utmContentFallback: string;
  search?: string;
  landingPage?: string;
  referrer?: string;
}

/** Build the root-relative browser booking URL used by SmashPro equipment CTAs. */
export function buildEstimateUrl(options: EstimateUrlOptions): string {
  const { fleetId, serviceSlug, utmContentFallback, search, landingPage, referrer } = options;
  const params = new URLSearchParams();
  let hasUtmContent = false;
  if (search) {
    const source = new URLSearchParams(search);
    ATTRIBUTION_KEYS.forEach((key) => {
      const value = source.get(key);
      if (value) {
        params.set(key, value.slice(0, 160));
        if (key === "utm_content") hasUtmContent = true;
      }
    });
  }
  if (!hasUtmContent) params.set("utm_content", utmContentFallback);
  if (landingPage) params.set("landing_page", landingPage.slice(0, 500));
  if (referrer) params.set("referrer", referrer.slice(0, 500));
  params.set("equipment_source", fleetId);
  params.set("equipment_required", fleetId);
  if (serviceSlug) params.set("service", serviceSlug);
  return `/book/?${params.toString()}`;
}
