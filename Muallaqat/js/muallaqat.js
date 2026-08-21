(() => {
'use strict';

const POETS = [
  { id: 'imru-al-qais', name: 'امرؤ القيس' },
  { id: 'tarafa', name: 'طرفة بن العبد' },
  { id: 'antara', name: 'عنترة بن شداد' },
  { id: 'zuhair', name: 'زهير بن أبي سلمى' }
];

const poem = document.getElementById('poem');
const sections = document.getElementById('sections');
const search = document.getElementById('search');
const empty = document.getElementById('empty');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const topBtn = document.getElementById('topBtn');
const themeBtn = document.getElementById('themeBtn');
const poetSelect = document.getElementById('poetSelect');
const poetName = document.getElementById('poetName');
const openingLine = document.getElementById('openingLine');
const metaLine = document.getElementById('metaLine');
const textInfoBody = document.getElementById('textInfoBody');
const loadState = document.getElementById('loadState');

let DATA = [];
let poemMeta = null;
let sectionNames = ['الكل'];
let activeSection = 'الكل';
let fontScale = +(localStorage.getItem('masar-muallaqat-font') || 1);

const arNum = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

function getPoetId() {
  const raw = new URLSearchParams(location.search).get('poet') || 'imru-al-qais';
  return POETS.some(p => p.id === raw) ? raw : 'imru-al-qais';
}

function setupPoetSelector(id) {
  poetSelect.innerHTML = POETS.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
  poetSelect.value = id;
}

function renderMeta(meta) {
  poetName.textContent = meta.poet || meta.title || 'المعلقات';
  openingLine.textContent = meta.opening || '';
  metaLine.innerHTML = `
    <span><b>${esc(meta.verseCount ?? DATA.length)}</b> بيتًا</span>
    <i>•</i><span>البحر ${esc(meta.meter || '—')}</span>
    <i>•</i><span>القافية: ${esc(meta.rhyme || '—')}</span>`;

  const status = meta.textualStatus ? `<p><b>حالة النص:</b> ${esc(meta.textualStatus)}.</p>` : '';
  const note = meta.textualNote ? `<p>${esc(meta.textualNote)}</p>` : '';
  textInfoBody.innerHTML = `
    <p><b>النص المعتمد:</b> ${esc(meta.narration || '')}${meta.source ? ' — ' + esc(meta.source) : ''}.</p>
    ${status}${note}
    ${meta.sectionsNote ? `<p>${esc(meta.sectionsNote)}</p>` : ''}`;
  document.title = `${meta.title || meta.poet || 'المعلقات'} — بوابة مسار`;
}

function renderSections() {
  sections.innerHTML = sectionNames.map(s =>
    `<button class="sec ${s === activeSection ? 'active' : ''}" data-s="${esc(s)}">${esc(s)}</button>`
  ).join('');
}

function verseHTML(x) {
  const vocab = (x.vocabulary || []).map(v =>
    `<div class="word"><b>${esc(v.word)}</b><span>${esc(v.meaning)}</span></div>`
  ).join('');
  const txt = [x.first, x.second, x.meaning, x.variant,
    ...(x.vocabulary || []).flatMap(v => [v.word, v.meaning])].filter(Boolean).join(' ');

  return `<article class="verse" id="v${x.number}" data-n="${x.number}" data-section="${esc(x.section)}" data-text="${esc(txt)}">
    <button class="vhead" aria-expanded="false">
      <span class="num">${arNum(x.number)}</span>
      <span class="bayt"><span class="shatr">${esc(x.first)}</span><span class="shatr">${esc(x.second)}</span></span>
      <span class="plus">＋</span>
    </button>
    <div class="detail"><div class="inner"><div class="panel">
      <div><div class="label">المعنى المبسّط</div><p class="meaning">${esc(x.meaning)}</p>
        ${x.variant ? `<div class="variant"><span>اختلاف الرواية</span>${esc(x.variant)}</div>` : ''}
      </div>
      <div><div class="label">معاني الكلمات</div><div class="vocab">${vocab || '<div class="word"><span>لا توجد ألفاظ مشروحة لهذا البيت.</span></div>'}</div></div>
    </div></div></div>
  </article>`;
}

function bindVerses() {
  document.querySelectorAll('.vhead').forEach(btn => btn.addEventListener('click', () => {
    const v = btn.closest('.verse');
    v.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(v.classList.contains('open')));
    localStorage.setItem(`masar-muallaqat-last-${poemMeta.id}`, v.dataset.n);
  }));
}

function render() {
  poem.innerHTML = DATA.map(verseHTML).join('');
  bindVerses();
  applyFilter();
  setFont();

  const saved = +(localStorage.getItem(`masar-muallaqat-last-${poemMeta.id}`) || 0);
  if (saved && !location.hash) history.replaceState(null, '', location.pathname + location.search + '#v' + saved);
  setTimeout(() => {
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView({block: 'center'});
  }, 80);
}

function norm(s) {
  return String(s).toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

function applyFilter() {
  const q = norm(search.value.trim());
  let count = 0;
  document.querySelectorAll('.verse').forEach(v => {
    const ok = (activeSection === 'الكل' || v.dataset.section === activeSection) &&
      (!q || norm(v.dataset.text).includes(q));
    v.classList.toggle('hidden', !ok);
    if (ok) count++;
  });
  empty.style.display = count ? 'none' : 'block';
}

function setFont() {
  document.querySelectorAll('.bayt').forEach(el => {
    el.style.fontSize = `calc(clamp(1.22rem,3vw,1.62rem) * ${fontScale})`;
  });
  localStorage.setItem('masar-muallaqat-font', fontScale);
}

function initTheme() {
  const saved = localStorage.getItem('masar-theme') || localStorage.getItem('masarTheme') || localStorage.getItem('theme');
  document.documentElement.dataset.theme = (saved === 'dark' || saved === 'light')
    ? saved
    : (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
}

function usePoem(meta) {
  if (!meta || !Array.isArray(meta.verses)) throw new Error('Invalid poem data');
  if (!meta.id || meta.id !== getPoetId()) throw new Error('Poem id mismatch');
  if (Number(meta.verseCount) !== meta.verses.length) throw new Error('Verse count mismatch');

  poemMeta = meta;
  DATA = meta.verses;
  activeSection = 'الكل';
  search.value = '';
  sectionNames = ['الكل', ...new Set(DATA.map(x => x.section).filter(Boolean))];
  renderMeta(meta);
  renderSections();
  render();
  loadState.hidden = true;
}

async function loadPoem() {
  const id = getPoetId();
  setupPoetSelector(id);
  try {
    const response = await fetch(`poets/${id}.json`, {cache: 'no-store'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    usePoem(await response.json());
  } catch (err) {
    console.error(err);
    loadState.innerHTML = '<b>تعذر تحميل بيانات القصيدة.</b><br><span>تأكد من رفع الصفحة عبر خادم ويب ومن وجود ملف الشاعر داخل مجلد poets.</span>';
    loadState.classList.add('error');
  }
}

poetSelect.addEventListener('change', () => {
  const id = poetSelect.value;
  if (!POETS.some(p => p.id === id)) return;
  location.href = `${location.pathname}?poet=${encodeURIComponent(id)}`;
});

sections.addEventListener('click', e => {
  const b = e.target.closest('.sec');
  if (!b) return;
  activeSection = b.dataset.s;
  renderSections();
  applyFilter();
});

search.addEventListener('input', applyFilter);
document.getElementById('fontBtn').addEventListener('click', () => {
  fontScale = fontScale >= 1.25 ? .9 : Math.round((fontScale + .1) * 10) / 10;
  setFont();
});

themeBtn.addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  localStorage.setItem('masar-theme', t);
});

addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0;
  progressBar.style.width = pct + '%';
  progressLabel.textContent = arNum(Math.round(pct)) + '٪';
  topBtn.classList.toggle('show', scrollY > 700);
  if (!poemMeta) return;
  const c = [...document.querySelectorAll('.verse:not(.hidden)')]
    .filter(v => v.getBoundingClientRect().top < innerHeight * .55);
  if (c.length) localStorage.setItem(`masar-muallaqat-last-${poemMeta.id}`, c.at(-1).dataset.n);
}, {passive: true});

topBtn.addEventListener('click', () => scrollTo({top: 0, behavior: 'smooth'}));

initTheme();
loadPoem();
})();

