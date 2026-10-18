import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync('src/components/ExpoBanner.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
async function render(response, fails = false) {
  let state, effect, requested;
  const module = { exports: {} };
  new Function('require','module','exports','fetch','window',code)(name => {
    if(name.endsWith('.css')) return {};
    if(name==='react') return {useState: initial => {state=initial; return [state,value=>state=value];}, useEffect: callback=>effect=callback};
    return require(name);
  },module,module.exports,async (url,options)=>{requested={url,options};if(fails)throw Error('offline');return {ok:true,json:async()=>response};},{setTimeout,clearTimeout});
  const html=renderToStaticMarkup(module.exports.ExpoBanner());
  const cleanup=effect();await new Promise(resolve=>setImmediate(resolve));cleanup();
  return {html,state,requested};
}
test('useful linked launch remains on projection outage; no affiliate expansion',async()=>{
 const result=await render(null,true);assert.match(result.html,/Explore Our Expo Page/);assert.equal(result.state.cta,'Explore Our Expo Page');assert.doesNotMatch(result.html,/iframe|awin|Watch Our Expo Coverage/);assert.equal(result.requested.options.credentials,'omit');assert.equal(result.requested.options.cache,'no-store');
});
test('canonical projection updates banner without Equipment redeployment',async()=>{
 const data={url:'https://smashpro.app/media/equip-expo-2026/',label:'SMASHPRO AT EQUIP EXPO 2026',heading:'Published coverage',description:'Post-event takeaways',cta:'Watch Our Expo Coverage'};
 assert.equal((await render(data)).state.cta,data.cta);
 assert.equal((await render({...data,url:'https://evil.example/'})).state.cta,'Explore Our Expo Page');
 assert.equal((await render({...data,cta:'Invented action'})).state.cta,'Explore Our Expo Page');
 assert.equal((await render(null)).state.cta,'Explore Our Expo Page');
});
