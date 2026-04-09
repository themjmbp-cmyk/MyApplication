// ══ SVG HELPERS ═══════════════════════════════════════════════
const FM=`font-family="monospace"`;
function tickDim(x1,x2,y,lbl,col,extFrom,fs){const e=5,w=r(x2-x1);let s='';if(extFrom!==undefined){const d=y<extFrom?1:-1;s+=`<line x1="${r(x1)}" y1="${r(extFrom)}" x2="${r(x1)}" y2="${r(y+d*e)}" stroke="${col}" stroke-width=".4" stroke-dasharray="3 2.5" opacity=".5"/>`;s+=`<line x1="${r(x2)}" y1="${r(extFrom)}" x2="${r(x2)}" y2="${r(y+d*e)}" stroke="${col}" stroke-width=".4" stroke-dasharray="3 2.5" opacity=".5"/>`;}s+=`<line x1="${r(x1)}" y1="${r(y-e)}" x2="${r(x1)}" y2="${r(y+e)}" stroke="${col}" stroke-width="1"/>`;s+=`<line x1="${r(x2)}" y1="${r(y-e)}" x2="${r(x2)}" y2="${r(y+e)}" stroke="${col}" stroke-width="1"/>`;if(w>6)s+=`<line x1="${r(x1+.5)}" y1="${r(y)}" x2="${r(x2-.5)}" y2="${r(y)}" stroke="${col}" stroke-width=".8" marker-start="url(#da)" marker-end="url(#da)"/>`;if(w>16&&lbl){const f=fs||(w<40?6:w<70?7.5:9);s+=`<text x="${r((x1+x2)/2)}" y="${r(y-7)}" text-anchor="middle" ${FM} font-size="${f}" fill="${col}" font-weight="600">${lbl}</text>`;}return s;}
function DV(x,y1,y2,lbl,right=true,col='#1a5fa0'){const e=5,tx=right?r(x+15):r(x-15),my=r((y1+y2)/2),h2=r(y2-y1);let s='';s+=`<line x1="${r(x-e)}" y1="${r(y1)}" x2="${r(x+e)}" y2="${r(y1)}" stroke="${col}" stroke-width=".9"/>`;s+=`<line x1="${r(x-e)}" y1="${r(y2)}" x2="${r(x+e)}" y2="${r(y2)}" stroke="${col}" stroke-width=".9"/>`;if(h2>5)s+=`<line x1="${r(x)}" y1="${r(y1+.5)}" x2="${r(x)}" y2="${r(y2-.5)}" stroke="${col}" stroke-width=".7" marker-start="url(#da)" marker-end="url(#da)"/>`;if(h2>16&&lbl){const fs=h2<40?6.5:8;s+=`<text x="${tx}" y="${my}" text-anchor="middle" dominant-baseline="central" ${FM} font-size="${fs}" fill="${col}" transform="rotate(-90,${tx},${my})">${lbl}</text>`;}return s;}
function gnd(x1,x2,y){let s=`<line x1="${r(x1-14)}" y1="${r(y)}" x2="${r(x2+14)}" y2="${r(y)}" stroke="#333" stroke-width="2.5"/>`;for(let x=r(x1-14);x<x2+15;x+=7)s+=`<line x1="${r(x)}" y1="${r(y)}" x2="${r(x-5)}" y2="${r(y+5)}" stroke="#555" stroke-width=".7"/>`;return s;}
function cabSVG(x,y,w,h,lbl){return`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="#b5b0a8"/><rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="url(#ht)" opacity=".55"/><rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="none" stroke="#1a1a1a" stroke-width=".9"/>${w>10?`<text x="${r(x+w/2)}" y="${r(y+h/2)}" text-anchor="middle" dominant-baseline="central" ${FM} font-size="${mn(7.5,w*.4)}" fill="#333" transform="rotate(-90,${r(x+w/2)},${r(y+h/2)})">${lbl}</text>`:''}`;}

const P_TOP=14,P_BOT=305,PX={l:30,r:670},P_DT=74,DL_TOT=57,DL_SUB=72;
const BOT_TOP=313,FXL=14,FXR=706,fW=FXR-FXL,BOT_BOT=640,fgy=628;
const D_TOT_Y=BOT_TOP+55,D_SUB_Y=BOT_TOP+78,D_CLR_Y=BOT_TOP+101,F_DT=BOT_TOP+118;

function makeDefs(){return`<defs>
  <pattern id="ht" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#c0bbb4"/><rect width="3" height="6" fill="#b0aba4"/></pattern>
  <pattern id="conc" patternUnits="userSpaceOnUse" width="14" height="12"><rect width="14" height="12" fill="#c8bca4"/><circle cx="3" cy="3.5" r="1.1" fill="#9a8868"/><circle cx="9" cy="2" r=".7" fill="#8a7858"/><circle cx="11.5" cy="8" r="1.3" fill="#9a8868"/><circle cx="4" cy="9" r=".9" fill="#8a7858"/><line x1="0" y1="6" x2="14" y2="6" stroke="#b8a880" stroke-width=".35" opacity=".45"/></pattern>
  <marker id="da" viewBox="0 0 10 6" refX="9.2" refY="3" markerWidth="7" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 3L0 6Z" fill="context-stroke"/></marker>
  <marker id="ms-arr" viewBox="0 0 10 6" refX="9" refY="3" markerWidth="8" markerHeight="5" orient="auto"><path d="M0 0L10 3L0 6Z" fill="#1a7a30"/></marker>
  <clipPath id="fe-clip"><rect x="${FXL}" y="${BOT_TOP}" width="${fW}" height="${BOT_BOT-BOT_TOP}"/></clipPath>
  <clipPath id="ug-clip"><rect x="${FXL}" y="${BOT_BOT-70}" width="${fW}" height="72"/></clipPath>
</defs>`;}

function limitLine(origin,scale,yTop,yBot,labelY){if(!siteLimit||siteLimit<=0)return'';const state=getAlertState(),col=state==='over'?'#cc1111':state==='near'?'#c08800':'#1a7a30';const lx=r(origin+siteLimit*scale);let h='';h+=`<line x1="${lx}" y1="${r(yTop-4)}" x2="${lx}" y2="${r(yBot+2)}" stroke="${col}" stroke-width="1.8" stroke-dasharray="${state==='over'?'7 4':'10 5'}" stroke-linecap="round" opacity=".9"/>`;h+=`<polygon points="${lx-5},${r(yTop+2)} ${lx+5},${r(yTop+8)} ${lx-5},${r(yTop+14)}" fill="${col}" opacity=".85"/>`;if(state==='over'){const tw=TWfull(),iE=r(origin+tw*scale);if(iE>lx){h+=`<rect x="${lx}" y="${r(yTop-4)}" width="${r(iE-lx)}" height="${r(yBot-yTop+6)}" fill="#cc111115"/>`;h+=tickDim(lx,iE,r(yBot-8),`+${rnd(tw-siteLimit)}mm`,'#cc1111');}}const tagW=58,tagX=lx+2,tagY=r(labelY);h+=`<rect x="${tagX}" y="${r(tagY-10)}" width="${tagW}" height="13" fill="${col}" rx="2" opacity=".92"/>`;h+=`<text x="${r(tagX+3)}" y="${r(tagY)}" ${FM} font-size="7" font-weight="bold" fill="#fff">${T('maxLbl')}</text>`;h+=`<text x="${r(tagX+3)}" y="${r(tagY+10)}" ${FM} font-size="6.5" fill="${col}">${siteLimit} mm</text>`;return h;}

function drawUG(fox,fgy,fsc,sp,pvc){
  const L=FXL+2,R=FXR-2,UG_H=68,SLAB=10,BY=r(fgy+UG_H-10);
  const pvcPx=Math.max(4,Math.min(10,Math.round(pvc.d*fsc*.18))),co=Math.min(pvcPx*.5,4);
  let h='';h+=`<text x="${r((L+R)/2)}" y="${r(fgy+5)}" text-anchor="middle" ${FM} font-size="5" fill="#888" letter-spacing=".8">${T('ugSection')}</text>`;h+=`<rect x="${L}" y="${fgy}" width="${R-L}" height="${SLAB}" fill="url(#ht)" opacity=".7"/><rect x="${L}" y="${fgy}" width="${R-L}" height="${SLAB}" fill="none" stroke="#555" stroke-width=".6"/>`;h+=`<text x="${r(L+4)}" y="${r(fgy+SLAB/2+2.5)}" dominant-baseline="central" ${FM} font-size="5" fill="#555">${T('slab')}</text>`;h+=`<rect x="${L}" y="${r(fgy+SLAB)}" width="${R-L}" height="${r(UG_H-SLAB)}" fill="url(#conc)"/><rect x="${L}" y="${r(fgy+SLAB)}" width="${R-L}" height="${r(UG_H-SLAB)}" fill="none" stroke="#888" stroke-width=".5"/>`;
  const cx=[];let wx=fox;for(let i=0;i<=N();i++){cx.push(Math.max(L+4,Math.min(R-4,r(wx+sp.W*fsc/2))));wx=r(wx+sp.W*fsc);if(i<N())wx=r(wx+getLane(i).pg.s*fsc);}
  cx.forEach(x=>{if(x<L+2||x>R-2)return;const bT=r(fgy-2),bB=r(fgy+SLAB+18);h+=`<line x1="${x}" y1="${bT}" x2="${x}" y2="${bB}" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>`;for(let ty=bT+4;ty<bB-3;ty+=4)h+=`<line x1="${r(x-1.8)}" y1="${ty}" x2="${r(x+1.8)}" y2="${ty}" stroke="#aaa" stroke-width=".5"/>`;h+=`<rect x="${r(x-4)}" y="${r(fgy-3)}" width="8" height="2.5" fill="#b0b0b0" stroke="#777" stroke-width=".5" rx=".8"/>`;h+=`<rect x="${r(x-3)}" y="${r(fgy-6.5)}" width="6" height="4" fill="#999" stroke="#666" stroke-width=".5" rx=".5"/>`;h+=`<path d="M${r(x-4.5)},${fgy} L${r(x-4.5)},${r(fgy+3)} Q${r(x-4.5)},${r(fgy+6)} ${r(x-1.5)},${r(fgy+6)} L${r(x+1.5)},${r(fgy+6)} Q${r(x+4.5)},${r(fgy+6)} ${r(x+4.5)},${r(fgy+3)} L${r(x+4.5)},${fgy}" fill="none" stroke="#777" stroke-width="1.1"/>`;});
  for(let i=0;i<N();i++){const x0=cx[i],x1=cx[i+1];if(x0<L||x1>R||x1-x0<6)continue;const sw=x1-x0,rad=Math.min(8,r(sw*.10)),dY=r(fgy+SLAB+3);const path=`M${x0},${dY} L${x0},${r(BY-rad)} Q${x0},${BY} ${r(x0+rad)},${BY} L${r(x1-rad)},${BY} Q${x1},${BY} ${x1},${r(BY-rad)} L${x1},${dY}`;h+=`<path d="${path}" fill="none" stroke="${pvc.color}25" stroke-width="${pvcPx+5}" stroke-linecap="round" stroke-linejoin="round"/>`;h+=`<path d="${path}" fill="none" stroke="${pvc.color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;h+=`<path d="${path}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="${Math.max(2,pvcPx-3)}" stroke-linecap="round" stroke-linejoin="round"/>`;['#cc1111','#1a5fa0','#e8a020','#2a7a2a'].forEach((cc,k)=>{const ox=r(-co*.75+k*(co*1.5/3));h+=`<line x1="${r(x0+ox)}" y1="${dY}" x2="${r(x0+ox)}" y2="${r(BY-rad-2)}" stroke="${cc}" stroke-width=".9" opacity=".88"/>`;h+=`<line x1="${r(x1+ox)}" y1="${dY}" x2="${r(x1+ox)}" y2="${r(BY-rad-2)}" stroke="${cc}" stroke-width=".9" opacity=".88"/>`;if(sw>22)h+=`<line x1="${r(x0+rad+2)}" y1="${r(BY-1.5+(k-1.5)*1.4)}" x2="${r(x1-rad-2)}" y2="${r(BY-1.5+(k-1.5)*1.4)}" stroke="${cc}" stroke-width=".9" opacity=".88"/>`;});if(sw>36)h+=`<text x="${r((x0+x1)/2)}" y="${r(BY-pvcPx/2-3)}" text-anchor="middle" ${FM} font-size="5.5" fill="${pvc.color}" font-weight="bold">C${i+1}</text>`;}
  const cables=T('cables'),LW=136,LH=50,lx=R-LW-2,ly=r(fgy+UG_H-LH-2);
  h+=`<rect x="${lx}" y="${ly}" width="${LW}" height="${LH}" fill="#eeede5" stroke="${pvc.color}70" stroke-width=".8" rx="3"/>`;h+=`<rect x="${lx}" y="${ly}" width="${LW}" height="13" fill="${pvc.color}" rx="3"/>`;h+=`<rect x="${lx}" y="${r(ly+9)}" width="${LW}" height="4" fill="${pvc.color}"/>`;h+=`<text x="${r(lx+LW/2)}" y="${r(ly+9)}" text-anchor="middle" ${FM} font-size="6.5" font-weight="bold" fill="#fff">PVC ${pvc.label}</text>`;cables.forEach((lbl,k)=>{const ry=r(ly+17+k*8);h+=`<rect x="${r(lx+4)}" y="${r(ry-3)}" width="7" height="4" fill="${['#cc1111','#1a5fa0','#e8a020','#2a7a2a'][k]}" rx="1"/>`;h+=`<text x="${r(lx+14)}" y="${ry}" ${FM} font-size="5.5" fill="#333">${lbl}</text>`;});
  return h;
}

// ── Accessory drawing helpers ─────────────────────────────────
// Draw accessories in PLAN VIEW (top view) — to the left or right of the gate footprint
// pox = gate left edge, poy = gate top, pdd = gate depth pixels, psc = scale
// Returns {svg, totalW_px}
// ── Draw ONE accessory unit in PLAN VIEW (top view) ──────────
// x0 = left pixel edge, poy = plan top, pdd = gate depth px, psc = scale
function drawAccPlanUnit(item,x0,poy,pdd,psc){
  const a=ACC_BY_CODE[item.code];if(!a)return'';
  let h='';
  const itemW=getAccItemW(item);   // ✅ dynamic width (R50 uses glass+100mm)
  const wPx=r(itemW*psc);
  const postWmm=a.code==='R50'?25:38;
  const postPx=Math.max(3,r(postWmm*psc));
  const planDepthMm=postWmm+30;
  const dPx=Math.max(6,Math.min(r(planDepthMm*psc),r(pdd*0.25)));
  const y0=r(poy+pdd/2-dPx/2);
  // Outer rectangle (footprint)
  const fill=a.hasGlass?'rgba(155,210,248,.18)':'rgba(200,136,0,.07)';
  h+=`<rect x="${x0}" y="${y0}" width="${wPx}" height="${dPx}" fill="${fill}" stroke="#c08800" stroke-width="1.1" rx="2"/>`;
  // Posts (small filled squares at each end)
  h+=`<rect x="${x0}" y="${y0}" width="${postPx}" height="${dPx}" fill="rgba(145,140,128,.65)" stroke="#88877a" stroke-width=".5" rx="1"/>`;
  h+=`<rect x="${r(x0+wPx-postPx)}" y="${y0}" width="${postPx}" height="${dPx}" fill="rgba(145,140,128,.65)" stroke="#88877a" stroke-width=".5" rx="1"/>`;
  // Glass edge line (R30/R40/R50)
  if(a.hasGlass){const gO=getAccGlass(item);if(gO){const gWpx=Math.min(r(gO.gW*psc),wPx-postPx*2);const gx=r(x0+(wPx-gWpx)/2);h+=`<line x1="${gx}" y1="${r(y0+dPx/2)}" x2="${r(gx+gWpx)}" y2="${r(y0+dPx/2)}" stroke="#5ab0d8" stroke-width="1.8" opacity=".75"/>`;}}
  // Label
  if(wPx>20)h+=`<text x="${r(x0+wPx/2)}" y="${r(y0-5)}" text-anchor="middle" ${FM} font-size="6" fill="#c08800" font-weight="700">${a.code}</text>`;
  return h;
}

// ── Draw ONE accessory unit in FRONT ELEVATION (dynamic width, supports R50) ──
function drawAccElevUnitDyn(item,x0,fgy,fsc){
  const a=ACC_BY_CODE[item.code];if(!a)return'';
  const itemW=getAccItemW(item);  // ✅ dynamic width for R50
  const origW=a.W;
  // Temporarily patch dimensions for drawing by overriding wPx via a proxy-item
  // We do this by building inline with itemW
  let h='';
  const wPx=r(itemW*fsc);
  const totalH=r(a.H*fsc);
  const y0=r(fgy-totalH);
  const postWmm=a.code==='R50'?25:38;
  const postWpx=Math.max(3,r(postWmm*fsc));
  const postRad=Math.max(1,r(postWmm*fsc*0.28));
  const railHmm=32;
  const railHpx=Math.max(2,r(railHmm*fsc));
  const baseWmm=postWmm+32;
  const baseHmm=14;
  const baseHpx=Math.max(2,r(baseHmm*fsc));
  const baseWpx=Math.max(postWpx+3,r(baseWmm*fsc));
  const postCol='#a8a89e',postStroke='#6a6a62',railCol='#b8b8ae';
  h+=`<rect x="${x0}" y="${r(y0+railHpx)}" width="${postWpx}" height="${r(totalH-railHpx-baseHpx)}" fill="${postCol}" stroke="${postStroke}" stroke-width=".6" rx="${postRad}"/>`;
  h+=`<rect x="${r(x0+wPx-postWpx)}" y="${r(y0+railHpx)}" width="${postWpx}" height="${r(totalH-railHpx-baseHpx)}" fill="${postCol}" stroke="${postStroke}" stroke-width=".6" rx="${postRad}"/>`;
  h+=`<rect x="${x0}" y="${y0}" width="${wPx}" height="${railHpx}" fill="${railCol}" stroke="${postStroke}" stroke-width=".7" rx="${Math.max(1,r(railHmm*fsc*0.3))}"/>`;
  if(railHpx>3)h+=`<rect x="${r(x0+2)}" y="${r(y0+1)}" width="${r(wPx-4)}" height="${r(railHpx*0.35)}" fill="rgba(255,255,255,.2)" rx="1"/>`;
  const lbX=r(x0+postWpx/2-baseWpx/2);
  h+=`<rect x="${lbX}" y="${r(fgy-baseHpx)}" width="${baseWpx}" height="${baseHpx}" fill="${postCol}" stroke="${postStroke}" stroke-width=".5" rx="1"/>`;
  const rbX=r(x0+wPx-postWpx/2-baseWpx/2);
  h+=`<rect x="${rbX}" y="${r(fgy-baseHpx)}" width="${baseWpx}" height="${baseHpx}" fill="${postCol}" stroke="${postStroke}" stroke-width=".5" rx="1"/>`;
  if(!a.hasGlass){
    const midBarY=r(y0+totalH*0.48);const midBarH=Math.max(2,r(14*fsc));
    h+=`<rect x="${x0}" y="${r(midBarY-midBarH/2)}" width="${wPx}" height="${midBarH}" fill="${railCol}" stroke="${postStroke}" stroke-width=".45" rx="1"/>`;
    if(wPx>18){
      const bTopY=r(y0+railHpx+4);const bBotY=r(midBarY+midBarH/2);const midX=r(x0+wPx/2);
      h+=`<line x1="${r(x0+postWpx+1)}" y1="${bTopY}" x2="${midX}" y2="${bBotY}" stroke="${postStroke}" stroke-width=".8" opacity=".55"/>`;
      h+=`<line x1="${r(x0+wPx-postWpx-1)}" y1="${bTopY}" x2="${midX}" y2="${bBotY}" stroke="${postStroke}" stroke-width=".8" opacity=".55"/>`;
      const lMidY=r((midBarY+fgy-baseHpx)*0.5);
      h+=`<line x1="${r(x0+postWpx+1)}" y1="${r(midBarY+midBarH/2)}" x2="${r(x0+wPx/2)}" y2="${lMidY}" stroke="${postStroke}" stroke-width=".5" opacity=".35"/>`;
      h+=`<line x1="${r(x0+wPx-postWpx-1)}" y1="${r(midBarY+midBarH/2)}" x2="${r(x0+wPx/2)}" y2="${lMidY}" stroke="${postStroke}" stroke-width=".5" opacity=".35"/>`;
    }
  } else {
    const gO=getAccGlass(item);
    if(gO){
      const glassBottomMm=120;
      // For R50 the glass can be as wide as itemW - posts, for others clamp to wPx
      const gWpx=a.code==='R50'?r(gO.gW*fsc):Math.min(r(gO.gW*fsc),wPx-postWpx*1.2);
      const gHpx=r(gO.gH*fsc);
      const gBotPx=r(glassBottomMm*fsc);
      const gx=r(x0+(wPx-gWpx)/2);
      const gy=r(fgy-gBotPx-gHpx);
      h+=`<rect x="${gx}" y="${gy}" width="${gWpx}" height="${gHpx}" fill="rgba(155,210,245,.52)" stroke="#48a8d0" stroke-width=".9" rx="1"/>`;
      if(gWpx>10)h+=`<rect x="${r(gx+2)}" y="${r(gy+2)}" width="${r(Math.max(3,gWpx*0.10))}" height="${r(gHpx*0.72)}" fill="rgba(255,255,255,.22)" rx=".5"/>`;
      if(gHpx>20)h+=`<line x1="${r(gx+3)}" y1="${r(gy+gHpx*0.5)}" x2="${r(gx+gWpx-3)}" y2="${r(gy+gHpx*0.5)}" stroke="rgba(255,255,255,.18)" stroke-width=".8"/>`;
      const spacerH=Math.max(2,r(12*fsc));
      h+=`<rect x="${gx}" y="${r(fgy-gBotPx-spacerH)}" width="${gWpx}" height="${spacerH}" fill="${railCol}" stroke="${postStroke}" stroke-width=".5" rx="1"/>`;
      if(a.code==='R50'&&gWpx>8){
        const cW=Math.max(3,r(10*fsc)),cH=Math.max(2,r(8*fsc));
        [[gx-cW+2,gy+r(gHpx*.18)],[gx-cW+2,gy+r(gHpx*.75)]].forEach(([cx,cy])=>h+=`<rect x="${r(cx)}" y="${r(cy)}" width="${cW}" height="${cH}" fill="#888" stroke="#555" stroke-width=".4" rx=".5"/>`);
        [[gx+gWpx-2,gy+r(gHpx*.18)],[gx+gWpx-2,gy+r(gHpx*.75)]].forEach(([cx,cy])=>h+=`<rect x="${r(cx)}" y="${r(cy)}" width="${cW}" height="${cH}" fill="#888" stroke="#555" stroke-width=".4" rx=".5"/>`);
      }
      // Glass dimensions inside label
      if(gHpx>18&&gWpx>30)h+=`<text x="${r(gx+gWpx/2)}" y="${r(gy-4)}" text-anchor="middle" ${FM} font-size="5.5" fill="#48a8d0" font-weight="600">↑${gO.gH}mm</text>`;
      if(gWpx>40)h+=`<text x="${r(gx+gWpx/2)}" y="${r(gy+gHpx/2+4)}" text-anchor="middle" ${FM} font-size="5" fill="#48a8d0">←${gO.gW}→</text>`;
    }
  }
  if(wPx>16){const midHy=r(y0+totalH*0.38);h+=`<text x="${r(x0+wPx/2)}" y="${midHy}" text-anchor="middle" ${FM} font-size="${Math.max(5,Math.min(9,wPx*0.13))}" fill="#555" font-weight="600">${a.code}</text>`;}
  return h;
}

// ── Draw PLAN VIEW accessories for one side ───────────────────
function drawAccListPlan(list,side,pox,poy,pdd,psc){
  if(list.length===0)return{svg:'',totalW:0};
  let h='';
  const totalSideW=accSideTotalW(list);
  const firstGapPx=r(ACC_GAP_MM*psc);
  let offset=ACC_GAP_MM*psc;
  list.forEach((item,idx)=>{
    const a=ACC_BY_CODE[item.code];if(!a)return;
    const itemW=getAccItemW(item);  // ✅ dynamic width
    const wPx=r(itemW*psc);
    let x0;
    if(side==='left'){x0=r(pox-offset-wPx);}
    else{x0=r(pox+offset);}
    h+=drawAccPlanUnit(item,x0,poy,pdd,psc);
    // Dim for this accessory width
    if(wPx>20)h+=tickDim(r(x0),r(x0+wPx),r(poy-14),`${itemW}`,'#c08800');
    // Gap between accessories
    if(idx<list.length-1){
      const gapPx=r(ACC_GAP_MM*psc);
      const gapX=side==='left'?r(x0-gapPx):r(x0+wPx);
      if(gapPx>4)h+=tickDim(gapX,r(gapX+gapPx),r(poy-14),'20','#c06000');
    }
    offset+=wPx+ACC_GAP_MM*psc;
  });
  // Cabinet-to-first-acc gap
  if(firstGapPx>5){
    const gx1=side==='left'?r(pox-firstGapPx):pox;
    const gx2=side==='left'?pox:r(pox+firstGapPx);
    h+=tickDim(Math.min(gx1,gx2),Math.max(gx1,gx2),r(poy-14),'20','#c06000');
  }
  return{svg:h,totalW:totalSideW};
}

// ── Draw FRONT ELEVATION accessories for one side ─────────────
// Returns {svg, totalW} — NO height dims here; they are drawn in drawCAD with staggered offsets
function drawAccListElev(list,side,fox,foy,fgy,fsc,fdw){
  if(list.length===0)return{svg:'',totalW:0};
  let h='';
  const totalSideW=accSideTotalW(list);
  let offset=ACC_GAP_MM*fsc;
  list.forEach((item,idx)=>{
    const a=ACC_BY_CODE[item.code];if(!a)return;
    const itemW=getAccItemW(item);  // ✅ dynamic width
    const wPx=r(itemW*fsc);
    let x0;
    if(side==='left'){x0=r(fox-offset-wPx);}
    else{x0=r(fox+fdw+offset);}
    h+=drawAccElevUnitDyn(item,x0,fgy,fsc);
    // Gap annotation between accessories (small dim)
    if(idx<list.length-1){
      const gapPx=r(ACC_GAP_MM*fsc);
      if(gapPx>5){const gx=side==='left'?r(x0-gapPx):r(x0+wPx);h+=tickDim(gx,r(gx+gapPx),r(fgy-r(a.H*fsc)-14),'20','#c06000');}
    }
    // Width dim for this accessory
    if(wPx>24){const dimY=r(fgy-r(a.H*fsc)-26);h+=tickDim(r(x0),r(x0+wPx),dimY,`${itemW}`,'#c08800');}
    offset+=wPx+ACC_GAP_MM*fsc;
  });
  // First gap dim (cabinet→nearest acc)
  const firstGapPx=r(ACC_GAP_MM*fsc);
  if(firstGapPx>6){
    const firstItemW=getAccItemW(list[0]);
    const firstWpx=r(firstItemW*fsc);
    const nearEdge=side==='left'?r(fox-firstGapPx):r(fox+fdw);
    const farEdge=side==='left'?r(fox-firstGapPx):r(fox+fdw+firstGapPx);
    const maxAccH=Math.max(...list.map(it=>ACC_BY_CODE[it.code]?.H||0));
    const dimY=r(fgy-maxAccH*fsc-14);
    h+=tickDim(Math.min(nearEdge+firstWpx,farEdge),Math.max(nearEdge+firstWpx,farEdge),dimY,'20','#c06000');
  }
  return{svg:h,totalW:totalSideW};
}

