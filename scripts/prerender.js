// Usage: start `node scripts/dev-server.mjs`, then run `node scripts/prerender.js` (needs Playwright).
// Re-run this every time the page script or its styles change.
// Renders the home page in a real browser and stores the finished HTML inside
// <div id="root"> so that search engines and AI crawlers that do not run
// scripts still get the full page. The live script replaces it on load.
const {chromium}=require('playwright'); const fs=require('fs');
const FILE=require('path').join(__dirname,'..','dist','index.html');
(async()=>{
  let html=fs.readFileSync(FILE,'utf8');
  // always start from an empty root so the script can be re-run
  const a=html.indexOf('<div id="root">'); const b=html.indexOf('<nav id="seuk-hard-mobile-cta"');
  if(a<0||b<0) throw new Error('markers not found');
  html=html.slice(0,a)+'<div id="root"></div>\n    '+html.slice(b);
  fs.writeFileSync(FILE,html);

  const br=await chromium.launch();
  const p=await br.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ try{ localStorage.setItem('seuk_cookie_consent',JSON.stringify({necessary:true,functional:true,analytics:true,advertisement:true,consentedAt:new Date().toISOString(),version:1})) }catch(e){} });
  await p.route(/res\.cloudinary\.com|openstreetmap|googleapis|gstatic/, r=>r.abort());
  await p.goto('http://localhost:8765/',{waitUntil:'load'});
  await p.waitForSelector('#contact-form form'); await p.waitForTimeout(800);
  await p.addStyleTag({content:'html{scroll-behavior:auto !important}'});
  // record every text node, let the animated counters finish, then write the final numbers back
  const result=await p.evaluate(async()=>{
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const root=document.getElementById('root');
    const nodes=()=>{const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const out=[];let n;while(n=w.nextNode())out.push(n);return out};
    const before=nodes(); const start=before.map(n=>n.data);
    let changed=[];
    const h=document.documentElement.scrollHeight;
    for(let y=0;y<h;y+=500){ window.scrollTo(0,y); await sleep(350);
      before.forEach((n,i)=>{ if(n.isConnected && n.data!==start[i] && /\d/.test(n.data)) changed[i]=n.data; }); }
    // go back to the counters and wait until the numbers stop moving
    const idx=changed.map((v,i)=>v!==undefined?i:-1).filter(i=>i>=0);
    if(idx.length){ before[idx[0]].parentElement.scrollIntoView({block:'center'}); let last='';
      for(let pass=0;pass<40;pass++){ await sleep(300); const now=idx.map(i=>before[i].data).join('|'); if(now===last && pass>6) break; last=now; }
      idx.forEach(i=>{ changed[i]=before[i].data; }); }
    window.scrollTo(0,0); await sleep(1200);
    const finals=[]; before.forEach((n,i)=>{ if(changed[i]!==undefined && n.isConnected){ finals.push(start[i]+' -> '+changed[i]); n.data=changed[i]; } });
    return {html:root.innerHTML, finals, texts:before.length};
  });
  await br.close();
  let snap=result.html;
  // the stored hero video stays empty: the live script loads and fades in the real one, as it always has
  snap=snap.replace(/<video([^>]*)>/g,(m,attrs)=>'<video'+attrs.replace(/\ssrc="[^"]*"/,'').replace(/\sautoplay(="")?/,'').replace(/\spreload="[^"]*"/,' preload="none"')+'>');
  // mark the stored copy so the page can tell it from the live one
  if(!/^<div/.test(snap)) throw new Error('unexpected snapshot root');
  snap=snap.replace(/^<div/,'<div data-pre="1"');
  if(/aria-label="Cookie consent"/.test(snap)) throw new Error('cookie notice leaked into the snapshot');
  const CONT='<script>/* Keeps the hero entrance animation running smoothly when the live script replaces the stored HTML. */(function(){var t0=performance.now(),r=document.getElementById("root");if(!r||!window.MutationObserver||!r.querySelector(":scope > [data-pre]"))return;var mo=new MutationObserver(function(){if(r.querySelector(":scope > [data-pre]"))return;mo.disconnect();var e=r.querySelectorAll(\'#home [class*="animate-fade-in"]\'),dt=performance.now()-t0;for(var i=0;i<e.length;i++){var d=parseFloat(getComputedStyle(e[i]).animationDelay)||0;e[i].style.animationDelay=(d*1000-dt)+"ms";}});mo.observe(r,{childList:true});})();</script>';
  html=fs.readFileSync(FILE,'utf8').replace(/\s*<script>\/\* Keeps the hero entrance[\s\S]*?<\/script>/,'').replace('<div id="root"></div>','<div id="root">'+snap+'</div>\n    '+CONT);
  // the old no-script summary is now redundant: the full page is in the HTML
  html=html.replace(/\s*<noscript>\s*<main>[\s\S]*?<\/main>\s*<\/noscript>/,'');
  fs.writeFileSync(FILE,html);
  console.log('snapshot chars',snap.length,'| text nodes',result.texts,'| counters',JSON.stringify(result.finals),'| page errors',errs.length, errs.slice(0,2));
})();
