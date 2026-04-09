// ══ COMPARADOR DE MODELOS ═════════════════════════════════════
function drawComparator(){
  const W=720,colX=140,rH=34,rStart=88;
  const colW=r((W-colX-14)/MK.length);
  const featKeys=['irSensors','flowRate','mcbf','noise','antiPinch','antiTail','antiPanic','freePass','fireInt'];
  const featLblMap={irSensors:'compIrSensors',flowRate:'compFlowRate',mcbf:'compMcbf',noise:'compNoise',antiPinch:'compAntiPinch',antiTail:'compAntiTail',antiPanic:'compAntiPanic',freePass:'compFreePass',fireInt:'compFireInt'};
  const rowDefs=[
    {lbl:T('compW'),vals:MK.map(k=>MODELS[k].W),unit:'mm',bar:true,max:155},
    {lbl:T('compD'),vals:MK.map(k=>MODELS[k].D),unit:'mm',bar:true,max:1700},
    {lbl:T('compH'),vals:MK.map(k=>r(MODELS[k].H)),unit:'mm',bar:true,max:1100},
    {lbl:T('compCons'),vals:MK.map(k=>parseInt(MODELS[k].consumption)||0),unit:'VA',bar:true,max:200},
    {lbl:T('compSpeed'),vals:MK.map(k=>MODELS[k].openSpeed),unit:'',bar:false},
    {lbl:T('compTemp'),vals:MK.map(k=>MODELS[k].tempRange),unit:'',bar:false},
    {lbl:T('compPower'),vals:MK.map(k=>MODELS[k].power),unit:'',bar:false},
  ];
  const H=rStart+(rowDefs.length+featKeys.length)*rH+12;
  document.getElementById('cmpsvg').setAttribute('viewBox',`0 0 ${W} ${H}`);
  let svg=`<rect width="${W}" height="${H}" fill="#eeede5"/>`;
  svg+=`<rect x="8" y="8" width="${W-16}" height="${H-16}" fill="none" stroke="#14304f" stroke-width="1.2"/>`;
  svg+=`<text x="${W/2}" y="27" text-anchor="middle" ${FM} font-size="10" font-weight="bold" fill="#14304f" letter-spacing="2">${T('tabComp').toUpperCase()}</text>`;
  MK.forEach((k,i)=>{
    const sp=MODELS[k],cx=r(colX+i*colW+colW/2),isActive=k===M;
    if(isActive)svg+=`<rect x="${r(colX+i*colW+3)}" y="32" width="${r(colW-6)}" height="56" fill="${sp.mc}" fill-opacity=".1" rx="4"/>`;
    svg+=`<rect x="${r(colX+i*colW+8)}" y="33" width="${r(colW-16)}" height="2.5" fill="${sp.mc}" rx="1"/>`;
    svg+=`<text x="${cx}" y="48" text-anchor="middle" ${FM} font-size="${isActive?9.5:9}" font-weight="bold" fill="${sp.mc}">${sp.labelEnd.split(/[\s/]/)[0]}</text>`;
    svg+=`<text x="${cx}" y="59" text-anchor="middle" ${FM} font-size="6.5" fill="#888">${sp.sub.split('·')[0].trim()}</text>`;
    svg+=`<text x="${cx}" y="70" text-anchor="middle" ${FM} font-size="8" font-weight="bold" fill="${isActive?sp.mc:'#555'}">${sp.consumption}</text>`;
    if(isActive)svg+=`<text x="${cx}" y="82" text-anchor="middle" ${FM} font-size="6" fill="${sp.mc}">◀ ${T('compActive')} ▶</text>`;
  });
  // Unified rows (specs + features), same rH, continuous alternating bg
  let ri=0;
  rowDefs.forEach((rd)=>{
    const ry=rStart+ri*rH;
    if(ri%2===0)svg+=`<rect x="10" y="${ry}" width="${W-20}" height="${rH}" fill="rgba(0,0,0,.04)"/>`;
    svg+=`<text x="${colX-6}" y="${r(ry+rH/2+3)}" text-anchor="end" ${FM} font-size="7" fill="#666">${rd.lbl}</text>`;
    MK.forEach((k,i)=>{
      const sp=MODELS[k],cx=r(colX+i*colW+colW/2),val=rd.vals[i],isActive=k===M,fc=isActive?sp.mc:'#333';
      if(rd.bar&&typeof val==='number'){
        const bx=r(colX+i*colW+8),bMaxW=colW-16,bW=r((val/rd.max)*bMaxW),barY=r(ry+rH-8);
        svg+=`<rect x="${bx}" y="${barY}" width="${bMaxW}" height="4" fill="rgba(0,0,0,.1)" rx="2"/>`;
        svg+=`<rect x="${bx}" y="${barY}" width="${bW}" height="4" fill="${sp.mc}" fill-opacity=".75" rx="2"/>`;
        svg+=`<text x="${cx}" y="${r(ry+rH/2+2)}" text-anchor="middle" ${FM} font-size="${isActive?9:8.5}" font-weight="bold" fill="${fc}">${val} ${rd.unit}</text>`;
      }else{
        svg+=`<text x="${cx}" y="${r(ry+rH/2+3)}" text-anchor="middle" ${FM} font-size="7.5" fill="${fc}">${val}${rd.unit?' '+rd.unit:''}</text>`;
      }
    });
    ri++;
  });
  featKeys.forEach((fk)=>{
    const ry=rStart+ri*rH;
    if(ri%2===0)svg+=`<rect x="10" y="${ry}" width="${W-20}" height="${rH}" fill="rgba(0,0,0,.04)"/>`;
    svg+=`<text x="${colX-6}" y="${r(ry+rH/2+3)}" text-anchor="end" ${FM} font-size="7" fill="#666">${T(featLblMap[fk])}</text>`;
    MK.forEach((k,i)=>{
      const sp=MODELS[k],cx=r(colX+i*colW+colW/2),isActive=k===M,val=sp[fk];
      if(typeof val==='boolean'){
        const color=val?(isActive?sp.mc:'#2a7a2a'):'#bbb';
        svg+=`<text x="${cx}" y="${r(ry+rH/2+4)}" text-anchor="middle" ${FM} font-size="${val?12:10}" font-weight="${val?'bold':'normal'}" fill="${color}">${val?'✓':'–'}</text>`;
      }else{
        svg+=`<text x="${cx}" y="${r(ry+rH/2+3)}" text-anchor="middle" ${FM} font-size="7.5" font-weight="${isActive?'bold':'normal'}" fill="${isActive?sp.mc:'#444'}">${val??'–'}</text>`;
      }
    });
    ri++;
  });
  document.getElementById('cmpsvg').innerHTML=svg;
}

