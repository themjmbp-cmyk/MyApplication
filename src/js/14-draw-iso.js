// ══ VISTA 3D ISOMÉTRICA ═══════════════════════════════════════
function drawISO(){
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
  const box=(x0,z0,bw,bd,bh,col,al)=>{al=al||.92;
    const f=[pt(x0,0,z0),pt(x0+bw,0,z0),pt(x0+bw,bh,z0),pt(x0,bh,z0)];
    const t=[pt(x0,bh,z0),pt(x0+bw,bh,z0),pt(x0+bw,bh,z0+bd),pt(x0,bh,z0+bd)];
    const s=[pt(x0+bw,0,z0),pt(x0+bw,0,z0+bd),pt(x0+bw,bh,z0+bd),pt(x0+bw,bh,z0)];
    const sk='stroke="rgba(0,0,0,.28)" stroke-width=".5"';
    return `<polygon points="${pp(f)}" fill="${col}" fill-opacity="${al}" ${sk}/>`+
      `<polygon points="${pp(t)}" fill="${col}" fill-opacity="${r(al*.72)}" ${sk}/>`+
      `<polygon points="${pp(t)}" fill="#fff" fill-opacity=".22" stroke="none"/>`+
      `<polygon points="${pp(s)}" fill="${col}" fill-opacity="${r(al*.56)}" ${sk}/>`+
      `<polygon points="${pp(s)}" fill="#000" fill-opacity=".16" stroke="none"/>`;};
  const basePlate=()=>{
    const bh=40;
    let s=box(0,0,TWtotal,depthZ,bh,'#a8a8a8',1.0);
    [[20,20],[TWtotal-20,20],[20,depthZ-20],[TWtotal-20,depthZ-20]].forEach(([bx,bz])=>{
      const bp=pt(bx,bh,bz);
      s+=`<ellipse cx="${bp.sx}" cy="${bp.sy}" rx="${r(4*sc)}" ry="${r(2*sc)}" fill="#666" fill-opacity=".5"/>`;
    });
    return s;
  };
  let svg=`<rect width="${W}" height="${H}" fill="#eeede5"/>`;
  svg+=`<rect x="8" y="8" width="${W-16}" height="${H-16}" fill="none" stroke="#14304f" stroke-width="1.2"/>`;
  svg+=`<text x="18" y="24" ${FM} font-size="10" font-weight="bold" fill="#14304f" letter-spacing="1">${T('tabIso').toUpperCase()} — ${sp.label}</text>`;
  svg+=`<text x="18" y="36" ${FM} font-size="7" fill="#777">${sp.sub} · ${n} ${n>1?T('lanes'):T('lane')} · ${rnd(TWtotal)} mm</text>`;
  // Base plate
  svg+=basePlate();
  const cabinet=(x0,z0,bW,bD,bH,modelColor,wireOff)=>{
    let s='';
    s+=box(x0,z0,bW,bD,bH,'#dcdce4',0.95);
    const railH=60,sk2='stroke="rgba(0,0,0,.2)" stroke-width=".4"';
    const rf=[pt(x0,bH-railH,z0),pt(x0+bW,bH-railH,z0),pt(x0+bW,bH,z0),pt(x0,bH,z0)];
    const rt=[pt(x0,bH,z0),pt(x0+bW,bH,z0),pt(x0+bW,bH,z0+bD),pt(x0,bH,z0+bD)];
    const rs=[pt(x0+bW,bH-railH,z0),pt(x0+bW,bH-railH,z0+bD),pt(x0+bW,bH,z0+bD),pt(x0+bW,bH,z0)];
    s+=`<polygon points="${pp(rf)}" fill="${modelColor}" fill-opacity=".95" ${sk2}/>`;
    s+=`<polygon points="${pp(rt)}" fill="${modelColor}" fill-opacity=".78" ${sk2}/>`;
    s+=`<polygon points="${pp(rs)}" fill="${modelColor}" fill-opacity=".6" ${sk2}/>`;
    [0.3,0.7].forEach(f=>{
      const p1=pt(x0+bW*f,10,z0),p2=pt(x0+bW*f,bH-railH-10,z0);
      s+=`<line x1="${p1.sx}" y1="${p1.sy}" x2="${p2.sx}" y2="${p2.sy}" stroke="#999" stroke-width=".6" stroke-opacity=".7"/>`;
    });
    const gX=x0+bW*0.15,gW2=bW*0.7,gYb=30,gH2=bH*0.65;
    const gf=[pt(gX,gYb,z0),pt(gX+gW2,gYb,z0),pt(gX+gW2,gYb+gH2,z0),pt(gX,gYb+gH2,z0)];
    s+=`<polygon points="${pp(gf)}" fill="#88ccff" fill-opacity=".30" stroke="#5599cc" stroke-width=".9"/>`;
    const rX=x0+bW*0.15,rW=bW*0.08;
    const rfl=[pt(rX,gYb+5,z0),pt(rX+rW,gYb+5,z0),pt(rX+rW,gYb+gH2-5,z0),pt(rX,gYb+gH2-5,z0)];
    s+=`<polygon points="${pp(rfl)}" fill="#fff" fill-opacity=".15" stroke="none"/>`;
    const ledX=x0+bW*0.88;
    const l1=pt(ledX,bH*0.6,z0),l2=pt(ledX,bH*0.7,z0);
    s+=`<circle cx="${l1.sx}" cy="${l1.sy}" r="2.5" fill="#ff8800" fill-opacity=".85"/>`;
    s+=`<circle cx="${l2.sx}" cy="${l2.sy}" r="2.5" fill="#22cc22" fill-opacity=".85"/>`;
    if(wireOff!=null){const wp=pt(x0+wireOff,bH*.5,z0);s+=`<circle cx="${wp.sx}" cy="${wp.sy}" r="3.5" fill="#1a5fa0" opacity=".85" stroke="#fff" stroke-width=".4"/>`;}
    return s;
  };
  const cables=(x0,bW)=>{
    let s='';
    [['#e60000',0.3],['#0055cc',0.5],['#99bb00',0.7]].forEach(([col,f])=>{
      const cz=depthZ*0.55;
      const pa=pt(x0+bW*f,40,cz);
      const pb=pt(x0+bW*f,0,cz);
      s+=`<line x1="${pa.sx}" y1="${pa.sy}" x2="${pb.sx}" y2="${pb.sy}" stroke="${col}" stroke-width="1.5" stroke-opacity=".9"/>`;
      s+=`<circle cx="${pb.sx}" cy="${pb.sy}" r="2" fill="${col}" fill-opacity=".85"/>`;
    });
    return s;
  };
  const accPanel=(x0,z0,bW,bD,bH,hasGlass,gW,gH)=>{
    let s='';
    s+=box(x0,z0,bW,bD,bH,'#dcdce4',0.95);
    const railH=60,mc='#c08800',sk2='stroke="rgba(0,0,0,.2)" stroke-width=".4"';
    const rf=[pt(x0,bH-railH,z0),pt(x0+bW,bH-railH,z0),pt(x0+bW,bH,z0),pt(x0,bH,z0)];
    const rt=[pt(x0,bH,z0),pt(x0+bW,bH,z0),pt(x0+bW,bH,z0+bD),pt(x0,bH,z0+bD)];
    const rs=[pt(x0+bW,bH-railH,z0),pt(x0+bW,bH-railH,z0+bD),pt(x0+bW,bH,z0+bD),pt(x0+bW,bH,z0)];
    s+=`<polygon points="${pp(rf)}" fill="${mc}" fill-opacity=".95" ${sk2}/>`;
    s+=`<polygon points="${pp(rt)}" fill="${mc}" fill-opacity=".78" ${sk2}/>`;
    s+=`<polygon points="${pp(rs)}" fill="${mc}" fill-opacity=".6" ${sk2}/>`;
    if(hasGlass&&gW&&gH){
      const gX=x0+(bW-gW)/2,gZ=z0+20;
      const gf=[pt(gX,0,gZ),pt(gX+gW,0,gZ),pt(gX+gW,gH,gZ),pt(gX,gH,gZ)];
      s+=`<polygon points="${pp(gf)}" fill="#88ccff" fill-opacity=".35" stroke="#5599cc" stroke-width=".8"/>`;}
    return s;
  };
  // Accessories LEFT
  let axL=0;
  for(let i=0;i<accLeft.length;i++){
    const itm=accLeft[i],acat=ACC_BY_CODE[itm.code],aW=getAccItemW(itm),aH=acat.H;
    const izv=itm.isoZ!=null?+itm.isoZ:1,accZ=izv===1?(depthZ-accDepth)/2:izv===0?(depthZ-accDepth):0;
    axL+=ACC_GAP_MM;
    const gWl=acat.customGlass?(+(itm.r50gW)||920):acat.gW;
    const gHl=acat.customGlass?(+(itm.r50gH)||600):acat.gH;
    svg+=accPanel(axL,accZ,aW,accDepth,aH,acat.hasGlass,gWl,gHl);
    axL+=aW;
  }
  // Gate cabinets + lanes
  let cx=TWL;
  const cablesSvg=[];
  for(let i=0;i<=n;i++){
    const wireOff=(i===0)?sp.wireOff:(i===n)?sp.W-sp.wireOff:null;
    svg+=cabinet(cx,0,sp.W,depthZ,sp.H,sp.mc,wireOff);
    cablesSvg.push({x0:cx,bW:sp.W});
    cx+=sp.W;
    if(i<n){
      const{pg}=getLane(i),lW=pg.s;
      const lf=[pt(cx,0,0),pt(cx+lW,0,0),pt(cx+lW,0,depthZ),pt(cx,0,depthZ)];
      svg+=`<polygon points="${pp(lf)}" fill="#7dd87a" fill-opacity=".1" stroke="rgba(125,216,122,.4)" stroke-width=".6"/>`;
      const lmid=pt(cx+lW/2,2,depthZ/2);
      svg+=`<text x="${lmid.sx}" y="${lmid.sy}" text-anchor="middle" ${FM} font-size="7" fill="#1a7a30" font-weight="bold">${pg.l} mm</text>`;
      cx+=lW;
    }
  }
  // Accessories RIGHT
  let axR=TWL+TWg;
  for(let i=0;i<accRight.length;i++){
    const itm=accRight[i],acat=ACC_BY_CODE[itm.code],aW=getAccItemW(itm),aH=acat.H;
    const izv=itm.isoZ!=null?+itm.isoZ:1,accZ=izv===1?(depthZ-accDepth)/2:izv===0?(depthZ-accDepth):0;
    axR+=ACC_GAP_MM;
    const gWr=acat.customGlass?(+(itm.r50gW)||920):acat.gW;
    const gHr=acat.customGlass?(+(itm.r50gH)||600):acat.gH;
    svg+=accPanel(axR,accZ,aW,accDepth,aH,acat.hasGlass,gWr,gHr);
    axR+=aW;
  }
  // Cables (rendered last for correct SVG z-order)
  cablesSvg.forEach(c=>{svg+=cables(c.x0,c.bW);});
  // Total width dimension line
  const dL=pt(0,0,depthZ),dR=pt(TWtotal,0,depthZ);
  const dY=12;
  svg+=`<line x1="${dL.sx}" y1="${dL.sy+dY}" x2="${dR.sx}" y2="${dR.sy+dY}" stroke="#14304f" stroke-width=".8"/>`;
  svg+=`<line x1="${dL.sx}" y1="${dL.sy+dY-5}" x2="${dL.sx}" y2="${dL.sy+dY+5}" stroke="#14304f" stroke-width=".8"/>`;
  svg+=`<line x1="${dR.sx}" y1="${dR.sy+dY-5}" x2="${dR.sx}" y2="${dR.sy+dY+5}" stroke="#14304f" stroke-width=".8"/>`;
  svg+=`<text x="${r((dL.sx+dR.sx)/2)}" y="${r((dL.sy+dR.sy)/2+dY+12)}" text-anchor="middle" ${FM} font-size="8" fill="#14304f" font-weight="bold">${rnd(TWtotal)} mm</text>`;
  // Depth dimension
  const dp1=pt(TWtotal,0,0),dp2=pt(TWtotal,0,depthZ);
  const dx=10;
  svg+=`<line x1="${dp1.sx+dx}" y1="${dp1.sy}" x2="${dp2.sx+dx}" y2="${dp2.sy}" stroke="#666" stroke-width=".6" stroke-dasharray="3 2"/>`;
  svg+=`<text x="${dp2.sx+dx+5}" y="${r((dp1.sy+dp2.sy)/2+3)}" ${FM} font-size="6.5" fill="#666">${sp.D} mm</text>`;
  // Height dimension
  const hp1=pt(0,0,0),hp2=pt(0,sp.H,0);
  const hx=-8;
  svg+=`<line x1="${hp1.sx+hx}" y1="${hp1.sy}" x2="${hp2.sx+hx}" y2="${hp2.sy}" stroke="#666" stroke-width=".6" stroke-dasharray="3 2"/>`;
  svg+=`<text x="${hp1.sx+hx-3}" y="${r((hp1.sy+hp2.sy)/2+3)}" text-anchor="end" ${FM} font-size="6.5" fill="#666">${rnd(sp.H)} mm</text>`;
  document.getElementById('isosvg').innerHTML=svg;
}

