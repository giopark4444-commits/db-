const puppeteer = require('puppeteer');
const path = require('path');

const FILE = 'file://' + path.resolve(__dirname, 'index.html');

// Usa el hook real de la app para simular una lectura fiel de ~62 dB.
function fakeReading(){ if(window.__preview) window.__preview(62.4); }

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
