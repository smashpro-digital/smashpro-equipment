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
    <div><p className="eyebrow">{banner.label}</p><h2>{banner.heading}</h2><p>{banner.description}</p></div>
    <a className="expo-banner__link" href={banner.url}>{banner.cta}<span aria-hidden="true"> →</span></a>
  </aside>;
}
