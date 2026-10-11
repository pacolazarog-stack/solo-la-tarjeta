#!/usr/bin/env python3
"""SOLO LA TARJETA: respiración sonora por escenas.

Añade un motor Web Audio común con fundidos compartidos:
máquina -> autobús -> París -> impacto 200,79 € -> silencio profundo.
Al llegar a #duskPreFinal, todo el sonido cae a cero en 5 s y no vuelve.
La frase final #duskFinalPhrase conserva un retraso de 400 ms.
"""
import pathlib, sys

path = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "index.html")
s = path.read_text(encoding="utf-8")

STYLE = """
<style id="oras-sonic-breath-style">
:root{--final-reveal-delay:.4s}
#duskFinalPhrase.reveal{transition-delay:var(--final-reveal-delay)!important}
</style>
"""

SCRIPT = r"""
<script id="oras-sonic-breath-engine">
(() => {
  const normalize = value => (value || '').replace(/\s+/g, ' ').trim();
  const findText = text => [...document.querySelectorAll('p.reveal')].find(
    node => normalize(node.textContent) === text
  );

  const machineMark = findText('La máquina continuó pensando.');
  const busMark = findText('El autobús arrancó.');
  const parisMark = findText('Ahora estaba en París y llevaba su tarjeta de crédito en el bolso.');
  const paymentMark = [...document.querySelectorAll('.dusk-amount')].find(
    node => normalize(node.textContent) === '200,79 €.'
  );
  const preFinal = document.getElementById('duskPreFinal');
  const soundtrack = document.getElementById('soundtrack');
  const soundToggle = document.getElementById('soundToggle');
  const enterButton = document.getElementById('enterButton');

  const audio = {
    ctx: null,
    master: null,
    started: false,
    finalSilenced: false
  };
  let machineLayer = null;
  let busLayer = null;
  let paymentPlayed = false;
  let htmlAudioFade = 0;

  function ensureAudio(){
    if(audio.ctx) return audio.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return null;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 1;
    master.connect(ctx.destination);
    audio.ctx = ctx;
    audio.master = master;
    return ctx;
  }

  function fadeGain(gainNode, target, duration = 2.5){
    if(!audio.ctx || !gainNode) return;
    const now = audio.ctx.currentTime;
    const current = Math.max(0.0001, Number(gainNode.gain.value) || 0.0001);
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(current, now);
    gainNode.gain.linearRampToValueAtTime(Math.max(0, target), now + duration);
  }

  function fadeHtmlAudio(target, duration = 2.5, done){
    if(!soundtrack) return;
    clearInterval(htmlAudioFade);
    const start = Number(soundtrack.volume) || 0;
    const started = performance.now();
    htmlAudioFade = setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / (duration * 1000));
      soundtrack.volume = start + (target - start) * t;
      if(t >= 1){
        clearInterval(htmlAudioFade);
        soundtrack.volume = target;
        if(typeof done === 'function') done();
      }
    }, 50);
  }

  function stopLayer(layer, after = 0){
    if(!layer) return;
    window.setTimeout(() => {
      try{ layer.stop?.(); }catch(_){}
    }, Math.max(0, after * 1000));
  }

  function machineHum(){
    const ctx = ensureAudio();
    if(!ctx || !audio.master) return null;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const low = ctx.createOscillator();
    const high = ctx.createOscillator();
    gain.gain.value = 0;
    filter.type = 'lowpass';
    filter.frequency.value = 190;
    filter.Q.value = 0.7;
    low.type = 'sine'; low.frequency.value = 47;
    high.type = 'triangle'; high.frequency.value = 94;
    low.connect(filter); high.connect(filter);
    filter.connect(gain); gain.connect(audio.master);
    low.start(); high.start();
    return {
      gain,
      stop(){
        try{low.stop();}catch(_){}
        try{high.stop();}catch(_){}
        try{gain.disconnect();}catch(_){}
      }
    };
  }

  function busNoise(){
    const ctx = ensureAudio();
    if(!ctx || !audio.master) return null;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<data.length;i++) data[i] = (Math.random() * 2 - 1) * 0.38;
    const noise = ctx.createBufferSource();
    const pulse = ctx.createOscillator();
    noise.buffer = buffer; noise.loop = true;
    filter.type = 'lowpass'; filter.frequency.value = 420; filter.Q.value = 0.5;
    pulse.type = 'sine'; pulse.frequency.value = 36;
    gain.gain.value = 0;
    noise.connect(filter); pulse.connect(filter);
    filter.connect(gain); gain.connect(audio.master);
    noise.start(); pulse.start();
    return {
      gain,
      stop(){
        try{noise.stop();}catch(_){}
        try{pulse.stop();}catch(_){}
        try{gain.disconnect();}catch(_){}
      }
    };
  }

  function enterMachine(){
    if(audio.finalSilenced || machineLayer) return;
    machineLayer = machineHum();
    if(!machineLayer) return;
    machineLayer.gain.gain.value = 0.0001;
    fadeGain(machineLayer.gain, 0.025, 4);
  }

  function enterBus(){
    if(audio.finalSilenced || busLayer) return;
    if(machineLayer){
      fadeGain(machineLayer.gain, 0, 3);
      stopLayer(machineLayer, 3.2);
    }
    busLayer = busNoise();
    if(!busLayer) return;
    busLayer.gain.gain.value = 0.0001;
    fadeGain(busLayer.gain, 0.015, 4);
  }

  function enterParis(){
    if(audio.finalSilenced) return;
    if(machineLayer){
      fadeGain(machineLayer.gain, 0, 6);
      stopLayer(machineLayer, 6.2);
    }
    if(busLayer){
      fadeGain(busLayer.gain, 0, 6);
      stopLayer(busLayer, 6.2);
    }
  }

  function paymentImpact(){
    if(audio.finalSilenced || paymentPlayed) return;
    const ctx = ensureAudio();
    if(!ctx || !audio.master) return;
    paymentPlayed = true;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1040;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(gain); gain.connect(audio.master);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  }

  function deepSilence(){
    if(audio.finalSilenced) return;
    audio.finalSilenced = true;
    if(audio.master) fadeGain(audio.master, 0, 5);
    if(machineLayer) fadeGain(machineLayer.gain, 0, 5);
    if(busLayer) fadeGain(busLayer.gain, 0, 5);
    fadeHtmlAudio(0, 5, () => {
      try{ soundtrack?.pause(); }catch(_){}
      if(soundtrack) soundtrack.muted = true;
      stopLayer(machineLayer);
      stopLayer(busLayer);
    });
    if(soundToggle){
      soundToggle.setAttribute('aria-pressed','true');
      soundToggle.setAttribute('aria-label','Sonido desactivado');
    }
  }

  // El motor solo se arma tras una acción real del lector.
  enterButton?.addEventListener('click', async () => {
    const ctx = ensureAudio();
    try{ if(ctx?.state === 'suspended') await ctx.resume(); }catch(_){}
    audio.started = true;
  }, {capture:true});

  // Tras el clímax final, el sonido no puede volver a activarse.
  soundToggle?.addEventListener('click', event => {
    if(!audio.finalSilenced) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if(soundtrack){
      soundtrack.muted = true;
      soundtrack.volume = 0;
      try{soundtrack.pause();}catch(_){}
    }
  }, {capture:true});

  const actions = new Map([
    [machineMark, enterMachine],
    [busMark, enterBus],
    [parisMark, enterParis],
    [paymentMark, paymentImpact],
    [preFinal, deepSilence]
  ].filter(([node]) => node));

  if('IntersectionObserver' in window && actions.size){
    const seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      for(const entry of entries){
        if(!entry.isIntersecting || seen.has(entry.target) || !audio.started) continue;
        seen.add(entry.target);
        const action = actions.get(entry.target);
        if(action) action();
        observer.unobserve(entry.target);
      }
    }, {threshold:0.35});
    actions.forEach((_, node) => observer.observe(node));
  }
})();
</script>
"""

if 'oras-sonic-breath-engine' in s:
    print('OK: respiración sonora ya presente')
    raise SystemExit(0)

if 'id="duskPreFinal"' not in s or 'id="duskFinalPhrase"' not in s:
    raise SystemExit('No se encontraron los anclajes finales de SOLO LA TARJETA')

if 'oras-sonic-breath-style' not in s:
    s = s.replace('</head>', STYLE + '\n</head>', 1)

marker = '<script data-oras-universe="v1"'
idx = s.find(marker)
if idx < 0:
    idx = s.rfind('</body>')
if idx < 0:
    raise SystemExit('No se encontró un punto seguro para insertar el motor sonoro')
s = s[:idx] + SCRIPT + '\n' + s[idx:]

path.write_text(s, encoding='utf-8')
print('OK: máquina de respiración sonora aplicada')
