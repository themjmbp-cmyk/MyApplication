# CLAUDE.md — MyApplication

## Proyecto

Repositorio mixto con dos componentes:
1. **ZKTeco SpeedGate CAD** (`zkteco_v35_optimized.html`) — Herramienta web single-file para diseño de instalaciones de tornos de acceso. Plano CAD, cableado, ficha técnica y portada exportables. Trilingüe (ES/EN/PT), auto-guardado en LocalStorage.
2. **Ejemplos de Agentes Claude** (`agent_api.py`, `agent_sdk.py`) — Demostraciones de la API de Anthropic y el Claude Agent SDK: herramientas, subagentes, hooks, sesiones.

**Stack:** HTML/CSS/JS vanilla, Python 3.11+, `anthropic`, `claude-agent-sdk`, `anyio`.
**Rama activa:** `claude/add-context-docs-pUJKb`

---

## Agentes

- **Explore** → solo lectura (código, patrones, estructura). Lanzar 2–3 en paralelo para tareas multi-área.
- **Plan** → diseño de implementaciones. Propone; el agente principal ejecuta.
- **general-purpose** → investigación web/docs externos.
- **Ejecutor** (agente principal) → aplica cambios. Nunca duplica trabajo de subagentes.

**Reglas:** (1) Paralelo si ≥2 tareas independientes → 1 mensaje, múltiples Agent calls. (2) Explore: nunca edita. (3) Plan: propone, principal ejecuta. (4) Cada subagente recibe contexto completo (rutas, líneas, objetivo). (5) Formato de reporte: Hallazgos / Archivos críticos / Recomendación.

---

## Convenciones del Proyecto

### Git
- Rama de desarrollo: `claude/add-context-docs-pUJKb`
- Commits descriptivos (ES o EN) con lista de cambios en el body
- Nunca push a `main`/`master` sin confirmación del usuario

### Código fuente (`src/`)
- Editar archivos en `src/` → ejecutar `python build.py` para regenerar `zkteco_v35_optimized.html`
- `src/template.html` — shell HTML con placeholders `/*%%CSS%%*/` y `//%%JS%%`
- `src/css/main.css` — CSS de la aplicación (200 líneas)
- `src/js/NN-name.js` — módulos JS en orden numérico, concatenados en ese orden

| Archivo JS | Contenido |
|------------|-----------|
| `01-catalog.js` | GAP_MM, MAX_ACC_PER_SIDE, ACC_CAT, helpers |
| `02-i18n.js` | I18N (5 idiomas), T(), setLang(), updateI18nDOM() |
| `03-models.js` | pvcSize, MODELS, MK, state vars, model helpers |
| `04-acc-ui.js` | renderAccBar, renderAccSide, addAcc, removeAcc |
| `05-app-core.js` | alerts, setPage, autoSave, save/load, export |
| `06-svg-helpers.js` | tickDim, DV, gnd, makeDefs, drawUG, drawAccPlan/Elev |
| `07-draw-cad.js` | drawCAD() |
| `08-draw-wiring.js` | drawWiring() |
| `09-draw-canal.js` | drawCanal() |
| `10-draw-ficha.js` | accSideHtml, drawFicha(), drawFichaSVG() |
| `11-draw-cover.js` | drawCover() |
| `12-ui.js` | ui() |
| `13-projects.js` | getProjects, openProjects, modal functions |
| `14-draw-iso.js` | drawISO() |
| `15-draw-isowf.js` | drawISOWF() |
| `16-draw-comp.js` | drawComparator() |
| `17-utils.js` | showToast, toggleTheme, undo/redo, shareURL |
| `18-dxf-bom.js` | applyPreset, mirrorConfig, DXF, drawBOM, exportBOM |
| `19-init.js` | cable est, proj thumbnail, PWA, tab drag-drop, init |

- El HTML final (`zkteco_v35_optimized.html`) sigue siendo self-contained (single-file deployable)
- Todo texto visible usa `T('clave')` del objeto `I18N`; los 5 idiomas (ES/EN/PT/FR/DE) deben tener todas las claves
- `updateI18nDOM()` gestiona elementos `data-t` y mapa de IDs (`02-i18n.js`)
- Espaciado: múltiplos de 4px. Tipografía mínima: 9px etiquetas, 10px contenido

### Python (`agent_api.py`, `agent_sdk.py`)
- Sin dependencias fuera de `requirements.txt`
- Async/await con `anyio`; type hints en todas las funciones

---

## Archivos Críticos

| Archivo | Descripción | Líneas clave |
|---------|-------------|--------------|
| `zkteco_v35_optimized.html` | App CAD completa — generada por `build.py` | Editar en `src/` |
| `src/js/02-i18n.js` | I18N (5 idiomas) + T() + setLang() | 282 líneas |
| `src/js/03-models.js` | MODELS (4 modelos) + state vars | 26 líneas |
| `src/js/16-draw-comp.js` | drawComparator() con sección FEATURES | 66 líneas |
| `build.py` | Ensambla src/ → HTML | ejecutar tras editar src/ |
| `agent_sdk.py` | Ejemplos Claude Agent SDK | `run_subagent_example()`: línea 35 |
| `agent_api.py` | Ejemplos Anthropic API directa | — |
| `/root/.claude/settings.json` | Config global de Claude Code | Permisos y hooks |

---

## Flujo de Trabajo Estándar

Para tareas >1 archivo o >10 líneas:

```
1. EXPLORAR (paralelo) → 1–3 Explore + Plan si hay decisiones de arquitectura
2. SINTETIZAR → consolidar hallazgos, identificar riesgos y dependencias
3. IMPLEMENTAR → Edit/Write, cambios mínimos sin gold-plating
4. VERIFICAR → strings traducidos, CSS en 4px, git diff
5. BUILD → `python build.py` para regenerar el HTML deployable
6. COMMIT+PUSH → mensaje descriptivo → claude/add-context-docs-pUJKb
```

---

## Notas de Arquitectura (ZKTeco CAD)

- **`T(key)`** — traducción con fallback: idioma actual → ES → key literal
- **`ui()`** — render central de controles. Llamar tras cualquier cambio de estado
- **`drawCAD()`** — redibuja SVG del plano. Llamar tras cambios de modelo/pasillos/accesorios
- **`autoSave()`** — persiste en `localStorage`. Se llama al final de `ui()`
- **`MAX_ACC_PER_SIDE = 4`** — límite hard de accesorios por lado. Validado en `addAcc()`
- **`MODELS`** — todos los modelos de tornos con parámetros físicos
- **`ACC_CAT`** / **`ACC_BY_CODE`** — catálogo de accesorios (R10–R50) y lookup por código
