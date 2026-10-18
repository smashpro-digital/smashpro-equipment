import { useEffect, useState } from 'react';
import '../styles/expo-banner.css';

const destination = 'https://smashpro.app/media/equip-expo-2026/';
// Safe offline launch copy. WordPress owns current editorial/video availability.
export const expoFallback = {
  url: destination, label: 'SMASHPRO AT EQUIP EXPO 2026',
  heading: 'Exploring equipment, technology, and better ways to work.',
  description: 'Upcoming YouTube videos, product highlights, and post-event takeaways.',
  cta: 'Explore Our Expo Page',
};
export function ExpoBanner() {
  const [banner, setBanner] = useState(expoFallback);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch('https://smashpro.app/wp-json/smashpro/v1/equip-expo-2026', { signal: controller.signal, cache: 'no-store', credentials: 'omit' })
      .then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); })
      .then(data => {
        if (data.url === destination && ['Explore Our Expo Page', 'Watch Our Expo Coverage'].includes(data.cta)
          && ['label', 'heading', 'description'].every(key => typeof data[key] === 'string' && data[key].length < 250)) {
          setBanner({url: destination, label: data.label, heading: data.heading, description: data.description, cta: data.cta});
        }
      }).catch(() => { /* Preserve the useful linked launch banner on failure. */ })
      .finally(() => window.clearTimeout(timeout));
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, []);
  return <aside className="expo-banner shell" aria-label="Equip Expo 2026">
    <figure className="expo-banner__photo"><img src="/equipment/images/equip-expo/expo-2023-mower-480.webp" srcSet="/equipment/images/equip-expo/expo-2023-mower-480.webp 480w, /equipment/images/equip-expo/expo-2023-mower-960.webp 960w" sizes="(max-width: 767px) calc(100vw - 32px), 300px" width="960" height="640" loading="lazy" decoding="async" alt="An attendee testing a mower in the Expo outdoor demonstration yard." /><figcaption>2023 archive · © COLE_GIORDANO</figcaption></figure>
    <div className="expo-banner__copy"><img className="expo-banner__logo" src="/equipment/images/equip-expo/equip-logo-white.png" width="480" height="202" alt="Equip" loading="lazy" decoding="async" /><p className="eyebrow">{banner.label}</p><h2>{banner.heading}</h2><p>{banner.description}</p>
    <a className="expo-banner__link" href={banner.url}>{banner.cta}<span aria-hidden="true"> →</span></a></div>
  </aside>;
}
