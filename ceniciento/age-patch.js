(() => {
  const stage = document.querySelector('.stage');
  if (!stage || window.__CENICIENTO_AGING__) return;
  window.__CENICIENTO_AGING__ = true;

  const style = document.createElement('style');
  style.textContent = `
    :root{
      --cen-gray:0;
      --cen-sat:1;
      --cen-bright:1;
      --cen-contrast:1;
      --cen-cold:0;
    }
    .stage::before{
      filter:
        grayscale(var(--cen-gray))
        saturate(var(--cen-sat))
        brightness(var(--cen-bright))
        contrast(var(--cen-contrast)) !important;
      transition:filter .18s linear !important;
      will-change:filter;
    }
    .cen-age-canvas{
      position:absolute;
      inset:0;
      z-index:6;
      width:100%;
      height:100%;
      pointer-events:none;
    }
    .cen-age-cold{
      position:absolute;
      inset:0;
      z-index:7;
      pointer-events:none;
      opacity:var(--cen-cold);
      background:
        radial-gradient(88% 62% at 50% 42%,rgba(214,225,234,.05),transparent 68%),
        linear-gradient(to bottom,rgba(180,201,216,.05),rgba(18,26,34,.25));
      mix-blend-mode:color;
      transition:opacity .18s linear;
    }
    .cen-age-final{
      position:absolute;
      inset:0;
      z-index:8;
      pointer-events:none;
      opacity:0;
      background:rgba(20,20,20,.035);
      transition:opacity .6s ease;
    }
    body.cen-final .cen-age-final{opacity:1}
  `;
  document.head.appendChild(style);

  const root = document.documentElement;
  const pseudo = getComputedStyle(stage, '::before');
  const bg = pseudo.backgroundImage || '';
  const urlMatch = bg.match(/url\((['"]?)(.*?)\1\)/);

  const canvas = document.createElement('canvas');
  canvas.className = 'cen-age-canvas';
  stage.appendChild(canvas);

  const cold = document.createElement('div');
  cold.className = 'cen-age-cold';
  stage.appendChild(cold);

  const finalFilm = document.createElement('div');
  finalFilm.className = 'cen-age-final';
  stage.appendChild(finalFilm);

  if (!urlMatch) return;

  const imageURL = urlMatch[2];
  const image = new Image();
  image.decoding = 'async';
  image.src = imageURL;

  const ctx = canvas.getContext('2d', {alpha:true});
  if (!ctx) return;

  let furthest = 0;
  let ticking = false;
  let nw = 300, nh = 375;

  const clamp = v => Math.max(0, Math.min(1, v));
  const smooth = t => t * t * (3 - 2 * t);
  const ramp = (v, a, b) => smooth(clamp((v - a) / Math.max(.0001, b - a)));

  const resize = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const geometry = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const bx = -vw * .08;
    const by = -vh * .08;
    const bw = vw * 1.16;
    const bh = vh * 1.16;

    const s = Math.max(bw / nw, bh / nh);
    const dw = nw * s;
    const dh = nh * s;
    const dx = bx + (bw - dw) / 2;
    const dy = by + (bh - dh) / 2;

    return {s, dx, dy, dw, dh};
  };

  const pathFrom = (pts, g) => {
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const x = g.dx + pt[0] * g.s;
      const y = g.dy + pt[1] * g.s;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
  };

  const HAIR = [
    [36,58],[41,39],[53,27],[72,22],[91,26],[107,35],
    [117,48],[119,62],[113,72],[103,72],[94,68],[86,61],
    [77,59],[68,62],[59,65],[49,63],[41,61]
  ];
  const BEARD = [
    [78,84],[88,79],[101,79],[114,84],[124,94],[130,108],
    [129,122],[124,136],[115,145],[104,149],[94,147],[85,138],
    [79,127],[76,114],[75,99]
  ];

  const drawSilver = (age) => {
    if (!image.complete) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    if (age <= .005) return;

    const g = geometry();
    const intensity = Math.pow(age, 1.12);

    ctx.save();
    pathFrom(HAIR, g);
    ctx.clip();
    ctx.globalAlpha = .18 + intensity * .82;
    ctx.filter = `grayscale(1) brightness(${(1.62 + intensity * 1.52).toFixed(2)}) contrast(${(.92 - intensity * .25).toFixed(2)})`;
    ctx.drawImage(image, g.dx, g.dy, g.dw, g.dh);
    ctx.restore();

    ctx.save();
    pathFrom(BEARD, g);
    ctx.clip();
    ctx.globalAlpha = .12 + intensity * .88;
    ctx.filter = `grayscale(1) brightness(${(1.55 + intensity * 1.62).toFixed(2)}) contrast(${(.93 - intensity * .27).toFixed(2)})`;
    ctx.drawImage(image, g.dx, g.dy, g.dw, g.dh);
    ctx.restore();

    const lineAlpha = Math.max(0, (age - .34) / .66) * .30;
    if (lineAlpha > 0) {
      const map = ([x,y]) => [g.dx + x*g.s, g.dy + y*g.s];
      const lines = [
        [[79,77],[88,75],[96,76]],
        [[78,81],[87,80],[95,81]],
        [[104,80],[112,80],[118,83]],
        [[105,84],[112,84],[117,87]],
        [[90,103],[97,106],[103,104]]
      ];
      ctx.save();
      ctx.filter = 'none';
      ctx.strokeStyle = `rgba(66,54,47,${lineAlpha.toFixed(3)})`;
      ctx.lineWidth = Math.max(.75, g.s * .55);
      ctx.lineCap = 'round';
      lines.forEach(seg => {
        const a = map(seg[0]), b = map(seg[1]), c = map(seg[2]);
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.quadraticCurveTo(b[0], b[1], c[0], c[1]);
        ctx.stroke();
      });
      ctx.restore();
    }
  };

  const render = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const p = clamp(window.scrollY / maxScroll);

    furthest = Math.max(furthest, p);

    const age = ramp(furthest, .16, .86);
    const gray = ramp(furthest, .52, .94);
    const coldness = ramp(furthest, .42, .83);

    root.style.setProperty('--cen-gray', gray.toFixed(3));
    root.style.setProperty('--cen-sat', Math.max(0, 1 - gray).toFixed(3));
    root.style.setProperty('--cen-bright', (1 - gray * .075).toFixed(3));
    root.style.setProperty('--cen-contrast', (1 + gray * .13).toFixed(3));
    root.style.setProperty('--cen-cold', coldness.toFixed(3));

    drawSilver(age);

    if (furthest >= .955) {
      root.style.setProperty('--cen-gray', '1');
      root.style.setProperty('--cen-sat', '0');
      root.style.setProperty('--cen-bright', '.925');
      root.style.setProperty('--cen-contrast', '1.14');
      document.body.classList.add('cen-final');
      drawSilver(1);
    }
  };

  const requestRender = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      render();
      ticking = false;
    });
  };

  image.addEventListener('load', () => {
    nw = image.naturalWidth || 300;
    nh = image.naturalHeight || 375;
    resize();
    render();
  });

  window.addEventListener('resize', () => {
    resize();
    requestRender();
  }, {passive:true});

  window.addEventListener('scroll', requestRender, {passive:true});

  resize();
  requestRender();
})();