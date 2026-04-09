// ══ UI ════════════════════════════════════════════════════════
function ui(){
  const sp=MODELS[M];
  document.getElementById('mtabs').innerHTML=MK.map(k=>`<button class="mbt${k===M?' on':''}" onclick="pushUndo('modelo');M='${k}';lanes=lanes.map(()=>({pgIdx:0,lfIdx:0}));ui();drawCAD();if(PAGE==='ficha')drawFicha();"><span class="mn">${MODELS[k].label}</span><span class="ms">${MODELS[k].sub}</span></button>`).join('');
  document.getElementById('nv').textContent=N();
  const dmBtn=document.getElementById('dm'),ipBtn=document.getElementById('ip');
  dmBtn.disabled=N()<=1;dmBtn.title=N()<=1?T('ttipMinLanes'):'';dmBtn.setAttribute('aria-label',T('btnDecLanes'));
  ipBtn.disabled=N()>=6;ipBtn.title=N()>=6?T('ttipMaxLanes'):'';ipBtn.setAttribute('aria-label',T('btnIncLanes'));
  document.getElementById('lr').innerHTML=lanes.map((l,i)=>{
    const pgI=Math.min(l.pgIdx,sp.pg.length-1),pg=sp.pg[pgI],lfI=Math.min(l.lfIdx,pg.leaves.length-1);
    return`<div class="lc"><div class="ln">${T('lane')} ${i+1}</div>
    <div class="lch">${sp.pg.map((p,j)=>`<button class="ch ${j===pgI?'op':''}" onclick="pushUndo('anchura');lanes[${i}]={pgIdx:${j},lfIdx:0};ui();drawCAD();if(PAGE==='ficha')drawFicha();">${p.l}mm</button>`).join('')}</div>
    <div class="lch" style="margin-top:2px">${pg.leaves.length>1?pg.leaves.map((lv,j)=>`<button class="ch ${j===lfI?'ol':''}" onclick="pushUndo('hoja');lanes[${i}].lfIdx=${j};ui();drawCAD();if(PAGE==='ficha')drawFicha();">${lv.label}</button>`).join(''):`<span style="font-size:8px;font-family:monospace;color:rgba(168,189,212,.4)">${pg.leaves[0].label}</span>`}</div>
    </div>`;
  }).join('');
  const TWg=TWgate(),pvc=pvcSize(N()),st=getAlertState(),TWtotal=TWfull();
  const tc=st==='over'?'over':st==='near'?'near':'';
  const slack=siteLimit>0?rnd(siteLimit-TWtotal):null;
  document.getElementById('sk').innerHTML=`
    <div class="sc"><span class="sl">${T('covGates')}</span><span class="sv">${rnd(TWg).toLocaleString()} mm</span></div>
    ${TWtotal!==TWg?`<div class="sc"><span class="sl">${T('twLabel')}</span><span class="sv ${tc}" style="${tc?'':'color:#c08800'}">${rnd(TWtotal).toLocaleString()} mm${st==='over'?' ⚠':''}</span></div>`:''}
    <div class="sc"><span class="sl">${T('nCabs')}</span><span class="sv">${N()+1} ${T('uiGabinets')}</span></div>
    <div class="sc"><span class="sl">PVC</span><span class="sv" style="color:${pvc.color}">${pvc.label}</span></div>
    ${siteLimit>0?`<div class="sc"><span class="sl">${T('maxLbl')}</span><span class="sv ${tc}">${st==='over'?T('alertOverBadge'):st==='near'?T('alertNearBadge'):'✓ '+slack+'mm'}</span></div>`:''}
`;
  const sb=document.getElementById('session-banner');
  if(sb){if(sessionRestored){sb.style.display='flex';sb.style.cursor='pointer';sb.title=T('sessionClear');sb.onclick=clearSession;sb.innerHTML=`↺ ${T('sessionRestored')} ×`;}else{sb.style.display='none';sb.style.cursor='';sb.title='';sb.onclick=null;sb.innerHTML='';}}
  updateAlerts();updateI18nDOM();renderAccBar();autoSave();
}
document.getElementById('dm').onclick=()=>{if(N()>1){pushUndo('-pasillo');lanes.pop();ui();drawCAD();if(PAGE==='wiring')drawWiring();if(PAGE==='cover')drawCover();if(PAGE==='ficha')drawFicha();}};
document.getElementById('ip').onclick=()=>{if(N()<6){pushUndo('+pasillo');lanes.push({pgIdx:0,lfIdx:0});ui();drawCAD();if(PAGE==='wiring')drawWiring();if(PAGE==='cover')drawCover();if(PAGE==='ficha')drawFicha();}};
document.getElementById('f-date').value=new Date().toISOString().slice(0,10);

// ══ MIS PROYECTOS ═════════════════════════════════════════════
const PJ_KEY='zkteco-projects-v1';
