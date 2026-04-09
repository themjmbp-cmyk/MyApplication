// ══ TOAST ═════════════════════════════════════════════════════
function showToast(msg,dur){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.add('on');
  clearTimeout(t._tid);t._tid=setTimeout(()=>t.classList.remove('on'),dur||2200);
}

// ══ THEME TOGGLE ══════════════════════════════════════════════
function toggleTheme(){
  document.documentElement.classList.toggle('lt');
  const isLight=document.documentElement.classList.contains('lt');
  try{localStorage.setItem('zkteco-theme',isLight?'light':'dark');}catch(e){}
}
(function(){try{if(localStorage.getItem('zkteco-theme')==='dark')document.documentElement.classList.remove('lt');}catch(e){}})();

// ══ UNDO / REDO ═══════════════════════════════════════════════
const undoStack=[],redoStack=[];
function _stateSnap(){return JSON.stringify({M,lanes:lanes.map(l=>({...l})),siteLimit,siteLen,accLeft:accLeft.map(a=>({...a})),accRight:accRight.map(a=>({...a}))});}
function pushUndo(label){undoStack.push({snap:_stateSnap(),lbl:label||'—'});if(undoStack.length>30)undoStack.shift();redoStack.length=0;_updateUndoUI();}
function _applySnap(entry){
  const d=JSON.parse(typeof entry==='string'?entry:entry.snap);
  if(MODELS[d.M])M=d.M;
  lanes=d.lanes.map(l=>({...l}));
  siteLimit=d.siteLimit;siteLen=d.siteLen||0;
  const li=document.getElementById('limit-input');if(li)li.value=siteLimit||'';
  const sl=document.getElementById('site-len');if(sl)sl.value=siteLen||'';
  accLeft=d.accLeft.map(a=>({...a}));
  accRight=d.accRight.map(a=>({...a}));
}
function undo(){if(!undoStack.length)return;redoStack.push({snap:_stateSnap(),lbl:'↩'});_applySnap(undoStack.pop());ui();redrawPage();autoSave();_updateUndoUI();}
function redo(){if(!redoStack.length)return;undoStack.push({snap:_stateSnap(),lbl:'↪'});_applySnap(redoStack.pop());ui();redrawPage();autoSave();_updateUndoUI();}
function _updateUndoUI(){
  const bu=document.getElementById('btn-undo'),br=document.getElementById('btn-redo');
  if(bu)bu.disabled=!undoStack.length;if(br)br.disabled=!redoStack.length;
  const panel=document.getElementById('undo-panel');if(!panel)return;
  if(!undoStack.length){panel.innerHTML='';return;}
  const labels=[...undoStack].reverse().slice(0,6).map(e=>e.lbl||'—');
  panel.innerHTML=`<div class="undo-hist-line">↺ ${undoStack.length} ${T('undoHistLbl')}: ${labels.join(' · ')}</div>`;
}
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&e.key==='z'&&!e.target.matches('input,textarea')){e.preventDefault();undo();}
  if((e.ctrlKey||e.metaKey)&&((e.shiftKey&&e.key==='z')||e.key==='y')&&!e.target.matches('input,textarea')){e.preventDefault();redo();}
});

// ══ SHARE URL ═════════════════════════════════════════════════
function getShareURL(){
  const gv=id=>{const el=document.getElementById(id);return el?el.value:'';};
  const state={v:3,m:M,l:lanes.map(l=>({p:l.pgIdx,f:l.lfIdx})),sl:siteLimit,
    al:accLeft.map(a=>({c:a.code,g:a.r50gW,h:a.r50gH})),
    ar:accRight.map(a=>({c:a.code,g:a.r50gW,h:a.r50gH})),
    cv:{cl:gv('f-client'),pr:gv('f-project'),ad:gv('f-addr'),rf:gv('f-ref'),au:gv('f-author'),rv:gv('f-rev'),dt:gv('f-date'),vr:gv('f-version')}};
  return location.href.replace(/#.*/,'')+('#s='+btoa(encodeURIComponent(JSON.stringify(state))));
}
function shareURL(){
  const url=getShareURL();
  const hash=url.replace(/[^#]*(#.*)/,'$1');
  history.replaceState(null,'',hash);
  if(navigator.clipboard){
    navigator.clipboard.writeText(url).then(()=>showToast(T('urlCopied'))).catch(()=>showToast(T('urlCopyManual')));
  } else {
    try{const ta=document.createElement('textarea');ta.value=url;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();showToast(T('urlCopied'));}
    catch(e){showToast(T('urlCopyManual'));}
  }
}
function loadFromHash(){
  try{
    const m=location.hash.match(/[#&]s=([^&]+)/);
    if(!m)return false;
    const d=JSON.parse(decodeURIComponent(atob(m[1])));
    if(d.m&&MODELS[d.m])M=d.m;
    if(Array.isArray(d.l)){const sp=MODELS[M];lanes=d.l.map(l=>{const pgC=Math.min(+(l.p)||0,sp.pg.length-1),mxL=sp.pg[pgC].leaves.length-1;return{pgIdx:pgC,lfIdx:Math.min(+(l.f)||0,mxL)};});}
    if(lanes.length<1)lanes=[{pgIdx:0,lfIdx:0}];
    if(typeof d.sl==='number'){siteLimit=d.sl;const li=document.getElementById('limit-input');if(li)li.value=siteLimit||'';}
    accLeft=Array.isArray(d.al)?d.al.filter(a=>ACC_BY_CODE[a.c]).map(a=>({code:a.c,r50gW:+(a.g)||920,r50gH:+(a.h)||600})):[];
    accRight=Array.isArray(d.ar)?d.ar.filter(a=>ACC_BY_CODE[a.c]).map(a=>({code:a.c,r50gW:+(a.g)||920,r50gH:+(a.h)||600})):[];
    if(d.cv){const c=d.cv;[['f-client',c.cl],['f-project',c.pr],['f-addr',c.ad],['f-ref',c.rf],['f-author',c.au],['f-rev',c.rv],['f-date',c.dt],['f-version',c.vr]].forEach(([eid,v])=>{const el=document.getElementById(eid);if(el&&v!=null)el.value=v;});}
    return true;
  }catch(e){return false;}
}

// ══ PRESETS ═══════════════════════════════════════════════════
const PRESETS={
  std2: {m:'sbtl8000',l:[{pgIdx:0,lfIdx:0},{pgIdx:0,lfIdx:0}]},
  wide1:{m:'sbtl8000',l:[{pgIdx:1,lfIdx:0}]},
  mix3: {m:'sbtl8000',l:[{pgIdx:0,lfIdx:0},{pgIdx:1,lfIdx:0},{pgIdx:0,lfIdx:0}]},
  xl2:  {m:'sbtl8000',l:[{pgIdx:2,lfIdx:0},{pgIdx:2,lfIdx:0}]},
  acc4: {m:'sbtl8000',l:[{pgIdx:0,lfIdx:0},{pgIdx:0,lfIdx:0},{pgIdx:0,lfIdx:0},{pgIdx:0,lfIdx:0}]},
