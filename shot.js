const puppeteer = require('puppeteer');
const path = require('path');

const FILE = 'file://' + path.resolve(__dirname, 'index.html');

// Simula una lectura de ~62 dB para que las capturas se vean "vivas".
function fakeReading(){
  const DB_MIN=30, DB_MAX=120, A=-62, B=62, db=62.4;
  const t=(db-DB_MIN)/(DB_MAX-DB_MIN), ang=A+t*(B-A);
  const n=document.getElementById('needle');
  if(n) n.setAttribute('transform',`rotate(${ang} 200 210)`);
  document.getElementById('dbNow').textContent=db.toFixed(1);
  document.getElementById('descNow').textContent='conversación normal';
  document.getElementById('dbPeak').textContent='78';
  document.getElementById('dbAvg').textContent='59';
  document.getElementById('dbMin').textContent='41';
  const leds=document.querySelectorAll('.ladder i');
  const lit=Math.round(t*leds.length);
  leds.forEach((el,i)=>{ if(i<lit){ el.classList.add('on'); el.style.background=el.dataset.col; }});
  const fill=document.getElementById('doseFill'); if(fill){ fill.style.width='34%'; }
  document.getElementById('dosePct').textContent='34%';
  document.getElementById('doseMsg').textContent='Tiempo >85 dB: 00:00';
  // botón en estado encendido
  const bp=document.getElementById('btnPower'); if(bp){ bp.textContent='Apagar'; bp.classList.add('live'); }
  document.getElementById('powerled').classList.add('on');
  // dibujar una traza en el osciloscopio
  try{
    const cv=document.getElementById('scope'), x=cv.getContext('2d');
    const W=cv.clientWidth,H=cv.clientHeight, dpr=window.devicePixelRatio||1;
    cv.width=W*dpr; cv.height=H*dpr; x.setTransform(dpr,0,0,dpr,0,0);
    x.strokeStyle='#5af08c'; x.lineWidth=1.6; x.shadowColor='rgba(90,240,140,.8)'; x.shadowBlur=6;
    x.beginPath();
    for(let i=0;i<=W;i+=3){ const v=58+Math.sin(i/9)*7+Math.sin(i/3)*3; const y=H-6-((v-30)/90)*(H-12); i?x.lineTo(i,y):x.moveTo(i,y);}
    x.stroke();
  }catch(e){}
}

(async () => {
  const browser = await puppeteer.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
  const themes = [
    ['classic','Analógico'], ['neon','Neón'], ['casete','Casete'],
    ['cromo','Cromo'], ['plano','Plano'], ['minimo','Mínimo']
  ];
  // capturas de móvil para cada estética
  for (const [key,label] of themes){
    const page = await browser.newPage();
    await page.setViewport({ width: 412, height: 880, deviceScaleFactor: 2 });
    await page.evaluateOnNewDocument(k => localStorage.setItem('vusono.theme', k), key);
    await page.goto(FILE, { waitUntil: 'networkidle0' });
    await page.evaluate(fakeReading);
    await new Promise(r=>setTimeout(r,150));
    await page.screenshot({ path: `preview-${key}.png` });
    await page.close();
    console.log('captura', label);
  }
  // captura de escritorio (tema analógico)
  const dp = await browser.newPage();
  await dp.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
  await dp.evaluateOnNewDocument(() => localStorage.setItem('vusono.theme','classic'));
  await dp.goto(FILE, { waitUntil: 'networkidle0' });
  await dp.evaluate(fakeReading);
  await new Promise(r=>setTimeout(r,150));
  await dp.screenshot({ path: 'preview-desktop.png' });
  console.log('captura desktop');

  await browser.close();
})();
