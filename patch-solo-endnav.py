from pathlib import Path

p = Path('narrative-universe.js')
s = p.read_text(encoding='utf-8')

s = s.replace("const VERSION='20261011-37';", "const VERSION='20261011-38';")

old = """function showSoloEndNav(){
  if(document.querySelector('.ou-solo-endnav'))return;
  const nav=document.createElement('nav');
  nav.className='ou-solo-endnav';
  nav.setAttribute('aria-label','Navegación al terminar SOLO LA TARJETA');

  const forward=document.createElement('button');
  forward.type='button';
  forward.textContent='Adelante';
  forward.setAttribute('aria-label','Ir adelante');
  forward.addEventListener('click',()=>history.forward());

  const home=document.createElement('a');
  home.href=rootPath+'elegia-breve/?v='+VERSION;
  home.target='_top';
  home.textContent='Inicio';
  home.setAttribute('aria-label','Volver al inicio de ANA KLAUDYA');

  nav.append(forward,home);
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}
"""
new = """function showSoloEndNav(){
  if(document.querySelector('.ou-solo-endnav'))return;
  const nav=document.createElement('nav');
  nav.className='ou-solo-endnav';
  nav.setAttribute('aria-label','Navegación al terminar SOLO LA TARJETA');

  const back=document.createElement('button');
  back.type='button';
  back.textContent='Atrás';
  back.setAttribute('aria-label','Ir atrás');
  back.addEventListener('click',()=>history.back());

  const forward=document.createElement('button');
  forward.type='button';
  forward.textContent='Adelante';
  forward.setAttribute('aria-label','Ir adelante');
  forward.addEventListener('click',()=>history.forward());

  nav.append(back,forward);
  document.body.appendChild(nav);
  requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('ou-visible')));
}
"""

if old not in s:
    raise RuntimeError('No se encontró la navegación final de SOLO LA TARJETA versión 37')

s = s.replace(old, new, 1)
p.write_text(s, encoding='utf-8')

for q in Path('.').rglob('*.html'):
    if '.git' in q.parts:
        continue
    t = q.read_text(encoding='utf-8')
    t = t.replace('narrative-universe.js?v=20261011-37', 'narrative-universe.js?v=20261011-38')
    q.write_text(t, encoding='utf-8')
