// ══ VISTA CAD WIREFRAME ════════════════════════════════════════
function drawISOWF(){
  const sp=MODELS[M];if(!sp)return;
  const n=N(),TWg=TWgate(),TWL=accSideTotalW(accLeft),TWR=accSideTotalW(accRight),TWtotal=TWfull(),MAXH=maxH();
  const depthZ=sp.D,accDepth=140,W=720,H=480;
  const topPad=48,botPad=24;
  const projW=(TWtotal+depthZ)*0.866,projH=MAXH+(TWtotal+depthZ)*0.5;
  const sc=Math.min((W-80)/projW,(H-topPad-botPad)/projH)*0.92;
  const ox=r(W/2-(TWtotal-depthZ)*0.866*sc/2);
  const oy=r(topPad+(H-topPad-botPad)/2+(MAXH-(TWtotal+depthZ)*0.5)*sc/2);
  const pt=(x,y,z)=>({sx:r(ox+(x-z)*0.866*sc),sy:r(oy+(x+z)*0.5*sc-y*sc)});
  const pp=pts=>pts.map(q=>q.sx+','+q.sy).join(' ');
  // Wireframe box: visible faces + hidden edges dashed
  const wfBox=(x0,z0,bw,bd,bh,lc,sw)=>{
    lc=lc||'#1a1a2e';sw=sw||0.9;
    const sk=`stroke="${lc}" stroke-width="${sw}" stroke-linejoin="round"`;
    const A=pt(x0,0,z0),B=pt(x0+bw,0,z0),C=pt(x0+bw,bh,z0),D=pt(x0,bh,z0);
    const E=pt(x0,0,z0+bd),F=pt(x0+bw,0,z0+bd),G=pt(x0+bw,bh,z0+bd),Hh=pt(x0,bh,z0+bd);
    const dsh=`stroke="${lc}" stroke-width="${sw*0.5}" fill="none" stroke-dasharray="2.5 2" stroke-opacity="0.3"`;
    return `<polygon points="${pp([A,B,C,D])}" fill="#f7f7f7" fill-opacity="0.97" ${sk}/>`+
      `<polygon points="${pp([D,C,G,Hh])}" fill="#f0f0f0" fill-opacity="0.97" ${sk}/>`+
      `<polygon points="${pp([B,F,G,C])}" fill="#e8e8e8" fill-opacity="0.97" ${sk}/>`+
      `<line x1="${A.sx}" y1="${A.sy}" x2="${E.sx}" y2="${E.sy}" ${dsh}/>`+
      `<line x1="${E.sx}" y1="${E.sy}" x2="${F.sx}" y2="${F.sy}" ${dsh}/>`+
      `<line x1="${E.sx}" y1="${E.sy}" x2="${Hh.sx}" y2="${Hh.sy}" ${dsh}/>`;
  };
  const FM='font-family="monospace"';
  const RS='stroke="#cc0000" stroke-width="0.75"';
  let svg=`<rect width="${W}" height="${H}" fill="#ffffff"/>`;
  svg+=`<rect x="8" y="8" width="${W-16}" height="${H-16}" fill="none" stroke="#1a1a2e" stroke-width="1"/>`;
  svg+=`<text x="18" y="24" ${FM} font-size="10" font-weight="bold" fill="#1a1a2e" letter-spacing="1">${T('tabIsoWF').toUpperCase()} — ${sp.label}</text>`;
  svg+=`<text x="18" y="36" ${FM} font-size="7" fill="#555">${sp.sub} · ${n} ${n>1?T('lanes'):T('lane')} · ${rnd(TWtotal)} mm</text>`;
  // Floor plate
  svg+=wfBox(0,0,TWtotal,depthZ,20,'#888',0.6);
  // Left accessories
  let axL=0;
  for(let i=0;i<accLeft.length;i++){
    const itm=accLeft[i],acat=ACC_BY_CODE[itm.code],aW=getAccItemW(itm),aH=acat.H;
    const izv=itm.isoZ!=null?+itm.isoZ:1,accZ=izv===1?(depthZ-accDepth)/2:izv===0?(depthZ-accDepth):0;
    axL+=ACC_GAP_MM;
    svg+=wfBox(axL,accZ,aW,accDepth,aH,'#1a1a2e',0.8);
    axL+=aW;
  }
  // Gate cabinets — accumulate barrier data for deferred rendering
  const barrierQ=[];
  let cx=TWL;
  for(let i=0;i<=n;i++){
    svg+=wfBox(cx,0,sp.W,depthZ,sp.H,'#1a1a2e',1.0);
    const rH=55;
    const rfp=[pt(cx,sp.H-rH,0),pt(cx+sp.W,sp.H-rH,0),pt(cx+sp.W,sp.H,0),pt(cx,sp.H,0)];
    const rtp=[pt(cx,sp.H,0),pt(cx+sp.W,sp.H,0),pt(cx+sp.W,sp.H,depthZ),pt(cx,sp.H,depthZ)];
    svg+=`<polygon points="${pp(rfp)}" fill="${sp.mc}" fill-opacity="0.15" stroke="${sp.mc}" stroke-width="0.7" stroke-opacity="0.6"/>`;
    svg+=`<polygon points="${pp(rtp)}" fill="${sp.mc}" fill-opacity="0.08" stroke="${sp.mc}" stroke-width="0.7" stroke-opacity="0.4"/>`;
    [0.33,0.67].forEach(f=>{
      const p1=pt(cx+sp.W*f,10,0),p2=pt(cx+sp.W*f,sp.H-rH-10,0);
      svg+=`<line x1="${p1.sx}" y1="${p1.sy}" x2="${p2.sx}" y2="${p2.sy}" stroke="#ccc" stroke-width="0.5" stroke-dasharray="3 2"/>`;
    });
    const gX=cx+sp.W*0.12,gWp=sp.W*0.76,gYb=24,gHp=sp.H*0.6;
    const gf=[pt(gX,gYb,0),pt(gX+gWp,gYb,0),pt(gX+gWp,gYb+gHp,0),pt(gX,gYb+gHp,0)];
    svg+=`<polygon points="${pp(gf)}" fill="#cce8ff" fill-opacity="0.25" stroke="#3377aa" stroke-width="0.6"/>`;
    cx+=sp.W;
    if(i<n){const{pg}=getLane(i),lW=pg.s;barrierQ.push({lx:cx,lW,lbl:pg.l});cx+=lW;}
  }
  // Right accessories
  let axR=TWL+TWg;
  for(let i=0;i<accRight.length;i++){
    const itm=accRight[i],acat=ACC_BY_CODE[itm.code],aW=getAccItemW(itm),aH=acat.H;
    const izv=itm.isoZ!=null?+itm.isoZ:1,accZ=izv===1?(depthZ-accDepth)/2:izv===0?(depthZ-accDepth):0;
    axR+=ACC_GAP_MM;
    svg+=wfBox(axR,accZ,aW,accDepth,aH,'#1a1a2e',0.8);
    axR+=aW;
  }
  // ── Barreras — renderizadas AL FINAL para quedar siempre encima ──
  // Posición: borde interno de cada gabinete (lx = borde derecho del gabinete izquierdo)
  // z=0 cara frontal; renderizado tras todos los sólidos garantiza visibilidad
  barrierQ.forEach(({lx,lW,lbl})=>{
    const bLen=lW*0.44,bY0=sp.H*0.13,bY1=sp.H,bC='#1a3860',bZ=depthZ/2;
    const bSk=`fill="#ddeef8" fill-opacity="0.8" stroke="${bC}" stroke-width="0.9"`;
    // Pala izquierda: desde lx (borde del gabinete izq.) hacia el interior del pasillo
    svg+=`<polygon points="${pp([pt(lx,bY0,bZ),pt(lx+bLen,bY0,bZ),pt(lx+bLen,bY1,bZ),pt(lx,bY1,bZ)])}" ${bSk}/>`;
    const lh=pt(lx,sp.H*0.58,bZ);
    svg+=`<circle cx="${lh.sx}" cy="${lh.sy}" r="4" fill="#fff" stroke="${bC}" stroke-width="0.9"/>`;
    svg+=`<circle cx="${lh.sx}" cy="${lh.sy}" r="1.6" fill="${bC}"/>`;
    // Pala derecha: desde lx+lW (borde del gabinete derecho) hacia el interior
    svg+=`<polygon points="${pp([pt(lx+lW-bLen,bY0,bZ),pt(lx+lW,bY0,bZ),pt(lx+lW,bY1,bZ),pt(lx+lW-bLen,bY1,bZ)])}" ${bSk}/>`;
    const rh=pt(lx+lW,sp.H*0.58,bZ);
    svg+=`<circle cx="${rh.sx}" cy="${rh.sy}" r="4" fill="#fff" stroke="${bC}" stroke-width="0.9"/>`;
    svg+=`<circle cx="${rh.sx}" cy="${rh.sy}" r="1.6" fill="${bC}"/>`;
    // Cota ancho de pasillo (rojo)
    const lmid=pt(lx+lW/2,3,depthZ*0.55);
    svg+=`<text x="${lmid.sx}" y="${lmid.sy}" text-anchor="middle" ${FM} font-size="7" fill="#cc0000" font-weight="bold">${lbl} mm</text>`;
  });
  // ── Cotas en rojo ──────────────────────────────────────────
  const dL=pt(0,0,depthZ),dR=pt(TWtotal,0,depthZ);
  const dY=14;
  svg+=`<line x1="${dL.sx}" y1="${dL.sy+dY}" x2="${dR.sx}" y2="${dR.sy+dY}" ${RS}/>`;
  svg+=`<line x1="${dL.sx}" y1="${dL.sy+dY-5}" x2="${dL.sx}" y2="${dL.sy+dY+5}" ${RS}/>`;
  svg+=`<line x1="${dR.sx}" y1="${dR.sy+dY-5}" x2="${dR.sx}" y2="${dR.sy+dY+5}" ${RS}/>`;
  svg+=`<text x="${r((dL.sx+dR.sx)/2)}" y="${r((dL.sy+dR.sy)/2+dY+12)}" text-anchor="middle" ${FM} font-size="8" fill="#cc0000" font-weight="bold">${rnd(TWtotal)} mm</text>`;
  if(TWL+sp.W<=TWtotal){
    const cw1=pt(TWL,0,0),cw2=pt(TWL+sp.W,0,0),cwY=-8;
    svg+=`<line x1="${cw1.sx}" y1="${cw1.sy+cwY}" x2="${cw2.sx}" y2="${cw2.sy+cwY}" ${RS}/>`;
    svg+=`<line x1="${cw1.sx}" y1="${cw1.sy+cwY-4}" x2="${cw1.sx}" y2="${cw1.sy+cwY+4}" ${RS}/>`;
    svg+=`<line x1="${cw2.sx}" y1="${cw2.sy+cwY-4}" x2="${cw2.sx}" y2="${cw2.sy+cwY+4}" ${RS}/>`;
    svg+=`<text x="${r((cw1.sx+cw2.sx)/2)}" y="${r(Math.min(cw1.sy,cw2.sy)+cwY-5)}" text-anchor="middle" ${FM} font-size="7" fill="#cc0000">${sp.W} mm</text>`;
  }
  const hp1=pt(0,0,0),hp2=pt(0,sp.H,0),hx=-12;
  svg+=`<line x1="${hp1.sx+hx}" y1="${hp1.sy}" x2="${hp2.sx+hx}" y2="${hp2.sy}" ${RS}/>`;
  svg+=`<line x1="${hp1.sx+hx-4}" y1="${hp1.sy}" x2="${hp1.sx+hx+4}" y2="${hp1.sy}" ${RS}/>`;
  svg+=`<line x1="${hp2.sx+hx-4}" y1="${hp2.sy}" x2="${hp2.sx+hx+4}" y2="${hp2.sy}" ${RS}/>`;
  svg+=`<text x="${hp1.sx+hx-5}" y="${r((hp1.sy+hp2.sy)/2+3)}" text-anchor="end" ${FM} font-size="7" fill="#cc0000">${rnd(sp.H)} mm</text>`;
  const dp1=pt(TWtotal,0,0),dp2=pt(TWtotal,0,depthZ),dx=10;
  svg+=`<line x1="${dp1.sx+dx}" y1="${dp1.sy}" x2="${dp2.sx+dx}" y2="${dp2.sy}" stroke="#aaa" stroke-width="0.6" stroke-dasharray="3 2"/>`;
  svg+=`<text x="${dp2.sx+dx+5}" y="${r((dp1.sy+dp2.sy)/2+3)}" ${FM} font-size="6.5" fill="#aaa">${sp.D} mm</text>`;
  document.getElementById('isowfsvg').innerHTML=svg;
}

