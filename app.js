const API = 'https://api.alquran.cloud/v1';
const app = document.getElementById('app');
const root = document.documentElement;
const PLAY = '▶ കേൾക്കുക', STOP = '⏸ നിർത്തുക';
const ERR = 'ലോഡ് ചെയ്യാനായില്ല. ഇന്റർനെറ്റ് പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.';
const BISM = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
let surahs = null, audio = null;

const TRANSLATIONS = [
  { id: 'ml.abdulhameed', label: 'മലയാളം – അബ്ദുൽ ഹമീദ് & പറപ്പൂർ' },
  { id: 'ml.karakunnu', label: 'മലയാളം – കാരക്കുന്ന് & എളയാവൂർ' },
  { id: 'en.sahih', label: 'English – Saheeh International' },
  { id: 'en.yusufali', label: 'English – Yusuf Ali' },
];
const currentTr = () => {
  const t = localStorage.getItem('tr');
  return TRANSLATIONS.some(x => x.id === t) ? t : TRANSLATIONS[0].id;
};

// settings
let fs = parseFloat(localStorage.getItem('fs')) || 1;
const setFs = v => { fs = Math.min(1.8, Math.max(0.8, v)); root.style.setProperty('--fs', fs); localStorage.setItem('fs', fs); };
setFs(fs);
root.dataset.theme = localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.getElementById('bigger').onclick = () => setFs(fs + 0.1);
document.getElementById('smaller').onclick = () => setFs(fs - 0.1);
document.getElementById('theme').onclick = () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
};

const msg = t => app.innerHTML = `<div class="msg">${t}</div>`;
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
async function get(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  return (await r.json()).data;
}

async function home() {
  msg('ലോഡ് ചെയ്യുന്നു…');
  try { surahs = surahs || await get(API + '/surah'); }
  catch { return msg(ERR); }
  const last = +localStorage.getItem('last');
  app.innerHTML = `
    ${last ? `<a class="resume" href="#/surah/${last}">▶ അവസാനം വായിച്ചത്: ${surahs[last - 1].englishName} (തുടരുക)</a>` : ''}
    <input id="search" placeholder="സൂറത്ത് തിരയുക (പേര് അല്ലെങ്കിൽ നമ്പർ)">
    <div id="list"></div>`;
  const list = document.getElementById('list');
  const render = q => {
    q = q.trim().toLowerCase();
    list.innerHTML = surahs.filter(s => !q || String(s.number) === q ||
      s.englishName.toLowerCase().includes(q) || s.englishNameTranslation.toLowerCase().includes(q) || s.name.includes(q))
      .map(s => `<a class="surah" href="#/surah/${s.number}">
        <span class="num">${s.number}</span>
        <span class="info"><b>${s.englishName}</b><small>${s.englishNameTranslation} · ${s.numberOfAyahs} ആയത്തുകൾ · ${s.revelationType === 'Meccan' ? 'മക്കി' : 'മദനി'}</small></span>
        <span class="ar-name">${s.name.replace('سُورَةُ ', '')}</span></a>`).join('') || '<div class="msg">ഒന്നും കണ്ടെത്തിയില്ല</div>';
  };
  render('');
  document.getElementById('search').oninput = e => render(e.target.value);
}

async function surah(n) {
  if (!(n >= 1 && n <= 114)) { location.hash = '#/'; return; }
  msg('ലോഡ് ചെയ്യുന്നു…');
  try {
    surahs = surahs || await get(API + '/surah');
    const tr = currentTr();
    const [ar, ml, au] = await get(`${API}/surah/${n}/editions/quran-uthmani,${tr},ar.alafasy`);
    localStorage.setItem('last', n);
    const s = surahs[n - 1];
    const showBism = n !== 1 && n !== 9;
    const isEn = tr.startsWith('en.');
    app.innerHTML = `
      <a class="back" href="#/">← സൂറത്തുകൾ</a>
      <div class="head"><h1>${s.name}</h1><div>${s.englishName} · ${s.englishNameTranslation} · ${s.numberOfAyahs} ആയത്തുകൾ</div></div>
      <label class="trsel">പരിഭാഷ:
        <select id="tr">${TRANSLATIONS.map(t => `<option value="${t.id}"${t.id === tr ? ' selected' : ''}>${t.label}</option>`).join('')}</select>
      </label>
      ${showBism ? `<div class="bismillah">${BISM}</div>` : ''}
      ${ar.ayahs.map((a, i) => {
        let text = a.text;
        if (i === 0 && showBism) {
          // API prepends the bismillah to ayah 1; strip it by dropping the first 4 words
          const words = text.split(' ');
          if (words.length > 4) text = words.slice(4).join(' ');
        }
        return `<div class="ayah"><div class="row"><span class="num">${a.numberInSurah}</span>
          <button data-i="${i}">${PLAY}</button></div>
          <div class="arabic">${esc(text)}</div><div class="ml${isEn ? ' en' : ''}"${isEn ? ' lang="en"' : ''}>${esc(ml.ayahs[i].text)}</div></div>`;
      }).join('')}
      <div style="display:flex;justify-content:space-between;margin-top:12px">
        ${n > 1 ? `<a class="back" href="#/surah/${n - 1}">← മുമ്പത്തെ</a>` : '<span></span>'}
        ${n < 114 ? `<a class="back" href="#/surah/${n + 1}">അടുത്തത് →</a>` : ''}</div>`;
    window.scrollTo(0, 0);
    document.getElementById('tr').onchange = e => {
      localStorage.setItem('tr', e.target.value);
      const y = window.scrollY;
      surah(n).then(() => window.scrollTo(0, y));
    };
    app.querySelectorAll('.ayah button').forEach(b => b.onclick = () => play(b, au.ayahs[+b.dataset.i].audio));
  } catch { msg(ERR); }
}

function play(btn, url) {
  const same = audio && audio.src === url && !audio.paused;
  if (audio) { audio.pause(); document.querySelectorAll('.ayah button').forEach(b => b.textContent = PLAY); }
  if (same) return;
  audio = new Audio(url);
  btn.textContent = STOP;
  audio.onended = () => btn.textContent = PLAY;
  audio.play().catch(() => btn.textContent = PLAY);
}

// PWA: service worker + install button
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
let deferredInstall = null;
const installBtn = document.getElementById('install');
addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; installBtn.hidden = false; });
installBtn.onclick = async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null; installBtn.hidden = true;
};
addEventListener('appinstalled', () => installBtn.hidden = true);

function route() {
  if (audio) { audio.pause(); audio = null; }
  const m = location.hash.match(/^#\/surah\/(\d+)/);
  m ? surah(+m[1]) : home();
}
addEventListener('hashchange', route);
route();
