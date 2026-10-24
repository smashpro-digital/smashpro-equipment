import { useEffect, useRef } from 'react';
import '../styles/field-support.css';
const assetRoot = '/wp-content/themes/smashpro/assets';
const release = 'field-tested-20261023-v3';

/** Media owns the shared renderer; HQ owns the records. */
export function FieldSupport() {
  const host = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!document.querySelector('[data-ft-shared-style]')) {
      const style = document.createElement('link'); style.rel = 'stylesheet';
      style.href = `${assetRoot}/css/field-tested.css?v=${release}`;
      style.dataset.ftSharedStyle = 'true'; document.head.append(style);
    }
    const mount = () => {
      const client = (window as Window & { SmashProFieldTested?: { mount: (root: HTMLElement) => void } }).SmashProFieldTested;
      if (host.current) client?.mount(host.current);
    };
    let script = document.querySelector<HTMLScriptElement>('[data-ft-shared-script]');
    if (!script) {
      script = document.createElement('script'); script.src = `${assetRoot}/js/field-tested.js?v=${release}`;
      script.dataset.ftSharedScript = 'true'; script.addEventListener('load', mount, { once: true }); document.head.append(script);
    } else { script.addEventListener('load', mount, { once: true }); mount(); }
    return () => { script?.removeEventListener('load', mount); };
  }, []);
  return <section ref={host} className="ft-section field-support" id="field-support" data-field-tested-view="partners" aria-labelledby="field-support-title">
    <div className="ft-shell">
      <p className="ft-eyebrow">SmashPro Equipment</p>
      <h2 id="field-support-title">Field Support Partners</h2>
      <p className="ft-intro">Products we use. Partners we trust.</p>
      <p className="ft-disclosure">Follow our received products and planned tests. Each card shows the current relationship and review status.</p>
      <p data-ft-status role="status">Loading current partner records…</p>
      <div data-ft-content />
      <p><a className="ft-button" href="/media/#field-tested">Watch Field Tests</a></p>
    </div>
  </section>;
}
