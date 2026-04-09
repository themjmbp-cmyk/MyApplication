// ══ MAIN CAD ══════════════════════════════════════════════════
function drawCAD(){
  const sp=MODELS[M];if(!sp)return;
  const TWg=TWgate(),MAXH=maxH(),pvc=pvcSize(N());
  const TWL=accSideTotalW(accLeft),TWR=accSideTotalW(accRight),TWtotal=TWL+TWg+TWR;

  // Choose scale considering accessories in plan AND elevation
  const pW2=PX.r-PX.l,pH2=P_BOT-P_DT;
  const psc_maxW=TWtotal>0?(pW2-14)/TWtotal:0.05,psc_maxD=(pH2-8)/sp.D;
  const psc=Math.min(psc_maxW,psc_maxD)*.86;
  const pdw=TWg*psc,pdd=sp.D*psc;
  const pLWpx=r(TWL*psc),pRWpx=r(TWR*psc);
  // Gate starts after left accessories
  const totalPlanW=r(pLWpx+pdw+pRWpx);
  const pox=r(PX.l+(pW2-totalPlanW)/2+pLWpx); // gate left edge in plan
  const poy=r(P_DT+(pH2-pdd)/2);

  // Front elevation scale — also considers accessories
  const drawH=fgy-F_DT;
  const fsc_maxW=TWtotal>0?(fW-64)/TWtotal:0.05,fsc_maxH=drawH/MAXH;
  const fsc=Math.min(fsc_maxW,fsc_maxH)*.85;
  const fdw=TWg*fsc,fLWpx=r(TWL*fsc),fRWpx=r(TWR*fsc);
  const totalFrontW=r(fLWpx+fdw+fRWpx);
  const fox=r(FXL+(fW-totalFrontW)/2+fLWpx); // gate left edge in elevation
  const foy=r(fgy-sp.H*fsc);
  const topMostY=r(fgy-MAXH*fsc);
  const gapPx_p=r(GAP_MM*psc),gapPx_f=r(GAP_MM*fsc);

  let h=makeDefs()+`<rect width="720" height="700" fill="#eeede5"/><rect x="8" y="8" width="704" height="684" fill="none" stroke="#111" stroke-width="1.6"/><rect x="11" y="11" width="698" height="678" fill="none" stroke="#aaa" stroke-width=".3"/><line x1="14" y1="${BOT_TOP-1}" x2="706" y2="${BOT_TOP-1}" stroke="#444" stroke-width="1.2"/>`;

  // PLAN titles
  h+=`<text x="${PX.l}" y="${P_TOP+12}" text-anchor="start" ${FM} font-size="9" font-weight="bold" fill="#111" letter-spacing="1.2">${T('planTitle')} — ${T('planTopView')}</text>`;
  h+=`<text x="${PX.l}" y="${P_TOP+24}" text-anchor="start" ${FM} font-size="6.5" fill="#777">${sp.label} · ${sp.sub} · ${T('cotas')}</text>`;

  // Section A-A
  const aay=r(poy+pdd*.44);
  h+=`<line x1="${r(pox-pLWpx-24)}" y1="${aay}" x2="${r(pox-pLWpx-2)}" y2="${aay}" stroke="#555" stroke-width=".5" stroke-dasharray="5 2"/>`;
  h+=`<line x1="${r(pox+pdw+pRWpx+2)}" y1="${aay}" x2="${r(pox+pdw+pRWpx+24)}" y2="${aay}" stroke="#555" stroke-width=".5" stroke-dasharray="5 2"/>`;
  h+=`<text x="${r(pox-pLWpx-26)}" y="${r(aay+3)}" text-anchor="end" ${FM} font-size="7" fill="#444">A</text>`;
  h+=`<text x="${r(pox+pdw+pRWpx+26)}" y="${r(aay+3)}" text-anchor="start" ${FM} font-size="7" fill="#444">A</text>`;

  // Draw accessories in plan (LEFT side — going left from pox)
  const accLplanResult=drawAccListPlan(accLeft,'left',pox,poy,pdd,psc);
  h+=accLplanResult.svg;
  // Draw accessories in plan (RIGHT side — going right from pox+pdw)
  const accRplanResult=drawAccListPlan(accRight,'right',r(pox+pdw),poy,pdd,psc);
  h+=accRplanResult.svg;

  // Gate cabinets in plan
  let pcx=pox;
  for(let i=0;i<=N();i++){
    const cw=r(sp.W*psc),cd=r(sp.D*psc),lbl=i===0||i===N()?sp.labelEnd.split(/[\s/-]/)[0]:sp.labelCentral.split(/[\s/-]/)[0];
    h+=cabSVG(pcx,poy,cw,cd,lbl);
    sp.bolts.forEach(b=>{const bs=r(poy+b*psc),bx=r(pcx+cw/2),br=mn(3,r(psc*9));if(bs>r(poy+3)&&bs<r(poy+cd-3)){h+=`<circle cx="${bx}" cy="${bs}" r="${br}" fill="none" stroke="#cc1111" stroke-width=".75"/>`;h+=`<line x1="${r(bx-br)}" y1="${bs}" x2="${r(bx+br)}" y2="${bs}" stroke="#cc1111" stroke-width=".5"/>`;h+=`<line x1="${bx}" y1="${r(bs-br)}" x2="${bx}" y2="${r(bs+br)}" stroke="#cc1111" stroke-width=".5"/>`;}});
    if(i===0||i===N()){const wx=i===0?r(pox+sp.wireOff*psc):r(pox+pdw-sp.wireOff*psc);h+=`<circle cx="${wx}" cy="${r(poy+cd*.5)}" r="${mn(3.5,r(psc*20))}" fill="#1a5fa0" opacity=".7"/>`;}
    h+=`<rect x="${r(pcx+1)}" y="${r(poy+cd-4)}" width="${r(sp.W*psc-2)}" height="4" fill="${pvc.color}35" stroke="${pvc.color}" stroke-width=".6" rx="1"/>`;
    pcx=r(pcx+cw);
    if(i<N()){
      const{pg,lf}=getLane(i),lw=r(pg.s*psc),gap=r((pg.s-pg.c)/2*psc),clw=r(pg.c*psc);
      const pax=r(poy+pdd*.42),al=mn(clw*.47,r(psc*280)),pr=mn(3.5,r(psc*10));
      h+=`<rect x="${pcx}" y="${r(poy)}" width="${lw}" height="${r(pdd)}" fill="#bdd9ef" stroke="#5a96c8" stroke-width=".5"/>`;
      h+=`<rect x="${r(pcx+gap)}" y="${r(poy+1)}" width="${clw}" height="${r(pdd-2)}" fill="rgba(155,210,250,.35)"/>`;
      h+=`<line x1="${r(pcx+gap)}" y1="${pax}" x2="${r(pcx+gap+al)}" y2="${pax}" stroke="${sp.mc}" stroke-width="${mn(2.2,r(psc*12))}" stroke-linecap="round"/>`;
      h+=`<line x1="${r(pcx+lw-gap)}" y1="${pax}" x2="${r(pcx+lw-gap-al)}" y2="${pax}" stroke="${sp.mc}" stroke-width="${mn(2.2,r(psc*12))}" stroke-linecap="round"/>`;
      h+=`<circle cx="${r(pcx+gap)}" cy="${pax}" r="${pr}" fill="none" stroke="${sp.mc}" stroke-width=".9"/>`;h+=`<circle cx="${r(pcx+lw-gap)}" cy="${pax}" r="${pr}" fill="none" stroke="${sp.mc}" stroke-width=".9"/>`;
      h+=`<text x="${r(pcx+lw/2)}" y="${r(poy+pdd*.63)}" text-anchor="middle" ${FM} font-size="7.5" fill="#1a5fa0">C${i+1}</text>`;
      if(pg.c>=900){h+=`<text x="${r(pcx+lw/2)}" y="${r(poy+pdd*.45)}" text-anchor="middle" ${FM} font-size="8" fill="#1a5fa0" opacity=".8">♿</text>`;}
      if(clw>28)h+=tickDim(r(pcx+gap),r(pcx+gap+clw),r(poy+pdd-5),`${pg.c}`,'#2a7a2a');
      h+=`<line x1="${pcx}" y1="${r(poy+pdd-3)}" x2="${r(pcx+lw)}" y2="${r(poy+pdd-3)}" stroke="${pvc.color}" stroke-width="1.5" stroke-dasharray="4 2" opacity=".6"/>`;
      if(gapPx_p>=6){const gx0=r(pcx+lw/2-gapPx_p/2),gx1=r(pcx+lw/2+gapPx_p/2),gy=r(poy+pdd*.26);h+=`<line x1="${gx0}" y1="${r(gy-3)}" x2="${gx0}" y2="${r(gy+3)}" stroke="#8a6800" stroke-width=".9"/>`;h+=`<line x1="${gx1}" y1="${r(gy-3)}" x2="${gx1}" y2="${r(gy+3)}" stroke="#8a6800" stroke-width=".9"/>`;h+=`<line x1="${gx0}" y1="${gy}" x2="${gx1}" y2="${gy}" stroke="#8a6800" stroke-width=".7" marker-start="url(#da)" marker-end="url(#da)"/>`;h+=`<text x="${r((gx0+gx1)/2)}" y="${r(gy-5)}" text-anchor="middle" ${FM} font-size="5.5" fill="#8a6800" font-weight="600">GAP ${GAP_MM}mm</text>`;}
      pcx=r(pcx+lw);
    }
  }

  // Plan dims
  // Total width dim
  const planLeft=r(pox-pLWpx),planRight=r(pox+pdw+pRWpx);
  h+=tickDim(planLeft,planRight,DL_TOT,`${rnd(TWtotal)} mm`,'#c08800',poy,9);
  // Gate-only dim (second row)
  h+=tickDim(pox,r(pox+pdw),DL_SUB,`${rnd(TWg)} mm`,'#1a5fa0',poy,7.5);
  // Cabinet sub-dims
  let pdx=pox;
  for(let i=0;i<=N();i++){const cw=r(sp.W*psc);h+=tickDim(pdx,r(pdx+cw),DL_SUB+14,`${sp.W}`,'#1a5fa0',poy,6);pdx=r(pdx+cw);if(i<N()){const{pg}=getLane(i),lw=r(pg.s*psc);h+=tickDim(pdx,r(pdx+lw),DL_SUB+14,`${rnd(pg.s)}`,'#555',poy,6);pdx=r(pdx+lw);}}
  h+=DV(r(planRight+34),poy,r(poy+pdd),`${sp.D} mm`);

  // Scale bar
  const sbp=r(500*psc),sbx=r(PX.r-sbp-4),sby=r(P_BOT-14);
  if(sbx>PX.l+130&&sbp>20){h+=`<rect x="${sbx}" y="${r(sby-4)}" width="${sbp}" height="4" fill="none" stroke="#444" stroke-width=".6"/>`;h+=`<rect x="${sbx}" y="${r(sby-4)}" width="${r(sbp/2)}" height="4" fill="#444" opacity=".6"/>`;h+=`<text x="${r(sbx+sbp/2)}" y="${r(sby-7)}" text-anchor="middle" ${FM} font-size="6.5" fill="#444">${T('scaleLbl')}</text>`;}

  // Legend — 2 columnas esquina superior-derecha del plano (siempre sobre las cotas)
  const legItems=[{c:'#cc1111',v:`${T('pernoLbl')} ×${(N()+1)*sp.bolts.length}`},{c:'#1a5fa0',v:T('gabLbl')},{c:'#555',v:T('slotLbl')},{c:pvc.color,v:`PVC ${pvc.label}`},{c:'#8a6800',v:`${T('ficGapCentral')} ${GAP_MM} mm`},{c:'#c08800',v:`${T('twLabel')}: ${rnd(TWtotal)} mm`}];
  const lRows=Math.ceil(legItems.length/2),lCW=88,legW=lCW*2,lH=lRows*10+8;
  const lx2=r(PX.r-18-13-4-legW);  // a la izquierda del indicador Norte
  const ly2=P_TOP+4;
  h+=`<rect x="${lx2}" y="${ly2}" width="${legW}" height="${lH}" fill="#eeede5" fill-opacity=".95" stroke="#ccc" stroke-width=".35" rx="2"/>`;
  legItems.forEach(({c,v},k)=>{const col=Math.floor(k/lRows),row=k%lRows,ix=r(lx2+4+col*lCW),iy=ly2+7+row*10;h+=`<rect x="${ix}" y="${r(iy-3)}" width="5" height="4" fill="${c}" rx="1"/>`;h+=`<text x="${r(ix+7)}" y="${iy}" ${FM} font-size="5.5" fill="#333">${v}</text>`;});

  // Limit line (full footprint)
  if(siteLimit>0)h+=limitLine(r(pox-pLWpx),psc,poy-2,r(poy+pdd+4),r(poy+pdd/2));

  // ── COTA HUECO DISPONIBLE en planta (Mejora 9) ───────────────
  if(siteLimit>0){
    const hPx=r(siteLimit*psc),hLeft=r(pox-pLWpx),hRight=r(hLeft+hPx);
    const hCol=getAlertState()==='over'?'#cc1111':'#1a7a30';
    if(hRight>hLeft+8&&hLeft>=PX.l-10&&hRight<=PX.r+20){
      h+=tickDim(hLeft,hRight,DL_TOT-18,`${rnd(siteLimit)} mm`,hCol,poy,8.5);
      h+=`<text x="${r((hLeft+hRight)/2)}" y="${DL_TOT-22}" text-anchor="middle" ${FM} font-size="6" fill="${hCol}" font-weight="600">${T('maxLbl')}</text>`;
    }
  }

  // ── NORTH INDICATOR (Mejora 15) ───────────────────────────────
  {const nox=r(PX.r-18),noy=r(P_TOP+20);h+=`<g opacity=".8"><circle cx="${nox}" cy="${noy}" r="13" fill="#eeede5" stroke="#888" stroke-width=".6"/><line x1="${nox}" y1="${r(noy+9)}" x2="${nox}" y2="${r(noy-11)}" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><polygon points="${r(nox-3)},${r(noy-3)} ${nox},${r(noy-11)} ${r(nox+3)},${r(noy-3)}" fill="#333"/><polygon points="${r(nox-3)},${r(noy+3)} ${nox},${r(noy+9)} ${r(nox+3)},${r(noy+3)}" fill="#ddd" stroke="#888" stroke-width=".5"/><text x="${nox}" y="${r(noy-14)}" text-anchor="middle" ${FM} font-size="7" fill="#222" font-weight="bold">N</text></g>`;}

  // ── FRONT ELEVATION ──────────────────────────────────────────
  h+=`<text x="${FXL+4}" y="${BOT_TOP+13}" text-anchor="start" ${FM} font-size="9" font-weight="bold" fill="#222" letter-spacing="1">${T('frontTitle')}</text>`;
  h+=`<text x="${FXL+4}" y="${BOT_TOP+25}" text-anchor="start" ${FM} font-size="6.5" fill="#777">${sp.label} · ${sp.sub} · ${T('cotas')}</text>`;
  const fsbp=r(500*fsc),fsbx=r(FXR-fsbp-8),fsby2=r(BOT_TOP+18);
  if(fsbp>20){h+=`<rect x="${fsbx}" y="${r(fsby2-3)}" width="${fsbp}" height="4" fill="none" stroke="#444" stroke-width=".6"/>`;h+=`<rect x="${fsbx}" y="${r(fsby2-3)}" width="${r(fsbp/2)}" height="4" fill="#444" opacity=".6"/>`;h+=`<text x="${r(fsbx+fsbp/2)}" y="${r(fsby2-6)}" text-anchor="middle" ${FM} font-size="6.5" fill="#444">${T('scaleLbl')}</text>`;}

  // Dim extension lines + dim rows (gate only)
  const FE=[];let fex=fox;for(let i=0;i<=N();i++){const cw=r(sp.W*fsc);FE.push({type:'cab',x0:fex,x1:r(fex+cw),idx:i});fex=r(fex+cw);if(i<N()){const{pg}=getLane(i),lw=r(pg.s*fsc);FE.push({type:'lane',x0:fex,x1:r(fex+lw),c:pg.c,s:pg.s,li:i});fex=r(fex+lw);}}
  const ob=[FE[0].x0,...FE.map(e=>e.x1)];
  ob.forEach(bx=>{h+=`<line x1="${r(bx)}" y1="${D_TOT_Y+6}" x2="${r(bx)}" y2="${topMostY}" stroke="#777" stroke-width=".3" stroke-dasharray="3 3" opacity=".5"/>`;});
  FE.filter(e=>e.type==='lane').forEach(e=>{const{pg}=getLane(e.li),gap=r((pg.s-pg.c)/2*fsc),clw=r(pg.c*fsc);[r(e.x0+gap),r(e.x0+gap+clw)].forEach(bx=>{h+=`<line x1="${r(bx)}" y1="${D_CLR_Y+6}" x2="${r(bx)}" y2="${topMostY}" stroke="#2a7a2a" stroke-width=".3" stroke-dasharray="2.5 2.5" opacity=".4"/>`;});});
  // Footprint dim (top, amber)
  h+=tickDim(r(fox-fLWpx),r(fox+fdw+fRWpx),D_TOT_Y-14,`${rnd(TWtotal)} mm`,'#c08800',undefined,10);
  // Gate dim
  h+=tickDim(fox,r(fox+fdw),D_TOT_Y,`${rnd(TWg)} mm`,'#1a5fa0',undefined,9);
  FE.forEach(e=>{if(e.type==='cab')h+=tickDim(e.x0,e.x1,D_SUB_Y,r(e.x1-e.x0)>16?`${sp.W}`:null,'#1a5fa0');else h+=tickDim(e.x0,e.x1,D_SUB_Y,r(e.x1-e.x0)>22?`${rnd(e.s)}`:null,'#555');});
  FE.filter(e=>e.type==='lane').forEach(e=>{const{pg}=getLane(e.li),gap=r((pg.s-pg.c)/2*fsc),clw=r(pg.c*fsc),xi=r(e.x0+gap),xo=r(xi+clw),ew=r(xo-xi),ec=5;h+=`<line x1="${xi}" y1="${r(D_CLR_Y-ec)}" x2="${xi}" y2="${r(D_CLR_Y+ec)}" stroke="#2a7a2a" stroke-width="1"/>`;h+=`<line x1="${xo}" y1="${r(D_CLR_Y-ec)}" x2="${xo}" y2="${r(D_CLR_Y+ec)}" stroke="#2a7a2a" stroke-width="1"/>`;if(ew>6)h+=`<line x1="${r(xi+.5)}" y1="${r(D_CLR_Y)}" x2="${r(xo-.5)}" y2="${r(D_CLR_Y)}" stroke="#2a7a2a" stroke-width=".8" marker-start="url(#da)" marker-end="url(#da)"/>`;if(ew>16){const fs=ew<40?6.5:ew<70?8:9.5;h+=`<text x="${r((xi+xo)/2)}" y="${r(D_CLR_Y-8)}" text-anchor="middle" ${FM} font-size="${fs}" fill="#2a7a2a" font-weight="600">${e.c}</text>`;}});
  [{c:'#c08800',v:'Ancho total'},{c:'#1a5fa0',k:'totalLbl'},{c:'#555',k:'slotDimLbl'},{c:'#2a7a2a',k:'libreLbl'}].forEach(({c,k,v},ki)=>{const yy=D_TOT_Y+(ki-1)*22-2;if(ki===0)return;h+=`<line x1="${r(FXL+4)}" y1="${r(yy+3)}" x2="${r(FXL+14)}" y2="${r(yy+3)}" stroke="${c}" stroke-width="1.8"/>`;h+=`<text x="${r(FXL+17)}" y="${r(yy+6)}" ${FM} font-size="5.5" fill="${c}">${k?T(k):v}</text>`;});
  h+=`<line x1="${r(FXL+4)}" y1="${r(D_TOT_Y-14+3)}" x2="${r(FXL+14)}" y2="${r(D_TOT_Y-14+3)}" stroke="#c08800" stroke-width="2"/>`;
  h+=`<text x="${r(FXL+17)}" y="${r(D_TOT_Y-14+6)}" ${FM} font-size="5.5" fill="#c08800">${T('twLabel')}</text>`;

  if(siteLimit>0)h+=limitLine(r(fox-fLWpx),fsc,D_TOT_Y-20,fgy+4,r(D_TOT_Y+10));

  // Accessories in elevation (LEFT — outside clipping)
  const accLelev=drawAccListElev(accLeft,'left',fox,foy,fgy,fsc,fdw);
  h+=accLelev.svg;
  const accRelev=drawAccListElev(accRight,'right',fox,foy,fgy,fsc,fdw);
  h+=accRelev.svg;

  // Gate cabinets + leaves in elevation (clipped)
  h+=`<g clip-path="url(#fe-clip)">`;
  let fecx=fox;
  for(let i=0;i<=N();i++){
    const cw=r(sp.W*fsc),ch=r(sp.H*fsc);
    h+=`<rect x="${fecx}" y="${foy}" width="${cw}" height="${ch}" fill="#b5b0a8"/>`;h+=`<rect x="${fecx}" y="${foy}" width="${cw}" height="${ch}" fill="url(#ht)" opacity=".55"/>`;h+=`<rect x="${fecx}" y="${foy}" width="${cw}" height="${ch}" fill="none" stroke="#111" stroke-width=".9"/>`;h+=`<rect x="${r(fecx+cw*.1)}" y="${r(foy+3)}" width="${r(cw*.8)}" height="${r(mn(7,ch*.04))}" fill="#2a7a2a" rx="1.5"/>`;h+=`<rect x="${r(fecx+cw*.1)}" y="${r(foy+ch*.35)}" width="${r(cw*.8)}" height="${r(mn(4,ch*.025))}" fill="#1a4a9a"/>`;
    fecx=r(fecx+cw);
    if(i<N()){
      const{pg,lf}=getLane(i),lw=r(pg.s*fsc),gp2=r((pg.s-pg.c)/2*fsc),clw=r(pg.c*fsc),pWpx=r(lf.pW*fsc);
      const lb=lf.topH-lf.pH,pBy=r(fgy-lb*fsc),pTy=r(fgy-lf.topH*fsc),pHpx=r(lf.pH*fsc);
      const armY=r(fgy-sp.armBase*fsc),bH=r(armY-pBy);
      h+=`<rect x="${fecx}" y="${foy}" width="${gp2}" height="${r(sp.H*fsc)}" fill="rgba(0,0,0,.05)"/>`;h+=`<rect x="${r(fecx+lw-gp2)}" y="${foy}" width="${gp2}" height="${r(sp.H*fsc)}" fill="rgba(0,0,0,.05)"/>`;
      if(bH>1){const bW=r(mn(gp2*.65,22));h+=`<rect x="${fecx}" y="${pBy}" width="${bW}" height="${bH}" fill="#888" stroke="#555" stroke-width=".4" rx="1"/>`;h+=`<rect x="${r(fecx+lw-bW)}" y="${pBy}" width="${bW}" height="${bH}" fill="#888" stroke="#555" stroke-width=".4" rx="1"/>`;}
      h+=`<rect x="${fecx}" y="${pTy}" width="${pWpx}" height="${pHpx}" fill="rgba(130,195,255,.50)" stroke="#2a8a50" stroke-width=".85" rx="1"/>`;h+=`<rect x="${r(fecx+lw-pWpx)}" y="${pTy}" width="${pWpx}" height="${pHpx}" fill="rgba(130,195,255,.50)" stroke="#2a8a50" stroke-width=".85" rx="1"/>`;
      [fecx,r(fecx+lw)].forEach(bx=>{h+=`<line x1="${bx}" y1="${foy}" x2="${bx}" y2="${fgy}" stroke="#555" stroke-width=".4" stroke-dasharray="4 3" opacity=".25"/>`;});[r(fecx+gp2),r(fecx+gp2+clw)].forEach(bx=>{h+=`<line x1="${bx}" y1="${foy}" x2="${bx}" y2="${fgy}" stroke="#2a7a2a" stroke-width=".4" stroke-dasharray="3 3" opacity=".25"/>`;});
      if(pTy>F_DT+4)h+=`<text x="${r(fecx+lw/2)}" y="${r(pTy-5)}" text-anchor="middle" ${FM} font-size="6.5" fill="#2a8a50">↑${lf.topH}mm</text>`;
      h+=`<text x="${r(fecx+lw/2)}" y="${r(fgy-24)}" text-anchor="middle" ${FM} font-size="7" fill="#1a5fa0" opacity=".7">C${i+1}</text>`;
      if(gapPx_f>=6){const gx0f=r(fecx+lw/2-gapPx_f/2),gx1f=r(fecx+lw/2+gapPx_f/2),gAY=r(armY-14);if(gAY>F_DT+10&&gAY<fgy-10){h+=`<line x1="${gx0f}" y1="${r(gAY-3)}" x2="${gx0f}" y2="${r(gAY+3)}" stroke="#8a6800" stroke-width=".9"/>`;h+=`<line x1="${gx1f}" y1="${r(gAY-3)}" x2="${gx1f}" y2="${r(gAY+3)}" stroke="#8a6800" stroke-width=".9"/>`;h+=`<line x1="${gx0f}" y1="${gAY}" x2="${gx1f}" y2="${gAY}" stroke="#8a6800" stroke-width=".7" marker-start="url(#da)" marker-end="url(#da)"/>`;h+=`<text x="${r((gx0f+gx1f)/2)}" y="${r(gAY-5)}" text-anchor="middle" ${FM} font-size="5.5" fill="#8a6800" font-weight="600">GAP ${GAP_MM}mm</text>`;h+=`<text x="${r((gx0f+gx1f)/2)}" y="${r(gAY+12)}" text-anchor="middle" ${FM} font-size="4.5" fill="#8a6800" opacity=".65">(${T('gapNote')})</text>`;}}
      fecx=r(fecx+lw);
    }
  }
  h+=`</g>`;
  h+=gnd(r(fox-fLWpx),r(fox+fdw+fRWpx),fgy);

  // ── Height dimensions — staggered to avoid overlaps ──────────
  // Cabinet height: just left of gate (not of accessories)
  h+=DV(r(fox-18),foy,fgy,`${sp.H} mm`,false,'#1a5fa0');

  // Leaf/blade heights: just right of gate (before accessories)
  if(N()>0){
    const{lf:lf0}=getLane(0);
    const lb0=r(fgy-(lf0.topH-lf0.pH)*fsc);
    const lt0=r(fgy-lf0.topH*fsc);
    // Place leaf dims at fox+fdw+18 and fox+fdw+36 (inside the acc zone or just right)
    const leafDimX=r(fox+fdw+18);
    const leafDimX2=r(fox+fdw+36);
    if(leafDimX+38<FXR-4||(fRWpx>0)){
      h+=DV(leafDimX,lt0,fgy,`${lf0.topH} mm`,true,'#2a7a2a');
      h+=DV(leafDimX2,lt0,lb0,`${lf0.pH}mm`,true,'#2a9a50');
      h+=`<line x1="${r(fox+fdw+2)}" y1="${lt0}" x2="${r(leafDimX+4)}" y2="${lt0}" stroke="#2a7a2a" stroke-width=".4" opacity=".5"/>`;
      h+=`<line x1="${r(fox+fdw+2)}" y1="${lb0}" x2="${r(leafDimX2+4)}" y2="${lb0}" stroke="#2a9a50" stroke-width=".4" opacity=".5"/>`;
    }
    const armY0=r(fgy-sp.armBase*fsc);
    if(armY0>lb0+4&&armY0<r(fgy-4)){
      h+=`<line x1="${r(fox-fLWpx)}" y1="${armY0}" x2="${r(fox+fdw+fRWpx)}" y2="${armY0}" stroke="#c08800" stroke-width=".5" stroke-dasharray="4 2" opacity=".4"/>`;
      h+=`<text x="${r(fox-18)}" y="${r(armY0-4)}" text-anchor="end" ${FM} font-size="6" fill="#a07800">↑${sp.armBase}</text>`;
    }
  }

  // Accessory height dims — outermost edge, stacked OUTSIDE the gate dims
  // LEFT side: place at fox - fLWpx - 20 (outermost left)
  if(accLeft.length>0){
    const outL=accLeft[accLeft.length-1];
    const oaL=ACC_BY_CODE[outL.code];
    if(oaL){
      const accHpxL=r(oaL.H*fsc);
      const dimXL=r(fox-fLWpx-20);
      h+=DV(dimXL,r(fgy-accHpxL),fgy,`${oaL.H}mm`,false,'#c08800');
      // Extension line from accessory outer edge to dim
      h+=`<line x1="${r(fox-fLWpx)}" y1="${r(fgy-accHpxL)}" x2="${r(dimXL+4)}" y2="${r(fgy-accHpxL)}" stroke="#c08800" stroke-width=".4" opacity=".5"/>`;
    }
  }
  // RIGHT side: place at fox + fdw + fRWpx + 20 (outermost right)
  if(accRight.length>0){
    const outR=accRight[accRight.length-1];
    const oaR=ACC_BY_CODE[outR.code];
    if(oaR){
      const accHpxR=r(oaR.H*fsc);
      const dimXR=r(fox+fdw+fRWpx+20);
      h+=DV(dimXR,r(fgy-accHpxR),fgy,`${oaR.H}mm`,true,'#c08800');
      h+=`<line x1="${r(fox+fdw+fRWpx)}" y1="${r(fgy-accHpxR)}" x2="${r(dimXR-4)}" y2="${r(fgy-accHpxR)}" stroke="#c08800" stroke-width=".4" opacity=".5"/>`;
    }
  }
  const wly=r(fgy+8);if(wly<BOT_BOT-72){h+=`<line x1="${r(fox-fLWpx)}" y1="${wly}" x2="${r(fox+fdw+fRWpx)}" y2="${wly}" stroke="#b07800" stroke-width=".9" stroke-dasharray="5 2.5"/>`;h+=`<text x="${r(fox+fdw/2)}" y="${r(wly+8)}" text-anchor="middle" ${FM} font-size="6.5" fill="#926400">${T('awaiting')}</text>`;}
  h+=`<g clip-path="url(#ug-clip)">${drawUG(fox,fgy,fsc,sp,pvc)}</g>`;
  document.getElementById('cv').setAttribute('viewBox','0 0 720 700');
  document.getElementById('cv').innerHTML=h;
}

