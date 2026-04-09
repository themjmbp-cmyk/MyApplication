// ══ COVER ═════════════════════════════════════════════════════
function drawCover(){
  const sp=MODELS[M],TWg=TWgate(),state=getAlertState(),aC=state==='over'?'#cc1111':state==='near'?'#c08800':null;
  const TWL=accTotalW(accLeft),TWR=accTotalW(accRight),TWtotal=TWL+TWg+TWR;
  const gv=id=>{const el=document.getElementById(id);return el?el.value.trim()||'—':'—';};
  const client=gv('f-client'),project=gv('f-project'),addr=gv('f-addr'),refn=gv('f-ref'),author=gv('f-author'),rev=gv('f-rev');
  const dateRaw=gv('f-date'),version=gv('f-version')||'Rev. A';
  let dateStr='—';if(dateRaw&&dateRaw!=='—'){const d=new Date(dateRaw);if(!isNaN(d.getTime()))dateStr=`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;}
  const W=720,H=560;
  let h=`<rect width="${W}" height="${H}" fill="#eeede5"/><rect x="10" y="10" width="${W-20}" height="${H-20}" fill="none" stroke="#14304f" stroke-width="2"/>`;
  h+=`<rect x="10" y="10" width="${W-20}" height="72" fill="#14304f"/>`;h+=`<text x="40" y="52" ${FM} font-size="30" font-weight="bold" fill="#fff" letter-spacing="2">ZK<tspan fill="#7dd87a">Teco</tspan></text>`;h+=`<text x="40" y="70" ${FM} font-size="9" fill="#7dd87a" letter-spacing="4">${T('coverSecurityTag')}</text>`;
  h+=`<text x="${W-105}" y="40" text-anchor="end" ${FM} font-size="9" fill="#aaa" letter-spacing="1">${T('coverTitle')}</text>`;h+=`<text x="${W-105}" y="54" text-anchor="end" ${FM} font-size="14" font-weight="bold" fill="#fff">${refn}</text>`;h+=`<text x="${W-105}" y="68" text-anchor="end" ${FM} font-size="9" fill="#7dd87a">${version}</text>`;
  h+=`<text x="40" y="112" ${FM} font-size="8" fill="#888" letter-spacing="2">${T('covProject')}</text>`;h+=`<text x="40" y="135" ${FM} font-size="18" font-weight="bold" fill="#14304f">${project}</text>`;h+=`<line x1="40" y1="145" x2="${W-40}" y2="145" stroke="#14304f" stroke-width=".5"/>`;
  const c2x=390,rH=28;let ry=168;
  const rows=[[T('fldClient').toUpperCase(),client,false,''],[T('fldAddr').toUpperCase(),addr,false,''],[T('modelLbl').toUpperCase(),sp.label,false,''],['',unitsShort(),false,'sub'],[T('uiLanes').toUpperCase(),`${N()} ${N()>1?T('lanes'):T('lane')} · ${N()+1} ${T('nCabs').toLowerCase()}`,false,''],[T('covGates'),`${rnd(TWg)} mm`,aC!==null,''],[T('twLabel').toUpperCase(),`${rnd(TWtotal)} mm`,false,'acc']];
  rows.forEach(([lbl,val,alert,type])=>{const y=ry,isSub=type==='sub',isAlt=alert&&aC,isAcc=type==='acc';if(isSub){h+=`<text x="40" y="${y}" ${FM} font-size="8.5" font-weight="500" fill="#555">${val}</text>`;h+=`<line x1="40" y1="${r(y+4)}" x2="${r(c2x-20)}" y2="${r(y+4)}" stroke="#eee" stroke-width=".5"/>`;ry+=15;return;}if(isAlt)h+=`<rect x="36" y="${r(y-14)}" width="${r(c2x-56)}" height="${rH-2}" fill="${aC}12" rx="3"/>`;if(isAcc&&TWtotal!==TWg)h+=`<rect x="36" y="${r(y-14)}" width="${r(c2x-56)}" height="${rH-2}" fill="rgba(200,136,0,.08)" rx="3"/>`;if(lbl)h+=`<text x="40" y="${y}" ${FM} font-size="7" fill="${isAlt?aC:isAcc&&TWtotal!==TWg?'#c08800':'#888'}" letter-spacing="1">${lbl}</text>`;h+=`<text x="40" y="${r(y+13)}" ${FM} font-size="${isAlt||isAcc?12:11}" font-weight="bold" fill="${isAlt?aC:isAcc&&TWtotal!==TWg?'#c08800':'#14304f'}">${val}${isAlt?' ⚠':''}</text>`;h+=`<line x1="40" y1="${r(y+17)}" x2="${r(c2x-20)}" y2="${r(y+17)}" stroke="${isAlt?aC+'40':'#ccc'}" stroke-width=".5"/>`;ry+=rH;});
  if(siteLimit>0){const sl=siteLimit-TWfull(),bc=aC||'#1a7a30';h+=`<rect x="36" y="${ry}" width="${r(c2x-56)}" height="24" fill="${bc}10" stroke="${bc}50" stroke-width=".8" rx="3"/>`;h+=`<text x="44" y="${r(ry+9)}" ${FM} font-size="7" fill="${bc}" letter-spacing="1">${T('covLimit')}</text>`;h+=`<text x="44" y="${r(ry+20)}" ${FM} font-size="11" font-weight="bold" fill="${bc}">${siteLimit} mm — ${state==='over'?T('alertOverBadge')+' +'+rnd(TWfull()-siteLimit)+'mm':state==='near'?T('alertNearBadge')+' '+rnd(sl)+'mm':T('limOk')+' '+rnd(sl)+'mm'}</text>`;}
  // Accessories summary in cover
  if(accLeft.length>0||accRight.length>0){
    h+=`<text x="40" y="${ry+30}" ${FM} font-size="7" fill="#c08800" letter-spacing="1">${T('accLabel')}</text>`;
    const accSummary=[...accLeft.map(it=>`◀${it.code}`),...accRight.map(it=>`${it.code}▶`)].join('  ');
    h+=`<text x="40" y="${ry+42}" ${FM} font-size="9.5" font-weight="bold" fill="#c08800">${accSummary}</text>`;
  }
  h+=`<text x="${c2x}" y="168" ${FM} font-size="7" fill="#888" letter-spacing="1">${T('covLeaves')}</text>`;
  lanes.forEach((_,i)=>{const{pg,lf}=getLane(i),y=182+i*26;h+=`<rect x="${c2x}" y="${r(y-10)}" width="${W-c2x-40}" height="22" fill="#fff" stroke="#e0e0e0" stroke-width=".5" rx="3"/>`;h+=`<text x="${r(c2x+8)}" y="${r(y+1)}" ${FM} font-size="7.5" fill="#14304f" font-weight="bold">C${i+1} · ${pg.l}mm ${T('libreLbl')}</text>`;h+=`<text x="${r(c2x+8)}" y="${r(y+10)}" ${FM} font-size="6.5" fill="#555">${lf.label} · ${lf.gmp}</text>`;});
  h+=`<line x1="40" y1="${H-130}" x2="${W-40}" y2="${H-130}" stroke="#14304f" stroke-width=".5"/>`;
  const fbY=H-118,fbH=80,fcW=r((W-20)/4);h+=`<rect x="10" y="${fbY}" width="${W-20}" height="${fbH+28}" fill="#fff" stroke="#14304f" stroke-width=".5"/>`;
  [[T('covBy'),author],[T('covCheck'),rev==='—'?'—':rev],[T('covDate'),dateStr],[T('covRev'),version]].forEach(([tx,v],k)=>{const fx=10+k*fcW;if(k>0)h+=`<line x1="${fx}" y1="${fbY}" x2="${fx}" y2="${fbY+fbH+28}" stroke="#14304f" stroke-width=".5"/>`;h+=`<text x="${r(fx+8)}" y="${r(fbY+12)}" ${FM} font-size="7" fill="#888" letter-spacing=".8">${tx}</text>`;h+=`<text x="${r(fx+8)}" y="${r(fbY+30)}" ${FM} font-size="11" font-weight="bold" fill="#14304f">${v}</text>`;});
  h+=`<rect x="10" y="${H-30}" width="${W-20}" height="20" fill="#14304f"/>`;h+=`<text x="360" y="${H-16}" text-anchor="middle" ${FM} font-size="7" fill="#7dd87a" letter-spacing="1">ZKTeco Corp. © 2025 — www.zkteco.com</text>`;
  document.getElementById('covsvg').innerHTML=h;
  autoSave();
}

