'use strict';

const FAVORITES_KEY = 'masar-restaurants-favorites-v1';
const state = { all: [], filtered: [], visible: 24, pageSize: 24, favorites: new Set(), favoritesOnly: false };
const els = {};

document.addEventListener('DOMContentLoaded', () => {
  Object.assign(els, {
    grid: document.querySelector('#restaurantsGrid'), status: document.querySelector('#statusArea'),
    search: document.querySelector('#searchInput'), category: document.querySelector('#categoryFilter'),
    rating: document.querySelector('#ratingFilter'), location: document.querySelector('#locationFilter'), sort: document.querySelector('#sortSelect'),
    clear: document.querySelector('#clearFilters'), summary: document.querySelector('#resultsSummary'),
    loadMore: document.querySelector('#loadMore'), template: document.querySelector('#restaurantCardTemplate'),
    dialog: document.querySelector('#detailsDialog'), dialogContent: document.querySelector('#dialogContent'),
    closeDialog: document.querySelector('#closeDialog'), theme: document.querySelector('#themeToggle'),
    toTop: document.querySelector('#toTop'), favoritesOnly: document.querySelector('#favoritesOnly'),
    favoritesCount: document.querySelector('#favoritesCount'), copyFavorites: document.querySelector('#copyFavorites')
  });
  loadFavorites();
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
    populateLocations();
    updateStats();
    updateFavoritesUI();
    applyFilters();
  } catch (error) {
    console.error('تعذر تحميل ملف المطاعم:', error);
    showStatus('تعذر قراءة ملف Restaurants/madinah_restaurants.json. افتح الصفحة من بوابة مسار أو عبر خادم محلي، وتأكد من بقاء الملف في مساره الصحيح.', true);
  }
}

function normalize(item) {
  const name = clean(item.name);
  const address = clean(item.address);
  return {
    id: restaurantId(name, address), name, rating: num(item.google_rating), reviews: Math.max(0, Math.round(num(item.reviews_count))),
    phone: clean(item.phone) || null, address, category: clean(item.cuisine_category) || null,
    location: extractLocation(address)
  };
}
function clean(value){ return typeof value === 'string' ? value.trim() : ''; }
function num(value){ const n = Number(value); return Number.isFinite(n) ? n : 0; }
function restaurantId(name,address){ return `${name}|${address}`.toLowerCase().replace(/\s+/g,' ').trim(); }
function extractLocation(address){
  if(!address) return 'غير محدد';
  const parts=address.split(/[,،]/).map(clean).filter(Boolean);
  const generic=/^(saudi arabia|المملكة العربية السعودية|madinah(?:\s+\d+)?|medina(?:\s+\d+)?|المدينة المنورة|المدينة)$/i;
  const meaningful=parts.filter(part=>!generic.test(part) && !/^\d+$/.test(part));
  if(!meaningful.length) return 'غير محدد';
  const madinahIndex=parts.findIndex(part=>/^(madinah|medina|المدينة)/i.test(part));
  if(madinahIndex>0){
    for(let i=madinahIndex-1;i>=0;i--){ if(!generic.test(parts[i]) && !/^\d+$/.test(parts[i])) return parts[i]; }
  }
  return meaningful.length>1 ? meaningful[meaningful.length-1] : meaningful[0];
}
function loadFavorites(){
  try{ const saved=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]'); state.favorites=new Set(Array.isArray(saved)?saved:[]); }
  catch{ state.favorites=new Set(); }
}
function saveFavorites(){ localStorage.setItem(FAVORITES_KEY,JSON.stringify([...state.favorites])); }

function deduplicate(items){ const seen=new Set(); return items.filter(x=>{const key=`${x.name}|${x.address}`.toLowerCase();if(seen.has(key))return false;seen.add(key);return true;}); }

function bindEvents() {
  [els.search, els.category, els.location, els.rating, els.sort].forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { state.visible = state.pageSize; applyFilters(); }));
  els.clear.addEventListener('click', clearFilters);
  els.favoritesOnly.addEventListener('click', toggleFavoritesOnly);
  els.copyFavorites.addEventListener('click', copyFavoritesList);
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

function populateLocations() {
  const counts = new Map();
  state.all.forEach(r => {
    const locationName = clean(r.location) || 'غير محدد';
    counts.set(locationName, (counts.get(locationName) || 0) + 1);
  });

  els.location.replaceChildren(new Option('جميع المواقع', 'all'));
  const fragment = document.createDocumentFragment();
  [...counts.entries()]
    .sort(([a],[b]) => a.localeCompare(b, 'ar', { sensitivity: 'base' }))
    .forEach(([locationName, count]) => {
      fragment.append(new Option(`${locationName} (${formatNumber(count)})`, locationName));
    });
  els.location.append(fragment);
  els.location.disabled = counts.size === 0;
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
  const cat=els.category.value; const location=els.location.value; const minRating=Number(els.rating.value);
  state.filtered=state.all.filter(r => {
    const hay=`${r.name} ${r.address} ${r.category||''}`.toLowerCase();
    return (!q || hay.includes(q)) && (cat==='all' || r.category===cat) && (location==='all' || r.location===location) && r.rating>=minRating && (!state.favoritesOnly || state.favorites.has(r.id));
  });
  sortRestaurants(state.filtered, els.sort.value);
  els.clear.hidden = !(q || cat!=='all' || location!=='all' || minRating || els.sort.value!=='recommended' || state.favoritesOnly);
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
  const favorite=card.querySelector('.favorite-btn'); updateFavoriteButton(favorite,r); favorite.addEventListener('click',e=>{e.stopPropagation();toggleFavorite(r,favorite);});
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
  const favorite=document.createElement('button'); favorite.className='dialog-favorite'; updateFavoriteButton(favorite,r,true); favorite.addEventListener('click',()=>{toggleFavorite(r,favorite,true);});
  const map=document.createElement('a'); map.href=maps; map.target='_blank'; map.rel='noopener'; map.textContent='فتح الموقع';
  actions.append(favorite,map);
  if(r.phone){const call=document.createElement('a');call.className='secondary';call.href=`tel:${r.phone.replace(/[^+\d]/g,'')}`;call.textContent='اتصال';actions.append(call);}
  body.append(kicker,title,grid,address,actions); els.dialogContent.replaceChildren(body); els.dialog.showModal();
}
function info(label,value){const box=document.createElement('div');box.className='dialog-info';const s=document.createElement('span');s.textContent=label;const b=document.createElement('strong');b.textContent=value;box.append(s,b);return box;}

function isFavorite(r){ return state.favorites.has(r.id); }
function updateFavoriteButton(button,r,inDialog=false){
  const active=isFavorite(r); button.setAttribute('aria-pressed',String(active));
  button.textContent=active?'♥':'♡';
  button.setAttribute('aria-label',active?'إزالة من المفضلة':'إضافة إلى المفضلة');
  button.title=active?'إزالة من المفضلة':'إضافة إلى المفضلة';
  if(inDialog) button.classList.toggle('is-favorite',active);
}
function toggleFavorite(r,button,inDialog=false){
  if(isFavorite(r)) state.favorites.delete(r.id); else state.favorites.add(r.id);
  saveFavorites(); updateFavoriteButton(button,r,inDialog); updateFavoritesUI();
  document.querySelectorAll('.restaurant-card').forEach(card=>{
    const name=card.querySelector('.restaurant-name')?.textContent;
    const address=card.querySelector('.address')?.textContent;
    if(restaurantId(name||'',address||'')===r.id) updateFavoriteButton(card.querySelector('.favorite-btn'),r);
  });
  if(state.favoritesOnly) applyFilters();
}
function toggleFavoritesOnly(){
  state.favoritesOnly=!state.favoritesOnly; state.visible=state.pageSize; updateFavoritesUI(); applyFilters();
}
function updateFavoritesUI(){
  const count=state.favorites.size; els.favoritesCount.textContent=formatNumber(count);
  els.favoritesOnly.setAttribute('aria-pressed',String(state.favoritesOnly));
  els.favoritesOnly.classList.toggle('is-active',state.favoritesOnly);
  els.copyFavorites.disabled=count===0;
}
async function copyFavoritesList(){
  const favorites=state.all.filter(r=>state.favorites.has(r.id));
  if(!favorites.length) return;
  const lines=favorites.map((r,i)=>{
    const maps=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} ${r.address}`)}`;
    return `${i+1}. ${r.name}\nالتقييم: ${r.rating?r.rating.toFixed(1):'غير متوفر'} (${formatNumber(r.reviews)} تقييم)\nالهاتف: ${r.phone||'غير متوفر'}\nالعنوان: ${r.address||'غير متوفر'}\nالموقع: ${maps}`;
  });
  const value=`مطاعمي المفضلة في المدينة المنورة (${favorites.length})\n\n${lines.join('\n\n')}`;
  const ok=await copyText(value);
  if(ok){ const old=els.copyFavorites.textContent; els.copyFavorites.textContent='تم النسخ ✓'; setTimeout(()=>els.copyFavorites.textContent=old,1500); }
}
async function copyText(value){
  try{ await navigator.clipboard.writeText(value); return true; }
  catch{
    const area=document.createElement('textarea'); area.value=value; area.style.position='fixed'; area.style.opacity='0'; document.body.append(area); area.select();
    const ok=document.execCommand('copy'); area.remove(); return ok;
  }
}

async function copyPhone(phone,button){try{await navigator.clipboard.writeText(phone);const old=button.textContent;button.textContent='✓';setTimeout(()=>button.textContent=old,1200);}catch{button.title='تعذر النسخ';}}
function clearFilters(){els.search.value='';els.category.value='all';els.location.value='all';els.rating.value='0';els.sort.value='recommended';state.favoritesOnly=false;state.visible=state.pageSize;updateFavoritesUI();applyFilters();}
function showStatus(message,isError){els.status.hidden=false;els.status.innerHTML='';const p=document.createElement('p');p.textContent=message;if(isError)p.setAttribute('role','alert');els.status.append(p);}
function formatNumber(n){return new Intl.NumberFormat('ar-SA').format(n);}
function compact(n){return new Intl.NumberFormat('ar-SA',{notation:'compact',maximumFractionDigits:1}).format(n);}
function loadTheme(){const saved=localStorage.getItem('masar-restaurants-theme');const dark=saved==='dark'||(!saved&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=dark?'dark':'light';updateThemeLabel();}
function toggleTheme(){document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';localStorage.setItem('masar-restaurants-theme',document.documentElement.dataset.theme);updateThemeLabel();}
function updateThemeLabel(){els.theme.setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن');}
