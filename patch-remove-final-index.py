from pathlib import Path

p=Path('ceniciento/el-espejo.js')
s=p.read_text(encoding='utf-8')

old="""const index=document.createElement('button');
index.type='button';index.className='mirror-finale-index';index.textContent='Índice';
index.setAttribute('aria-label','Abrir el índice de ANA KLAUDYA');
index.onclick=()=>go(ROOT+'elegia-breve/?indice=1');

"""
if old in s:
    s=s.replace(old,'',1)

s=s.replace('finaleNav.append(back,index,forward,restart,exit);','finaleNav.append(back,forward,restart,exit);',1)

p.write_text(s,encoding='utf-8')
print('PASS: botón Índice eliminado de la pantalla final flag')
