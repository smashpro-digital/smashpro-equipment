import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import test from "node:test";
import ts from "typescript";
function load(relative) {
  const filename = resolve(relative), module = { exports: {} }, require = createRequire(filename);
  const code = ts.transpileModule(readFileSync(filename, 'utf8').replaceAll('import.meta.env', '({})'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
  }).outputText;
  new Function('require', 'module', 'exports', code)((name) => {
    if (name.endsWith('.css')) return {};
    if (name.startsWith('.')) for (const suffix of ['.ts', '.tsx']) {
      const candidate = resolve(dirname(filename), name) + suffix;
      if (existsSync(candidate)) return load(candidate);
    }
    return require(name);
  }, module, module.exports);
  return module.exports;
}

const { nyasiEquipment } = load("src/data/nyasiEquipment.ts");
const { nyasiCustomerInquiry, nyasiVideos, nyasiCommissioning } = load("src/data/nyasiExperience.ts");
const { EquipmentWatch, publishedEquipmentVideos } = load("src/components/EquipmentWatch.tsx");
const { PassportCommissioning } = load("src/components/PassportExperience.tsx");
const video = { equipmentId: "SP-NYASI-26", videoId: "fixture0001", title: "Test fixture only", description: "Not production media", category: "Factory", lifecycleStage: "Factory", publishedAt: "2026-01-01", verifiedAt: "2026-01-02", visibility: "public" };
test("only verified published asset-specific videos enter the player", () => {
  const candidates = [video, {...video,visibility:"private"}, {...video,equipmentId:"SP-ARDHI-26"}, {...video,verifiedAt:""}, {...video,publishedAt:"2999-01-01"}, {...video,videoId:"javascript:alert(1)"}];
  assert.deepEqual(publishedEquipmentVideos(candidates,"SP-NYASI-26"),[video]);
  assert.equal(nyasiVideos.length, 0, "No invented NYASI video IDs");
  const html=renderToStaticMarkup(React.createElement(EquipmentWatch,{videos:[video],equipmentId:video.equipmentId,channelUrl:"https://www.youtube.com/@SmashProHQ",emptyMessage:"Pending"}));
  assert.doesNotMatch(html, /<iframe|autoplay/);
  assert.match(html,/Connect to YouTube/);
});
test("public projection and HTML contain no NYASI procurement prices or private player", () => {
  const { NyasiPassport }=load("src/components/NyasiPassport.tsx");
  const html=renderToStaticMarkup(React.createElement(NyasiPassport,{item:nyasiEquipment}));
  assert.doesNotMatch(html,/\$[0-9]|1,565|2,165|<iframe|<video|customer_id=/);
  assert.doesNotMatch(JSON.stringify(nyasiEquipment),/\$[0-9]|1,565|2,165/);
  for(const label of ["Work with NYASI", "Build with SmashPro", "Watch NYASI", "Pending verification"]) assert.ok(html.includes(label));
  assert.equal(nyasiCommissioning.filter(c=>c.status==='verified').length,0);
});
test("commissioning cannot be labeled verified without evidence", () => {
  const html=renderToStaticMarkup(React.createElement(PassportCommissioning,{checks:[{id:"check",title:"Drive",status:"verified",evidence:[]}]}));
  assert.match(html,/Pending verification/);
  assert.doesNotMatch(html,/Verified with evidence/);
});
test("existing intake URL carries equipment attribution but no customer identity or unsupported service", () => {
  const url=new URL(nyasiCustomerInquiry.href);
  assert.equal(url.origin,"https://smashpro.app"); assert.equal(url.pathname,"/book/");
  assert.equal(url.searchParams.get("equipment_source"),"SP-NYASI-26");
  assert.equal(url.searchParams.get("utm_content"),"nyasi-passport");
  assert.equal(url.searchParams.has("service"),false);
  assert.equal(url.searchParams.has("customer_id"),false);
  assert.equal(nyasiCustomerInquiry.readiness,"inquiry-only");
});
