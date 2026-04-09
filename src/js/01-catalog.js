const GAP_MM=50, MAX_ACC_PER_SIDE=4;

// ══ ACCESSORY CATALOG ═════════════════════════════════════════
const ACC_CAT=[
  {code:'R10',W:500,H:950,hasGlass:false,gW:0,gH:0,
   label:'R10 · Poste y barra',labelEn:'R10 · Post & rail',labelPt:'R10 · Poste e barra',
   desc:'Inox sin vidrio',descEn:'Stainless, no glass',descPt:'Inox sem vidro'},
  {code:'R20',W:1020,H:950,hasGlass:false,gW:0,gH:0,
   label:'R20 · Poste y barra ancho',labelEn:'R20 · Wide post & rail',labelPt:'R20 · Poste e barra largo',
   desc:'Inox ancho sin vidrio',descEn:'Wide stainless, no glass',descPt:'Inox largo sem vidro'},
  {code:'R30',W:500,H:950,hasGlass:true,gW:415,gH:600,
   label:'R30 · Inox + vidrio',labelEn:'R30 · Rail + glass',labelPt:'R30 · Inox + vidro',
   desc:'Inox + vidrio templado',descEn:'Inox + tempered glass',descPt:'Inox + vidro temperado'},
  {code:'R40',W:1020,H:950,hasGlass:true,gW:920,gH:600,
   label:'R40 · Inox ancho + vidrio',labelEn:'R40 · Wide rail + glass',labelPt:'R40 · Inox largo + vidro',
   desc:'Inox ancho + vidrio templado',descEn:'Wide inox + tempered glass',descPt:'Inox largo + vidro temperado'},
  {code:'R50',W:1020,H:955,hasGlass:true,gW:920,gH:600,
   customW:true, // outer frame width is fixed 1020mm; glass is custom
   customGlass:true, // glass dimensions are freely configurable within range
   gWmin:920,gWmax:1400,gHmin:600,gHmax:850,
   label:'R50 · Poste inox + vidrio obra',labelEn:'R50 · Post + glass on site',labelPt:'R50 · Poste + vidro em obra',
   desc:'Inox + vidrio a medida (obra)',descEn:'Inox + custom glass on site',descPt:'Inox + vidro medida (obra)'}
];
const ACC_BY_CODE=Object.fromEntries(ACC_CAT.map(a=>[a.code,a]));

// State: each side is an array of {code, r50gi, r50gW, r50gH}
// r50gW/r50gH: custom glass dims for R50 (default 920×600)
let accLeft=[], accRight=[];

function getAccGlass(item){
  const a=ACC_BY_CODE[item.code];
  if(!a||!a.hasGlass)return null;
  if(a.customGlass){
    // R50: custom glass dimensions stored in item
    const gW=Math.max(a.gWmin,Math.min(a.gWmax,+(item.r50gW)||a.gW));
    const gH=Math.max(a.gHmin,Math.min(a.gHmax,+(item.r50gH)||a.gH));
    return{gW,gH,custom:true};
  }
  if(a.glassOpts)return a.glassOpts[Math.min(item.r50gi||0,a.glassOpts.length-1)];
  return{gW:a.gW,gH:a.gH};
}
function setR50Custom(side,idx,field,val){
  const list=side==='left'?accLeft:accRight;
  if(!list[idx])return;
  list[idx][field]=val;
  renderAccBar();drawCAD();if(PAGE==='ficha')drawFicha();autoSave();
}
function setAccIsoPos(side,idx,pos){
  const list=side==='left'?accLeft:accRight;
  if(list[idx])list[idx].isoZ=pos;
  renderAccBar();if(PAGE==='iso')drawISO();autoSave();
}
// R50 total width = glass width + 100mm (50mm post on each side)
// All other accessories have fixed W from catalog
function getAccItemW(item){
  const a=ACC_BY_CODE[item.code];if(!a)return 0;
  if(a.customGlass){return(+(item.r50gW)||a.gW)+100;}
  return a.W;
}
const ACC_GAP_MM=20;
// Total width of one side: gap-before-first + sum(widths) + gaps-between
function accSideTotalW(list){if(list.length===0)return 0;return list.length*ACC_GAP_MM+list.reduce((s,it)=>s+getAccItemW(it),0);}
function accTotalW(list){return accSideTotalW(list);}
function accLbl(a){return LANG==='en'?a.labelEn:LANG==='pt'?a.labelPt:a.label;}
function accDsc(a){return LANG==='en'?a.descEn:LANG==='pt'?a.descPt:a.desc;}
function goLbl(o){return LANG==='en'?o.labelEn:LANG==='pt'?o.labelPt:o.label;}

