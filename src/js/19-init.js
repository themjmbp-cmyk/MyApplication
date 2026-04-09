// ══ SITE LENGTH + CABLE ESTIMATE ══════════════════════════════
function onSiteLenChange(){
  const val=parseFloat(document.getElementById('site-len').value)||0;
  siteLen=Math.max(0,val);_updateCableEst();autoSave();
}
function _updateCableEst(){
  const el=document.getElementById('cable-est');if(!el)return;
  if(!siteLen){el.textContent='';return;}
  const nCab=N()+1,cbl=T('cables');
  const nTypes=Array.isArray(cbl)?cbl.length:4;
  const totalM=Math.round(siteLen*nCab*nTypes*1.15);
  el.textContent=`≈${totalM}m ${T('cableTotLbl')||''}`;
}

// ══ PROJECTS MINI THUMBNAIL ════════════════════════════════════
function _projectMiniSVG(model,nLanes){
  const sp=MODELS[model];if(!sp)return'';
  const n=nLanes||1,cw=14,lw=22,W=150,H=36;
  const totalW=(n+1)*cw+n*lw,sc=Math.min((W-16)/totalW,(H-8)/44);
  let x=(W-totalW*sc)/2,my=H/2;
  let svg=`<svg viewBox="0 0 ${W} ${H}" style="width:150px;height:36px;display:block;border-radius:3px;overflow:hidden">`;
  svg+=`<rect width="${W}" height="${H}" fill="rgba(20,48,79,.06)" rx="3"/>`;
  for(let i=0;i<=n;i++){
    svg+=`<rect x="${r(x)}" y="${r(my-9)}" width="${r(cw*sc)}" height="18" fill="${sp.mc}" rx="1" opacity=".85"/>`;
    x+=cw*sc;
    if(i<n){svg+=`<rect x="${r(x)}" y="${r(my-6)}" width="${r(lw*sc)}" height="12" fill="#bdd9ef" rx="1" opacity=".55"/>`;x+=lw*sc;}
  }
  svg+=`</svg>`;return svg;
}

// ══ PWA SERVICE WORKER (solo con servidor HTTP) ═══════════════
if('serviceWorker' in navigator && location.protocol!=='file:'){navigator.serviceWorker.register('sw.js').catch(()=>{});}

// ══ TAB DRAG-AND-DROP ══════════════════════════════════════════
const TAB_ORDER_KEY='zkteco-tab-order';
function _saveTabOrder(){const tabs=[...document.querySelectorAll('.pt .ptb[draggable]')];localStorage.setItem(TAB_ORDER_KEY,JSON.stringify(tabs.map(t=>t.id)));}
function _restoreTabOrder(){try{const saved=JSON.parse(localStorage.getItem(TAB_ORDER_KEY));if(!Array.isArray(saved)||saved.length<2)return;const pt=document.querySelector('.pt'),fixed=document.getElementById('pt-tabs-end');saved.forEach(id=>{const el=document.getElementById(id);if(el)pt.insertBefore(el,fixed);});}catch(e){}}
function initTabDrag(){
  _restoreTabOrder();
  const pt=document.querySelector('.pt');let dragged=null;
  pt.addEventListener('dragstart',e=>{const t=e.target.closest('.ptb[draggable]');if(!t)return;dragged=t;e.dataTransfer.effectAllowed='move';setTimeout(()=>{if(dragged)dragged.style.opacity='.35';},0);});
  pt.addEventListener('dragend',e=>{const t=e.target.closest('.ptb[draggable]');if(t)t.style.opacity='';pt.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));dragged=null;});
  pt.addEventListener('dragover',e=>{e.preventDefault();const t=e.target.closest('.ptb[draggable]');if(!t||t===dragged)return;pt.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));t.classList.add('drag-over');});
  pt.addEventListener('dragleave',e=>{const t=e.target.closest('.ptb[draggable]');if(t&&!t.contains(e.relatedTarget))t.classList.remove('drag-over');});
  pt.addEventListener('drop',e=>{e.preventDefault();const t=e.target.closest('.ptb[draggable]');if(!t||!dragged||t===dragged)return;t.classList.remove('drag-over');const fixed=pt.querySelector('.ptb:not([draggable])');const r=t.getBoundingClientRect();pt.insertBefore(dragged,e.clientX<r.left+r.width/2?t:(t.nextElementSibling||fixed));_saveTabOrder();});
}

loadFromHash()||autoLoad();ui();drawCAD();_updateCableEst();initTabDrag();
