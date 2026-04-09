// ══ WIRING ════════════════════════════════════════════════════
function drawWiring(){
  const sp=MODELS[M];if(!sp)return;
  const n=N(),pvc=pvcSize(n),totalUnits=n+1,totalCables=2+4*n;
  const cables=T('cables'),pvcRanges=T('pvcRanges');
  const C_AC='#cc2020',C_ETH='#1464b4',C_MTR='#1a7a30',C_MS='#1a1a1a';
  // ── Layout constants ──────────────────────────────────────────
  const SVG_W=720,MG=16,SW_W=62,SW_D=38;
  const CAB_D=48; // unit depth in plan view (px)
  const availW=SVG_W-2*MG-SW_W-12;
  const cabW=Math.max(54,Math.min(88,Math.floor(availW*0.78/totalUnits)));
  const laneGap=n>0?Math.min(100,Math.max(16,Math.floor((availW-totalUnits*cabW)/n))):0;
  const barrL=n>0?Math.max(0,Math.min(16,Math.floor(laneGap/2)-3)):0;
  const UX0=MG+SW_W+12;
  const uX=i=>UX0+i*(cabW+laneGap);
  const condTkM=pvc.d<=50?11:pvc.d<=63?14:18; // main conduit px-thickness
  const condTkB=Math.max(5,condTkM-5);          // branch conduit
  // Y positions
  const TITLE_H=40,WALL_H=11;
  const UNITS_TOP=TITLE_H+WALL_H+8;
  const UNITS_BOT=UNITS_TOP+CAB_D;
  const MAIN_CY=r(UNITS_BOT+28);
  const PLAN_BOT=MAIN_CY+Math.ceil(condTkM/2)+10;
  const BOT_WALL=PLAN_BOT+WALL_H;
  const BOT2_TOP=BOT_WALL+10;
  const SEC2_TITLE_H=16,SEC2_DRAW_H=220;
  const FGY2=BOT2_TOP+SEC2_TITLE_H+SEC2_DRAW_H;
  const vH=FGY2+24;
  const condX1=r(uX(0)-8),condX2=r(uX(n)+cabW+8);
  const wsvg=document.getElementById('wsvg');
  wsvg.setAttribute('viewBox',`0 0 ${SVG_W} ${vH}`);
  // ── Defs: floor tile, wall hatch, metallic conduit pattern ───
  let h=`<defs>
  <pattern id="fp-t" patternUnits="userSpaceOnUse" width="24" height="24">
    <rect width="24" height="24" fill="#e8e4da"/>
    <path d="M0 0h24M0 24h24M0 0v24M24 0v24" stroke="#d4d0c6" stroke-width=".32"/>
  </pattern>
  <pattern id="wp-t" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
    <rect width="7" height="7" fill="#a8a098"/>
    <rect width="3.5" height="7" fill="#989088"/>
  </pattern>
  <pattern id="cnd-m" patternUnits="userSpaceOnUse" width="8" height="${condTkM}">
    <rect width="8" height="${condTkM}" fill="#8a9eb4"/>
    <rect width="8" height="${r(condTkM*.22)}" fill="#a4b8cc"/>
    <rect y="${r(condTkM*.78)}" width="8" height="${r(condTkM*.22)}" fill="#6a8898"/>
  </pattern>
  <marker id="da" viewBox="0 0 10 6" refX="9.2" refY="3" markerWidth="7" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 3L0 6Z" fill="context-stroke"/></marker>
</defs>`;
  // ── Global background + border ────────────────────────────────
  h+=`<rect width="${SVG_W}" height="${vH}" fill="#d4d0c8"/>`;
  h+=`<rect x="8" y="8" width="${SVG_W-16}" height="${vH-16}" fill="none" stroke="#222" stroke-width="1.4"/>`;
  // ── Title bar (dark navy) ─────────────────────────────────────
  h+=`<rect x="8" y="8" width="${SVG_W-16}" height="32" fill="#182838"/>`;
  h+=`<text x="${MG+2}" y="23" text-anchor="start" ${FM} font-size="9.5" font-weight="bold" fill="#fff" letter-spacing=".8">${T('wiringTitle')}</text>`;
  h+=`<text x="${MG+2}" y="35" text-anchor="start" ${FM} font-size="6.5" fill="#7ab4d8">${sp.label} · ${n} ${n>1?T('lanes'):T('lane')} · ${unitsShort()}</text>`;
  // ── Floor plan area ───────────────────────────────────────────
  h+=`<rect x="8" y="${TITLE_H}" width="${SVG_W-16}" height="${PLAN_BOT-TITLE_H}" fill="url(#fp-t)"/>`;
  // Top wall strip
  h+=`<rect x="8" y="${TITLE_H}" width="${SVG_W-16}" height="${WALL_H}" fill="url(#wp-t)"/>`;
  h+=`<rect x="8" y="${TITLE_H}" width="${SVG_W-16}" height="${WALL_H}" fill="none" stroke="#555" stroke-width=".7"/>`;
  h+=`<text x="${MG+2}" y="${r(TITLE_H+WALL_H/2+2.5)}" ${FM} font-size="4.5" fill="#666" letter-spacing=".5">MURO</text>`;
  // Bottom wall strip
  h+=`<rect x="8" y="${PLAN_BOT}" width="${SVG_W-16}" height="${WALL_H}" fill="url(#wp-t)"/>`;
  h+=`<rect x="8" y="${PLAN_BOT}" width="${SVG_W-16}" height="${WALL_H}" fill="none" stroke="#555" stroke-width=".7"/>`;
  h+=`<text x="${MG+2}" y="${r(PLAN_BOT+WALL_H/2+2.5)}" ${FM} font-size="4.5" fill="#666" letter-spacing=".5">MURO</text>`;
  // ── Switch / Access Control panel ────────────────────────────
  const swX=MG+2,swY=r(UNITS_TOP+(CAB_D-SW_D)/2);
  h+=`<rect x="${swX+2}" y="${swY+2}" width="${SW_W}" height="${SW_D}" fill="rgba(0,0,0,.2)" rx="3"/>`;
  h+=`<rect x="${swX}" y="${swY}" width="${SW_W}" height="${SW_D}" fill="#182838" stroke="#3a5070" stroke-width="1" rx="3"/>`;
  h+=`<rect x="${swX}" y="${swY}" width="${SW_W}" height="13" fill="#0e1c2a" rx="3"/>`;
  h+=`<rect x="${swX}" y="${swY+7}" width="${SW_W}" height="6" fill="#0e1c2a"/>`;
  h+=`<text x="${r(swX+SW_W/2)}" y="${swY+11}" text-anchor="middle" ${FM} font-size="5.8" fill="#aad0ee" font-weight="bold">${T('switchLbl')}</text>`;
  h+=`<text x="${r(swX+SW_W/2)}" y="${swY+26}" text-anchor="middle" ${FM} font-size="5" fill="#6a90a8">${T('accessCtrl')}</text>`;
  // ── Feed conduit (switch → main conduit, bent elbow) ─────────
  const feedX=swX+SW_W,feedY=r(swY+SW_D/2);
  const elbR=6;
  h+=`<path d="M${feedX} ${feedY} L${condX1+elbR} ${feedY} Q${condX1} ${feedY} ${condX1} ${r(feedY+elbR)} L${condX1} ${MAIN_CY}" fill="none" stroke="${pvc.color}" stroke-width="${condTkB}" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>`;
  // ── Ethernet bezier: switch → E1 ─────────────────────────────
  const swEX=feedX,swEY=r(swY+SW_D*.35);
  const e1LX=uX(0),e1EY=r(UNITS_TOP+CAB_D*.55);
  h+=`<path d="M${swEX} ${swEY} C${swEX+22} ${swEY} ${e1LX-22} ${e1EY} ${e1LX} ${e1EY}" fill="none" stroke="${C_ETH}" stroke-width="1.5" stroke-dasharray="4 2.5"/>`;
  h+=`<circle cx="${swEX}" cy="${swEY}" r="2.2" fill="${C_ETH}"/>`;
  h+=`<circle cx="${e1LX}" cy="${e1EY}" r="2" fill="${C_ETH}"/>`;
  // ── Main horizontal conduit ───────────────────────────────────
  const condR=r(condTkM/2),condW=condX2-condX1;
  h+=`<rect x="${condX1}" y="${r(MAIN_CY-condTkM/2)}" width="${condW}" height="${condTkM}" fill="url(#cnd-m)" stroke="#4a6070" stroke-width="1.4" rx="${condR}"/>`;
  // Internal cable bundle dots (cross-section view)
  const dotY=r(MAIN_CY-condTkM/2+3);
  const dotStep=Math.max(26,Math.floor(condW/(totalUnits+1)));
  for(let d=0;d<Math.min(totalUnits,7);d++){
    const dx_d=condX1+14+d*dotStep;
    if(dx_d<condX2-18){
      h+=`<circle cx="${dx_d}" cy="${dotY}" r="1.4" fill="${C_AC}" opacity=".85"/>`;
      h+=`<circle cx="${dx_d+4}" cy="${dotY}" r="1.4" fill="${C_ETH}" opacity=".85"/>`;
      h+=`<circle cx="${dx_d+8}" cy="${dotY}" r="1.4" fill="${C_MS}" opacity=".85"/>`;
      h+=`<circle cx="${dx_d+12}" cy="${dotY}" r="1.4" fill="${C_MTR}" opacity=".85"/>`;
    }
  }
  // Conduit highlight strip
  h+=`<rect x="${condX1+condR}" y="${r(MAIN_CY-condTkM/2+1)}" width="${condW-2*condR}" height="2" fill="rgba(255,255,255,.24)" rx="1"/>`;
  // ── Units + branch conduits + junction boxes ──────────────────
  for(let i=0;i<=n;i++){
    const dx=uX(i),type=cabType(i),isEnd=(type==='left'||type==='right');
    const mRef=isEnd?sp.labelEnd:sp.labelCentral,hdrCol=isEnd?'#14304f':'#1a4a28';
    const bgFill=isEnd?'#d8e8f4':'#d4eedc';
    const uCX=r(dx+cabW/2);
    // Barrier arms (plan-view silhouette)
    if(barrL>3){
      const barrY=r(UNITS_TOP+CAB_D*.42);
      if(type==='left'||type==='central'){
        h+=`<rect x="${dx+cabW}" y="${barrY-2}" width="${barrL}" height="5" fill="${hdrCol}" rx="1"/>`;
        h+=`<rect x="${r(dx+cabW+barrL-3)}" y="${barrY-5}" width="4" height="10" fill="${hdrCol}" rx="1" opacity=".65"/>`;
      }
      if(type==='right'||type==='central'){
        h+=`<rect x="${r(dx-barrL)}" y="${barrY-2}" width="${barrL}" height="5" fill="${hdrCol}" rx="1"/>`;
        h+=`<rect x="${r(dx-barrL)}" y="${barrY-5}" width="4" height="10" fill="${hdrCol}" rx="1" opacity=".65"/>`;
      }
    }
    // Unit silhouette (shadow + body)
    h+=`<rect x="${dx+2}" y="${UNITS_TOP+2}" width="${cabW}" height="${CAB_D}" fill="rgba(0,0,0,.15)" rx="4"/>`;
    h+=`<rect x="${dx}" y="${UNITS_TOP}" width="${cabW}" height="${CAB_D}" fill="${bgFill}" stroke="${hdrCol}" stroke-width="1.4" rx="4"/>`;
    h+=`<rect x="${dx}" y="${UNITS_TOP}" width="${cabW}" height="14" fill="${hdrCol}" rx="4"/>`;
    h+=`<rect x="${dx}" y="${UNITS_TOP+8}" width="${cabW}" height="6" fill="${hdrCol}"/>`;
    h+=`<text x="${uCX}" y="${r(UNITS_TOP+11)}" text-anchor="middle" ${FM} font-size="${cabW>70?6.5:5.8}" font-weight="bold" fill="#fff">${mRef}</text>`;
    const roleLbl=type==='left'?`E${i+1}·${T('ctrlMaster')}`:type==='right'?`E${i+1}·${T('ctrlSlave')}`:`E${i+1}·S/M`;
    h+=`<text x="${uCX}" y="${r(UNITS_TOP+22)}" text-anchor="middle" ${FM} font-size="${cabW>70?5.2:4.8}" fill="${hdrCol}">${roleLbl}</text>`;
    // Port color indicators (AC IN, RJ45, M-S, ETH-MTR)
    const portY=r(UNITS_TOP+28),portOffsets=[-10,-3,4,11];
    [{col:C_AC},{col:C_ETH},{col:C_MS},{col:C_MTR}].forEach(({col},k)=>{
      h+=`<rect x="${r(uCX+portOffsets[k]-2.5)}" y="${portY}" width="5" height="7" fill="${col}" rx="1" opacity=".9"/>`;
    });
    h+=`<text x="${uCX}" y="${r(UNITS_TOP+CAB_D-3)}" text-anchor="middle" ${FM} font-size="4.5" fill="#aaa">E${i+1}</text>`;
    // Branch conduit (unit bottom → junction box on main conduit)
    h+=`<line x1="${uCX}" y1="${UNITS_BOT}" x2="${uCX}" y2="${r(MAIN_CY-condTkM/2)}" stroke="${pvc.color}" stroke-width="${condTkB}" stroke-linecap="round" opacity=".55"/>`;
  }
  // === VISTA FRONTAL / FRONT ELEVATION WITH CABLE ROUTING ====
  const TWg=TWgate();
  const LBL_W=84;
  const avW2=SVG_W-2*MG-LBL_W-8;
  const fsc2=Math.min(avW2/Math.max(1,TWg),(SEC2_DRAW_H-30)/sp.H)*0.85;
  const fdw2=r(TWg*fsc2);
  const fox2=r(MG+LBL_W+(avW2-fdw2)/2);
  const gndY2=r(FGY2-26);
  const foy2=r(gndY2-sp.H*fsc2);
  // Section title bar
  h+=`<rect x="8" y="${BOT2_TOP}" width="${SVG_W-16}" height="${SEC2_TITLE_H}" fill="#182838"/>`;
  h+=`<text x="${r(SVG_W/2)}" y="${BOT2_TOP+11}" text-anchor="middle" ${FM} font-size="7.5" font-weight="bold" fill="#fff" letter-spacing=".8">${T('frontTitle')} — RECORRIDO DE CABLES</text>`;
  // Background
  h+=`<rect x="8" y="${BOT2_TOP+SEC2_TITLE_H}" width="${SVG_W-16}" height="${SEC2_DRAW_H}" fill="#e8e6de"/>`;
  // Cable line definitions
  const wiresDef=[
    {col:C_AC,  lbl:cables[0], dash:'',    w:2.2},
    {col:C_ETH, lbl:cables[1], dash:'5 3', w:1.8},
    {col:C_MTR, lbl:cables[2], dash:'',    w:1.8},
    {col:C_MS,  lbl:cables[3], dash:'8 4', w:1.8}
  ];
  const wireYs=[.28,.41,.57,.70].map(f=>r(foy2+sp.H*fsc2*f));
  // Build cabinet/lane positions
  const FE2=[];let fcx2=fox2;
  for(let i=0;i<=n;i++){
    const cw2=r(sp.W*fsc2);
    FE2.push({type:'cab',x0:fcx2,x1:r(fcx2+cw2),i});
    fcx2=r(fcx2+cw2);
    if(i<n){const{pg}=getLane(i);const lw2=r(pg.s*fsc2);FE2.push({type:'lane',x0:fcx2,x1:r(fcx2+lw2),pg,li:i});fcx2=r(fcx2+lw2);}
  }
  // Passageways (behind cabinets and cables)
  FE2.filter(e=>e.type==='lane').forEach(e=>{
    const{pg}=e,lw2=e.x1-e.x0,gp2=r((pg.s-pg.c)/2*fsc2),clw2=r(pg.c*fsc2);
    h+=`<rect x="${e.x0}" y="${foy2}" width="${lw2}" height="${r(sp.H*fsc2)}" fill="rgba(155,210,250,.45)" stroke="#5a96c8" stroke-width=".5"/>`;
    h+=`<rect x="${r(e.x0+gp2)}" y="${r(foy2+2)}" width="${clw2}" height="${r(sp.H*fsc2-4)}" fill="rgba(155,220,255,.25)"/>`;
    const fs2=Math.max(7,Math.min(11,r(clw2*.12)));
    h+=`<text x="${r((e.x0+e.x1)/2)}" y="${r(foy2+sp.H*fsc2*.78)}" text-anchor="middle" ${FM} font-size="${fs2}" fill="#1a5fa0">C${e.li+1}</text>`;
    const gapPx2=r(GAP_MM*fsc2);
    if(gapPx2>=5&&clw2>12){
      const gx0=r((e.x0+e.x1)/2-gapPx2/2),gx1=r((e.x0+e.x1)/2+gapPx2/2),gAY=r(foy2+12);
      h+=`<line x1="${gx0}" y1="${r(gAY-3)}" x2="${gx0}" y2="${r(gAY+3)}" stroke="#8a6800" stroke-width=".9"/>`;
      h+=`<line x1="${gx1}" y1="${r(gAY-3)}" x2="${gx1}" y2="${r(gAY+3)}" stroke="#8a6800" stroke-width=".9"/>`;
      h+=`<line x1="${gx0}" y1="${gAY}" x2="${gx1}" y2="${gAY}" stroke="#8a6800" stroke-width=".7" marker-start="url(#da)" marker-end="url(#da)"/>`;
      h+=`<text x="${r((gx0+gx1)/2)}" y="${r(gAY-5)}" text-anchor="middle" ${FM} font-size="4.8" fill="#8a6800" font-weight="600">GAP ${GAP_MM}mm</text>`;
    }
    if(clw2>14)h+=tickDim(r(e.x0+gp2),r(e.x0+gp2+clw2),r(gndY2+12),`${pg.c}`,'#2a7a2a');
    if(lw2>18)h+=tickDim(e.x0,e.x1,r(gndY2+22),`${rnd(pg.s)}`,'#555');
  });
  // Cabinets
  FE2.filter(e=>e.type==='cab').forEach(e=>{
    const cw2=e.x1-e.x0,ch2=r(sp.H*fsc2);
    h+=`<rect x="${e.x0}" y="${foy2}" width="${cw2}" height="${ch2}" fill="#b5b0a8" stroke="#777" stroke-width=".8"/>`;
    h+=`<rect x="${r(e.x0+cw2*.12)}" y="${r(foy2+4)}" width="${r(cw2*.76)}" height="${r(Math.min(5,ch2*.04))}" fill="#2a7a2a" rx="1"/>`;
  });
  // Cable routing lines + connection dots + labels
  wiresDef.forEach(({col,lbl,dash,w},k)=>{
    const wy=wireYs[k];
    h+=`<line x1="${fox2}" y1="${wy}" x2="${r(fox2+fdw2)}" y2="${wy}" stroke="${col}" stroke-width="${w}" stroke-dasharray="${dash}"/>`;
    h+=`<circle cx="${fox2}" cy="${wy}" r="2.5" fill="${col}"/>`;
    h+=`<circle cx="${r(fox2+fdw2)}" cy="${wy}" r="2.5" fill="${col}"/>`;
    FE2.filter(e=>e.type==='cab').forEach(e=>{
      if(e.i>0)h+=`<circle cx="${e.x0}" cy="${wy}" r="1.8" fill="${col}" opacity=".75"/>`;
      if(e.i<n)h+=`<circle cx="${e.x1}" cy="${wy}" r="1.8" fill="${col}" opacity=".75"/>`;
    });
    const lnX2=r(fox2-LBL_W+36),lblRX=r(fox2-LBL_W+30);
    h+=`<line x1="${lnX2}" y1="${wy}" x2="${r(fox2-8)}" y2="${wy}" stroke="${col}" stroke-width="${w}" stroke-dasharray="${dash}"/>`;
    h+=`<circle cx="${lnX2}" cy="${wy}" r="2" fill="${col}"/>`;
    h+=`<text x="${r(lblRX-2)}" y="${r(wy+2.5)}" text-anchor="end" ${FM} font-size="5.5" fill="${col}">${lbl}</text>`;
  });
  // Ground line
  h+=gnd(fox2,r(fox2+fdw2),gndY2);
  // ── Title + render ────────────────────────────────────────────
  const badge=document.getElementById('pvc-badge');if(badge)badge.innerHTML='';
  document.getElementById('w-title').textContent=`${sp.label} · ${n} ${n>1?T('lanes'):T('lane')}`;
  wsvg.innerHTML=h;
}

