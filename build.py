#!/usr/bin/env python3
"""
Assembles src/ source files into zkteco_v35_optimized.html.

Usage:
    python build.py

Source layout:
    src/template.html     — HTML shell with /*%%CSS%%*/ and //%%JS%% placeholders
    src/css/main.css      — CSS injected into <style>
    src/js/NN-name.js     — JS files concatenated in alphabetical (numeric) order
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
SRC  = ROOT / 'src'
OUT  = ROOT / 'zkteco_v35_optimized.html'

template = (SRC / 'template.html').read_text(encoding='utf-8')
css      = (SRC / 'css' / 'main.css').read_text(encoding='utf-8')

js_files = sorted((SRC / 'js').glob('*.js'))
js       = '\n'.join(f.read_text(encoding='utf-8') for f in js_files)

result = template.replace('/*%%CSS%%*/', css).replace('//%%JS%%', js)
OUT.write_text(result, encoding='utf-8')

lines = len(result.splitlines())
print(f'Built {OUT.name}  ({lines:,} lines, {len(js_files)} JS modules)')
