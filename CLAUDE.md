# CLAUDE.md — MyApplication

## Proyecto

Repositorio mixto con dos componentes:
1. **ZKTeco SpeedGate CAD** (`zkteco_v35_optimized.html`) — Herramienta web single-file para diseño de instalaciones de tornos de acceso. Plano CAD, cableado, ficha técnica y portada exportables. Trilingüe (ES/EN/PT), auto-guardado en LocalStorage.
2. **Ejemplos de Agentes Claude** (`agent_api.py`, `agent_sdk.py`) — Demostraciones de la API de Anthropic y el Claude Agent SDK: herramientas, subagentes, hooks, sesiones.

**Stack:** HTML/CSS/JS vanilla, Python 3.11+, `anthropic`, `claude-agent-sdk`, `anyio`.
**Rama activa:** `claude/check-agent-status-ab8E3`

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
- Rama de desarrollo: `claude/check-agent-status-ab8E3`
- Commits descriptivos (ES o EN) con lista de cambios en el body
- Nunca push a `main`/`master` sin confirmación del usuario

### HTML (`zkteco_v35_optimized.html`)
- **Archivo único self-contained** — no crear archivos JS/CSS separados
- CSS minificado en `<style>` (líneas 3–135)
- Todo texto visible usa `T('clave')` del objeto `I18N`; los tres idiomas deben tener todas las claves
- `updateI18nDOM()` gestiona elementos `data-t` y mapa de IDs (línea 409)
- Espaciado: múltiplos de 4px. Tipografía mínima: 9px etiquetas, 10px contenido

### Python (`agent_api.py`, `agent_sdk.py`)
- Sin dependencias fuera de `requirements.txt`
- Async/await con `anyio`; type hints en todas las funciones

---

## Archivos Críticos

| Archivo | Descripción | Líneas clave |
|---------|-------------|--------------|
| `zkteco_v35_optimized.html` | App CAD completa (single-file) | CSS: 3–135, I18N: 296–405, UI JS: 1218–1245 |
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
5. COMMIT+PUSH → mensaje descriptivo → claude/check-agent-status-ab8E3
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
