from pathlib import Path

p = Path('elegia-breve/index.html')
s = p.read_text(encoding='utf-8')
marker = '</style>'
css = r'''
    /* Contraste estable para controles de lectura con pausa */
    .voice-dialog button,
    .voice-dialog .entry-button,
    .voice-dialog [role="button"]{
      color:#fff!important;
      background:rgba(24,45,38,.46)!important;
      border-color:rgba(255,255,255,.28)!important;
      text-shadow:0 1px 2px rgba(0,0,0,.55)!important;
      box-shadow:0 2px 10px rgba(0,0,0,.10)!important;
    }
    .voice-dialog button:hover,
    .voice-dialog button:focus-visible,
    .voice-dialog .entry-button:hover,
    .voice-dialog .entry-button:focus-visible{
      color:#fff!important;
      background:rgba(24,45,38,.58)!important;
    }
'''
if css not in s:
    if marker not in s:
        raise RuntimeError('No se encontro </style> en elegia-breve/index.html')
    s = s.replace(marker, css + '\n  ' + marker, 1)
p.write_text(s, encoding='utf-8')
