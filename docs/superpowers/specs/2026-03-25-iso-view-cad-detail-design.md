# Spec: Vista Isométrica CAD Detallada

**Fecha:** 2026-03-25
**Archivo afectado:** `zkteco_v35_optimized.html` — líneas 1742–1829 (`drawISO()`)
**Rama:** `claude/check-agent-status-ab8E3`

---

## Objetivo

Mejorar la función `drawISO()` para que genere una vista isométrica SVG de aspecto técnico-realista, similar a las capturas del manual del modelo Comet, mostrando los cuerpos físicos reales de los gabinetes speedgate con nivel de detalle CAD.

---

## Decisiones de diseño

| Pregunta | Decisión |
|----------|----------|
| Nivel de detalle | Opción C — CAD técnico detallado |
| Cables | Siempre visibles en TODOS los gabinetes (incluyendo centrales), independientes de accesorios |
| Sensores/LEDs | Fijos/decorativos en cara frontal, no cambian con configuración |
| Base plate | Cubre TWtotal (gabinetes + accesorios ambos lados) |
| Accesorios | Mismo tratamiento visual que gabinetes (gris + rail ámbar) |

---

## Arquitectura

`drawISO()` se reescribe con helpers locales (funciones internas, closures). Todos usan las variables de cierre `sc`, `ox`, `oy`, `pt`, `pp`, `box` definidas al inicio de `drawISO()`.

```
drawISO()
├── pt(x,y,z)          — proyección isométrica (sin cambios)
├── pp(pts)            — serializa puntos SVG (sin cambios)
├── box(x0,z0,bw,bd,bh,col,al) — caja genérica 3 caras (sin cambios)
│
├── basePlate()        — NUEVO: sin parámetros, usa closure TWtotal, depthZ
├── cabinet(x0,z0,bW,bD,bH,modelColor,wireOff) — NUEVO
├── accPanel(x0,z0,bW,bD,bH,hasGlass,gW,gH)   — NUEVO
└── cables(x0,bW,bH)   — NUEVO: llamado en loop por cada gabinete
```

### Orden de renderizado SVG

1. Fondo rect + borde + etiquetas de texto
2. `basePlate()` — debe renderizarse primero (capa inferior)
3. Accesorios LEFT: `accPanel()` × `accLeft.length` (de izquierda a derecha)
4. Gabinetes + pasillos: `cabinet()` × (n+1) alternando con lane gap polygons
5. Accesorios RIGHT: `accPanel()` × `accRight.length`
6. Cables: `cables()` × (n+1), una llamada por cada gabinete — renderizados DESPUÉS de todos los sólidos para quedar visibles encima
7. Líneas de cota (ancho, profundidad, altura) — sin cambios respecto a código actual

---

## Especificación de helpers

### `basePlate()`
- **Sin parámetros** — usa variables de cierre: `TWtotal`, `depthZ`, `sc`, `ox`, `oy`
- Caja plana de **40mm de altura física** (Y-axis), renderizada como `bh=40` en `box()`
- Posición: `x0=0`, `z0=0`, `bw=TWtotal`, `bd=depthZ`
- Color base: gris medio `#a8a8a8`, opacidad `1.0`
- Sobre la cara superior (top polygon del box): 4 pernos elípticos en esquinas, `rx=4, ry=2`, fill `#666`, opacity `.5`
- Nota: el auto-scale absorbe los 40mm extra de altura automáticamente vía la fórmula `projH` existente

### `cabinet(x0, z0, bW, bD, bH, modelColor, wireOff)`
- **Cuerpo principal**: `box(x0, z0, bW, bD, bH, '#dcdce4', 0.95)` — gris claro, 3 caras
- **Rail superior** (~60mm físicos): franja adicional superpuesta sobre el top y cara frontal del gabinete
  - Cara frontal del rail: polygon `[pt(x0,bH-60,z0), pt(x0+bW,bH-60,z0), pt(x0+bW,bH,z0), pt(x0,bH,z0)]`, fill `modelColor`, opacity `.95`
  - Cara superior del rail: top polygon de `box()` de altura 60 (ya incluido en el body box, pero con overlay de color del modelo a opacity `.85`)
  - Cara lateral del rail: polygon derecho equivalente, fill `modelColor`, opacity `.75`
- **Ranuras verticales** en cara frontal: 2 líneas finas `stroke="#999"` a `x0+bW*0.3` y `x0+bW*0.7`, desde `y=10` hasta `y=bH-70`
- **Panel de cristal**: rectángulo centrado en cara frontal
  - `gX = x0 + bW*0.15`, `gZ = z0`, ancho `bW*0.7`, alto `bH*0.65` (desde `y=30` hasta `y=bH-80`)
  - Fill `#88ccff`, opacity `.30`; stroke `#5599cc` width `.9`
  - Reflejo: franja izquierda del cristal, ancho `bW*0.08`, fill `#fff`, opacity `.15`
- **Sensores LED** en cara frontal izquierda (`x0+bW*0.08`, fijos):
  - Naranja `#ff8800`, `cy = bH*0.45`, radio 2.5
  - Verde `#22cc22`, `cy = bH*0.55`, radio 2.5
- **Punto de cableado** (existente): círculo `#1a5fa0` en posición `wireOff` pasado como parámetro
  - Para gabinete izquierdo (i=0): `wireOff = sp.wireOff`
  - Para gabinete derecho (i=n): `wireOff = sp.W - sp.wireOff`
  - Para gabinetes centrales: no se renderiza punto de cableado

### `accPanel(x0, z0, bW, bD, bH, hasGlass, gW, gH)`
- **Cuerpo principal**: `box(x0, z0, bW, bD, bH, '#dcdce4', 0.95)` — igual que cabinet
- **Rail superior** (~60mm): igual que en `cabinet()` pero con `modelColor = '#c08800'` (ámbar fijo)
- **Sin sensores LED**, sin punto de cableado
- Si `hasGlass=true`:
  - `gW` y `gH` vienen de `ACC_BY_CODE[itm.code].gW/.gH`, o bien de `itm.r50gW/itm.r50gH` con fallbacks `920`/`600` si `acat.customGlass=true`
  - Panel cristal centrado: `gX = x0+(bW-gW)/2`, `gZ = z0+20`
  - Polygon frontal: `[pt(gX,0,gZ), pt(gX+gW,0,gZ), pt(gX+gW,gH,gZ), pt(gX,gH,gZ)]`
  - Fill `#88ccff`, opacity `.35`; stroke `#5599cc` width `.8`

### `cables(x0, bW, bH)`
- Llamado **por cada gabinete** (loop `for i=0..n`), con `x0=cx` (posición X acumulada del gabinete actual)
- 3 cables desde la base frontal del gabinete (`z0=0`, `y=0`):
  - Rojo `#e60000` en `x0 + bW*0.35`
  - Azul `#0055cc` en `x0 + bW*0.45`
  - Verde-amarillo `#aaaa00` en `x0 + bW*0.55`
- Cada cable: `<path>` SVG con curva cuadrática
  - Punto inicio: `pt(xCable, 0, 0)` (base frontal del gabinete)
  - Control point: `(sx, sy+20)`
  - Punto final: `(sx+5, sy+35)` en coordenadas SVG
  - `stroke-width="1.3"`, `fill="none"`
- Siempre visibles en todos los gabinetes (end y central)

---

## Variables de cierre disponibles en drawISO()

Los helpers acceden a estas variables del scope de `drawISO()` sin parámetros explícitos:

```js
const sp = MODELS[M];
const n = N();               // número de pasillos
const TWtotal = TWfull();
const depthZ = sp.D;
const sc;                    // factor de escala calculado
const ox, oy;                // offset de proyección
const pt, pp, box;           // helpers básicos ya definidos
```

---

## Compatibilidad

- **Sin nuevas claves I18N**
- **Sin cambios en `MODELS`** ni `ACC_CAT`
- **Sin cambios en otras funciones** (`drawCAD`, `drawWiring`, `ui`, `autoSave`, etc.)
- **`isoZ` de accesorios** se mantiene: controla posición Z (`accZ`) en `accPanel()`
- **Exportación PNG/SVG** sin cambios (mismo elemento `#isosvg`)
- **Auto-scale**: la fórmula `projH = MAXH + (TWtotal+depthZ)*0.5` absorbe los 40mm de la base plate porque `MAXH = Math.max(sp.H, ...)` es significativamente mayor que 40

---

## Archivos afectados

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `zkteco_v35_optimized.html` | 1742–1829 | Reemplazar `drawISO()` completamente |

---

## Criterios de aceptación

- [ ] La base plate gris cubre el ancho total de la instalación (TWtotal) y la profundidad completa
- [ ] La base plate tiene pernos de anclaje visibles en sus esquinas superiores
- [ ] Cada gabinete tiene cuerpo gris + rail superior en color del modelo activo
- [ ] Cada gabinete tiene ranuras verticales en cara frontal
- [ ] Cada gabinete tiene panel de cristal translúcido centrado con reflejo lateral
- [ ] Cada gabinete tiene 2 sensores LED fijos (naranja + verde) en cara frontal izquierda
- [ ] Los gabinetes extremos (izquierdo y derecho) tienen punto de cableado azul en su posición `wireOff`
- [ ] 3 cables de color (rojo, azul, verde-amarillo) salen de la base de TODOS los gabinetes
- [ ] Los accesorios tienen cuerpo gris + rail ámbar, igual tratamiento visual que gabinetes
- [ ] Los accesorios con cristal (`hasGlass=true`) muestran panel translúcido
- [ ] Las líneas de cota (ancho, profundidad, altura) siguen funcionando correctamente
- [ ] El export PNG/SVG sigue funcionando
- [ ] El parámetro `isoZ` de accesorios sigue controlando profundidad Z
- [ ] No hay regresiones visibles en otras pestañas (CAD, cableado, ficha, portada)
- [ ] La vista se adapta correctamente a 1, 2 y 3 pasillos
- [ ] La vista se adapta correctamente con 0, 1, 2, 3 y 4 accesorios por lado
