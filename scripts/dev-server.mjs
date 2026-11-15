// Local stand-in for Netlify: serves dist/ and runs the real form guard.
// Run `node scripts/build.mjs` once first (creates the signing secret), then
// `node scripts/dev-server.mjs` and open http://localhost:8765/ .
// A submission that passes the guard is logged at /__log instead of being sent.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import gate from '../netlify/edge-functions/form-gate.js';
import postBlock from '../netlify/edge-functions/post-block.js';
import tokenFn from '../netlify/edge-functions/form-token.js';
const ROOT=path.join(path.dirname(fileURLToPath(import.meta.url)),'..','dist'); const PORT=Number(process.env.PORT||8765);
const TYPES={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon'};
export const log=[];
http.createServer(async (req,res)=>{
  const url=new URL(req.url,'http://localhost:'+PORT);
  const chunks=[]; for await (const c of req) chunks.push(c); const body=Buffer.concat(chunks);
  const send=async (r)=>{ res.writeHead(r.status,Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); };
  if(url.pathname==='/__log'){ res.writeHead(200,{'content-type':'application/json'}); res.end(JSON.stringify(log)); return; }
  if(req.method==='GET' && url.pathname==='/api/form-token') return send(await tokenFn(new Request(url),{ip:'127.0.0.1'}));
  if(req.method==='POST'){
    const request=new Request(url, {method:'POST', headers:req.headers, body});
    if(url.pathname!=='/__forms.html'){ const rb=await postBlock(); log.push({post:url.pathname,status:rb.status}); return send(rb); }
    const r=await gate(request,{ ip:'127.0.0.1', next: async (fwd)=>{ log.push({forwarded: await fwd.text()}); return new Response('ok',{status:200}); } });
    log.push({post:url.pathname,status:r.status});
    return send(r);
  }
  let p=path.join(ROOT,decodeURIComponent(url.pathname)); 
  if(fs.existsSync(p)&&fs.statSync(p).isDirectory()) p=path.join(p,'index.html');
  if(!fs.existsSync(p)){ res.writeHead(404,{'content-type':'text/html; charset=utf-8'}); res.end(fs.readFileSync(path.join(ROOT,'404.html'))); return; }
  res.writeHead(200,{'content-type':TYPES[path.extname(p)]||'application/octet-stream'}); res.end(fs.readFileSync(p));
}).listen(PORT,()=>console.log('dev server on',PORT));
