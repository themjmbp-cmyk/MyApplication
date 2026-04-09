};
function applyPreset(key){
  const p=PRESETS[key];if(!p)return;
  pushUndo();
  if(MODELS[p.m])M=p.m;
  const sp=MODELS[M];
  lanes=p.l.map(l=>{const mxP=sp.pg.length-1,pg=Math.min(l.pgIdx,mxP),mxL=sp.pg[pg].leaves.length-1;return{pgIdx:pg,lfIdx:Math.min(l.lfIdx,mxL)};});
  ui();redrawPage();autoSave();showToast(T('presetApplied'));
}

// ══ MIRROR CONFIG ═════════════════════════════════════════════
function mirrorConfig(){
  pushUndo();
  const tmp=accLeft;accLeft=accRight;accRight=tmp;
  ui();redrawPage();autoSave();showToast(T('mirrorApplied'));
}

// ══ DXF EXPORT ════════════════════════════════════════════════
function _dxfLine(x1,y1,x2,y2,layer){return'0\nLINE\n8\n'+(layer||'0')+'\n10\n'+r(x1)+'\n20\n'+r(y1)+'\n11\n'+r(x2)+'\n21\n'+r(y2)+'\n';}
function _dxfRect(x,y,w,h,layer){const l=layer||'0';return _dxfLine(x,y,x+w,y,l)+_dxfLine(x+w,y,x+w,y+h,l)+_dxfLine(x+w,y+h,x,y+h,l)+_dxfLine(x,y+h,x,y,l);}
function _dxfText(x,y,txt,ht,layer){return'0\nTEXT\n8\n'+(layer||'ANNO')+'\n10\n'+r(x)+'\n20\n'+r(y)+'\n40\n'+(ht||80)+'\n1\n'+String(txt).replace(/\n/g,' ')+'\n72\n1\n11\n'+r(x)+'\n21\n'+r(y)+'\n';}
function exportDXF(){
  const sp=MODELS[M],n=N();
  let dxf='',x=0;
  // Left accessories
  accLeft.forEach(item=>{
    const aw=getAccItemW(item),ah=item.H||950;
    dxf+=_dxfRect(x,0,aw,ah,'ACC');
    dxf+=_dxfText(x+aw/2,ah/2,item.code,80,'ANNO');
    x+=aw+ACC_GAP_MM;
  });
  if(accLeft.length)x+=ACC_GAP_MM;
  // Cabinets + lanes
  for(let i=0;i<=n;i++){
    dxf+=_dxfRect(x,0,sp.W,sp.D,'CABS');
    dxf+=_dxfText(x+sp.W/2,sp.D/2,(i===0?sp.labelEnd:sp.labelCentral),60,'ANNO');
    x+=sp.W;
    if(i<n)x+=getLane(i).pg.s;
  }
  // Right accessories
  if(accRight.length)x+=ACC_GAP_MM;
  accRight.forEach(item=>{
    const aw=getAccItemW(item),ah=item.H||950;
    dxf+=_dxfRect(x,0,aw,ah,'ACC');
    dxf+=_dxfText(x+aw/2,ah/2,item.code,80,'ANNO');
    x+=aw+ACC_GAP_MM;
  });
  const tw=TWfull();
  dxf+=_dxfLine(0,-200,tw,-200,'DIM');
  dxf+=_dxfLine(0,-180,0,-220,'DIM')+_dxfLine(tw,-180,tw,-220,'DIM');
  dxf+=_dxfText(tw/2,-300,'TW='+rnd(tw)+' mm',120,'DIM');
  if(siteLimit>0){
    dxf+=_dxfLine(0,-380,siteLimit,-380,'LIMIT');
    dxf+=_dxfLine(0,-360,0,-400,'LIMIT')+_dxfLine(siteLimit,-360,siteLimit,-400,'LIMIT');
    dxf+=_dxfText(siteLimit/2,-450,T('maxLbl')+' '+rnd(siteLimit)+' mm',100,'LIMIT');
  }
  const hdr='0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1014\n9\n$EXTMIN\n10\n-100\n20\n-500\n9\n$EXTMAX\n10\n'+r(tw+200)+'\n20\n'+r(sp.D+100)+'\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n';
  const blob=new Blob([hdr+dxf+'0\nENDSEC\n0\nEOF\n'],{type:'application/dxf'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='ZKTeco_'+M+'_'+n+'L.dxf';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000);
  showToast('DXF exportado ✓');
}

// ══ BILL OF MATERIALS ═════════════════════════════════════════
function drawBOM(){
  const sp=MODELS[M],n=N(),nCentral=Math.max(0,n-1);
  const pvc=pvcSize(n),cables=T('cables');
  const items=[];
  items.push({qty:1,ref:sp.labelEnd,desc:sp.label+' · '+sp.sub});
  if(nCentral>0)items.push({qty:nCentral,ref:sp.labelCentral,desc:sp.label+' · Central'});
  const leafG={};
  Array.from({length:n},(_,i)=>{const lf=getLane(i).lf;if(!leafG[lf.gmp])leafG[lf.gmp]={qty:0,ref:lf.gmp,desc:lf.label};leafG[lf.gmp].qty+=2;});
  Object.values(leafG).forEach(g=>items.push(g));
  const accG={};
  [...accLeft,...accRight].forEach(a=>{if(!accG[a.code])accG[a.code]={qty:0,ref:a.code,desc:accLbl(ACC_BY_CODE[a.code])};accG[a.code].qty++;});
  Object.values(accG).forEach(g=>items.push(g));
  items.push({qty:1,ref:'PVC-Ø'+pvc.d,desc:T('bomPVC')+' '+pvc.label});
  if(Array.isArray(cables))cables.forEach((c,i)=>items.push({qty:n+1,ref:'CBL-'+(i+1),desc:c}));
  const el=document.getElementById('bom-content');if(!el)return;
  const grid='display:grid;grid-template-columns:40px 150px 1fr;gap:2px 8px;font-family:monospace;';
  const hdr=`<div class="bom-hdr" style="${grid}font-size:9px;font-weight:700;color:rgba(255,255,255,.5);padding:4px 0;border-bottom:1px solid rgba(255,255,255,.15);margin-bottom:2px"><span>${T('bomQty')}</span><span>${T('bomGMP')}</span><span>${T('bomDesc')}</span></div>`;
  const rows=items.map(it=>`<div class="bom-sep" style="${grid}font-size:9.5px;padding:2.5px 0;border-bottom:1px solid rgba(255,255,255,.06);align-items:center"><span class="bom-qty" style="color:#7dd87a;font-weight:700">${it.qty}×</span><span class="bom-ref" style="color:#b0b8c8">${it.ref}</span><span class="bom-desc" style="color:#d0d8e4">${it.desc}</span></div>`).join('');
  const total=items.reduce((s,it)=>s+it.qty,0);
  const foot=`<div class="bom-foot" style="${grid}font-size:10px;font-weight:700;color:#7dd87a;padding:6px 0 2px;border-top:1px solid rgba(255,255,255,.2);margin-top:2px"><span>${total}×</span><span style="grid-column:2/4">${T('bomTotal')}</span><span></span></div>`;
  el.innerHTML=hdr+rows+foot;
}
function exportBOM(fmt){
  if(fmt!=='csv')return;
  const sp=MODELS[M],n=N(),nCentral=Math.max(0,n-1);
  const pvc=pvcSize(n),cables=T('cables');
  const rows=[[T('bomQty'),T('bomGMP'),T('bomDesc')]];
  rows.push([1,sp.labelEnd,sp.label]);
  if(nCentral>0)rows.push([nCentral,sp.labelCentral,sp.label+' Central']);
  const leafG={};
  Array.from({length:n},(_,i)=>{const lf=getLane(i).lf;if(!leafG[lf.gmp])leafG[lf.gmp]={qty:0,gmp:lf.gmp,lbl:lf.label};leafG[lf.gmp].qty+=2;});
  Object.values(leafG).forEach(g=>rows.push([g.qty,g.gmp,g.lbl]));
  [...accLeft,...accRight].forEach(a=>rows.push([1,a.code,accLbl(ACC_BY_CODE[a.code])]));
  rows.push([1,'PVC-Ø'+pvc.d,T('bomPVC')+' '+pvc.label]);
  if(Array.isArray(cables))cables.forEach((c,i)=>rows.push([n+1,'CBL-'+(i+1),c]));
  const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='BOM_ZKTeco_'+M+'.csv';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000);
  showToast('CSV exportado ✓');
}
function printBOM(){drawBOM();window.print();}

// ══ BOM → EXCEL (XML Spreadsheet 2003) ═══════════════════════
function exportBOMxls(){
  const sp=MODELS[M],n=N(),nCentral=Math.max(0,n-1);
  const pvc=pvcSize(n),cables=T('cables');
  const rows=[[T('bomQty'),T('bomGMP'),T('bomDesc')]];
  rows.push([1,sp.labelEnd,sp.label]);
  if(nCentral>0)rows.push([nCentral,sp.labelCentral,sp.label+' Central']);
  const leafG={};
  Array.from({length:n},(_,i)=>{const lf=getLane(i).lf;if(!leafG[lf.gmp])leafG[lf.gmp]={qty:0,gmp:lf.gmp,lbl:lf.label};leafG[lf.gmp].qty+=2;});
  Object.values(leafG).forEach(g=>rows.push([g.qty,g.gmp,g.lbl]));
  [...accLeft,...accRight].forEach(a=>rows.push([1,a.code,accLbl(ACC_BY_CODE[a.code])]));
  rows.push([1,'PVC-Ø'+pvc.d,T('bomPVC')+' '+pvc.label]);
  if(Array.isArray(cables))cables.forEach((c,i)=>rows.push([n+1,'CBL-'+(i+1),c]));
  const esc=v=>String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const xmlRows=rows.map(row=>`<Row>${row.map(c=>`<Cell><Data ss:Type="String">${esc(c)}</Data></Cell>`).join('')}</Row>`).join('');
  const xls='<?xml version="1.0"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="BOM"><Table>'+xmlRows+'</Table></Worksheet></Workbook>';
  const blob=new Blob([xls],{type:'application/vnd.ms-excel;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='BOM_ZKTeco_'+M+'.xls';a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000);
  showToast('XLS exportado ✓');
}

