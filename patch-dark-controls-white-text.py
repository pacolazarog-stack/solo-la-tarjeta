from pathlib import Path

STYLE = '''<style id="oras-dark-controls-white-text">
/* Todo control textual de fondo oscuro mantiene la rotulación blanca.
   El interrogante de ANA KLAUDYA es una excepción narrativa: permanece negro. */
button:not(.ou-card):not(.mirror-finale-card):not(.portrait-question),
[role="button"]:not(.ou-card):not(.mirror-finale-card):not(.portrait-question),
input[type="button"],
input[type="submit"],
summary,
.journey-nav button,
.ou-solo-endnav button,
.ou-solo-endnav a,
.ou-ceniciento-endnav button,
.ou-ceniciento-endnav a,
.mirror-continue,
.mirror-finale-nav button,
.voice-controls button,
.audio-controls button,
[class*="controls"] button,
[class*="toolbar"] button,
[class*="botonera"] button{
  color:#fffaf1!important;
  -webkit-text-fill-color:#fffaf1!important;
}
.portrait-question,
.portrait-question .question-beat{
  color:#000!important;
  -webkit-text-fill-color:#000!important;
}
</style>'''

for p in Path('.').rglob('*.html'):
    if '.git' in p.parts:
        continue
    s=p.read_text(encoding='utf-8')
    if 'id="oras-dark-controls-white-text"' not in s and '</head>' in s:
        s=s.replace('</head>',STYLE+'\n</head>',1)
        p.write_text(s,encoding='utf-8')

print('PASS: controles oscuros en blanco; interrogante de ANA KLAUDYA en negro')
