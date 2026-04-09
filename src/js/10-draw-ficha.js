// ══ FICHA ═════════════════════════════════════════════════════
function accSideHtml(list,sideLabel){
  if(list.length===0)return`<div class="ac-none-note">${T('accNone')}</div>`;
  return list.map((item,idx)=>{
    const a=ACC_BY_CODE[item.code];if(!a)return'';
    const gO=getAccGlass(item);
    return`<div style="margin-bottom:6px;padding:6px 8px;border:1px solid rgba(200,136,0,.3);border-radius:6px;background:rgba(200,136,0,.05)">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="afbadge">${a.code}</span><span style="font-size:8.5px;color:#c08800">${accDsc(a)}</span></div>
      <div class="adr"><span class="adk">${T('ficAccW')}</span><span class="adv">${a.W} mm</span></div>
      <div class="adr"><span class="adk">${T('ficAccH')}</span><span class="adv">${a.H} mm</span></div>
      ${gO?`<div class="adr"><span class="adk">${T('ficAccGW')}</span><span class="adv">${gO.gW} mm</span></div><div class="adr"><span class="adk">${T('ficAccGH')}</span><span class="adv">${gO.gH} mm</span></div>`:''}
      ${a.glassOpts&&gO?`<div class="adr"><span class="adk">${T('ficAccOpt')}</span><span class="adv" style="font-size:8px">${goLbl(gO)}</span></div>`:''}
    </div>`;
  }).join('');
}
function drawFicha(){
  const sp=MODELS[M],TWg=TWgate(),pvc=pvcSize(N()),state=getAlertState(),totalCables=2+4*N();
  const aC=state==='over'?'#cc1111':state==='near'?'#c08800':null;
  const tB=(N()+1)*sp.bolts.length,nC=Math.max(0,N()-1);
  const slack=siteLimit>0?rnd(siteLimit-TWfull()):null;
  const TWL=accTotalW(accLeft),TWR=accTotalW(accRight),TWtotal=TWL+TWg+TWR;
  const row=(k,v,u='',col='')=>`<div class="fr2"><span class="fk">${k}</span><span class="fv" style="${col?'color:'+col:''}"> ${v}<span class="u">${u}</span></span></div>`;

  let c1=`<div class="fc"><div class="fh fhd">${T('ficGab')}</div>`;
  c1+=row(T('ficType'),T('swingBarrier'));c1+=row(T('ficLargo'),sp.D,'mm');c1+=row(T('ficAncho'),sp.W,'mm');c1+=row(T('ficAlto'),sp.H,'mm');c1+=row(T('ficArm'),sp.armBase,'mm');c1+=row(T('ficTemp'),sp.tempRange);c1+=row(T('ficVel'),sp.openSpeed);c1+=row(T('ficElec'),sp.power);c1+=row(T('ficPow'),sp.consumption);c1+=row(T('ficGap'),GAP_MM+' mm','','#8a6800');c1+=`</div>`;

  let c2=`<div class="fc"><div class="fh fhg">${T('ficProj')}</div>`;
  c2+=row(T('ficLanes'),N());c2+=row(T('ficCabs'),N()+1,T('uiGabinets'));c2+=`<div class="fr2"><span class="fk">${T('ficCabDetail')}</span><span class="fv" style="font-size:9px;font-weight:500;text-align:right">${unitsInfo()}</span></div>`;c2+=`</div>`;
  c2+=`<div class="fkpi" style="${aC?`border:2px solid ${aC};background:${aC}12`:''}"><span class="fkl" style="color:${aC||'#0a3070'}">${T('ficTW')}${aC?' ⚠':''}</span><span class="fkv" style="color:${aC||'#0a3070'}">${rnd(TWg).toLocaleString()} <span style="font-size:12px;font-weight:600">mm</span></span></div>`;
  if(TWtotal!==TWg){c2+=`<div class="fkpi" style="background:rgba(200,136,0,.12);border:1px solid rgba(200,136,0,.4)"><span class="fkl" style="color:#c08800">${T('ficTWfull')}</span><span class="fkv" style="color:#c08800">${rnd(TWtotal).toLocaleString()} <span style="font-size:12px;font-weight:600">mm</span></span></div>`;}
  if(siteLimit>0){const bc=aC||'#1a7a30';c2+=`<div class="fr2" style="background:${bc}08"><span class="fk" style="color:${bc}">${T('ficLimit')} · ${T('maxLbl')}</span><span class="fv" style="color:${bc};font-size:14px;font-weight:900">${siteLimit} mm</span></div>`;c2+=`<div class="fr2"><span class="fk" style="color:${bc}">${state==='over'?T('alertOverBadge'):state==='near'?T('alertNearBadge'):T('limOk')}</span><span class="fv" style="color:${bc}">${state==='over'?'+'+rnd(TWfull()-siteLimit)+' mm':rnd(slack)+' mm libres'}</span></div>`;}

  let lanesHtml=`<div class="fc" style="grid-column:1/-1"><div class="fh fhg">${T('ficLeaves')}</div><div class="flg">`;
  lanes.forEach((_,i)=>{const{pg,lf}=getLane(i);lanesHtml+=`<div class="fli"><div class="flinum">C${i+1}</div><div class="flipass">${T('ficStep')}: ${pg.l} mm</div><div class="fligmp">${T('ficSlot')}: ${rnd(pg.s)} mm · GAP: ${GAP_MM} mm</div><div class="flileaf">${lf.label}</div><div class="fligmp">${lf.gmp}</div><div class="flidims">${lf.topH}H · ${lf.pH}B · ${lf.pW}W mm</div></div>`;});
  lanesHtml+=`</div></div>`;

  // Accessories card — two-column layout per side
  let accHtml='';
  if(accLeft.length>0||accRight.length>0){
    accHtml=`<div class="afc" style="grid-column:1/-1">
      <div class="afh">◀ <span class="afbadge">${T('ficAcc')}</span> ▶ &nbsp;${T('ficAccL')} &amp; ${T('ficAccR')}</div>
      <div class="afsides">
        <div class="afside">
          <div class="afside-lbl">◀ ${T('accLeftSide').toUpperCase()}${TWL>0?' — '+TWL+' mm':''}</div>
          ${accSideHtml(accLeft,'left')}
        </div>
        <div class="afside">
          <div class="afside-lbl">▶ ${T('accRightSide').toUpperCase()}${TWR>0?' — '+TWR+' mm':''}</div>
          ${accSideHtml(accRight,'right')}
        </div>
      </div>
    </div>`;
  }
  // ── BOM ──────────────────────────────────────────────────────
  const bomItems=[];
  bomItems.push({qty:1,ref:sp.labelEnd,desc:sp.label+' · '+sp.sub});
  if(nC>0)bomItems.push({qty:nC,ref:sp.labelCentral,desc:sp.label+' · Central'});
  const blG={};
  Array.from({length:N()},(_,i)=>{const lf=getLane(i).lf;if(!blG[lf.gmp])blG[lf.gmp]={qty:0,ref:lf.gmp,desc:lf.label};blG[lf.gmp].qty+=2;});
  Object.values(blG).forEach(g=>bomItems.push(g));
  const baG={};
  [...accLeft,...accRight].forEach(a=>{if(!baG[a.code])baG[a.code]={qty:0,ref:a.code,desc:accLbl(ACC_BY_CODE[a.code])};baG[a.code].qty++;});
  Object.values(baG).forEach(g=>bomItems.push(g));
  const bTotal=bomItems.reduce((s,it)=>s+it.qty,0);
  const bomHtml=`<div class="fc" style="grid-column:1/-1"><div class="fh fhd" style="letter-spacing:1px">${T('bomTitle')}</div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:0">`+
    bomItems.map(it=>`<div class="fr2" style="padding:4px 12px"><span class="fk"><span style="font-weight:700;color:#1a5fa0;min-width:22px;display:inline-block;font-size:11px">${it.qty}×</span>${it.ref}</span><span class="fv" style="font-size:9px;color:#555;font-weight:500">${it.desc}</span></div>`).join('')+
    `</div><div class="fr2" style="border-top:1.5px solid rgba(26,95,160,.2);padding:5px 12px"><span class="fk" style="font-weight:700;color:#14304f">${T('bomTotal')}</span><span class="fv" style="font-weight:800;color:#1a5fa0;font-size:13px">${bTotal}×</span></div></div>`;
  document.getElementById('ficha-outer').innerHTML=`<div class="fhr2">${sp.label} — ${sp.sub}</div><div class="fg">${c1}${c2}${lanesHtml}${accHtml}${bomHtml}<div class="fft">ZKTeco Corp. © 2025 — www.zkteco.com</div></div>`;
  const bEl=document.getElementById('bom-inline');if(bEl)bEl.innerHTML='';
  drawFichaSVG();
}

function drawFichaSVG(){
  const sp=MODELS[M],TWg=TWgate(),pvc=pvcSize(N()),state=getAlertState(),totalCables=2+4*N();
  const W=680,P=18,tB=(N()+1)*sp.bolts.length,nC=Math.max(0,N()-1);
  const ac=state==='over'?'#cc1111':state==='near'?'#c08800':null;
  const C1W=r(W/2-10),C2X=r(W/2+8);
  const TWL=accTotalW(accLeft),TWR=accTotalW(accRight),TWtotal=TWL+TWg+TWR;
  const rows1=[
    {sec:T('ficGab'),col:'#14304f',items:[{k:T('ficType'),v:T('swingBarrier')},{k:T('ficLargo'),v:sp.D,u:'mm'},{k:T('ficAncho'),v:sp.W,u:'mm'},{k:T('ficAlto'),v:sp.H,u:'mm'},{k:T('ficArm'),v:sp.armBase,u:'mm'},{k:T('ficTemp'),v:sp.tempRange},{k:T('ficVel'),v:sp.openSpeed},{k:T('ficElec'),v:sp.power},{k:T('ficPow'),v:sp.consumption},{k:T('ficGap'),v:`${GAP_MM} mm`,col:'#8a6800'}]},
    {sec:T('ficComm'),col:'#0a2a50',items:[{k:T('ficProto'),v:T('ficRS485')},{k:T('ficBaud'),v:T('ficBaud9')},{k:T('ficMaster'),v:`${sp.labelEnd} ×1`,col:'#c04000'},{k:T('ficSlave'),v:nC>0?`${sp.labelCentral} ×${nC}`:'N/A',col:nC>0?'#1a5fa0':'#aaa'}]},
  ];
  const RH=16,SH=20,KH=28,AH=30,HDR=40,FTR=22;
  const cH1=rows1.reduce((s,x)=>s+SH+x.items.length*RH,0);
  const hasAcc=accLeft.length>0||accRight.length>0;
  const cH2=SH+3*RH+KH+8+(TWtotal!==TWg?KH+4:0)+(siteLimit>0?RH*2:0);
  const lanesH=SH+Math.ceil(N()/4)*AH+8;
  const accH=hasAcc?SH+(Math.max(accLeft.length,accRight.length))*40+8:0;
  const maxCH=Math.max(cH1,cH2),tot=HDR+maxCH+lanesH+accH+FTR+16;
  document.getElementById('ficha-svg').setAttribute('viewBox',`0 0 ${W} ${tot}`);
  let h=`<rect width="${W}" height="${tot}" fill="#f8f8f6"/>`;
  h+=`<rect x="0" y="0" width="${W}" height="${HDR}" fill="#14304f"/>`;h+=`<text x="${W/2}" y="16" text-anchor="middle" ${FM} font-size="12" font-weight="bold" fill="#7dd87a" letter-spacing="1">${sp.label}</text>`;h+=`<text x="${W/2}" y="30" text-anchor="middle" ${FM} font-size="8" fill="#aaa">${sp.sub}</text>`;
  h+=`<line x1="${C2X-P}" y1="${HDR+4}" x2="${C2X-P}" y2="${HDR+maxCH+4}" stroke="#e0e8f0" stroke-width=".7"/>`;
  let y=HDR+6;
  rows1.forEach(({sec,col,items})=>{h+=`<rect x="${P}" y="${r(y)}" width="${C1W-P}" height="${SH}" fill="${col}" rx="2"/>`;h+=`<text x="${r(P+6)}" y="${r(y+13)}" ${FM} font-size="7" font-weight="bold" fill="#7dd87a" letter-spacing="1">${sec.toUpperCase()}</text>`;y+=SH;items.forEach(({k,v,u,col:ic})=>{h+=`<text x="${r(P+6)}" y="${r(y+RH/2+3)}" ${FM} font-size="7" fill="#57606a">${k}</text>`;const val=u?`${v} ${u}`:v;h+=`<text x="${r(P+C1W-P-5)}" y="${r(y+RH/2+4)}" text-anchor="end" ${FM} font-size="${String(val).length>20?7:8}" font-weight="600" fill="${ic||'#1a1a2e'}">${val}</text>`;h+=`<line x1="${P}" y1="${r(y+RH)}" x2="${P+C1W-P}" y2="${r(y+RH)}" stroke="#e8ecf0" stroke-width=".4"/>`;y+=RH;});});
  let y2=HDR+6;
  h+=`<rect x="${C2X}" y="${r(y2)}" width="${W-C2X-P}" height="${SH}" fill="#1a4a28" rx="2"/>`;h+=`<text x="${r(C2X+6)}" y="${r(y2+13)}" ${FM} font-size="7" font-weight="bold" fill="#7dd87a" letter-spacing="1">${T('ficProj').toUpperCase()}</text>`;y2+=SH;
  [{k:T('ficLanes'),v:N()},{k:T('ficCabs'),v:N()+1,u:T('uiGabinets')},{k:T('ficCabDetail'),v:unitsShort()}].forEach(({k,v,u})=>{h+=`<text x="${r(C2X+6)}" y="${r(y2+RH/2+3)}" ${FM} font-size="7" fill="#57606a">${k}</text>`;const val=u?`${v} ${u}`:v;h+=`<text x="${W-P-5}" y="${r(y2+RH/2+4)}" text-anchor="end" ${FM} font-size="${String(val).length>22?7:8}" font-weight="600" fill="#1a1a2e">${val}</text>`;h+=`<line x1="${C2X}" y1="${r(y2+RH)}" x2="${W-P}" y2="${r(y2+RH)}" stroke="#e8ecf0" stroke-width=".4"/>`;y2+=RH;});
  y2+=3;const kC=ac||'#0a3070';h+=`<rect x="${C2X}" y="${y2}" width="${W-C2X-P}" height="${KH}" fill="${kC}14" rx="3"/>`;h+=`<text x="${r(C2X+6)}" y="${r(y2+KH/2+3)}" ${FM} font-size="8" font-weight="bold" fill="${kC}">${T('ficTW')}${ac?' ⚠':''}</text>`;h+=`<text x="${W-P-5}" y="${r(y2+KH/2+6)}" text-anchor="end" ${FM} font-size="16" font-weight="900" fill="${kC}">${rnd(TWg)} mm</text>`;y2+=KH+5;
  if(TWtotal!==TWg){h+=`<rect x="${C2X}" y="${y2}" width="${W-C2X-P}" height="${KH}" fill="rgba(200,136,0,.12)" rx="3" style="border:1px solid rgba(200,136,0,.4)"/>`;h+=`<text x="${r(C2X+6)}" y="${r(y2+KH/2+3)}" ${FM} font-size="8" font-weight="bold" fill="#c08800">${T('ficTWfull')}</text>`;h+=`<text x="${W-P-5}" y="${r(y2+KH/2+6)}" text-anchor="end" ${FM} font-size="16" font-weight="900" fill="#c08800">${rnd(TWtotal)} mm</text>`;y2+=KH+4;}
  if(siteLimit>0){const bc=ac||'#1a7a30',sl=siteLimit-TWfull();h+=`<rect x="${C2X}" y="${y2}" width="${W-C2X-P}" height="${RH*2}" fill="${bc}10" rx="2"/>`;h+=`<text x="${r(C2X+6)}" y="${r(y2+RH/2+3)}" ${FM} font-size="7" fill="${bc}">${T('ficLimit')}: ${siteLimit} mm</text>`;h+=`<text x="${r(C2X+6)}" y="${r(y2+RH+RH/2+3)}" ${FM} font-size="7" fill="${bc}">${state==='over'?T('alertOverBadge')+' +'+rnd(TWfull()-siteLimit)+'mm':state==='near'?T('alertNearBadge')+' '+rnd(sl)+'mm':T('limOk')+' '+rnd(sl)+'mm'}</text>`;y2+=RH*2;}
  // Lanes
  const lY=HDR+maxCH+6;h+=`<rect x="${P}" y="${lY}" width="${W-2*P}" height="${SH}" fill="#1a4a28" rx="2"/>`;h+=`<text x="${r(P+6)}" y="${r(lY+13)}" ${FM} font-size="7" font-weight="bold" fill="#7dd87a" letter-spacing="1">${T('ficLeaves').toUpperCase()}</text>`;
  const liW=r((W-2*P)/Math.min(N(),4)-4);
  lanes.forEach((_,i)=>{const{pg,lf}=getLane(i),cc=i%4,rr=Math.floor(i/4),lx=r(P+2+cc*(liW+4)),ly=r(lY+SH+rr*AH+2);h+=`<rect x="${lx}" y="${ly}" width="${liW}" height="${AH-4}" fill="#fff" stroke="#d0e8d8" stroke-width=".7" rx="3"/>`;h+=`<text x="${r(lx+6)}" y="${r(ly+10)}" ${FM} font-size="7" font-weight="bold" fill="#2a7a2a">C${i+1} · ${pg.l}mm · GAP ${GAP_MM}mm</text>`;h+=`<text x="${r(lx+6)}" y="${r(ly+20)}" ${FM} font-size="6.5" fill="#555">${lf.label} · ${lf.gmp}</text>`;h+=`<text x="${r(lx+6)}" y="${r(ly+28)}" ${FM} font-size="6" fill="#888">${lf.topH}H · ${lf.pH}B · ${lf.pW}W mm</text>`;});
  // Accessories
  if(hasAcc){
    const aY=lY+lanesH+4;h+=`<rect x="${P}" y="${aY}" width="${W-2*P}" height="${SH}" fill="#3a2400" rx="2"/>`;h+=`<text x="${r(P+6)}" y="${r(aY+13)}" ${FM} font-size="7" font-weight="bold" fill="#f0c060" letter-spacing="1">${T('ficAccL').split(' ').slice(-2).join(' ').toUpperCase()} + ${T('ficAccR').split(' ').slice(-2).join(' ').toUpperCase()}</text>`;
    const aMidX=r(W/2);let aLy=aY+SH+4,aRy=aY+SH+4;
    h+=`<line x1="${aMidX}" y1="${aY+SH}" x2="${aMidX}" y2="${aY+accH}" stroke="#c08800" stroke-width=".5" opacity=".4"/>`;
    h+=`<text x="${r(P+6)}" y="${r(aY+SH+12)}" ${FM} font-size="6.5" font-weight="bold" fill="#c08800">◀ ${T('accLeftSide').toUpperCase()}${TWL>0?' — '+TWL+' mm':''}</text>`;
    h+=`<text x="${r(aMidX+8)}" y="${r(aY+SH+12)}" ${FM} font-size="6.5" font-weight="bold" fill="#c08800">${T('accRightSide').toUpperCase()} ▶${TWR>0?' — '+TWR+' mm':''}</text>`;
    aLy+=16;aRy+=16;
    const drawAccListSVG=(list,xStart,xEnd)=>{
      if(list.length===0){h+=`<text x="${r((xStart+xEnd)/2)}" y="${r(aLy+8)}" text-anchor="middle" ${FM} font-size="7" fill="#aaa" font-style="italic">${T('accNone')}</text>`;return;}
      let ay=aLy;list.forEach((item)=>{
        const a=ACC_BY_CODE[item.code];if(!a)return;const gO=getAccGlass(item);
        h+=`<rect x="${xStart}" y="${ay}" width="${xEnd-xStart-4}" height="32" fill="rgba(200,136,0,.06)" stroke="rgba(200,136,0,.25)" stroke-width=".7" rx="3"/>`;
        h+=`<rect x="${r(xStart+4)}" y="${r(ay+4)}" width="28" height="12" fill="#c08800" rx="3"/>`;h+=`<text x="${r(xStart+18)}" y="${r(ay+14)}" text-anchor="middle" ${FM} font-size="8" font-weight="bold" fill="#fff">${a.code}</text>`;
        h+=`<text x="${r(xStart+38)}" y="${r(ay+11)}" ${FM} font-size="7" fill="#c08800">${a.W}×${a.H}mm</text>`;
        if(gO)h+=`<text x="${r(xStart+38)}" y="${r(ay+22)}" ${FM} font-size="6.5" fill="#5ab0d8">${T('glass')} ${gO.gW}×${gO.gH}mm</text>`;
        ay+=36;
      });
    };
    drawAccListSVG(accLeft,P+2,aMidX-4);
    drawAccListSVG(accRight,aMidX+4,W-P-2);
  }
  h+=`<rect x="0" y="${tot-FTR}" width="${W}" height="${FTR}" fill="#14304f"/>`;h+=`<text x="${W/2}" y="${tot-8}" text-anchor="middle" ${FM} font-size="7" fill="#7dd87a" letter-spacing=".8">ZKTeco Corp. © 2025 — www.zkteco.com</text>`;
  document.getElementById('ficha-svg').setAttribute('viewBox',`0 0 ${W} ${tot}`);document.getElementById('ficha-svg').innerHTML=h;
}

