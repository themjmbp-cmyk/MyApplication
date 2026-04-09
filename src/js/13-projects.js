function getProjects(){try{return JSON.parse(localStorage.getItem(PJ_KEY)||'[]');}catch(e){return[];}}
function _savePJStore(arr){try{localStorage.setItem(PJ_KEY,JSON.stringify(arr));}catch(e){console.error('Projects save error:',e);}}
function showSaveInput(){
  const inp=document.getElementById('pj-name-inp');
  inp.value=document.getElementById('f-project').value||'Proyecto';
  document.getElementById('pj-name-row').style.display='flex';
  inp.focus();inp.select();
}
function hideSaveInput(){
  document.getElementById('pj-name-row').style.display='none';
}
function confirmSaveToProjects(){
  const name=document.getElementById('pj-name-inp').value;
  if(!name||!name.trim()){hideSaveInput();return;}
  const arr=getProjects();if(arr.length>=10){alert(T('projMax'));return;}
  const gv=id=>{const el=document.getElementById(id);return el?el.value:'';};
  arr.unshift({id:Date.now().toString(),name:name.trim(),model:M,nLanes:N(),date:new Date().toLocaleDateString(),tw:rnd(TWfull()),
    data:JSON.stringify({version:'3',ts:Date.now(),model:M,lanes:lanes.map(l=>({pgIdx:l.pgIdx,lfIdx:l.lfIdx})),siteLimit,accLeft,accRight,
      cover:{client:gv('f-client'),project:gv('f-project'),addr:gv('f-addr'),ref:gv('f-ref'),author:gv('f-author'),revby:gv('f-rev'),date:gv('f-date'),version:gv('f-version')}})});
  _savePJStore(arr);hideSaveInput();renderProjectsModal();
}
function loadFromProjects(id){
  const proj=getProjects().find(p=>p.id===id);if(!proj)return;
  try{
    const d=JSON.parse(proj.data);
    if(d.model&&MODELS[d.model])M=d.model;
    if(Array.isArray(d.lanes)){const sp2=MODELS[M];lanes=d.lanes.map(l=>{const pg=+(l.pgIdx)||0,lf=+(l.lfIdx)||0;const mxP=sp2?sp2.pg.length-1:0,mxL=sp2?sp2.pg[Math.min(pg,mxP)].leaves.length-1:0;return{pgIdx:Math.min(pg,mxP),lfIdx:Math.min(lf,mxL)};});}
    if(lanes.length<1)lanes=[{pgIdx:0,lfIdx:0}];
    if(typeof d.siteLimit==='number'){siteLimit=d.siteLimit;const li=document.getElementById('limit-input');if(li)li.value=siteLimit||'';}
    accLeft=Array.isArray(d.accLeft)?d.accLeft.filter(a=>ACC_BY_CODE[a.code]).map(a=>({...a,r50gW:+(a.r50gW)||920,r50gH:+(a.r50gH)||600})):[];
    accRight=Array.isArray(d.accRight)?d.accRight.filter(a=>ACC_BY_CODE[a.code]).map(a=>({...a,r50gW:+(a.r50gW)||920,r50gH:+(a.r50gH)||600})):[];
    if(d.cover){const c=d.cover;[['f-client',c.client],['f-project',c.project],['f-addr',c.addr],['f-ref',c.ref],['f-author',c.author],['f-rev',c.revby],['f-date',c.date],['f-version',c.version]].forEach(([eid,v])=>{const el=document.getElementById(eid);if(el&&v!=null)el.value=v;});}
    closeProjects();ui();redrawPage();autoSave();
  }catch(err){alert(T('errorLoad')+': '+err.message);}
}
function deleteProject(id){_savePJStore(getProjects().filter(p=>p.id!==id));renderProjectsModal();}
function openProjects(){document.getElementById('proj-modal').style.display='flex';renderProjectsModal();}
function closeProjects(){document.getElementById('proj-modal').style.display='none';}
function renderProjectsModal(){
  const arr=getProjects(),el=document.getElementById('proj-list');if(!el)return;
  if(!arr.length){el.innerHTML=`<div class="pj-empty">${T('projEmpty')}</div>`;return;}
  el.innerHTML='<div class="pj-grid">'+arr.map(p=>`<div class="pj-card">
    <div class="pj-name">${p.model===M?`<span class="pj-active-dot"></span>`:''}${p.name}</div>
    ${_projectMiniSVG(p.model,p.nLanes)}
    <div class="pj-meta">${(MODELS[p.model]||{labelEnd:p.model}).labelEnd} · ${p.nLanes} ${T('lanes')} · ${p.tw} mm</div>
    <div class="pj-meta">${p.date}</div>
    <div class="pj-actions">
      <button class="pj-load" onclick="loadFromProjects('${p.id}')">${T('projLoad')}</button>
      <button class="pj-del" onclick="if(confirm('${T('projDel')}?'))deleteProject('${p.id}')">${T('projDel')}</button>
    </div></div>`).join('')+'</div>';
}

