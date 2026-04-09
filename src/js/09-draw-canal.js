// ══ CANAL ═════════════════════════════════════════════════════
function drawCanal(){
  const sp=MODELS[M];if(!sp)return;
  const n=N(),pvc=pvcSize(n);
  const C_AC='#cc1111',C_ETH='#1a5fa0',C_MTR='#e8a020',C_MS='#2a7a2a';
  const SVG_W=720,MG=14;
  // Layout
  const TITLE_H=40,FRONT_CLIP_H=130,UG_H=170;
  const GND_Y=TITLE_H+FRONT_CLIP_H;
  const vH=GND_Y+UG_H+14;
  // Scale (same approach as drawCAD front elevation)
  const TWg=TWgate();
  const fsc=Math.min((SVG_W-2*MG-20)/Math.max(1,TWg),(FRONT_CLIP_H+40)/sp.H)*0.85;
  const fdw=r(TWg*fsc);
  const fox=r(MG+(SVG_W-2*MG-fdw)/2);
  // UG params (enlarged for readability)
  const pvcPx=pvc.d<=50?14:pvc.d<=63?17:21;
  const co=pvcPx*.42;
  const SLAB=18,BY=r(GND_Y+UG_H-14);
  const L=MG+4,R=SVG_W-MG-4;
  let h=makeDefs();
  h+=`<rect width="${SVG_W}" height="${vH}" fill="#eeede5"/>`;
  h+=`<rect x="8" y="8" width="${SVG_W-16}" height="${vH-16}" fill="none" stroke="#111" stroke-width="1.6"/>`;
  // Title bar
  h+=`<rect x="8" y="8" width="${SVG_W-16}" height="32" fill="#182838"/>`;
  h+=`<text x="${MG+2}" y="23" ${FM} font-size="9.5" font-weight="bold" fill="#fff" letter-spacing=".8">${T('canalTitle')}</text>`;
  h+=`<text x="${MG+2}" y="35" ${FM} font-size="6.5" fill="#7ab4d8">${sp.label} · ${n} ${n>1?T('lanes'):T('lane')} · PVC ${pvc.label}</text>`;
  // Front clip background
  h+=`<rect x="8" y="${TITLE_H}" width="${SVG_W-16}" height="${FRONT_CLIP_H}" fill="#eeede5"/>`;
  // Cabinets + passageways (bottom portion only)
  const clipTop=TITLE_H+2;
  let fecx=fox;
  for(let i=0;i<=n;i++){
    const cw=r(sp.W*fsc),ch=r(sp.H*fsc);
    const visTop=Math.max(clipTop,r(GND_Y-ch));
    const visH=r(GND_Y-visTop);
    if(visH>0){
      h+=`<rect x="${fecx}" y="${visTop}" width="${cw}" height="${visH}" fill="#b5b0a8" stroke="#111" stroke-width=".9"/>`;
      h+=`<rect x="${fecx}" y="${visTop}" width="${cw}" height="${visH}" fill="url(#ht)" opacity=".55"/>`;
    }
    sp.bolts.forEach(b=>{const bs=r(GND_Y-b*fsc),br=Math.min(3,r(fsc*9));if(bs>clipTop&&bs<GND_Y-2){h+=`<circle cx="${r(fecx+cw/2)}" cy="${bs}" r="${br}" fill="none" stroke="#cc1111" stroke-width=".75"/>`;h+=`<line x1="${r(fecx+cw/2-br)}" y1="${bs}" x2="${r(fecx+cw/2+br)}" y2="${bs}" stroke="#cc1111" stroke-width=".5"/>`;h+=`<line x1="${r(fecx+cw/2)}" y1="${r(bs-br)}" x2="${r(fecx+cw/2)}" y2="${r(bs+br)}" stroke="#cc1111" stroke-width=".5"/>`;}});
    fecx=r(fecx+cw);
    if(i<n){
      const{pg}=getLane(i);
      const lw=r(pg.s*fsc),gp2=r((pg.s-pg.c)/2*fsc),clw=r(pg.c*fsc);
      h+=`<rect x="${fecx}" y="${clipTop}" width="${lw}" height="${r(GND_Y-clipTop)}" fill="rgba(155,210,250,.35)" stroke="#5a96c8" stroke-width=".5"/>`;
      h+=`<rect x="${r(fecx+gp2)}" y="${clipTop}" width="${clw}" height="${r(GND_Y-clipTop)}" fill="rgba(155,220,255,.2)"/>`;
      h+=`<text x="${r(fecx+lw/2)}" y="${r(GND_Y-8)}" text-anchor="middle" ${FM} font-size="8" fill="#1a5fa0">C${i+1}</text>`;
      if(clw>20)h+=tickDim(r(fecx+gp2),r(fecx+gp2+clw),r(GND_Y-24),`${pg.c}`,'#2a7a2a');
      if(lw>24)h+=tickDim(fecx,r(fecx+lw),r(GND_Y-10),`${rnd(pg.s)}`,'#555');
      fecx=r(fecx+lw);
    }
  }
  // Ground line
  h+=gnd(fox,r(fox+fdw),GND_Y);
  // UG section label + slab + concrete
  h+=`<text x="${r((L+R)/2)}" y="${r(GND_Y+5)}" text-anchor="middle" ${FM} font-size="5" fill="#888" letter-spacing=".8">${T('ugSection')}</text>`;
  h+=`<rect x="${L}" y="${GND_Y}" width="${R-L}" height="${SLAB}" fill="url(#ht)" opacity=".7"/>`;
  h+=`<rect x="${L}" y="${GND_Y}" width="${R-L}" height="${SLAB}" fill="none" stroke="#555" stroke-width=".6"/>`;
  h+=`<text x="${r(L+4)}" y="${r(GND_Y+SLAB/2+2.5)}" dominant-baseline="central" ${FM} font-size="5" fill="#555">${T('slab')}</text>`;
  h+=`<rect x="${L}" y="${r(GND_Y+SLAB)}" width="${R-L}" height="${r(UG_H-SLAB)}" fill="url(#conc)"/>`;
  h+=`<rect x="${L}" y="${r(GND_Y+SLAB)}" width="${R-L}" height="${r(UG_H-SLAB)}" fill="none" stroke="#888" stroke-width=".5"/>`;
  // Cabinet centers (cx array)
  const cx=[];let wx=fox;
  for(let i=0;i<=n;i++){cx.push(Math.max(L+4,Math.min(R-4,r(wx+sp.W*fsc/2))));wx=r(wx+sp.W*fsc);if(i<n)wx=r(wx+getLane(i).pg.s*fsc);}
  // Cable exits / anchors
  cx.forEach(x=>{
    if(x<L+2||x>R-2)return;
    const bT=r(GND_Y-2),bB=r(GND_Y+SLAB+22);
    h+=`<line x1="${x}" y1="${bT}" x2="${x}" y2="${bB}" stroke="#888" stroke-width="3" stroke-linecap="round"/>`;
    for(let ty=bT+5;ty<bB-3;ty+=5)h+=`<line x1="${r(x-2.2)}" y1="${ty}" x2="${r(x+2.2)}" y2="${ty}" stroke="#aaa" stroke-width=".6"/>`;
    h+=`<rect x="${r(x-5)}" y="${r(GND_Y-3.5)}" width="10" height="3.5" fill="#b0b0b0" stroke="#777" stroke-width=".5" rx=".8"/>`;
    h+=`<rect x="${r(x-4)}" y="${r(GND_Y-8)}" width="8" height="5.5" fill="#999" stroke="#666" stroke-width=".6" rx=".7"/>`;
    h+=`<path d="M${r(x-6)},${GND_Y} L${r(x-6)},${r(GND_Y+4)} Q${r(x-6)},${r(GND_Y+8)} ${r(x-2)},${r(GND_Y+8)} L${r(x+2)},${r(GND_Y+8)} Q${r(x+6)},${r(GND_Y+8)} ${r(x+6)},${r(GND_Y+4)} L${r(x+6)},${GND_Y}" fill="none" stroke="#777" stroke-width="1.3"/>`;
  });
  // Conduit paths with cables
  for(let i=0;i<n;i++){
    const x0=cx[i],x1=cx[i+1];
    if(x0<L||x1>R||x1-x0<8)continue;
    const sw=x1-x0,rad=Math.min(18,r(sw*.12)),dY=r(GND_Y+SLAB+4);
    const path=`M${x0},${dY} L${x0},${r(BY-rad)} Q${x0},${BY} ${r(x0+rad)},${BY} L${r(x1-rad)},${BY} Q${x1},${BY} ${x1},${r(BY-rad)} L${x1},${dY}`;
    h+=`<path d="${path}" fill="none" stroke="${pvc.color}22" stroke-width="${pvcPx+10}" stroke-linecap="round" stroke-linejoin="round"/>`;
    h+=`<path d="${path}" fill="none" stroke="${pvc.color}" stroke-width="${pvcPx}" stroke-linecap="round" stroke-linejoin="round"/>`;
    h+=`<path d="${path}" fill="none" stroke="rgba(255,255,255,.30)" stroke-width="${Math.max(4,pvcPx-5)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    [C_AC,C_ETH,C_MTR,C_MS].forEach((cc,k)=>{
      const ox=r(-co*1.5+k*co);
      h+=`<line x1="${r(x0+ox)}" y1="${dY}" x2="${r(x0+ox)}" y2="${r(BY-rad-3)}" stroke="${cc}" stroke-width="1.4" opacity=".9"/>`;
      h+=`<line x1="${r(x1+ox)}" y1="${dY}" x2="${r(x1+ox)}" y2="${r(BY-rad-3)}" stroke="${cc}" stroke-width="1.4" opacity=".9"/>`;
      if(sw>30)h+=`<line x1="${r(x0+rad+3)}" y1="${r(BY-2+(k-1.5)*2)}" x2="${r(x1-rad-3)}" y2="${r(BY-2+(k-1.5)*2)}" stroke="${cc}" stroke-width="1.4" opacity=".9"/>`;
    });
    if(sw>50)h+=`<text x="${r((x0+x1)/2)}" y="${r(BY-pvcPx/2-5)}" text-anchor="middle" ${FM} font-size="7" fill="${pvc.color}" font-weight="bold">PVC ${pvc.label}</text>`;
    if(sw>36)h+=`<text x="${r((x0+x1)/2)}" y="${r(BY+pvcPx/2+9)}" text-anchor="middle" ${FM} font-size="6" fill="#666">C${i+1}</text>`;
  }
  // Legend
  const cables=T('cables');
  const LW2=148,LH2=60,lx2=R-LW2-2,ly2=r(GND_Y+UG_H-LH2-2);
  h+=`<rect x="${lx2}" y="${ly2}" width="${LW2}" height="${LH2}" fill="#eeede5" stroke="${pvc.color}70" stroke-width=".8" rx="3"/>`;
  h+=`<rect x="${lx2}" y="${ly2}" width="${LW2}" height="14" fill="${pvc.color}" rx="3"/>`;
  h+=`<rect x="${lx2}" y="${r(ly2+10)}" width="${LW2}" height="4" fill="${pvc.color}"/>`;
  h+=`<text x="${r(lx2+LW2/2)}" y="${r(ly2+10)}" text-anchor="middle" ${FM} font-size="7" font-weight="bold" fill="#fff">PVC ${pvc.label}</text>`;
  [C_AC,C_ETH,C_MTR,C_MS].forEach((col,k)=>{const ry=r(ly2+18+k*10);h+=`<rect x="${r(lx2+4)}" y="${r(ry-4)}" width="9" height="5" fill="${col}" rx="1"/>`;h+=`<text x="${r(lx2+16)}" y="${ry}" ${FM} font-size="6" fill="#333">${cables[k]}</text>`;});
  const el=document.getElementById('canalsvg');
  el.setAttribute('viewBox',`0 0 ${SVG_W} ${vH}`);
  el.innerHTML=h;
}

