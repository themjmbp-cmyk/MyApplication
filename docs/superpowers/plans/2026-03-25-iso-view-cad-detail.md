# ISO View CAD Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `drawISO()` in `zkteco_v35_optimized.html` to render a detailed CAD-style isometric view with floor base plate, realistic cabinet bodies (gray + model-color rail + glass + LED sensors + slots), and colored cables.

**Architecture:** Add 4 local helper functions inside `drawISO()` — `basePlate()`, `cabinet()`, `accPanel()`, `cables()` — replacing the current simple `box()` calls for ground shadow, gate cabinets, and accessories. Cables are accumulated and rendered last (SVG z-order). All helpers are closures that use `pt`, `pp`, `box`, `sc`, `ox`, `oy` already defined in `drawISO()`.

**Tech Stack:** Vanilla JS, SVG string concatenation, isometric projection math (already in place). No external dependencies. No test framework — verification is visual (open HTML in browser).

---

## File Map

| File | Change |
|------|--------|
| `zkteco_v35_optimized.html:1742–1829` | Replace `drawISO()` entirely |

No other files touched.

---

### Task 1: Add `basePlate()` helper — replace ground shadow

**Files:**
- Modify: `zkteco_v35_optimized.html:1767–1769`

Replace lines 1767–1769 (the ground shadow section) with the `basePlate()` helper definition inserted right after the `box` helper ends (after line 1762), and its call replacing the shadow.

- [ ] **Step 1: Insert `basePlate()` helper after `box` definition (line 1762)**

Insert this block immediately after line 1762 (the closing `};` of `box`):

```js
  const basePlate=()=>{
    const bh=40;
    let s=box(0,0,TWtotal,depthZ,bh,'#a8a8a8',1.0);
    [[20,20],[TWtotal-20,20],[20,depthZ-20],[TWtotal-20,depthZ-20]].forEach(([bx,bz])=>{
      const bp=pt(bx,bh,bz);
      s+=`<ellipse cx="${bp.sx}" cy="${bp.sy}" rx="${r(4*sc)}" ry="${r(2*sc)}" fill="#666" fill-opacity=".5"/>`;
    });
    return s;
  };
```

- [ ] **Step 2: Replace ground shadow call (lines 1767–1769) with basePlate() call**

Replace:
```js
  // Ground shadow
  const gc=[pt(0,0,0),pt(TWtotal,0,0),pt(TWtotal,0,depthZ),pt(0,0,depthZ)];
  svg+=`<polygon points="${pp(gc)}" fill="#bbb" fill-opacity=".25" stroke="#aaa" stroke-width=".4" stroke-dasharray="5 3"/>`;
```

With:
```js
  // Base plate
  svg+=basePlate();
```

- [ ] **Step 3: Open `zkteco_v35_optimized.html` in browser, navigate to tab ISO**

Verify: gray flat platform visible under the entire installation footprint, with 4 small bolt ellipses at corners.

- [ ] **Step 4: Commit**

```bash
git add zkteco_v35_optimized.html
git commit -m "feat(iso): add basePlate() helper with floor platform and anchor bolts"
```

---

### Task 2: Add `cabinet()` helper — detailed gate cabinet rendering

**Files:**
- Modify: `zkteco_v35_optimized.html:1783–1798` (gate cabinets section)

- [ ] **Step 1: Insert `cabinet()` helper after `basePlate()` definition**

Insert immediately after the closing `};` of `basePlate()`:

```js
  const cabinet=(x0,z0,bW,bD,bH,modelColor,wireOff)=>{
    let s='';
    // Main body - light gray
    s+=box(x0,z0,bW,bD,bH,'#dcdce4',0.95);
    // Rail overlay on top 60mm
    const railH=60,sk2='stroke="rgba(0,0,0,.2)" stroke-width=".4"';
    const rf=[pt(x0,bH-railH,z0),pt(x0+bW,bH-railH,z0),pt(x0+bW,bH,z0),pt(x0,bH,z0)];
    const rt=[pt(x0,bH,z0),pt(x0+bW,bH,z0),pt(x0+bW,bH,z0+bD),pt(x0,bH,z0+bD)];
    const rs=[pt(x0+bW,bH-railH,z0),pt(x0+bW,bH-railH,z0+bD),pt(x0+bW,bH,z0+bD),pt(x0+bW,bH,z0)];
    s+=`<polygon points="${pp(rf)}" fill="${modelColor}" fill-opacity=".95" ${sk2}/>`;
    s+=`<polygon points="${pp(rt)}" fill="${modelColor}" fill-opacity=".78" ${sk2}/>`;
    s+=`<polygon points="${pp(rs)}" fill="${modelColor}" fill-opacity=".6" ${sk2}/>`;
    // Vertical slots on front face
    [0.3,0.7].forEach(f=>{
      const p1=pt(x0+bW*f,10,z0),p2=pt(x0+bW*f,bH-railH-10,z0);
      s+=`<line x1="${p1.sx}" y1="${p1.sy}" x2="${p2.sx}" y2="${p2.sy}" stroke="#999" stroke-width=".6" stroke-opacity=".7"/>`;
    });
    // Glass panel
    const gX=x0+bW*0.15,gW2=bW*0.7,gYb=30,gH2=bH*0.65;
    const gf=[pt(gX,gYb,z0),pt(gX+gW2,gYb,z0),pt(gX+gW2,gYb+gH2,z0),pt(gX,gYb+gH2,z0)];
    s+=`<polygon points="${pp(gf)}" fill="#88ccff" fill-opacity=".30" stroke="#5599cc" stroke-width=".9"/>`;
    // Glass reflection strip
    const rX=x0+bW*0.15,rW=bW*0.08;
    const rfl=[pt(rX,gYb+5,z0),pt(rX+rW,gYb+5,z0),pt(rX+rW,gYb+gH2-5,z0),pt(rX,gYb+gH2-5,z0)];
    s+=`<polygon points="${pp(rfl)}" fill="#fff" fill-opacity=".15" stroke="none"/>`;
    // LED sensors (fixed decorative)
    const ledX=x0+bW*0.08;
    const l1=pt(ledX,bH*0.45,z0),l2=pt(ledX,bH*0.55,z0);
    s+=`<circle cx="${l1.sx}" cy="${l1.sy}" r="2.5" fill="#ff8800" fill-opacity=".85"/>`;
    s+=`<circle cx="${l2.sx}" cy="${l2.sy}" r="2.5" fill="#22cc22" fill-opacity=".85"/>`;
    // Wire point (only end cabinets, wireOff!=null)
    if(wireOff!=null){const wp=pt(x0+wireOff,bH*.5,z0);s+=`<circle cx="${wp.sx}" cy="${wp.sy}" r="3.5" fill="#1a5fa0" opacity=".85" stroke="#fff" stroke-width=".4"/>`;}
    return s;
  };
```

- [ ] **Step 2: Replace gate cabinet rendering (lines 1783–1798)**

Replace the entire `// Gate cabinets + lanes` block:
```js
  // Gate cabinets + lanes
  let cx=TWL;
  for(let i=0;i<=n;i++){
    svg+=box(cx,0,sp.W,depthZ,sp.H,sp.mc,1);
    // Wire dot on front face
    if(i===0||i===n){const wOff=i===0?sp.wireOff:sp.W-sp.wireOff;const wp=pt(cx+wOff,sp.H*.5,0);svg+=`<circle cx="${wp.sx}" cy="${wp.sy}" r="3.5" fill="#1a5fa0" opacity=".85" stroke="#fff" stroke-width=".4"/>`;}
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
```

With:
```js
  // Gate cabinets + lanes
  let cx=TWL;const cablesSvg=[];
  for(let i=0;i<=n;i++){
    const wireOff=(i===0)?sp.wireOff:(i===n)?sp.W-sp.wireOff:null;
    svg+=cabinet(cx,0,sp.W,depthZ,sp.H,sp.mc,wireOff);
    cablesSvg.push({x0:cx,bW:sp.W,bH:sp.H});
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
```

Note: `cablesSvg` accumulates cabinet positions to render cables later.

- [ ] **Step 3: Verify in browser**

Navigate to ISO tab. Expect: each gate cabinet now shows gray body, colored top rail (blue for Comet, red for SBTL8000), glass panel, LED dots, vertical slots. Wire point circles still visible on end cabinets. Base plate still visible below.

- [ ] **Step 4: Commit**

```bash
git add zkteco_v35_optimized.html
git commit -m "feat(iso): add cabinet() helper with rail, glass, LED sensors, slots"
```

---

### Task 3: Add `accPanel()` helper — detailed accessory rendering

**Files:**
- Modify: `zkteco_v35_optimized.html` — accessory LEFT and RIGHT loop bodies

- [ ] **Step 1: Insert `accPanel()` helper after `cabinet()` definition**

Insert immediately after the closing `};` of `cabinet()`:

```js
  const accPanel=(x0,z0,bW,bD,bH,hasGlass,gW,gH)=>{
    let s='';
    // Main body - same gray as cabinets
    s+=box(x0,z0,bW,bD,bH,'#dcdce4',0.95);
    // Rail overlay - amber color
    const railH=60,mc='#c08800',sk2='stroke="rgba(0,0,0,.2)" stroke-width=".4"';
    const rf=[pt(x0,bH-railH,z0),pt(x0+bW,bH-railH,z0),pt(x0+bW,bH,z0),pt(x0,bH,z0)];
    const rt=[pt(x0,bH,z0),pt(x0+bW,bH,z0),pt(x0+bW,bH,z0+bD),pt(x0,bH,z0+bD)];
    const rs=[pt(x0+bW,bH-railH,z0),pt(x0+bW,bH-railH,z0+bD),pt(x0+bW,bH,z0+bD),pt(x0+bW,bH,z0)];
    s+=`<polygon points="${pp(rf)}" fill="${mc}" fill-opacity=".95" ${sk2}/>`;
    s+=`<polygon points="${pp(rt)}" fill="${mc}" fill-opacity=".78" ${sk2}/>`;
    s+=`<polygon points="${pp(rs)}" fill="${mc}" fill-opacity=".6" ${sk2}/>`;
    // Glass panel if applicable
    if(hasGlass&&gW&&gH){
      const gX=x0+(bW-gW)/2,gZ=z0+20;
      const gf=[pt(gX,0,gZ),pt(gX+gW,0,gZ),pt(gX+gW,gH,gZ),pt(gX,gH,gZ)];
      s+=`<polygon points="${pp(gf)}" fill="#88ccff" fill-opacity=".35" stroke="#5599cc" stroke-width=".8"/>`;}
    return s;
  };
```

- [ ] **Step 2: Replace accessory LEFT loop body**

Replace the body of the LEFT accessories loop (the inner content, NOT the loop structure):
```js
    axL+=ACC_GAP_MM;
    svg+=box(axL,accZ,aW,accDepth,aH,'#c08800',.78);
    if(acat.hasGlass){const gW=acat.customGlass?(+(itm.r50gW)||920):acat.gW,gH=acat.customGlass?(+(itm.r50gH)||600):acat.gH;
      const gX=axL+(aW-gW)/2,gZ=accZ+20;
      const gf=[pt(gX,0,gZ),pt(gX+gW,0,gZ),pt(gX+gW,gH,gZ),pt(gX,gH,gZ)];
      svg+=`<polygon points="${pp(gf)}" fill="#88ccff" fill-opacity=".4" stroke="#5599cc" stroke-width=".8"/>`;}
    axL+=aW;
```

With:
```js
    axL+=ACC_GAP_MM;
    const gWl=acat.customGlass?(+(itm.r50gW)||920):acat.gW;
    const gHl=acat.customGlass?(+(itm.r50gH)||600):acat.gH;
    svg+=accPanel(axL,accZ,aW,accDepth,aH,acat.hasGlass,gWl,gHl);
    axL+=aW;
```

- [ ] **Step 3: Replace accessory RIGHT loop body**

Replace the body of the RIGHT accessories loop:
```js
    axR+=ACC_GAP_MM;
    svg+=box(axR,accZ,aW,accDepth,aH,'#c08800',.78);
    if(acat.hasGlass){const gW=acat.customGlass?(+(itm.r50gW)||920):acat.gW,gH=acat.customGlass?(+(itm.r50gH)||600):acat.gH;
      const gX=axR+(aW-gW)/2,gZ=accZ+20;
      const gf=[pt(gX,0,gZ),pt(gX+gW,0,gZ),pt(gX+gW,gH,gZ),pt(gX,gH,gZ)];
      svg+=`<polygon points="${pp(gf)}" fill="#88ccff" fill-opacity=".4" stroke="#5599cc" stroke-width=".8"/>`;}
    axR+=aW;
```

With:
```js
    axR+=ACC_GAP_MM;
    const gWr=acat.customGlass?(+(itm.r50gW)||920):acat.gW;
    const gHr=acat.customGlass?(+(itm.r50gH)||600):acat.gH;
    svg+=accPanel(axR,accZ,aW,accDepth,aH,acat.hasGlass,gWr,gHr);
    axR+=aW;
```

- [ ] **Step 4: Verify in browser**

Add accessories (e.g. R50 with glass) on both sides. Expect: accessories now show gray body + amber rail on top, same height profile as cabinets. Glass panel appears on R50.

- [ ] **Step 5: Commit**

```bash
git add zkteco_v35_optimized.html
git commit -m "feat(iso): add accPanel() helper - gray body + amber rail, replaces plain box"
```

---

### Task 4: Add `cables()` helper — colored cables on all cabinets

**Files:**
- Modify: `zkteco_v35_optimized.html` — insert after RIGHT accessories loop, before dimension lines

- [ ] **Step 1: Insert `cables()` helper after `accPanel()` definition**

Insert immediately after the closing `};` of `accPanel()`:

```js
  const cables=(x0,bW)=>{
    let s='';
    [['#e60000',0.35],['#0055cc',0.45],['#aaaa00',0.55]].forEach(([col,f])=>{
      const p0=pt(x0+bW*f,0,0);
      s+=`<path d="M${p0.sx},${p0.sy} Q${p0.sx},${p0.sy+20} ${p0.sx+5},${p0.sy+35}" stroke="${col}" stroke-width="1.3" fill="none"/>`;
    });
    return s;
  };
```

- [ ] **Step 2: Append cable rendering after the RIGHT accessories loop and before dimension lines**

After the closing `}` of the RIGHT accessories loop (after the `axR+=aW;` / `}` block), and before the `// Total width dimension line` comment, insert:

```js
  // Cables (rendered last for correct SVG z-order)
  cablesSvg.forEach(c=>{ svg+=cables(c.x0,c.bW); });
```

- [ ] **Step 3: Verify in browser**

Expect: 3 colored cables (red, blue, yellow-green) curve downward from the base of every cabinet. Cables appear on top of all solids. Works with 1, 2, and 3 lanes.

- [ ] **Step 4: Verify edge cases**

- [ ] Switch model to SBTL8000 — rail color changes to red, cables still visible
- [ ] Switch model to Mars Pro — rail color changes to green, cables still visible
- [ ] Set 3 lanes — all 4 cabinets have cables
- [ ] Add 4 accessories LEFT + 4 RIGHT — accPanels render correctly, no overlap with cables

- [ ] **Step 5: Commit**

```bash
git add zkteco_v35_optimized.html
git commit -m "feat(iso): add cables() helper - colored cables visible on all cabinets"
```

---

### Task 5: Final verification and push

- [ ] **Step 1: Open HTML in browser and run through all acceptance criteria**

Checklist:
- [ ] Base plate gris cubre TWtotal y profundidad completa
- [ ] Base plate tiene pernos visibles en esquinas
- [ ] Cada gabinete: cuerpo gris + rail de color del modelo
- [ ] Cada gabinete: ranuras verticales en cara frontal
- [ ] Cada gabinete: cristal translúcido con reflejo lateral
- [ ] Cada gabinete: 2 LEDs fijos (naranja + verde)
- [ ] Gabinetes extremos: punto de cableado azul
- [ ] 3 cables (rojo/azul/verde-amarillo) en TODOS los gabinetes
- [ ] Accesorios: cuerpo gris + rail ámbar
- [ ] Accesorios R50 con cristal: panel translúcido visible
- [ ] Cotas (ancho/profundidad/altura) funcionan
- [ ] Export PNG/SVG funciona (botones en pestaña ISO)
- [ ] isoZ de accesorios sigue cambiando su posición en profundidad
- [ ] Sin regresiones en otras pestañas (CAD, Cableado, Ficha, Portada, Comparador)

- [ ] **Step 2: Check git diff for unintended changes outside drawISO()**

```bash
git diff HEAD~4 zkteco_v35_optimized.html | grep "^+" | grep -v "^+++" | grep -v "drawISO\|basePlate\|cabinet\|accPanel\|cables\|1742\|1829"
```

Expected: no output (all changes confined to drawISO function).

- [ ] **Step 3: Final commit and push**

```bash
git add zkteco_v35_optimized.html
git commit -m "feat(iso): complete CAD-detail isometric view - floor plate, realistic cabinets, cables"
git push -u origin claude/check-agent-status-ab8E3
```
