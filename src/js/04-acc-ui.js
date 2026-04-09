// ══ ACCESSORY UI ══════════════════════════════════════════════
function renderAccBar(){
  renderAccSide('left',accLeft,'acc-left-items','acc-left-add');
  renderAccSide('right',accRight,'acc-right-items','acc-right-add');
}
function renderAccSide(side,list,itemsId,addId){
  const itemsEl=document.getElementById(itemsId);
  const addEl=document.getElementById(addId);
  if(!itemsEl||!addEl)return;
  if(list.length===0){itemsEl.innerHTML=`<div class="ac-none">${T('accNone')}</div>`;}
  else{
    itemsEl.innerHTML=list.map((item,idx)=>{
      const a=ACC_BY_CODE[item.code];if(!a)return'';
      const gO=getAccGlass(item);
      let extraHtml='';
      if(a.customGlass){
        // R50: show custom numeric inputs for glass width and height
        const gW=+(item.r50gW)||920, gH=+(item.r50gH)||600;
        extraHtml=`<div class="ac-r50-row">
          <span class="ac-r50-lbl">${T('glass')}:</span>
          <span class="ac-r50-lbl">${T('r50Width')}</span>
          <input class="ac-r50-inp" type="number" min="${a.gWmin}" max="${a.gWmax}" step="10" value="${gW}"
            onchange="setR50Custom('${side}',${idx},'r50gW',Math.max(${a.gWmin},Math.min(${a.gWmax},+this.value)))">
          <span class="ac-r50-unit">mm</span>
          <span class="ac-r50-range">(${a.gWmin}–${a.gWmax})</span>
          <span class="ac-r50-lbl" style="margin-left:4px">${T('r50Height')}</span>
          <input class="ac-r50-inp" type="number" min="${a.gHmin}" max="${a.gHmax}" step="10" value="${gH}"
            onchange="setR50Custom('${side}',${idx},'r50gH',Math.max(${a.gHmin},Math.min(${a.gHmax},+this.value)))">
          <span class="ac-r50-unit">mm</span>
          <span class="ac-r50-range">(${a.gHmin}–${a.gHmax})</span>
        </div>`;
      }
      const dynW=getAccItemW(item);
      const dimDesc=`${dynW}×${a.H}mm${gO?` · ${T('glass')} ${gO.gW}×${gO.gH}mm`:''}`;
      const isoZ=item.isoZ!=null?+item.isoZ:1;
      const posHtml=`<div class="iso-pos-row"><span class="iso-pos-lbl">${T('isoPos')}:</span>${[0,1,2].map(p=>`<button class="iso-pos-btn${isoZ===p?' on':''}" onclick="setAccIsoPos('${side}',${idx},${p})">${[T('isoPosF'),T('isoPosM'),T('isoPosB')][p]}</button>`).join('')}</div>`;
      return`<div class="ac-item">
        <span class="ac-item-badge">${a.code}</span>
        <span class="ac-item-desc">${accDsc(a)} · ${dimDesc}</span>
        <button class="ac-rm" onclick="removeAcc('${side}',${idx})" title="${T('accRemove')}">×</button>
        ${extraHtml}${posHtml}
      </div>`;
    }).join('');
  }
  const canAdd=list.length<MAX_ACC_PER_SIDE;
  const maxMsg=!canAdd?`<span style="font-size:9px;color:rgba(125,216,122,.4);font-family:monospace;margin-left:4px">max ${MAX_ACC_PER_SIDE}</span>`:'';
  addEl.innerHTML=`<span class="ac-add-lbl">${T('accAdd')}:</span>`+
    ACC_CAT.map(a=>`<button class="ac-add-btn" ${canAdd?'':'disabled'} onclick="addAcc('${side}','${a.code}')" title="${canAdd?a.code+' · '+accDsc(a)+' · '+a.W+'×'+a.H+'mm':'Max '+MAX_ACC_PER_SIDE+' '+T('msgPerSide')}">${a.code}</button>`).join('')+maxMsg;
}
function addAcc(side,code){
  const a=ACC_BY_CODE[code];if(!a)return;
  const list=side==='left'?accLeft:accRight;
  if(list.length>=MAX_ACC_PER_SIDE)return;
  if(typeof pushUndo==='function')pushUndo('+'+code);
  list.push({code,r50gi:0,r50gW:920,r50gH:600,isoZ:1});
  renderAccBar();drawCAD();if(PAGE==='ficha')drawFicha();if(PAGE==='cover')drawCover();autoSave();
}
function removeAcc(side,idx){
  const list=side==='left'?accLeft:accRight;
  if(typeof pushUndo==='function')pushUndo('-'+list[idx]?.code);
  list.splice(idx,1);
  renderAccBar();drawCAD();if(PAGE==='ficha')drawFicha();if(PAGE==='cover')drawCover();autoSave();
}
function setAccGlass(side,idx,gi){
  const list=side==='left'?accLeft:accRight;
  if(list[idx])list[idx].r50gi=gi;
  renderAccBar();drawCAD();if(PAGE==='ficha')drawFicha();
}

