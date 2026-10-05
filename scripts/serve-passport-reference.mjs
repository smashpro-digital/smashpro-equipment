// Read-only reference server for the unchanged baseline bundle. Assets may live
// on another drive; avoid duplicating original media in the screenshot harness.
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const [referenceRoot,port='4187']=process.argv.slice(2);
if(!referenceRoot)throw Error('Pass the untouched reference build root');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.pdf':'application/pdf','.mp4':'video/mp4'};
createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let root=resolve(referenceRoot,'dist'),relative=pathname.replace(/^\/equipment\//,'');
  if(pathname.startsWith('/equipment/images/')){root=resolve(referenceRoot,'images');relative=pathname.slice('/equipment/images/'.length);}
  if(pathname.startsWith('/equipment/documents/')){root=resolve(referenceRoot,'public/documents');relative=pathname.slice('/equipment/documents/'.length);}
  const file=resolve(root,relative||'index.html');
  if(!file.startsWith(root+sep)||!existsSync(file)||!statSync(file).isFile()){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',mime[extname(file)]??'application/octet-stream');
  const stream=createReadStream(file);stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
}).listen(Number(port),'127.0.0.1',()=>console.log(`Reference server http://127.0.0.1:${port}/equipment/`));
