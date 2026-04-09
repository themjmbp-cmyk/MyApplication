// ══ MODELS ════════════════════════════════════════════════════
function pvcSize(n){const t=2+4*n;if(t<=8)return{d:50,label:'Ø50 mm',color:'#2a7a2a'};if(t<=12)return{d:63,label:'Ø63 mm',color:'#c08800'};return{d:75,label:'Ø75 mm',color:'#cc4400'};}
const MODELS={
  sbtl8000:{label:'SBTL8000 / SBTL8200',labelEnd:'SBTL8000',labelCentral:'SBTL8200',sub:'Swing Barrier · Industrial',W:134,D:1613,H:1017.5,armBase:200,wallCl:100,bolts:[80,336,681,977,1533],wireOff:88,mc:'#c04000',tempRange:'-20°C ~ +70°C',openSpeed:'0.3–0.6 s',power:'AC 100–240V 50/60Hz',consumption:'120VA',irSensors:'12 p',flowRate:'35 p/min',mcbf:'10 M',noise:'< 60 dB',antiPinch:true,antiTail:true,antiPanic:true,freePass:true,fireInt:true,
   pg:[{c:660,s:788.5,l:'660',leaves:[{label:'Std 935',gmp:'GMP-ACC-640X935-A',pH:480,pW:295,topH:935},{label:'H 1.2m',gmp:'GMP-ACC-640X1200-A',pH:745,pW:295,topH:1200},{label:'H 1.5m',gmp:'GMP-ACC-640X1500-A',pH:1045,pW:295,topH:1500}]},{c:900,s:1028,l:'900',leaves:[{label:'Wide 935',gmp:'GMP-ACC-900X935-A',pH:480,pW:425,topH:935},{label:'W 1.5m',gmp:'GMP-ACC-900X1500-A',pH:1255,pW:425,topH:1500}]},{c:1200,s:1330,l:'1200',leaves:[{label:'XL 935',gmp:'GMP-ACC-1200X935-A',pH:630,pW:575,topH:935}]}]},
  comet:{label:'Comet S1000 / S1200',labelEnd:'Comet S1000',labelCentral:'Comet S1200',sub:'Swing Gate · Slim',W:115,D:1500,H:1000,armBase:255,wallCl:100,bolts:[76,724,1424],wireOff:76,mc:'#005080',tempRange:'-28°C ~ +60°C',openSpeed:'0.8–3 s',power:'AC 100–240V 50/60Hz',consumption:'120W',irSensors:'8 p',flowRate:'25 p/min',mcbf:'6 M',noise:'< 60 dB',antiPinch:true,antiTail:true,antiPanic:true,freePass:true,fireInt:true,
   pg:[{c:660,s:812,l:'660',leaves:[{label:'Std 875',gmp:'GMP-ACC-650X875-A',pH:630,pW:295,topH:875},{label:'H 1.2m',gmp:'GMP-ACC-650X1200-A',pH:955,pW:295,topH:1200}]},{c:900,s:1010,l:'900',leaves:[{label:'Wide 875',gmp:'GMP-ACC-900X875-A',pH:630,pW:420,topH:875}]},{c:1200,s:1310,l:'1200',leaves:[{label:'XL 875',gmp:'GMP-ACC-1200X875-A',pH:630,pW:575,topH:875}]}]},
  mars:{label:'Mars Pro-S1000 / S1200',labelEnd:'Mars Pro-S1000',labelCentral:'Mars Pro-S1200',sub:'Swing Barrier · Compact',W:120,D:1355,H:1020,armBase:245,wallCl:100,bolts:[60,1300],wireOff:60,mc:'#1a6a30',tempRange:'-25°C ~ +65°C',openSpeed:'0.6 s',power:'AC 100–240V 50/60Hz',consumption:'100W',irSensors:'16 p',flowRate:'30 p/min',mcbf:'10 M',noise:'< 60 dB',antiPinch:true,antiTail:true,antiPanic:true,freePass:true,fireInt:true,
   pg:[{c:650,s:800,l:'650',leaves:[{label:'Std 875',gmp:'GMP-ACC-650X875-A',pH:630,pW:295,topH:875},{label:'H 1.5m',gmp:'GMP-ACC-650X1500-A',pH:1255,pW:295,topH:1500}]},{c:900,s:1050,l:'900',leaves:[{label:'Wide 875',gmp:'GMP-ACC-900X875-A',pH:630,pW:420,topH:875},{label:'W 1.5m',gmp:'GMP-ACC-900X1500-A',pH:1255,pW:420,topH:1500}]},{c:1200,s:1350,l:'1200',leaves:[{label:'XL 875',gmp:'GMP-ACC-1200X875-A',pH:630,pW:575,topH:875}]}]},
  mars_s100:{label:'Mars-S100 / S120',labelEnd:'Mars-S100',labelCentral:'Mars-S120',sub:'Swing Barrier · Ultra-Compact',W:120,D:600,H:1040,armBase:264,wallCl:100,bolts:[60,540],wireOff:60,mc:'#1a5a8a',tempRange:'-20°C ~ +70°C',openSpeed:'0.8 s',power:'AC 100–240V 50/60Hz',consumption:'50VA',irSensors:'4 p',flowRate:'30 p/min',mcbf:'5 M',noise:'< 60 dB',antiPinch:true,antiTail:false,antiPanic:true,freePass:true,fireInt:true,
   pg:[{c:660,s:820,l:'660',leaves:[{label:'Std 875',gmp:'GMP-ACC-650X875-A',pH:630,pW:295,topH:894},{label:'H 1.5m',gmp:'GMP-ACC-650X1500-A',pH:1255,pW:295,topH:1519}]},{c:900,s:1060,l:'900',leaves:[{label:'Wide 875',gmp:'GMP-ACC-900X875-A',pH:630,pW:420,topH:894},{label:'W 1.5m',gmp:'GMP-ACC-900X1500-A',pH:1255,pW:420,topH:1519}]},{c:1200,s:1360,l:'1200',leaves:[{label:'XL 875',gmp:'GMP-ACC-1200X875-A',pH:630,pW:575,topH:894}]}]},
};
const MK=Object.keys(MODELS);
let M='sbtl8000',lanes=[{pgIdx:0,lfIdx:0},{pgIdx:0,lfIdx:0}],PAGE='cover',siteLimit=0,siteLen=0;
const N=()=>lanes.length;
const r=n=>+(Math.round(n*10)/10);
const rnd=n=>Math.round(n);
const mn=(...a)=>a.reduce((b,c)=>b<c?b:c);
function getLane(i){const sp=MODELS[M],l=lanes[i],pgI=Math.min(l.pgIdx,sp.pg.length-1),pg=sp.pg[pgI],lfI=Math.min(l.lfIdx,pg.leaves.length-1);return{pg,lf:pg.leaves[lfI]};}
function TWgate(){return(N()+1)*MODELS[M].W+Array.from({length:N()},(_,i)=>getLane(i).pg.s).reduce((a,b)=>a+b,0);}
function TWfull(){return accSideTotalW(accLeft)+TWgate()+accSideTotalW(accRight);}
function maxH(){return Math.max(MODELS[M].H,...Array.from({length:N()},(_,i)=>getLane(i).lf.topH));}
function cabType(i){if(i===0)return'left';if(i===N())return'right';return'central';}
function unitsInfo(){const sp=MODELS[M],nC=Math.max(0,N()-1);return nC>0?`1 × ${sp.labelEnd} + ${nC} × ${sp.labelCentral}`:`1 × ${sp.labelEnd}`;}
function unitsShort(){const sp=MODELS[M],nC=Math.max(0,N()-1);return nC>0?`1×${sp.labelEnd} + ${nC}×${sp.labelCentral}`:`1×${sp.labelEnd}`;}

