import { useEffect, useState } from 'react';
export const ardhiCanonicalUrl = 'https://smashpro.app/equipment/sp-ardhi-26.html';
export default function ArdhiExpo() {
  const [qr, setQr] = useState('');
  useEffect(() => {
    let active = true;
    void import('qrcode').then(module => module.default.toDataURL(ardhiCanonicalUrl, { width: 512, margin: 4, errorCorrectionLevel: 'M' })).then(url => { if (active) setQr(url); }).catch(() => { /* Canonical link remains usable if QR generation fails. */ });
    return () => { active = false; };
  }, []);
  return <section className="shell flagship-expo" aria-labelledby="expo-title"><div><p className="eyebrow">Equip Expo / Fleet Asset 001</p><h2 id="expo-title">Scan to Follow</h2><p>Factory build. Ocean journey. First job. One permanent machine identity.</p><a href={ardhiCanonicalUrl}>Open the SP-ARDHI-26 passport</a><p className="flagship-note">Explore the mission timeline, factory archive, service record and partners below.</p></div>{qr && <img src={qr} width="320" height="320" alt="Scan to open the permanent SP-ARDHI-26 passport" />}</section>;
}
