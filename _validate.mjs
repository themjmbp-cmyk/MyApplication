/**
 * Validation script: verifies MODELS, I18N and drawComparator() output.
 * Run: node _validate.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, 'src/js');
const read = name => readFileSync(join(SRC, name), 'utf-8');

// ── Minimal browser shim ──────────────────────────────────────────────────────
let svgOutput = '';
const mockEl = {
  setAttribute: () => {},
  style: {},
  classList: { toggle: () => {}, contains: () => false, add: () => {}, remove: () => {} },
  dataset: {},
  get innerHTML() { return svgOutput; },
  set innerHTML(v) { svgOutput = v; }
};
const doc = {
  getElementById: () => mockEl,
  querySelectorAll: () => [],  // empty NodeList
  querySelector: () => mockEl,
};

// ── Build and evaluate all needed modules with one Function() call ────────────
// Stub out DOM-dependent functions called by setLang/updateI18nDOM
const stubs = `
function renderAccBar(){}
function drawCAD(){}
function drawWiring(){}
function drawFicha(){}
function drawCover(){}
function redrawPage(){}
`;

const code =
  `const FM='font-family="monospace"';\n` +
  read('01-catalog.js') + '\n' +
  read('02-i18n.js')    + '\n' +
  read('03-models.js')  + '\n' +
  stubs + '\n' +
  read('16-draw-comp.js') + '\n' +
  `return { MODELS, MK, I18N, T, setLang, drawComparator };`;

let MODELS, MK, I18N, T, setLang, drawComparator;
try {
  const fn = new Function('document', code);
  ({ MODELS, MK, I18N, T, setLang, drawComparator } = fn(doc));
} catch(e) {
  console.error('Evaluation failed:', e.message);
  process.exit(1);
}

// ── Test harness ─────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
function ok(lbl)       { console.log(`  ✓ ${lbl}`); pass++; }
function err(lbl, inf) { console.error(`  ✗ ${lbl}${inf ? ' — ' + inf : ''}`); fail++; }
function section(t)    { console.log(`\n${t}`); }

// ── 1. MODELS fields ─────────────────────────────────────────────────────────
section('1. MODELS — corrected + new fields');
const expected = {
  sbtl8000:  { tempRange:'-20°C ~ +70°C', openSpeed:'0.3–0.6 s', consumption:'120VA', D:1613,
                irSensors:'12 p', flowRate:'35 p/min', mcbf:'10 M', noise:'< 60 dB',
                antiPinch:true, antiTail:true,  antiPanic:true, freePass:true, fireInt:true },
  comet:     { tempRange:'-28°C ~ +60°C', openSpeed:'0.8–3 s',   consumption:'120W', D:1500,
                irSensors:'8 p',  flowRate:'25 p/min', mcbf:'6 M',  noise:'< 60 dB',
                antiPinch:true, antiTail:true,  antiPanic:true, freePass:true, fireInt:true },
  mars:      { tempRange:'-25°C ~ +65°C', openSpeed:'0.6 s',     consumption:'100W', D:1355,
                irSensors:'16 p', flowRate:'30 p/min', mcbf:'10 M', noise:'< 60 dB',
                antiPinch:true, antiTail:true,  antiPanic:true, freePass:true, fireInt:true },
  mars_s100: { tempRange:'-20°C ~ +70°C', openSpeed:'0.8 s',     consumption:'50VA', D:600,
                irSensors:'4 p',  flowRate:'30 p/min', mcbf:'5 M',  noise:'< 60 dB',
                antiPinch:true, antiTail:false, antiPanic:true, freePass:true, fireInt:true },
};
for (const [key, exp] of Object.entries(expected)) {
  const m = MODELS[key];
  if (!m) { err(`MODELS['${key}'] exists`); continue; }
  for (const [field, val] of Object.entries(exp)) {
    if (m[field] === val) ok(`${key}.${field} = ${JSON.stringify(val)}`);
    else err(`${key}.${field}`, `expected ${JSON.stringify(val)}, got ${JSON.stringify(m[field])}`);
  }
}

// ── 2. I18N completeness ─────────────────────────────────────────────────────
section('2. I18N — all comp* keys in 5 languages');
const compKeys = ['compW','compD','compH','compCons','compSpeed','compTemp','compPower','compActive',
  'compIrSensors','compFlowRate','compMcbf','compNoise',
  'compAntiPinch','compAntiTail','compAntiPanic','compFreePass','compFireInt'];
for (const lang of ['es','en','pt','fr','de']) {
  const missing = compKeys.filter(k => !I18N[lang]?.[k]);
  if (missing.length === 0) ok(`${lang}: all ${compKeys.length} keys present`);
  else err(`${lang}: missing`, missing.join(', '));
}

section('3. I18N — spot-check translations');
const spots = [
  ['es','compFreePass','Paso libre (power-off)'],
  ['en','compFeatures','FEATURES'],
  ['fr','compAntiTail','Anti-tailgating'],
  ['de','compFreePass','Freier Durchgang (Stromausfall)'],
  ['pt','compAntiPanic','Embreagem anti-pânico'],
];
for (const [lang, key, val] of spots) {
  const got = I18N[lang]?.[key];
  if (got === val) ok(`${lang}.${key} = "${val}"`);
  else err(`${lang}.${key}`, `expected "${val}", got "${got}"`);
}

// ── 3. drawComparator() SVG ───────────────────────────────────────────────────
section('4. drawComparator() — SVG output (lang=es)');
setLang('es');
svgOutput = '';
try { drawComparator(); } catch(e) { err('drawComparator() runtime error', e.message); }
const svgES = svgOutput;

if (svgES.length > 100) ok(`SVG generated (${svgES.length} chars)`);
else err('SVG generated');

// Feature labels in ES
['Sensores IR','Flujo (p/min)','MCBF','Nivel de ruido',
 'Anti-atrapamiento','Anti-intrusión','Embrague anti-pánico',
 'Paso libre (power-off)','Alarma incendio'].forEach(lbl => {
  if (svgES.includes(lbl)) ok(`label: "${lbl}"`);
  else err(`label: "${lbl}"`);
});

if (svgES.includes('✓')) ok('✓ symbol present (true booleans)');
else err('✓ symbol present');

if (svgES.includes('–')) ok('– symbol present (false booleans)');
else err('– symbol present');

if (svgES.includes('1355')) ok('Mars Pro D=1355mm in SVG');
else err('Mars Pro D=1355mm in SVG');

['0.3–0.6 s','0.8–3 s','0.6 s','0.8 s'].forEach(s => {
  if (svgES.includes(s)) ok(`speed: "${s}"`);
  else err(`speed: "${s}"`);
});

section('5. drawComparator() — SVG output (lang=de, longest labels)');
setLang('de');
svgOutput = '';
try { drawComparator(); } catch(e) { err('drawComparator() DE error', e.message); }
const svgDE = svgOutput;

['IR-Sensoren','Geräuschpegel','Anti-Tailgating',
 'Freier Durchgang (Stromausfall)','Anti-Panik-Kupplung'].forEach(lbl => {
  if (svgDE.includes(lbl)) ok(`DE label: "${lbl}"`);
  else err(`DE label: "${lbl}"`);
});

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(54)}`);
console.log(`Result: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
