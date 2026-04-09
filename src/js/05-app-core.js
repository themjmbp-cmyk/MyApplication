// ══ ALERTS ════════════════════════════════════════════════════
function getAlertState(){if(!siteLimit||siteLimit<=0)return null;const tw=TWfull();if(tw>siteLimit)return'over';if(tw>siteLimit*0.95)return'near';return null;}
function updateAlerts(){
  const state=getAlertState(),tw=rnd(TWfull());
  const bar=document.getElementById('alert-bar');
  bar.className='ab'+(state?' on ':' ')+(state||'');
  if(state==='over'){document.getElementById('alert-body').innerHTML=T('alertOver')(tw,siteLimit);document.getElementById('alert-badge').textContent=T('alertOverBadge');}
  else if(state==='near'){document.getElementById('alert-body').innerHTML=T('alertNear')(tw,siteLimit);document.getElementById('alert-badge').textContent=T('alertNearBadge');}
  const inp=document.getElementById('limit-input');inp.className='lf'+(state?' '+state:'');
}
function onLimitChange(){const val=parseInt(document.getElementById('limit-input').value,10)||0;siteLimit=Math.max(0,val);updateAlerts();drawCAD();if(PAGE==='cover')drawCover();if(PAGE==='ficha')drawFicha();autoSave();}
function setPage(p){PAGE=p;['cad','wiring','canal','ficha','cover','iso','isowf','comp'].forEach(id=>{const pg=document.getElementById('page-'+id);if(pg)pg.style.display=id===p?'':'none';const tb=document.getElementById('tab-'+id);if(tb)tb.classList.toggle('on',id===p);});if(p==='wiring')drawWiring();else if(p==='canal')drawCanal();else if(p==='ficha')drawFicha();else if(p==='cover')drawCover();else if(p==='iso')drawISO();else if(p==='isowf')drawISOWF();else if(p==='comp')drawComparator();}

// ══ AUTO-SAVE (LocalStorage) ══════════════════════════════════
const LS_KEY='zkteco-cad-v35';
let sessionRestored=false;
function autoSave(){
  try{
    const gv=id=>{const el=document.getElementById(id);return el?el.value:'';};
    localStorage.setItem(LS_KEY,JSON.stringify({version:'3',ts:Date.now(),model:M,lanes:lanes.map(l=>({pgIdx:l.pgIdx,lfIdx:l.lfIdx})),siteLimit,siteLen,accLeft,accRight,cover:{client:gv('f-client'),project:gv('f-project'),addr:gv('f-addr'),ref:gv('f-ref'),author:gv('f-author'),revby:gv('f-rev'),date:gv('f-date'),version:gv('f-version')}}));
  }catch(e){console.warn('autoSave failed:',e);const b=document.getElementById('btn-save-badge');if(b){b.title=e.message;b.style.opacity='1';}}}
function autoLoad(){
  try{
    const raw=localStorage.getItem(LS_KEY);if(!raw)return false;
    const d=JSON.parse(raw);
    if(d.model&&MODELS[d.model])M=d.model;
    if(Array.isArray(d.lanes))lanes=d.lanes.map(l=>({pgIdx:+(l.pgIdx)||0,lfIdx:+(l.lfIdx)||0}));
    if(lanes.length<1)lanes=[{pgIdx:0,lfIdx:0}];
    if(typeof d.siteLimit==='number'){siteLimit=d.siteLimit;const li=document.getElementById('limit-input');if(li)li.value=siteLimit||'';}
    if(typeof d.siteLen==='number'){siteLen=d.siteLen;const sl=document.getElementById('site-len');if(sl)sl.value=siteLen||'';}
    accLeft=Array.isArray(d.accLeft)?d.accLeft.filter(a=>ACC_BY_CODE[a.code]).map(a=>({...a,r50gW:+(a.r50gW)||920,r50gH:+(a.r50gH)||600,isoZ:a.isoZ!=null?+a.isoZ:1})):[];
    accRight=Array.isArray(d.accRight)?d.accRight.filter(a=>ACC_BY_CODE[a.code]).map(a=>({...a,r50gW:+(a.r50gW)||920,r50gH:+(a.r50gH)||600,isoZ:a.isoZ!=null?+a.isoZ:1})):[];
    if(d.cover){const c=d.cover;[['f-client',c.client],['f-project',c.project],['f-addr',c.addr],['f-ref',c.ref],['f-author',c.author],['f-rev',c.revby],['f-date',c.date],['f-version',c.version]].forEach(([id,v])=>{const el=document.getElementById(id);if(el&&v!=null)el.value=v;});}
    sessionRestored=true;return true;
  }catch(e){return false;}
}
function clearSession(){localStorage.removeItem(LS_KEY);sessionRestored=false;location.reload();}

// ══ SAVE / LOAD ═══════════════════════════════════════════════
function saveProject(){
  const gv=id=>{const el=document.getElementById(id);return el?el.value:'';};
  const data={version:'3',app:'ZKTeco SpeedGate CAD v35',saved:new Date().toISOString(),model:M,lanes:lanes.map(l=>({pgIdx:l.pgIdx,lfIdx:l.lfIdx})),siteLimit,accLeft,accRight,cover:{client:gv('f-client'),project:gv('f-project'),addr:gv('f-addr'),ref:gv('f-ref'),author:gv('f-author'),revby:gv('f-rev'),date:gv('f-date'),version:gv('f-version')}};
  dlB(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),`ZKTeco-${MODELS[M].label.replace(/[\s/]+/g,'-')}-${new Date().toISOString().slice(0,10)}.json`);
}
function loadProject(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const d=JSON.parse(ev.target.result);
      if(d.model&&MODELS[d.model])M=d.model;
      if(Array.isArray(d.lanes)){const sp2=MODELS[M];lanes=d.lanes.map(l=>{const pg=+(l.pgIdx)||0,lf=+(l.lfIdx)||0;const maxPg=sp2.pg.length-1,pgC=Math.min(pg,maxPg),maxLf=sp2.pg[pgC].leaves.length-1;return{pgIdx:pgC,lfIdx:Math.min(lf,maxLf)};});}
      if(lanes.length<1)lanes=[{pgIdx:0,lfIdx:0}];
      if(typeof d.siteLimit==='number'){siteLimit=d.siteLimit;const li=document.getElementById('limit-input');if(li)li.value=siteLimit||'';}
      if(typeof d.siteLen==='number'){siteLen=d.siteLen;const sl=document.getElementById('site-len');if(sl)sl.value=siteLen||'';}
      accLeft=Array.isArray(d.accLeft)?d.accLeft.filter(a=>ACC_BY_CODE[a.code]).map(a=>({...a,r50gW:+(a.r50gW)||920,r50gH:+(a.r50gH)||600,isoZ:a.isoZ!=null?+a.isoZ:1})):[];
      accRight=Array.isArray(d.accRight)?d.accRight.filter(a=>ACC_BY_CODE[a.code]).map(a=>({...a,r50gW:+(a.r50gW)||920,r50gH:+(a.r50gH)||600,isoZ:a.isoZ!=null?+a.isoZ:1})):[];
      if(d.cover){const c=d.cover;[['f-client',c.client],['f-project',c.project],['f-addr',c.addr],['f-ref',c.ref],['f-author',c.author],['f-rev',c.revby],['f-date',c.date],['f-version',c.version]].forEach(([id,v])=>{const el=document.getElementById(id);if(el&&v!=null)el.value=v;});}
      ui();redrawPage();autoSave();
    }catch(err){alert(T('errorLoad')+': '+err.message);}
    e.target.value='';
  };reader.readAsText(file);
}

// ══ EXPORT ════════════════════════════════════════════════════
function getSVGStr(el){const vb=el.viewBox.baseVal,cl=el.cloneNode(true);cl.setAttribute('width',vb.width);cl.setAttribute('height',vb.height);cl.setAttribute('xmlns','http://www.w3.org/2000/svg');let s=new XMLSerializer().serializeToString(cl);if(!s.includes('xmlns='))s=s.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');return s;}
function s2c(str,W,H,sc){return new Promise((res,rej)=>{const b=new Blob([str],{type:'image/svg+xml;charset=utf-8'}),u=URL.createObjectURL(b),img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=W*sc;c.height=H*sc;const ctx=c.getContext('2d');ctx.fillStyle='#eeede5';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c);};img.onerror=ex=>{URL.revokeObjectURL(u);rej(ex);};img.src=u;});}
function dlB(b,n){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(a.href),500);}
function showP(p,txt){const pb=document.getElementById('pbar');pb.classList.add('on');document.getElementById('pbar-txt').textContent=txt;document.getElementById('pbar-inner').style.width=p+'%';document.getElementById('pbar-pct').textContent=p+'%';}
function hideP(){document.getElementById('pbar').classList.remove('on');}
async function exportPage(id,fmt){const el=document.getElementById(id),vb=el.viewBox.baseVal;const name=`ZKTeco-${MODELS[M].label.replace(/[\s/]+/g,'-')}-${id==='cv'?'cad':id==='wsvg'?'wiring':T('lblPortada')}`;const str=getSVGStr(el);if(fmt==='svg'){dlB(new Blob([str],{type:'image/svg+xml'}),name+'.svg');return;}try{const c=await s2c(str,vb.width,vb.height,2);c.toBlob(b=>dlB(b,name+'.png'),'image/png');}catch(ex){alert(ex);}}
async function exportFicha(fmt){drawFichaSVG();const el=document.getElementById('ficha-svg'),vb=el.viewBox.baseVal;const name=`ZKTeco-${MODELS[M].label.replace(/[\s/]+/g,'-')}-ficha`;const str=getSVGStr(el);if(fmt==='svg'){dlB(new Blob([str],{type:'image/svg+xml'}),name+'.svg');return;}try{const c=await s2c(str,vb.width,vb.height,2);c.toBlob(b=>dlB(b,name+'.png'),'image/png');}catch(ex){alert(ex);}}
async function exportProject(fmt){
  const bP=document.getElementById('btn-all-png'),bS=document.getElementById('btn-all-svg');bP.disabled=true;bS.disabled=true;showP(0,'…');drawCover();drawFichaSVG();drawISOWF();drawComparator();
  const sp=MODELS[M],name=`ZKTeco-${sp.label.replace(/[\s/]+/g,'-')}-proyecto`;
  const pgs=[{id:'covsvg'},{id:'cv'},{id:'ficha-svg'},{id:'isowfsvg'},{id:'cmpsvg'}];
  const lbls=[T('tabCover'),T('tabCad'),T('tabFicha'),T('tabIsoWF'),T('tabComp')];
  const done=()=>setTimeout(()=>{hideP();bP.disabled=false;bS.disabled=false;},2000);
  if(fmt==='png'){try{const cvs=[];for(let i=0;i<pgs.length;i++){showP(10+i*18,lbls[i]+'…');const el=document.getElementById(pgs[i].id);const vb=el.viewBox.baseVal;const c=await s2c(getSVGStr(el),vb.width,vb.height,2);cvs.push({c,W:vb.width,H:vb.height});await new Promise(rr=>requestAnimationFrame(rr));}
  const G=40,SC=2,maxW=Math.max(...cvs.map(x=>x.W))*SC,totalH=cvs.reduce((s,x)=>s+x.H*SC,0)+(pgs.length-1)*G*SC;const out=document.createElement('canvas');out.width=maxW;out.height=totalH;const ctx=out.getContext('2d');ctx.fillStyle='#eeede5';ctx.fillRect(0,0,maxW,totalH);let y=0;cvs.forEach(({c,W,H},i)=>{ctx.drawImage(c,(maxW-W*SC)/2,y);y+=H*SC;if(i<cvs.length-1){ctx.fillStyle='#14304f';ctx.fillRect(0,y,maxW,G*SC);ctx.fillStyle='#7dd87a';ctx.font=`bold ${11*SC}px monospace`;ctx.textAlign='center';ctx.fillText(`— ${lbls[i+1]} —`,maxW/2,y+G*SC*.65);y+=G*SC;}});showP(98,'…');out.toBlob(b=>{dlB(b,name+'.png');showP(100,'✅');done();},'image/png');}catch(ex){hideP();alert(ex);bP.disabled=false;bS.disabled=false;}}
  else{try{const G=20,pd=pgs.map((p,i)=>{const el=document.getElementById(p.id);const vb=el.viewBox.baseVal;return{str:getSVGStr(el),W:vb.width,H:vb.height,label:lbls[i]};});const maxW=Math.max(...pd.map(p=>p.W)),totalH=pd.reduce((s,p)=>s+p.H,0)+(pgs.length-1)*G;let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${maxW}" height="${totalH}" viewBox="0 0 ${maxW} ${totalH}"><rect width="${maxW}" height="${totalH}" fill="#eeede5"/>`;let y=0;pd.forEach((p,i)=>{const ox=(maxW-p.W)/2;let inner=p.str.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');svg+=`<g transform="translate(${ox},${y})"><svg width="${p.W}" height="${p.H}" viewBox="0 0 ${p.W} ${p.H}">${inner}</svg></g>`;y+=p.H;if(i<pd.length-1){svg+=`<rect x="0" y="${y}" width="${maxW}" height="${G}" fill="#14304f"/>`;svg+=`<text x="${maxW/2}" y="${r(y+G*.65)}" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#7dd87a">— ${pd[i+1].label} —</text>`;y+=G;}});svg+=`</svg>`;dlB(new Blob([svg],{type:'image/svg+xml'}),name+'.svg');showP(100,'✅');done();}catch(ex){hideP();alert(ex);bP.disabled=false;bS.disabled=false;}}
}
async function exportPDF(){
  const btn=document.getElementById('btn-pdf');btn.disabled=true;showP(0,T('loadingPDF'));
  if(!window.jspdf){await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
  drawCover();drawFichaSVG();drawISOWF();drawComparator();showP(10,'…');
  const{jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a3'});
  const PW=420,PH=297,mg=12;
  const pgs=[{id:'covsvg',label:T('tabCover')},{id:'cv',label:T('tabCad')},{id:'ficha-svg',label:T('tabFicha')},{id:'isowfsvg',label:T('tabIsoWF')},{id:'cmpsvg',label:T('tabComp')}];
  const sp=MODELS[M];
  for(let i=0;i<pgs.length;i++){if(i>0)doc.addPage();showP(10+i*20,pgs[i].label+'…');const el=document.getElementById(pgs[i].id);const vb=el.viewBox.baseVal;const canvas=await s2c(getSVGStr(el),vb.width,vb.height,2);const aR=vb.width/vb.height,pgAR=(PW-2*mg)/(PH-2*mg);let dW,dH,ox,oy;if(aR>pgAR){dW=PW-2*mg;dH=dW/aR;ox=mg;oy=mg+(PH-2*mg-dH)/2;}else{dH=PH-2*mg;dW=dH*aR;oy=mg;ox=mg+(PW-2*mg-dW)/2;}doc.addImage(canvas.toDataURL('image/jpeg',.93),'JPEG',ox,oy,dW,dH);doc.setFillColor(20,48,79);doc.rect(0,0,PW,8,'F');doc.setTextColor(125,216,122);doc.setFontSize(8);doc.setFont('Courier','bold');doc.text(`ZKTeco SpeedGate CAD — ${sp.label} — ${pgs[i].label}`,mg,5.5);doc.setTextColor(150,150,150);doc.setFont('Courier','normal');doc.setFontSize(7);doc.text(`${T('pdfPage')} ${i+1} / ${pgs.length}`,PW-mg,PH-3,{align:'right'});doc.setDrawColor(200,200,200);doc.setLineWidth(.2);doc.line(mg,PH-7,PW-mg,PH-7);doc.setTextColor(150,150,150);doc.setFontSize(6);doc.text('ZKTeco Corp. © 2025 — www.zkteco.com',PW/2,PH-3,{align:'center'});await new Promise(rr=>requestAnimationFrame(rr));}
  showP(95,'…');doc.save(`ZKTeco-${sp.label.replace(/[\s/]+/g,'-')}-proyecto.pdf`);showP(100,'✅');setTimeout(()=>{hideP();btn.disabled=false;},2000);
}

