/* Safe default: no private requests, document previews, or pending asset links. */
const internal = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)
  && new URLSearchParams(location.search).get('internal') === '1';
const $ = id => document.getElementById(id);
const node = (tag, text, className) => {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
};
const read = async name => {
  const response = await fetch(name, {cache: 'no-store'});
  if (!response.ok) throw Error(`Unable to load ${name}`);
  return response.json();
};
const localPath = path => {
  if (!path || path.startsWith('/') || path.includes('\\') || path.split('/').includes('..') || /^[a-z]+:/i.test(path)) throw Error('Unsafe document path');
  return path.split('/').map(encodeURIComponent).join('/');
};
const field = (list, label, value) => {
  const group = node('div'); group.append(node('dt', label), node('dd', value)); list.append(group);
};
async function render() {
  const [partner, documents, quotes, timeline, communications, scorecard, projects] = await Promise.all(
    ['partner.json','documents.json','quotes.json','timeline.json','communications.json','scorecard.json','projects.json'].map(read));
  let privateQuotes = [];
  if (internal) {
    $('mode').textContent = 'Local private workspace · Original files and pending project planning are available on this computer.';
    try {
      const privateProjects = await read('projects.private.json');
      projects.push(...privateProjects);
      const delivery = privateProjects.find(project => project.id === 'tri-lift-ardhi-delivery-support');
      if (delivery) {
        const event = timeline.find(event => event.id === 'delivery-support');
        event.title = delivery.title;
        event.notes = delivery.purpose + ' ' + delivery.notes;
      }
    } catch { $('mode').textContent += ' Private project record is unavailable.'; }
    try { privateQuotes = await read('quotes.private.json'); }
    catch { $('mode').textContent += ' Private quote values are unavailable.'; }
  }
  partner.services.forEach(service => $('service-list').append(node('span', service)));
  documents.forEach(doc => {
    const card = node('article', undefined, 'card'); card.id = `doc-${doc.id}`;
    if (internal && doc.thumbnail) {
      const preview = node('img'); preview.src = localPath(doc.thumbnail); preview.alt = `First page of ${doc.title}`; preview.loading = 'lazy'; card.append(preview);
    } else card.append(node('div', 'PDF', 'doc-icon'));
    card.append(node('h3', doc.title), node('p', doc.filename, 'filename'), node('small', 'Original preserved · Private source'));
    if (internal) {
      const link = node('a', 'Open original ↗'); link.href = localPath(doc.path); link.target = '_blank'; link.rel = 'noopener'; card.append(link);
    } else card.append(node('small', 'Available in the local private archive'));
    $('document-list').append(card);
  });
  quotes.forEach(quote => {
    const card = node('article', undefined, 'quote'); card.append(node('span', quote.status, 'status'),node('h3', quote.equipment));
    const values = node('dl');
    for (const [label,value] of [['Archive ID',quote.id],['Quote date',quote.date],['Capacity',`${quote.capacity.supplier_label} supplier label; verify rating`],['Delivery / pickup','Quoted together; not booked'],['Operator included',quote.operator_included === null ? 'Not confirmed' : String(quote.operator_included)],['Price','Private quote record']]) field(values,label,value);
    card.append(values,node('p',quote.notes));
    const privateQuote = privateQuotes.find(record => record.id === quote.id);
    if (privateQuote) {
      const prices = node('dl');
      const money = amount => amount === null ? 'Not specified' : new Intl.NumberFormat('en-US',{style:'currency',currency:privateQuote.price.currency}).format(amount);
      for (const key of ['daily','weekly','monthly','lp_tank','pickup_and_delivery_combined','tie_down_fee','tax','total']) field(prices,key.replaceAll('_',' '),money(privateQuote.price[key]));
      card.append(prices,node('p',privateQuote.notes));
    }
    const reference = node('a','Rental quote document ↗'); reference.href = '#doc-rental-quote-20261009'; card.append(reference); $('quote-list').append(card);
  });
  communications.forEach(record => {
    const article=node('article',undefined,'log'); article.append(node('time',record.date),node('h3',record.type),node('p',record.summary));
    record.attachments.forEach(id => { const link=node('a',documents.find(d=>d.id===id).title);link.href=`#doc-${id}`;article.append(link,node('br')); });
    $('communication-list').append(article);
  });
  const visibleProjects = projects.filter(p => internal || (p.status === 'Completed' && p.completed_at && p.public_display === true && p.completion_evidence?.length));
  if(visibleProjects.length) $('project-list').replaceChildren();
  visibleProjects.forEach(project => { const article=node('article',undefined,'quote');article.append(node('h3',project.title),node('span',project.status,'status'),node('p',project.purpose));$('project-list').append(article); });
  timeline.forEach(event => {
    const detail=node('details',undefined,'timeline-entry');const summary=node('summary');
    summary.append(node('span',event.date || 'Date not recorded','date'),node('strong',event.title),node('span',event.status,'status'));
    detail.append(summary,node('p',event.notes));
    event.documents.forEach(id=>{const link=node('a','Supporting document ↗');link.href=`#doc-${id}`;detail.append(link,node('br'));});
    $('timeline-list').append(detail);
  });
  Object.entries(scorecard).filter(([key])=>key!=='partner_id').forEach(([key,value])=>{const card=node('div',undefined,'score');card.append(node('span',key),node('strong',value));$('scorecard-list').append(card);});
  document.documentElement.dataset.ready='true';
}
render().catch(error=>{$('error').hidden=false;$('error').textContent=`Partner record unavailable. ${error.message}. Start the documented local preview server.`;});
