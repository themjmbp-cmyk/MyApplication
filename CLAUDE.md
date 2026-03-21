# CLAUDE.md — MyApplication

## Proyecto

Repositorio mixto con dos componentes principales:

1. **ZKTeco SpeedGate CAD** (`zkteco_v35_optimized.html`) — Herramienta web single-file para diseño y documentación de instalaciones de tornos de acceso. Incluye plano CAD, diagrama de cableado, ficha técnica y portada exportables. Trilingüe (ES/EN/PT), auto-guardado en LocalStorage.

2. **Ejemplos de Agentes Claude** (`agent_api.py`, `agent_sdk.py`) — Demostraciones de la API de Anthropic y el Claude Agent SDK: agentes con herramientas, subagentes, hooks, sesiones.

**Stack:** HTML/CSS/JS vanilla (sin dependencias externas), Python 3.11+, `anthropic`, `claude-agent-sdk`, `anyio`.

**Rama de desarrollo activa:** `claude/check-agent-status-ab8E3`

---

## Equipo de Agentes — Roles y Colaboración

Claude Code usa un equipo de agentes especializados que trabajan en paralelo y reportan resultados al agente coordinador. **Siempre lanza agentes en paralelo cuando las tareas son independientes.**

### Roles del equipo

| Agente | Tipo | Responsabilidad |
|--------|------|-----------------|
| **Explorador** | `Explore` | Lectura de código, búsqueda de patrones, análisis de estructura. Solo lectura — nunca modifica archivos. |
| **Planificador** | `Plan` | Diseño de implementaciones, análisis de trade-offs, identificación de archivos críticos. |
| **Investigador** | `general-purpose` | Búsquedas web, documentación externa, información actualizada. |
| **Ejecutor** | agente principal | Aplica los cambios al código basándose en los reportes del equipo. |

### Protocolo de colaboración

**Cuándo lanzar múltiples agentes en paralelo:**
- Análisis de código en diferentes áreas del proyecto → lanzar 2–3 `Explore` simultáneos
- Investigación + exploración de código → `Explore` + `general-purpose` en paralelo
- Tareas independientes en archivos distintos → un agente por área

**Cuándo usar un solo agente:**
- Búsquedas dirigidas a un archivo concreto conocido
- Cambios de 1–3 líneas sin contexto adicional necesario

**Formato de reporte esperado de los agentes:**
Cada agente debe terminar su respuesta con un resumen estructurado:
```
## Hallazgos
- [hallazgo 1 con número de línea si aplica]
- [hallazgo 2]

## Archivos críticos
- path/to/file.ext:línea — descripción

## Recomendación
[acción concreta propuesta]
```

### Reglas de coordinación

1. **El agente principal nunca duplica trabajo** que un subagente ya está haciendo.
2. **Los subagentes `Explore` no editan archivos** — solo investigan y reportan.
3. **El agente `Plan` propone**, el agente principal decide y ejecuta.
4. **Prioridad de paralelismo:** si 3 tareas son independientes → 1 mensaje con 3 llamadas al Agent tool.
5. **Contexto completo:** cada subagente recibe en su prompt todo el contexto necesario (rutas, líneas de código relevantes, objetivo).

---

## Convenciones del Proyecto

### Git
- Rama principal de desarrollo: `claude/check-agent-status-ab8E3`
- Commits descriptivos en español o inglés, con lista de cambios en el body
- Nunca hacer push a `main`/`master` sin confirmación explícita del usuario

### HTML (`zkteco_v35_optimized.html`)
- **Archivo único self-contained** — no crear archivos JS/CSS separados
- CSS minificado en el bloque `<style>` (líneas 3–135)
- Toda cadena de texto visible al usuario debe usar `T('clave')` del objeto `I18N`
- Los tres idiomas (ES, EN, PT) deben tener todas las claves al añadir una nueva
- `updateI18nDOM()` gestiona los elementos con `data-t` y el mapa de IDs en línea 409
- Escala de espaciado base: múltiplos de 4px
- Tipografía mínima: 9px en etiquetas, 10px en contenido

### Python (`agent_api.py`, `agent_sdk.py`)
- Sin dependencias externas más allá de `requirements.txt`
- Async/await con `anyio`
- Type hints en todas las funciones

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

Para cualquier tarea no trivial (>1 archivo o >10 líneas):

```
1. EXPLORACIÓN PARALELA
   → Lanzar 1–3 agentes Explore para entender el código afectado
   → Lanzar agente Plan si hay decisiones de arquitectura

2. SÍNTESIS
   → Agente principal consolida hallazgos de los subagentes
   → Identifica riesgos y dependencias

3. IMPLEMENTACIÓN
   → Agente principal aplica los cambios (Edit/Write)
   → Cambios mínimos necesarios, sin gold-plating

4. VERIFICACIÓN
   → Confirmar que no hay strings sin traducir
   → Confirmar que CSS nuevo usa escala de 4px
   → git diff para revisar el conjunto de cambios

5. COMMIT Y PUSH
   → Commit con mensaje descriptivo
   → Push a claude/check-agent-status-ab8E3
```

---

## Notas de Arquitectura (ZKTeco CAD)

- **`T(key)`** — función de traducción. Fallback: idioma actual → ES → key literal
- **`ui()`** — función central de render de controles. Llamar tras cualquier cambio de estado
- **`drawCAD()`** — redibuja el SVG del plano. Llamar tras cambios de modelo/pasillos/accesorios
- **`autoSave()`** — persiste estado en `localStorage`. Se llama al final de `ui()`
- **`MAX_ACC_PER_SIDE = 4`** — límite hard de accesorios por lado. Validado en `addAcc()`
- **`MODELS`** — objeto con todos los modelos de tornos y sus parámetros físicos
- **`ACC_CAT`** / **`ACC_BY_CODE`** — catálogo de accesorios (R10–R50) y lookup por código
