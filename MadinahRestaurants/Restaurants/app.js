'use strict';

const state = { all: [], filtered: [], visible: 24, pageSize: 24 };
const els = {};

document.addEventListener('DOMContentLoaded', () => {
  Object.assign(els, {
    grid: document.querySelector('#restaurantsGrid'), status: document.querySelector('#statusArea'),
    search: document.querySelector('#searchInput'), category: document.querySelector('#categoryFilter'),
    rating: document.querySelector('#ratingFilter'), sort: document.querySelector('#sortSelect'),
    clear: document.querySelector('#clearFilters'), summary: document.querySelector('#resultsSummary'),
    loadMore: document.querySelector('#loadMore'), template: document.querySelector('#restaurantCardTemplate'),
    dialog: document.querySelector('#detailsDialog'), dialogContent: document.querySelector('#dialogContent'),
    closeDialog: document.querySelector('#closeDialog'), theme: document.querySelector('#themeToggle'),
    toTop: document.querySelector('#toTop')
  });
  bindEvents();
  loadTheme();
  loadData();
});

async function loadData() {
  try {
    const dataUrl = './Restaurants/madinah_restaurants.json';
    const response = await fetch(dataUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const raw = Array.isArray(payload) ? payload : payload.restaurants;

    if (!Array.isArray(raw)) throw new Error('صيغة JSON غير مدعومة');
    state.all = deduplicate(raw.map(normalize).filter(x => x.name));
    populateCategories();
    updateStats();
    applyFilters();
  } catch (error) {
    console.error('تعذر تحميل ملف المطاعم:', error);
    showStatus('تعذر قراءة ملف Restaurants/madinah_restaurants.json. افتح الصفحة من بوابة مسار أو عبر خادم محلي، وتأكد من بقاء الملف في مساره الصحيح.', true);
  }
}

function normalize(item) {
  return {
    name: clean(item.name), rating: num(item.google_rating), reviews: Math.max(0, Math.round(num(item.reviews_count))),
    phone: clean(item.phone) || null, address: clean(item.address), category: clean(item.cuisine_category) || null
  };
}
function clean(value){ return typeof value === 'string' ? value.trim() : ''; }
function num(value){ const n = Number(value); return Number.isFinite(n) ? n : 0; }
function deduplicate(items){ const seen=new Set(); return items.filter(x=>{const key=`${x.name}|${x.address}`.toLowerCase();if(seen.has(key))return false;seen.add(key);return true;}); }

function bindEvents() {
  [els.search, els.category, els.rating, els.sort].forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { state.visible = state.pageSize; applyFilters(); }));
  els.clear.addEventListener('click', clearFilters);
  els.loadMore.addEventListener('click', () => { state.visible += state.pageSize; renderCards(); });
  els.closeDialog.addEventListener('click', () => els.dialog.close());
  els.dialog.addEventListener('click', e => { if (e.target === els.dialog) els.dialog.close(); });
  els.theme.addEventListener('click', toggleTheme);
  window.addEventListener('scroll', () => els.toTop.classList.toggle('visible', window.scrollY > 850), {passive:true});
  els.toTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

function populateCategories() {
  [...new Set(state.all.map(x => x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ar')).forEach(cat => {
    const option=document.createElement('option'); option.value=cat; option.textContent=cat; els.category.append(option);
  });
}

function updateStats() {
  const rated=state.all.filter(x=>x.rating>0);
  const average=rated.length ? rated.reduce((s,x)=>s+x.rating,0)/rated.length : 0;
  const totalReviews=state.all.reduce((s,x)=>s+x.reviews,0);
  const categories=new Set(state.all.map(x=>x.category).filter(Boolean)).size;
  setText('#statCount', formatNumber(state.all.length));
  setText('#statAverage', average.toFixed(1));
  setText('#statReviews', compact(totalReviews));
  setText('#statCategories', formatNumber(categories));
}
function setText(selector,value){ document.querySelector(selector).textContent=value; }

function applyFilters() {
  const q=els.search.value.trim().toLowerCase();
  const cat=els.category.value; const minRating=Number(els.rating.value);
  state.filtered=state.all.filter(r => {
    const hay=`${r.name} ${r.address} ${r.category||''}`.toLowerCase();
    return (!q || hay.includes(q)) && (cat==='all' || r.category===cat) && r.rating>=minRating;
  });
  sortRestaurants(state.filtered, els.sort.value);
  els.clear.hidden = !(q || cat!=='all' || minRating || els.sort.value!=='recommended');
  renderCards();
}

function sortRestaurants(items, mode) {
  const collator=new Intl.Collator('ar',{sensitivity:'base'});
  const score=r => (r.rating*20) + Math.log10(r.reviews+1)*8;
  items.sort((a,b)=>{
    if(mode==='rating-desc') return b.rating-a.rating || b.reviews-a.reviews;
    if(mode==='reviews-desc') return b.reviews-a.reviews || b.rating-a.rating;
    if(mode==='reviews-asc') return a.reviews-b.reviews || b.rating-a.rating;
    if(mode==='name-asc') return collator.compare(a.name,b.name);
    return score(b)-score(a);
  });
}

function renderCards() {
  els.grid.textContent='';
  const slice=state.filtered.slice(0,state.visible);
  els.summary.textContent=`عرض ${formatNumber(slice.length)} من أصل ${formatNumber(state.filtered.length)} نتيجة`;
  if (!state.filtered.length) { els.grid.hidden=true; showStatus('لا توجد مطاعم مطابقة. جرّب تعديل البحث أو إزالة بعض الفلاتر.', false); els.loadMore.hidden=true; return; }
  els.status.replaceChildren();
  els.status.hidden = true;
  els.grid.hidden = false;
  const frag=document.createDocumentFragment();
  slice.forEach((restaurant,index)=>frag.append(createCard(restaurant,index)));
  els.grid.append(frag);
  els.loadMore.hidden = state.visible >= state.filtered.length;
}

function createCard(r,index) {
  const card=els.template.content.firstElementChild.cloneNode(true);
  card.style.animationDelay=`${Math.min(index,12)*22}ms`;
  text(card,'.restaurant-name',r.name); text(card,'.rating-value',r.rating ? r.rating.toFixed(1) : '—');
  text(card,'.reviews-count',`(${compact(r.reviews)} تقييم)`); text(card,'.address',r.address || 'العنوان غير متوفر');
  const category=card.querySelector('.category-badge'); if(r.category){category.textContent=r.category;category.hidden=false;}
  const phone=card.querySelector('.phone-text'); phone.textContent=r.phone || 'رقم الهاتف غير متوفر'; phone.classList.toggle('unavailable',!r.phone);
  renderBadges(card.querySelector('.commercial-badges'),r);
  const call=card.querySelector('.call-btn'), copy=card.querySelector('.copy-btn');
  if(r.phone){call.href=`tel:${r.phone.replace(/[^+\d]/g,'')}`;copy.addEventListener('click',()=>copyPhone(r.phone,copy));}
  else{call.setAttribute('aria-disabled','true');call.removeAttribute('href');copy.disabled=true;}
  const maps=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address}`)}`;
  card.querySelector('.map-btn').href=maps;
  const open=()=>openDialog(r,maps);
  card.querySelector('.details-btn').addEventListener('click',open);
  card.addEventListener('keydown',e=>{if(e.key==='Enter' && !e.target.closest('a,button'))open();});
  return card;
}
function text(root,selector,value){ root.querySelector(selector).textContent=value; }
function renderBadges(container,r){
  const badges=[]; if(r.rating>=4.7 && r.reviews>=500)badges.push('تقييم مرتفع'); if(r.reviews>=5000)badges.push('الأكثر شهرة'); if(r.rating>=4.5&&r.reviews>=1000&&!badges.includes('الأكثر شهرة'))badges.push('موصى به');
  badges.slice(0,2).forEach(label=>{const span=document.createElement('span');span.textContent=label;container.append(span);});
}

function openDialog(r,maps) {
  const body=document.createElement('div'); body.className='dialog-body';
  const kicker=document.createElement('div'); kicker.className='dialog-kicker'; kicker.textContent=r.category||'مطعم';
  const title=document.createElement('h2'); title.id='dialogTitle'; title.textContent=r.name;
  const grid=document.createElement('div'); grid.className='dialog-grid';
  grid.append(info('تقييم Google',r.rating?r.rating.toFixed(1):'غير متوفر'),info('عدد المراجعات',`${formatNumber(r.reviews)} تقييم`),info('رقم الهاتف',r.phone||'غير متوفر'));
  const address=info('العنوان',r.address||'غير متوفر'); address.classList.add('dialog-address');
  const actions=document.createElement('div'); actions.className='dialog-actions';
  const map=document.createElement('a'); map.href=maps; map.target='_blank'; map.rel='noopener'; map.textContent='فتح الموقع';
  actions.append(map);
  if(r.phone){const call=document.createElement('a');call.className='secondary';call.href=`tel:${r.phone.replace(/[^+\d]/g,'')}`;call.textContent='اتصال';actions.append(call);}
  body.append(kicker,title,grid,address,actions); els.dialogContent.replaceChildren(body); els.dialog.showModal();
}
function info(label,value){const box=document.createElement('div');box.className='dialog-info';const s=document.createElement('span');s.textContent=label;const b=document.createElement('strong');b.textContent=value;box.append(s,b);return box;}

async function copyPhone(phone,button){try{await navigator.clipboard.writeText(phone);const old=button.textContent;button.textContent='✓';setTimeout(()=>button.textContent=old,1200);}catch{button.title='تعذر النسخ';}}
function clearFilters(){els.search.value='';els.category.value='all';els.rating.value='0';els.sort.value='recommended';state.visible=state.pageSize;applyFilters();}
function showStatus(message,isError){els.status.hidden=false;els.status.innerHTML='';const p=document.createElement('p');p.textContent=message;if(isError)p.setAttribute('role','alert');els.status.append(p);}
function formatNumber(n){return new Intl.NumberFormat('ar-SA').format(n);}
function compact(n){return new Intl.NumberFormat('ar-SA',{notation:'compact',maximumFractionDigits:1}).format(n);}
function loadTheme(){const saved=localStorage.getItem('masar-restaurants-theme');const dark=saved==='dark'||(!saved&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';updateThemeLabel();}
function toggleTheme(){document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('masar-restaurants-theme',document.documentElement.dataset.theme);updateThemeLabel();}
function updateThemeLabel(){els.theme.setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن');}
