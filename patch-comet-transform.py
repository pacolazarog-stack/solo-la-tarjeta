#!/usr/bin/env python3
"""index.html: el cometa se anima solo con transform y opacity (sin left/top).

Equivalencia exacta: left/top en % del contenedor (.world-comet, inset:0 dentro de
.world fixed) pasan a translate3d en cqw/cqh, que miden lo mismo (contenedor con
container-type:size). Mismos fotogramas, mismas posiciones, misma curva por tramo.
Respaldo con vw/vh para navegadores sin unidades de contenedor.
"""
import re, sys, pathlib

path = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'index.html')
s = path.read_text(encoding='utf-8')

def once(old, new, label):
    global s
    assert s.count(old) == 1, f'{label}: se esperaba 1 coincidencia, hay {s.count(old)}'
    s = s.replace(old, new)

# 1. Contenedor de medida + capa propia solo para transform/opacity.
once(".world-comet{z-index:5;opacity:0;pointer-events:none;overflow:visible}",
     ".world-comet{z-index:5;opacity:0;pointer-events:none;overflow:visible;container-type:size}", 'contenedor')
once("position:absolute;left:-22%;top:30%;pointer-events:none;will-change:left,top,transform,opacity}",
     "position:absolute;left:0;top:0;pointer-events:none;will-change:transform,opacity}", 'base')
once("filter:blur(.12px);transform:translate(-50%,-50%) scale(.74)}",
     "filter:blur(.12px);transform:translate3d(-22cqw,30cqh,0) translate(-50%,-50%) scale(.74)}", 'núcleo base')
once("transform-origin:right center;transform:translate(-100%,-50%) rotate(-12deg) scaleX(.12);",
     "transform-origin:right center;transform:translate3d(-22cqw,30cqh,0) translate(-100%,-50%) rotate(-12deg) scaleX(.12);", 'cola base')

# 2. Fotogramas: se leen los antiguos y se reescriben con la misma geometría.
m = re.search(r"@keyframes cometCore\{.*?\n\}\n@keyframes cometTail\{.*?\n\}", s, re.S)
assert m, 'keyframes del cometa no encontrados'
old_block = m.group(0)
frame = re.compile(r"(\d+)%\{left:(-?[\d.]+)%;top:(-?[\d.]+)%;(?:opacity:([\d.]+);)?transform:translate\((-?\d+)%,-50%\)\s*(?:rotate\(-12deg\)\s*scaleX\(([\d.]+)\)|scale\(([\d.]+)\))\}")
def build(unit_x, unit_y):
    parts = []
    for name, body in (('cometCore', old_block.split('@keyframes cometTail')[0]),
                       ('cometTail', old_block.split('@keyframes cometTail')[1])):
        fr = frame.findall(body); assert len(fr) >= 6, name
        lines = []
        for pct, x, y, op, tx, sx, sc in fr:
            move = f"translate3d({x}{unit_x},{y}{unit_y},0) translate({tx}%,-50%)"
            if sx: move += f" rotate(-12deg) scaleX({sx})"
            else:  move += f" scale({sc})"
            lines.append(f"  {pct}%{{{'opacity:'+op+';' if op else ''}transform:{move}}}")
        parts.append(f"@keyframes {name}{{\n" + "\n".join(lines) + "\n}")
    return "\n".join(parts)
new_block = build('cqw', 'cqh') + "\n@supports not (width:1cqw){\n" + \
    build('vw', 'svh').replace('@keyframes', '  @keyframes') + "\n}"
s = s.replace(old_block, new_block)
path.write_text(s, encoding='utf-8')
print('OK: cometa con transform y opacity')
