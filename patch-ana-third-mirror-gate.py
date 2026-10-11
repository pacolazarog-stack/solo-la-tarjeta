from pathlib import Path

p=Path('narrative-universe.js')
s=p.read_text(encoding='utf-8')

# When ANA KLAUDYA is the reading that completes 3/3, Flores becomes a clean,
# blocked transition screen. Only an explicit Seguir may launch EL ESPEJO.
# The epilogue may already be marked complete in a reader's localStorage from
# a previous deployment, so reaching Flores must recover the pending gate too.

old_state="""  return {journeyStartedAt:0,cardFound:false,soloComplete:false,anaComplete:false,anaParts:emptyAnaParts(),cenicientoComplete:false,cenicientoUnlocked:false,mirrorReadComplete:false,returnedFromCeniciento:false,ghosts:{}};
"""
new_state="""  return {journeyStartedAt:0,cardFound:false,soloComplete:false,anaComplete:false,anaParts:emptyAnaParts(),anaThirdGatePending:false,cenicientoComplete:false,cenicientoUnlocked:false,mirrorReadComplete:false,returnedFromCeniciento:false,ghosts:{}};
"""
if old_state not in s: raise RuntimeError('No se encontró estado compuesto de ANA')
s=s.replace(old_state,new_state,1)

old_bool="""  for(const key of ['cardFound','soloComplete','cenicientoComplete','cenicientoUnlocked','mirrorReadComplete','returnedFromCeniciento'])current[key]=saved[key]===true;
"""
new_bool="""  for(const key of ['cardFound','soloComplete','anaThirdGatePending','cenicientoComplete','cenicientoUnlocked','mirrorReadComplete','returnedFromCeniciento'])current[key]=saved[key]===true;
"""
if old_bool not in s: raise RuntimeError('No se encontró normalización booleana')
s=s.replace(old_bool,new_bool,1)

old_complete="""function completeAnaPart(key){
  state=readState();
  if(!state.journeyStartedAt||!ANA_PARTS.some(([part])=>part===key))return false;
  if(state.anaParts[key]){ensureChecklist();return true;}
  const parts=Object.assign(emptyAnaParts(),state.anaParts,{[key]:true});
  save({anaParts:parts,anaComplete:anaPartsComplete(parts)});
  state=readState();ensureChecklist();
  if(window.parent===window){
    maybeStartMirror();
  }else{
    window.parent.postMessage({channel:'oras-universe-v2',type:'ana-progress'},location.origin);
  }
  return true;
}
"""
new_complete="""function completeAnaPart(key){
  state=readState();
  if(!state.journeyStartedAt||!ANA_PARTS.some(([part])=>part===key))return false;

  /* A reader can arrive here with epilogo already true because that completion
     was stored before this gate existed. Reaching the visible Flores screen is
     still the authoritative boundary: if the three readings are complete and
     EL ESPEJO has not been completed, recover the explicit Seguir gate. */
  if(state.anaParts[key]){
    const recoverThirdGate=key==='epilogo'&&state.anaComplete&&state.soloComplete&&state.cenicientoComplete&&!state.mirrorReadComplete;
    if(recoverThirdGate&&!state.anaThirdGatePending){save({anaThirdGatePending:true});state=readState();}
    ensureChecklist();
    if(recoverThirdGate){
      if(window.parent===window)showAnaThirdMirrorGate();
      else window.parent.postMessage({channel:'oras-universe-v2',type:'ana-progress'},location.origin);
    }
    return true;
  }

  const wasAnaComplete=state.anaComplete;
  const parts=Object.assign(emptyAnaParts(),state.anaParts,{[key]:true});
  const completesAna=anaPartsComplete(parts);
  const thirdNow=key==='epilogo'&&completesAna&&!wasAnaComplete&&state.soloComplete&&state.cenicientoComplete;
  save({anaParts:parts,anaComplete:completesAna,anaThirdGatePending:thirdNow||state.anaThirdGatePending});
  state=readState();ensureChecklist();
  if(window.parent===window){
    if(state.anaThirdGatePending)showAnaThirdMirrorGate();
    else maybeStartMirror();
  }else{
    window.parent.postMessage({channel:'oras-universe-v2',type:'ana-progress'},location.origin);
  }
  return true;
}
"""
if old_complete not in s: raise RuntimeError('No se encontró completeAnaPart')
s=s.replace(old_complete,new_complete,1)

anchor="""window.addEventListener('oras:ana-part-complete',event=>completeAnaPart(event.detail?.part));

"""
gate=r'''window.addEventListener('oras:ana-part-complete',event=>completeAnaPart(event.detail?.part));

let anaThirdGateOpen=false;
function showAnaThirdMirrorGate(){
  state=readState();
  if(!page.ana||window.parent!==window||!state.anaThirdGatePending||anaThirdGateOpen)return false;
  const frame=document.getElementById('cenicientoFrame');
  if(!frame||frame.hidden)return false;
  anaThirdGateOpen=true;
  document.body.classList.add('ou-ana-third-mirror-gate');

  let style=document.getElementById('ou-ana-third-mirror-gate-style');
  if(!style){
    style=document.createElement('style');style.id='ou-ana-third-mirror-gate-style';
    style.textContent=`
      body.ou-ana-third-mirror-gate{overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important}
      body.ou-ana-third-mirror-gate > *:not(#cenicientoFrame):not(.ou-ana-third-follow):not(script):not(style){display:none!important}
      body.ou-ana-third-mirror-gate #cenicientoFrame{display:block!important;position:fixed!important;inset:0!important;width:100%!important;height:100%!important;z-index:2147481000!important;border:0!important;background:#fff!important}
      .ou-ana-third-follow{position:fixed!important;z-index:2147483000!important;left:50%!important;bottom:calc(34px + env(safe-area-inset-bottom,0px))!important;transform:translateX(-50%)!important;min-width:108px!important;min-height:50px!important;padding:11px 24px!important;border:1px solid rgba(255,255,255,.30)!important;border-radius:999px!important;background:rgba(12,12,12,.78)!important;color:#fff!important;-webkit-text-fill-color:#fff!important;font:italic 400 1rem/1.2 Georgia,'Times New Roman',serif!important;letter-spacing:.025em!important;text-shadow:0 2px 14px rgba(0,0,0,.9)!important;cursor:pointer!important;box-shadow:0 8px 28px rgba(0,0,0,.22)!important}
    `;
    document.head.appendChild(style);
  }

  const childStyleId='ou-ana-third-child-flower-only';
  const isolateFlower=()=>{
    try{
      const doc=frame.contentDocument;if(!doc)return;
      let childStyle=doc.getElementById(childStyleId);
      if(!childStyle){
        childStyle=doc.createElement('style');childStyle.id=childStyleId;
        childStyle.textContent=`
          html,body{overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important;background:#fff!important}
          body > *:not(#flowerCoda):not(script):not(style){display:none!important}
          #flowerCoda{display:grid!important;position:fixed!important;inset:0!important;z-index:2147482000!important;place-items:center!important;width:100%!important;height:100svh!important;min-height:100svh!important;margin:0!important;padding:0!important;background:#fff!important;color:#201d19!important;opacity:1!important;visibility:visible!important}
          #flowerCoda p{margin:0!important}
        `;
        doc.head.appendChild(childStyle);
      }
      const flower=doc.getElementById('flowerCoda');if(flower){flower.hidden=false;flower.scrollIntoView({block:'start',behavior:'auto'});}
    }catch(_){}
  };
  isolateFlower();
  frame.addEventListener('load',isolateFlower,{once:true});

  let follow=document.querySelector('.ou-ana-third-follow');
  if(!follow){
    follow=document.createElement('button');follow.type='button';follow.className='ou-ana-third-follow';follow.textContent='Seguir';follow.setAttribute('aria-label','Continuar hacia EL ESPEJO');document.body.appendChild(follow);
  }

  const block=event=>{
    if(!anaThirdGateOpen)return;
    if(event.target===follow&&(event.type==='click'||(event.type==='keydown'&&['Enter',' '].includes(event.key))))return;
    if(event.type==='keydown'&&event.key==='Tab'){event.preventDefault();follow.focus({preventScroll:true});return;}
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();
  };
  addEventListener('wheel',block,{passive:false,capture:true});
  addEventListener('touchmove',block,{passive:false,capture:true});
  addEventListener('keydown',block,{capture:true});

  follow.addEventListener('click',()=>{
    if(!anaThirdGateOpen)return;
    anaThirdGateOpen=false;
    try{frame.contentDocument?.getElementById(childStyleId)?.remove();}catch(_){}
    document.body.classList.remove('ou-ana-third-mirror-gate');
    follow.remove();
    save({anaThirdGatePending:false});state=readState();ensureChecklist();
    maybeStartMirror();
  },{once:true});
  requestAnimationFrame(()=>follow.focus({preventScroll:true}));
  return true;
}

'''
if anchor not in s: raise RuntimeError('No se encontró ancla tras evento de parte ANA')
s=s.replace(anchor,gate,1)

old_parent="""    if(event.data?.channel==='oras-universe-v2'&&event.data.type==='ana-progress'){
      state=readState();ensureChecklist();maybeStartMirror();
    }
"""
new_parent="""    if(event.data?.channel==='oras-universe-v2'&&event.data.type==='ana-progress'){
      state=readState();ensureChecklist();
      if(state.anaThirdGatePending)showAnaThirdMirrorGate();
      else maybeStartMirror();
    }
"""
if old_parent not in s: raise RuntimeError('No se encontró recepción ana-progress')
s=s.replace(old_parent,new_parent,1)

old_reset="""  save({anaComplete:false,anaParts:emptyAnaParts(),soloComplete:false,cenicientoComplete:false,mirrorReadComplete:false,returnedFromCeniciento:true});
"""
new_reset="""  save({anaComplete:false,anaParts:emptyAnaParts(),anaThirdGatePending:false,soloComplete:false,cenicientoComplete:false,mirrorReadComplete:false,returnedFromCeniciento:true});
"""
if old_reset not in s: raise RuntimeError('No se encontró reset compuesto de ANA')
s=s.replace(old_reset,new_reset,1)

p.write_text(s,encoding='utf-8')
print('PASS: ANA third-reading Flores gate requires explicit Seguir before EL ESPEJO, including pre-existing completion state')
