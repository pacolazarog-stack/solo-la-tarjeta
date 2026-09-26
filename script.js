(() => {
  const enterButton=document.getElementById('enterButton');
  const soundtrack=document.getElementById('soundtrack');
  const root=document.documentElement;
  const clamp=v=>Math.min(1,Math.max(0,v));
  const smooth=t=>t*t*(3-2*t);
  const lerp=(a,b,t)=>a+(b-a)*t;
  const mixColor=(a,b,t)=>[Math.round(lerp(a[0],b[0],t)),Math.round(lerp(a[1],b[1],t)),Math.round(lerp(a[2],b[2],t))];

  const COLORS={
    warm:[241,237,229],
    electronic:[236,239,236],
    paris:[233,237,242],
    between:[240,239,235],
    closing:[247,245,240]
  };

  const enter=async()=>{
    enterButton.disabled=true;
    soundtrack.currentTime=0;
    soundtrack.volume=0;
    try{
      await soundtrack.play();
      const target=.14,steps=40;
      let step=0;
      const fade=setInterval(()=>{
        step++;
        soundtrack.volume=Math.min(target,target*(step/steps));
        if(step>=steps) clearInterval(fade);
      },78);
    }catch(_){}
    document.body.classList.add('entered');
    setTimeout(()=>document.getElementById('entryGate')?.remove(),1500);
  };
  enterButton.addEventListener('click',enter);

  const revealItems=[...document.querySelectorAll('.reveal')];
  const revealObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }
  },{rootMargin:'0px 0px -8% 0px',threshold:.08});
  revealItems.forEach(el=>revealObserver.observe(el));

  const electronic=document.querySelector('[data-electronic]');
  if(electronic){
    const eo=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('signal-visible');
          eo.unobserve(entry.target);
        }
      }
    },{threshold:.18});
    eo.observe(electronic);
  }

  const twoDays=document.querySelector('[data-two-days]');
  const paris=document.querySelector('.paris-section');
  const closing=document.querySelector('.closing-section');
  const finalLine=document.querySelector('.final-line');
  const progress=document.querySelector('.progress i');

  let sceneFrames=[];
  const buildSceneFrames=()=>{
    const vh=innerHeight||document.documentElement.clientHeight;
    const electronicTop=electronic?.offsetTop||0;
    const electronicH=electronic?.offsetHeight||0;
    const twoTop=twoDays?.offsetTop||0;
    const twoH=twoDays?.offsetHeight||0;
    const parisTop=paris?.offsetTop||0;
    const parisH=paris?.offsetHeight||0;
    const closingTop=closing?.offsetTop||0;
    const finalTop=finalLine?.offsetTop||document.documentElement.scrollHeight;

    sceneFrames=[
      {y:0,c:COLORS.warm,g:.46},
      {y:Math.max(0,electronicTop-vh*.8),c:COLORS.warm,g:.46},
      {y:electronicTop+electronicH*.32,c:COLORS.electronic,g:.40},
      {y:electronicTop+electronicH+vh*.65,c:COLORS.warm,g:.44},
      {y:Math.max(0,twoTop-vh*.55),c:COLORS.warm,g:.42},
      {y:twoTop+twoH*.86,c:COLORS.warm,g:.38},
      {y:parisTop+vh*.18,c:COLORS.paris,g:.32},
      {y:parisTop+parisH*.58,c:COLORS.paris,g:.30},
      {y:Math.max(parisTop+parisH*.72,closingTop-vh*.72),c:COLORS.between,g:.35},
      {y:closingTop+vh*.18,c:COLORS.closing,g:.42},
      {y:finalTop+vh*.25,c:COLORS.closing,g:.38}
    ].sort((a,b)=>a.y-b.y);
  };

  const applyWorld=()=>{
    if(!sceneFrames.length) buildSceneFrames();
    const vh=innerHeight||document.documentElement.clientHeight;
    const probe=scrollY+vh*.46;
    let a=sceneFrames[0],b=sceneFrames[sceneFrames.length-1];

    for(let i=0;i<sceneFrames.length-1;i++){
      if(probe>=sceneFrames[i].y&&probe<=sceneFrames[i+1].y){
        a=sceneFrames[i];b=sceneFrames[i+1];break;
      }
    }
    const span=Math.max(1,b.y-a.y);
    const t=smooth(clamp((probe-a.y)/span));
    const color=mixColor(a.c,b.c,t);
    const glow=lerp(a.g,b.g,t);
    root.style.setProperty('--world-r',color[0]);
    root.style.setProperty('--world-g',color[1]);
    root.style.setProperty('--world-b',color[2]);
    root.style.setProperty('--world-glow',glow.toFixed(3));
  };

  const updateProgress=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    const ratio=max>0?clamp(scrollY/max):0;
    progress.style.height=(ratio*100)+'%';
  };

  const canvas=twoDays?.querySelector('.wave-rainbow');
  let coupling=null;

  if(twoDays&&canvas){
    const ctx=canvas.getContext('2d');
    let phase=0;
    const state={active:false,waves:0,harmony:0,lock:0,spectrum:0};

    const resizeCanvas=()=>{
      const dpr=Math.min(2,Math.max(1,window.devicePixelRatio||1));
      const rect=canvas.getBoundingClientRect();
      canvas.width=Math.max(1,Math.round(rect.width*dpr));
      canvas.height=Math.max(1,Math.round(rect.height*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };

    const rgba=(rgb,a)=>`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

    const drawCoupling=()=>{
      const w=canvas.clientWidth,h=canvas.clientHeight;
      if(!w||!h) return;
      ctx.clearRect(0,0,w,h);
      if(!state.active) return;

      ctx.save();
      ctx.globalCompositeOperation='screen';

      const kP=6.8;
      const kRStart=10.6;
      const kR=lerp(kRStart,kP,state.harmony);
      const phaseGap=Math.PI*1.08*(1-state.harmony);
      const separation=h*.085*(1-state.lock);
      const waveAmp=h*.037;

      const drawWave=kind=>{
        ctx.beginPath();
        for(let x=0;x<=w;x+=4){
          const t=x/w;
          const pWave=Math.sin(t*kP*Math.PI*2+phase);
          const rWave=Math.sin(t*kR*Math.PI*2+phase-phaseGap);
          const wave=kind==='p'?pWave:rWave;
          const y0=h*.50+(kind==='p'?-separation:separation);
          const y=y0+wave*waveAmp;
          if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        const lockEmphasis=.34+.66*state.lock;
        const alpha=state.waves*(.34+.34*lockEmphasis);
        ctx.lineWidth=1.25+state.lock*.85;
        ctx.strokeStyle=kind==='p'?`rgba(174,215,236,${alpha})`:`rgba(249,215,188,${alpha})`;
        ctx.shadowBlur=state.lock*10;
        ctx.shadowColor=kind==='p'?'rgba(174,215,236,.28)':'rgba(249,215,188,.24)';
        ctx.stroke();
        ctx.shadowBlur=0;
      };

      if(state.waves>.002){
        drawWave('p');
        drawWave('r');
      }

      if(state.lock>.02){
        const halo=ctx.createRadialGradient(w*.5,h*.5,0,w*.5,h*.5,Math.max(w,h)*.55);
        const strength=state.lock*(.10+state.spectrum*.16);
        halo.addColorStop(0,`rgba(255,255,255,${strength})`);
        halo.addColorStop(.38,`rgba(247,248,249,${strength*.44})`);
        halo.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle=halo;
        ctx.fillRect(0,0,w,h);
      }

      if(state.spectrum>.002){
        const colors=[[207,67,73],[231,126,58],[226,190,74],[92,164,108],[73,134,209],[111,96,188]];
        const baseY=h*.13,gap=h*.112,thickness=Math.max(20,h*.058);

        for(let i=0;i<colors.length;i++){
          const upper=[],lower=[];
          let constructiveSum=0,samples=0;
          for(let x=0;x<=w;x+=6){
            const t=x/w;
            const pWave=Math.sin(t*kP*Math.PI*2+phase+i*.05);
            const rWave=Math.sin(t*kR*Math.PI*2+phase-phaseGap+i*.05);
            const constructive=(1+pWave*rWave)/2;
            const residual=(1-state.lock)*(pWave+rWave)*h*.010;
            const y=baseY+i*gap+residual;
            upper.push([x,y]);lower.push([x,y+thickness]);
            constructiveSum+=constructive;samples++;
          }
          const constructive=samples?constructiveSum/samples:.5;
          const luminosity=.50+.50*(constructive*.32+state.lock*.68);
          const alpha=state.spectrum*(.08+.24*luminosity);

          ctx.beginPath();
          upper.forEach(([x,y],idx)=>idx?ctx.lineTo(x,y):ctx.moveTo(x,y));
          for(let j=lower.length-1;j>=0;j--)ctx.lineTo(lower[j][0],lower[j][1]);
          ctx.closePath();

          const grad=ctx.createLinearGradient(0,0,w,0);
          grad.addColorStop(0,rgba(colors[i],alpha*.50));
          grad.addColorStop(.16,rgba(colors[i],alpha*.82));
          grad.addColorStop(.50,rgba(colors[i],alpha*(1+.30*state.lock)));
          grad.addColorStop(.84,rgba(colors[i],alpha*.82));
          grad.addColorStop(1,rgba(colors[i],alpha*.50));
          ctx.fillStyle=grad;ctx.fill();
        }
      }
      ctx.restore();
    };

    const updateCoupling=()=>{
      const rect=twoDays.getBoundingClientRect();
      const vh=innerHeight||document.documentElement.clientHeight;
      const travel=Math.max(1,rect.height-vh);
      const p=clamp((-rect.top)/travel);

      state.active=rect.bottom>0&&rect.top<vh;

      const blackIn=smooth(clamp((p-.03)/.21));
      const wavesIn=smooth(clamp((p-.17)/.10));
      const harmony=smooth(clamp((p-.30)/.28));
      const lockIn=smooth(clamp((p-.55)/.055));
      const lockOut=1-smooth(clamp((p-.75)/.075));
      const lock=Math.max(0,lockIn*lockOut);
      const spectrumIn=smooth(clamp((p-.64)/.075));
      const spectrumOut=1-smooth(clamp((p-.84)/.085));
      const spectrum=Math.max(0,spectrumIn*spectrumOut);
      const blackOut=1-smooth(clamp((p-.65)/.17));
      const black=Math.max(0,blackIn*blackOut);
      const whiteIn=smooth(clamp((p-.78)/.10));
      const whiteOut=1-smooth(clamp((p-.92)/.09));
      const white=Math.max(0,whiteIn*whiteOut);
      const aftertone=smooth(clamp((p-.88)/.12));
      const wavesOut=1-smooth(clamp((p-.80)/.09));
      const pulse=smooth(clamp((p-.955)/.04));

      state.waves=Math.max(0,wavesIn*wavesOut);
      state.harmony=harmony;
      state.lock=lock;
      state.spectrum=spectrum;

      twoDays.style.setProperty('--black',black.toFixed(3));
      twoDays.style.setProperty('--white',white.toFixed(3));
      twoDays.style.setProperty('--aftertone',aftertone.toFixed(3));
      twoDays.style.setProperty('--pulse',(pulse*.48).toFixed(3));
      twoDays.style.setProperty('--pulse-scale',(0.22+pulse*.78).toFixed(3));
      twoDays.style.setProperty('--pulse-dot',(0.45+pulse*.75).toFixed(3));
      drawCoupling();
    };

    const animate=()=>{
      phase+=.0055;
      if(state.active&&(state.waves>.002||state.lock>.002||state.spectrum>.002))drawCoupling();
      requestAnimationFrame(animate);
    };

    coupling={resizeCanvas,updateCoupling};
    resizeCanvas();updateCoupling();animate();
  }

  let ticking=false;
  const updateAll=()=>{
    ticking=false;
    applyWorld();
    updateProgress();
    coupling?.updateCoupling();
  };
  const requestUpdate=()=>{
    if(!ticking){
      ticking=true;
      requestAnimationFrame(updateAll);
    }
  };

  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',()=>{
    sceneFrames=[];
    buildSceneFrames();
    coupling?.resizeCanvas();
    requestUpdate();
  });

  buildSceneFrames();
  updateAll();
})();
