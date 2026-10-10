import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const base = 'partners/tri-lift/';
const read = name => JSON.parse(readFileSync(base + name,'utf8'));

test('partner uses one stable identity and honest pending business states',()=>{
  const partner=read('partner.json');
  assert.equal(partner.id,'partner-tri-lift');
  assert.equal(partner.public_deployment,false);
  assert.equal(partner.services.length,5);
  const timeline=read('timeline.json');
  assert.equal(timeline.length,8);
  for(const id of ['forms-completed','insurance-verified','delivery-support']) assert.equal(timeline.find(e=>e.id===id).status,'Pending');
  const scorecard=read('scorecard.json');
  for(const field of ['Pricing','Delivery','Overall']) assert.equal(scorecard[field],'Pending');
});

test('all four source documents are indexed without changing filenames',()=>{
  const documents=read('documents.json');
  assert.equal(documents.length,4);
  assert.equal(new Set(documents.map(d=>d.id)).size,documents.length);
  for(const doc of documents){
    assert.equal(doc.path.split('/').at(-1),doc.filename);
    assert.equal(doc.source_path.split('/').at(-1),doc.filename);
    assert.match(doc.sha256,/^[a-f0-9]{64}$/);
    assert.ok(doc.bytes>0);
    assert.equal(doc.visibility,'private_original');
    assert.ok(!doc.path.includes('..'));
    assert.ok(doc.thumbnail.startsWith('previews/'));
  }
  const ids=new Set(documents.map(d=>d.id));
  for(const record of [...read('timeline.json'),...read('quotes.json'),...read('communications.json')]){
    for(const id of record.documents ?? record.attachments ?? []) assert.ok(ids.has(id),id);
  }
});

test('commercial values and pending asset links are excluded from committed projection',()=>{
  assert.deepEqual(read('projects.json'),[]);
  for(const quote of read('quotes.json')){
    assert.equal(quote.price,null);
    assert.equal(quote.operator_included,null);
    assert.equal(quote.capacity.verified_value,null);
    assert.equal(quote.status,'Received; acceptance pending');
  }
  const source=readFileSync(base+'partner.js','utf8');
  assert.match(source,/p\.status === 'Completed' && p\.completed_at && p\.public_display === true && p\.completion_evidence\?\.length/);
  assert.match(source,/location\.hostname/);
  const config=readFileSync('vite.config.ts','utf8');
  assert.ok(!config.includes('partners/tri-lift'));
});

test('Git excludes originals, previews and private companion records',()=>{
  const paths=[...read('documents.json').flatMap(doc=>[base+doc.path,base+doc.thumbnail]),base+'projects.private.json',base+'quotes.private.json'];
  const ignored=execFileSync('git',['check-ignore','--stdin'],{input:paths.join('\n')+'\n',encoding:'utf8'}).trim().split(/\r?\n/);
  assert.deepEqual(new Set(ignored),new Set(paths));
  const tracked=execFileSync('git',['ls-files','partners'],{encoding:'utf8'}).trim().split(/\r?\n/);
  assert.ok(!tracked.some(path=>/\.pdf$|\.private\.json$|\/previews\/|\/private\//i.test(path)), 'Private material must never be force-added');
});
