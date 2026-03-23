# MyApplication

Repositorio con dos componentes independientes:

1. **ZKTeco SpeedGate CAD** — herramienta web de diseño de instalaciones de tornos de acceso
2. **Ejemplos de Agentes Claude** — demostraciones de la API de Anthropic y el Claude Agent SDK

---

## 1. ZKTeco SpeedGate CAD

**Archivo:** `zkteco_v35_optimized.html`

Herramienta de ingeniería single-file (sin dependencias externas) para diseñar, documentar y exportar instalaciones de tornos de acceso ZKTeco SpeedGate. Funciona directamente en el navegador, sin instalación ni servidor.

### Inicio rápido

Abre `zkteco_v35_optimized.html` en cualquier navegador moderno (Chrome, Firefox, Edge, Safari). No requiere conexión a internet para funcionar, salvo el QR de portada.

### Modelos soportados

| Modelo | Descripción |
|--------|-------------|
| **SBTL-8000** | Torno de brazos retráctiles, perfil premium |
| **Comet** | Torno compacto de media altura |
| **Mars** | Torno de alta seguridad |
| **Mars S100** | Variante Mars con módulo biométrico integrado |

### Interfaz — Pestañas principales

#### Plano CAD (`cv`)
Vista superior + alzado frontal a escala con cotas.

- **Selector de modelo** — cambia el modelo de torno (cabecera)
- **Pasillos** — ajusta de 1 a 6 pasillos con botones `−` / `+`
- **Anchura libre** — selecciona el ancho de paso por pasillo (según catálogo del modelo)
- **Hoja** — selecciona el tipo de hoja abatible por pasillo
- **Límite de sitio** — introduce el ancho máximo disponible en mm; el sistema alerta si la instalación lo supera (amarillo = cerca, rojo = excedido)
- **Longitud de corredor** — introduce la longitud de la instalación en metros para calcular la estimación de cable
- **Accesorios** — añade columnas o mamparas en el lado izquierdo y derecho (hasta 4 por lado)
- **Exportar** — descarga la vista actual como SVG o PNG
- **Espejo** — intercambia los accesorios de lado izquierdo y derecho

**Indicadores visuales:**
- Símbolo ♿ en pasillos con ancho libre ≥ 900 mm (accesibilidad PMR)
- Marca de tornillo de anclaje en planta
- Indicador de canalización PVC (diámetro automático según número de pasillos)

#### Vista 3D isométrica (`iso`)
Proyección isométrica de la instalación completa.

- Accesorios posicionables en profundidad: **Frente / Centro / Fondo**
  - El botón de posición aparece en cada accesorio de la barra lateral
  - Afecta a la coordenada Z en la proyección isométrica
- Cotas de anchura total, profundidad y altura
- Panel de vidrio en accesorios R40/R50

#### Diagrama de cableado (`wiring`)
Esquema de conexionado eléctrico de la instalación:

- Línea de alimentación AC y derivaciones por gabinete
- Cadena de comunicaciones Maestro → Esclavo → Extremo
- Indicador de tipo y diámetro de canalización PVC
- Leyenda de tipos de cable

#### Ficha técnica (`ficha`)
Tabla de especificaciones del modelo seleccionado: dimensiones, consumo, velocidad, temperatura de operación, IP, etc.

#### Lista de materiales (`bom`)
BOM generado automáticamente con:

- Gabinetes (extremo + centrales)
- Hojas abatibles (agrupadas por referencia)
- Accesorios
- Canalización PVC
- Cables

**Exportación:**
- `⬇ CSV` — archivo separado por comas
- `⬇ XLS` — XML Spreadsheet compatible con Microsoft Excel
- `🖨 Imprimir` — impresión directa

#### Portada (`cover`)
Portada de proyecto exportable con:

- Datos del cliente y proyecto (empresa, dirección, referencia, autor, revisor, fecha, versión)
- Tabla de pasillos con ancho y tipo de hoja
- Resumen de accesorios
- Cuadro de firmas (Elaborado / Revisado / Fecha / Revisión)
- **Código QR** con datos del proyecto (requiere conexión a internet)

#### Comparador (`comp`)
Tabla comparativa de todos los modelos disponibles: dimensiones, consumo, velocidad, número de pernos, etc. El modelo activo se resalta.

#### Mis Proyectos (`proj`)
Gestión de proyectos guardados en el navegador (localStorage):

- Guarda hasta 10 proyectos con nombre personalizado
- Vista de miniatura esquemática de cada configuración
- Carga o elimina proyectos individualmente

### Exportación

| Formato | Contenido | Función |
|---------|-----------|---------|
| SVG | Página actual (CAD / cableado / ficha / portada) | `Exportar → SVG` |
| PNG | Página actual a 2× resolución | `Exportar → PNG` |
| PNG (proyecto completo) | Todas las páginas concatenadas | Botón exportar proyecto |
| DXF | Plano CAD para AutoCAD / BricsCAD | `Exportar → DXF` |
| JSON | Estado completo del proyecto | `Guardar proyecto` |
| CSV | Lista de materiales | `BOM → ⬇ CSV` |
| XLS | Lista de materiales (Excel) | `BOM → ⬇ XLS` |

### Accesorios disponibles

| Código | Descripción | Ancho |
|--------|-------------|-------|
| R10 | Columna simple | 500 mm |
| R20 | Columna doble | 700 mm |
| R30 | Mampara sin vidrio | 600 mm |
| R40 | Mampara con vidrio fijo | 750 mm |
| R50 | Mampara con vidrio configurable | 920–1500 mm (personalizable) |

El accesorio R50 permite ajustar el ancho y alto del panel de vidrio dentro de rangos definidos.

### Presets rápidos

| Preset | Configuración |
|--------|--------------|
| Standard 2×660 | 2 pasillos, 660 mm, sbtl8000 |
| Accessible 1×900 | 1 pasillo, 900 mm (PMR) |
| Mix 660+900+660 | 3 pasillos mixtos |
| XL 2×1200 | 2 pasillos extra anchos |
| Dense 4×660 | 4 pasillos compactos |

### Compartir configuración

El botón **Compartir** genera una URL con la configuración codificada en el hash. Al abrir la URL en otro navegador se restaura automáticamente el estado.

### Persistencia y guardado

- **Auto-guardado** en `localStorage` al modificar cualquier parámetro
- **Importar JSON** — carga un proyecto exportado previamente
- **Mis Proyectos** — hasta 10 proyectos con nombre en el navegador

### Historial de acciones

El panel bajo los controles muestra las últimas acciones registradas (`↺ N cambios`). Cada acción de la barra de herramientas lleva etiqueta (modelo / anchura / hoja / ±pasillo / ±accesorio / espejo / preset).

- `Ctrl+Z` / `Cmd+Z` — deshacer
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` — rehacer

### Idiomas

Trilingüe con selector en cabecera: **Español · English · Português · Français · Deutsch**

### Tests de regresión

`zkteco_tests.html` — suite de pruebas automatizadas que carga la aplicación en un iframe y verifica:

- Modelos y estructura de datos
- Claves de i18n en los 5 idiomas
- Cálculos de dimensiones
- Renderizado de plano CAD, vista ISO y BOM
- Undo/Redo
- Presets
- Auto-guardado (incluye `siteLen` e `isoZ`)

Abre `zkteco_tests.html` directamente en el navegador. Los resultados se muestran con indicadores PASS / FAIL / WARN.

---

## 2. Ejemplos de Agentes Claude

**Archivos:** `agent_api.py`, `agent_sdk.py`

Demostraciones de cómo construir agentes IA con la API de Anthropic y el Claude Agent SDK.

### Setup

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY="your-api-key"
```

### `agent_api.py` — API de Anthropic directa

```bash
python agent_api.py
```

Ejemplos incluidos:

- **Math agent** — agente con herramientas propias (`add`, `multiply`) y runner automático de tool calls
- **Weather agent** — loop agentico manual con función de clima simulada
- **Streaming agent** — respuestas en streaming con `thinking` adaptativo

### `agent_sdk.py` — Claude Agent SDK

```bash
python agent_sdk.py
```

Ejemplos incluidos:

- **Code analysis agent** — análisis de código con herramientas integradas (Read, Glob, Grep)
- **Subagent example** — agente principal que lanza un subagente revisor especializado
- **PostToolUse hooks** — monitorización de cada tool call mediante hooks
- **Session ID capture** — captura del ID de sesión para reanudación posterior
- **ClaudeSDKClient** — control completo del ciclo de vida del agente

### ¿Cuál usar?

| Escenario | Fichero |
|-----------|---------|
| Herramientas propias con lógica personalizada | `agent_api.py` |
| Acceso a ficheros, web y terminal | `agent_sdk.py` |
| Control máximo sobre el loop | `agent_api.py` |
| Permisos y seguridad integrados | `agent_sdk.py` |
| Subagentes especializados | `agent_sdk.py` |

---

## Estructura del repositorio

```
MyApplication/
├── zkteco_v35_optimized.html   # Herramienta CAD (single-file)
├── zkteco_tests.html           # Tests de regresión de la herramienta CAD
├── agent_api.py                # Ejemplos API Anthropic directa
├── agent_sdk.py                # Ejemplos Claude Agent SDK
├── requirements.txt            # Dependencias Python
└── CLAUDE.md                   # Instrucciones del proyecto para Claude Code
```
