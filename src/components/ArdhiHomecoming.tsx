import { ardhiHomecoming } from '../data/ardhiHomecoming';

export function ArdhiHomecoming() {
  return <div className="ardhi-homecoming" id="homecoming">
    <h3>{ardhiHomecoming.title}</h3>
    <p>A growing collection from SmashPro HQ: photographs, Shorts, full-length films and field evidence. New chapters appear only after review and publication.</p>
    <details><summary>Explore the Homecoming collection plan</summary>
      <ul>{ardhiHomecoming.categories.map(category => <li key={category.title}>{category.title} — {category.mediaIds.length ? <a href={category.title === 'Carrier delivery' || category.title === 'Crate arrival' ? '#delivery-media' : '#unboxing-photos'}>Photographs available</a> : 'Media pending'}</li>)}</ul>
    </details>
    <p id="commissioning-plan"><a href="#inspections">View receiving inspections and commissioning progress</a></p>
    <aside id="operator-preparation" aria-labelledby="operator-preparation-title">
      <h3 id="operator-preparation-title">Operator access / next phase</h3>
      <p>The Smart Key opens the existing sign-in experience. Scanning does not start a job, authorize operation or record an inspection.</p>
      <p>Equipment check-in, engine hours, pre-operation inspection, condition photographs, check-out and maintenance reporting are not connected on this Passport. Authorized operator identity and Atlas location will remain private.</p>
      <a href="/k/ARDHI26-K01/">Open Smart Key / sign in</a>
    </aside>
  </div>;
}
