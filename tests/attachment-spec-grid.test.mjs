import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const server=await createServer({configFile:false,esbuild:{jsx:'automatic'},optimizeDeps:{noDiscovery:true,include:[]},server:{middlewareMode:true,hmr:false},appType:'custom'});
const {AttachmentSpecGrid}=await server.ssrLoadModule('/src/components/AttachmentSpecGrid.tsx');await server.close();
const render=fields=>renderToStaticMarkup(React.createElement(AttachmentSpecGrid,{fields}));
test('unassigned specifications create no cards or empty grid',()=>{
 assert.equal(render([{label:'Manufacturer'},{label:'Model',value:null},{label:'Weight',value:''},{label:'Pressure',value:'  '}]),'');
 assert.equal(render([{label:'Width',value:'42.91 in'},{label:'Manufacturer'}]),'<dl class="spec-grid"><div><dt>Width</dt><dd>42.91 in</dd></div></dl>');
});
test('later populated values restore cards without template edits and zero remains valid',()=>{
 const fields=[{label:'Manufacturer'},{label:'Model',value:''}];assert.equal(render(fields),'');
 fields[0].value='Verified maker';fields[1].value='Documented model';
 const html=render(fields);assert.match(html,/<dt>Manufacturer<\/dt><dd>Verified maker<\/dd>/);assert.match(html,/<dt>Model<\/dt><dd>Documented model<\/dd>/);
 assert.match(render([{label:'Hours',value:0}]),/<dd>0<\/dd>/);
});
