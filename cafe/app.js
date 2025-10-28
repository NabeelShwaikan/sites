/* assets/js/app.js */
'use strict';

/* ========= أدوات مختصرة ========= */
const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* ========= عدّاد العنوان والألسنة ========= */
function setCountsUI(){
  const total = Array.isArray(DRINKS) ? DRINKS.length : 0;
  const titleEl = $('#title');
  const tabReady = $('#tab-ready');
/*  if(titleEl)  titleEl.textContent  = `بوابة القهوة  (${total} مشروب)`; */
  if(tabReady) tabReady.textContent = `القائمة الكاملة (${total})`;
}

/* ========= الثيم ========= */
const themeBtns = $$('#themes .tbtn');
function setTheme(name){
  if(name==='light'){
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  }else{
    document.documentElement.setAttribute('data-theme', name);
    document.body.setAttribute('data-theme', name);
  }
  themeBtns.forEach(b=>b.classList.toggle('active', b.dataset.theme===name));
  localStorage.setItem('coffee:theme', name);
}
(function initTheme(){
  const saved = localStorage.getItem('coffee:theme') || 'cafe';
  setTheme(saved);
  setCountsUI();
})();
themeBtns.forEach(b=>{
  b.title = b.dataset.theme==='light'?'ثيم فاتح':b.dataset.theme==='dark'?'ثيم داكن':'ثيم مقهى';
  b.setAttribute('aria-pressed','false');
  b.onclick = ()=>{
    setTheme(b.dataset.theme);
    themeBtns.forEach(x=>x.setAttribute('aria-pressed', String(x===b)));
  };
});

/* ========= تبويبات ========= */
$$('.tab').forEach(t=>t.onclick=()=>{
  $$('.tab').forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  $$('.section').forEach(s=>s.classList.remove('active'));
  $('#'+t.dataset.tab).classList.add('active');
  history.replaceState(null,'',`?tab=${t.dataset.tab}`);
});
(function syncTabFromURL(){
  const tab=new URLSearchParams(location.search).get('tab');
  if(tab){ const el=$(`.tab[data-tab="${tab}"]`); if(el) el.click(); }
})();

/* ========= بطاقات الشبكة ========= */
function badge(text,cls=''){ return `<span class="badge ${cls}">${text}</span>`; }
function iconsFor(d){
  const has=(x)=> (d.required||[]).includes(x) || (d.optional||[]).includes(x);
  const base = [];
  if(has('حليب')||has('حليب مكثف')||has('كريمة')||has('كريمة خفيفة')) base.push('🥛');
  if(has('شوكولاتة')||has('كاكاو')||has('شوكولاتة بيضاء')) base.push('🍫');
  if(has('رغوة'))  base.push('🫧');
  if(has('ثلج'))    base.push('🧊');
  if(has('عسل'))    base.push('🍯');
  if(has('ليمون')||has('شريحة ليمون')) base.push('🍋');
  if(has('تونك'))   base.push('🥤');
  return base.join(' ');
}
function card(drink){
  const el=document.createElement('div'); el.className='card'; el.setAttribute('data-id', drink.id);
  el.innerHTML = `
    <div class="row">
      <strong>${drink.name}</strong>
      ${badge(drink.category,'cat')}
      ${badge('القوة: '+drink.strength,'strength')}
      ${badge('البن: '+(drink.bean==='blend'?'خلطة':drink.bean==='arabica'?'أرابيكا':drink.bean==='robusta'?'روبوستا':drink.bean==='none'?'—':drink.bean),'bean')}
    </div>
    <div class="muted">${drink.subCategory||''}</div>
    <div>${drink.description||''}</div>
    <div class="muted">${iconsFor(drink)}</div>
    <div class="row">
      <button data-id="${drink.id}">تفاصيل</button>
    </div>`;
  el.querySelector('[data-id]').onclick=()=>openDetails(drink);
  return el;
}
function renderReady(filterCat){
  const wrap=$('#readyWrap'); if(!wrap) return; wrap.innerHTML='';
  const cats=['إسبرسو','ترشيح','باردة','تراثية','تخصصية','حلويات','بدائل'];
  const makeSection=(cat)=>{
    const sec=document.createElement('section'); sec.setAttribute('data-cat',cat);
    const head=document.createElement('div'); head.className='cat-head';
    const items=DRINKS.filter(d=>d.category===cat).sort((a,b)=>a.name.localeCompare(b.name,'ar'));
    const total = items.length;
    const hot   = items.filter(d=>d.temperature==='hot').length;
    const iced  = items.filter(d=>d.temperature==='iced').length;
    const either= items.filter(d=>d.temperature==='either').length;
    head.innerHTML=`<div><h3>${cat}</h3><span class="badge">${total} عناصر</span><span class="subcounts">☀️ ساخنة: ${hot} | 🧊 باردة: ${iced}${either? ` | ♻️ مرنة: ${either}`:''}</span></div>`;
    const toggle=document.createElement('button'); toggle.className='ghost fold-btn'; toggle.textContent='طيّ';
    head.appendChild(toggle); sec.appendChild(head);
    const grid=document.createElement('div'); grid.className='grid'; sec.appendChild(grid);
    items.forEach(d=> grid.appendChild(card(d)));
    toggle.onclick=()=>{ const closed=grid.style.display==='none'; grid.style.display = closed? 'grid':'none'; toggle.textContent = closed? 'طيّ':'فتح'; };
    return sec;
  };
  cats.filter(c=>!filterCat || c===filterCat).forEach(cat=> wrap.appendChild(makeSection(cat)));
}
// شريط تصنيفات علوي
(function initReadyCats(){
  const box=$('#readyCats'); if(!box) return; box.innerHTML='';
  const cats=['إسبرسو','ترشيح','باردة','تراثية','تخصصية','حلويات','بدائل'];
  const allBtn=document.createElement('button'); allBtn.className='tbtn active'; allBtn.textContent='الكل'; box.appendChild(allBtn);
  const setActive=(btn)=>{ Array.from(box.children).forEach(b=>b.classList.remove('active')); btn.classList.add('active'); };
  allBtn.onclick=()=>{ setActive(allBtn); renderReady(); };
  cats.forEach(cat=>{ const b=document.createElement('button'); b.className='tbtn'; b.textContent=cat; b.onclick=()=>{ setActive(b); renderReady(cat); }; box.appendChild(b); });
  $('#expandAll').onclick=()=>{ document.querySelectorAll('#readyWrap .grid').forEach(g=> g.style.display='grid'); };
  $('#collapseAll').onclick=()=>{ document.querySelectorAll('#readyWrap .grid').forEach(g=> g.style.display='none'); };
})();

/* ========= "اصنع مودك" ========= */
const INGREDIENTS = ['شوكولاتة','فانيلا','بندق','عسل','حليب','رغوة','فستق','زعفران','كراميل','ثلج','توابل'];
const SPICES      = ['هيل','زعفران','قرنفل'];
(function renderIngredientCheckboxes(){
  const box=$('#ingBox'); if(!box) return;
  const wrap=document.createElement('div');
  wrap.className='filters';
  wrap.style.marginTop='6px';
  INGREDIENTS.forEach((name,i)=>{
    const id='ing_'+i;
    const label=document.createElement('label');
    label.style.display='inline-flex';
    label.style.alignItems='center';
    label.style.gap='6px';
    label.style.padding='6px 10px';
    label.style.border='1px solid var(--b)';
    label.style.borderRadius='10px';
    label.style.background='var(--chip)';
    label.innerHTML = `<input type="checkbox" id="${id}" data-ing="${name}"> <span>${name}</span>`;
    wrap.appendChild(label);
  });
  box.appendChild(wrap);
})();
function score(drink,{temp,milk,sweet,bean,ings}){
  let s=0;
  // حرارة
  if(temp==='any' || drink.temperature==='either' || drink.temperature===temp) s+=25; else s-=10;
  // حليب
  const hasMilk = (drink.required||[]).includes('حليب') || (drink.optional||[]).includes('حليب') || (drink.required||[]).includes('حليب مكثف') || (drink.required||[]).includes('كريمة') || (drink.required||[]).includes('كريمة خفيفة');
  if(milk==='any' || (milk==='with'&&hasMilk) || (milk==='without'&&!hasMilk)) s+=25; else s-=10;
  // نوع البن
  if(bean==='any' || drink.bean===bean || (bean==='blend'&&drink.bean==='blend')) s+=25; else s+=10;
  // الحلاوة (تصنيفات صديقة للحلاوة)
  const sweetFriendly = ['تخصصية','حلويات','باردة'].includes(drink.category);
  if(sweet==='any') s+=25;
  else if(sweet==='none')   s+= sweetFriendly?10:25;
  else if(sweet==='light')  s+= sweetFriendly?25:15;
  else if(sweet==='medium') s+= sweetFriendly?25:10;
  // المكوّنات
  const inList=(arr,val)=>arr && arr.includes(val);
  const allReq=drink.required||[]; const allOpt=drink.optional||[]; const allForb=drink.forbid||[];
  (ings||[]).forEach(sel=>{
    if(sel==='توابل'){
      if(SPICES.some(sp=>inList(allReq,sp)||inList(allOpt,sp))) s+=12;
      if(SPICES.some(sp=>inList(allForb,sp))) s-=15;
      return;
    }
    if(inList(allReq,sel) || inList(allOpt,sel)) s+=12;
    if(inList(allForb,sel)) s-=15;
  });
  s=Math.max(0, Math.min(100, s));
  return s;
}
function getSelectedIngredients(){
  return Array.from(document.querySelectorAll('#ingBox input[type="checkbox"]:checked')).map(i=>i.dataset.ing);
}

/* ========= الموسمية + العشوائية ========= */
// موسم تقريبي: شتاء (نوف–فبراير) | صيف (مايو–سبتمبر) | انتقال (مارس–أبريل وأكتوبر)
// يدعم override للاختبار: ?month=1..12
function currentSeason() {
  const urlM = Number(new URLSearchParams(location.search).get('month'));
  const m = (urlM >= 1 && urlM <= 12) ? urlM : (new Date().getMonth() + 1);
  if ([11,12,1,2].includes(m)) return 'winter';
  if ([5,6,7,8,9].includes(m)) return 'summer';
  return 'shoulder';
}
// انحياز موسمي (مع احترام اختيار المستخدم لو حدّد الحرارة)
function seasonBias(drink, season, prefTemp) {
  if (prefTemp === 'hot' || prefTemp === 'iced') return 1;
  const t = drink.temperature; // hot | iced | either
  if (season === 'summer') {
    if (t === 'iced')   return 1.6;
    if (t === 'either') return 1.25;
    if (t === 'hot')    return 0.7;
  } else if (season === 'winter') {
    if (t === 'hot')    return 1.6;
    if (t === 'either') return 1.25;
    if (t === 'iced')   return 0.7;
  } else { // shoulder
    if (t === 'either') return 1.3;
    return 1.0;
  }
  return 1.0;
}
// خلط مصفوفة (Fisher–Yates)
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ========= اقتراحات (موسمية + عشوائية) ========= */
function buildSuggestions(){
  const pref = {
    temp:  $('#prefTemp').value,     // any | hot | iced
    milk:  $('#prefMilk').value,     // any | with | without
    sweet: $('#prefSweet').value,    // any | none | light | medium
    bean:  $('#prefBean').value,     // any | arabica | robusta | blend
    ings:  getSelectedIngredients()
  };
  const season = currentSeason();

  // درجة توافق أساسية + انحياز موسمي + ضوضاء لكسر الثبات
  const ranked = DRINKS.map(d => {
    const base = score(d, pref);                 // 0..100
    const bias = seasonBias(d, season, pref.temp);
    const jitter = Math.random() * 6;            // 0..6
    const composite = base * bias + jitter;
    return { d, base, bias, composite };
  });

  // خذ أفضل 20 ثم اختر عشوائيًا 6 منها — تتغير كل مرة
  const top = ranked.sort((a,b)=> b.composite - a.composite).slice(0, 20);
  const picked = shuffle(top).slice(0, 6);

  const res = $('#builderResult');
  res.innerHTML = '';

  picked.forEach(({d, base, bias}) => {
    const el = card(d);
    const shown = Math.max(0, Math.min(100, Math.round(base * bias))); // رقم مفهوم للمستخدم
    el.querySelector('button').insertAdjacentHTML('afterend', `<span class="score">${shown}%</span>`);
    res.appendChild(el);
  });

  if (!picked.length) {
    res.innerHTML = '<div class=empty>لا توجد نتائج مناسبة — عدّل تفضيلاتك.</div>';
  }
}
$('#makeBtn')?.addEventListener('click', buildSuggestions);

/* ========= نافذة التفاصيل ========= */
const modal=$('#modal'); const mTitle=$('#mTitle'); const mCat=$('#mCat'); const mDesc=$('#mDesc'); const mStrength=$('#mStrength');
const mReq=$('#mReq'); const mOpt=$('#mOpt'); const mNon=$('#mNon'); const mBean=$('#mBean'); const mTemp=$('#mTemp');
const mPresent=$('#mPresent'); const mNotes=$('#mNotes'); const mCustom=$('#mCustom'); const mAddToOrder=$('#mAddToOrder');
$('#mClose')?.addEventListener('click', ()=> modal.style.display='none');
modal?.addEventListener('click',e=>{ if(e.target===modal) modal.style.display='none'; });

function openDetails(d){
  const j=(a)=>Array.isArray(a)?a.join('، '):'';
  mTitle.textContent=d.name; mCat.textContent=`${d.category} • ${d.subCategory||''}`;
  mDesc.textContent=d.description||'—'; mStrength.textContent=d.strength||'—';
  mReq.textContent=j(d.required); mOpt.textContent=j(d.optional);
  mBean.textContent=d.bean==='blend'?'خلطة':d.bean==='arabica'?'أرابيكا':d.bean==='robusta'?'روبوستا':d.bean==='none'?'—':d.bean;
  mTemp.textContent=d.temperature==='hot'?'ساخن':d.temperature==='iced'?'بارد':'ساخن/بارد';
  const pr=d.presentation||{}; mPresent.textContent=`${pr.cup||'—'}`; mNotes.textContent=d.notes||'—';

  const CATALOG = ['حليب','سكر','شوكولاتة','شوكولاتة بيضاء','فانيلا','بندق','عسل','رغوة','فستق','زعفران','كراميل','ثلج','هيل','قرنفل','ملح','تونك','شريحة ليمون','كريمة','كريمة خفيفة'];
  const allowSet = new Set(d.optional||[]);
  const forbidSet = new Set(d.forbid||[]);
  const requiredSet = new Set(d.required||[]);
  mCustom.innerHTML='';
  const selected=new Set();
  CATALOG.forEach(name=>{
    if(forbidSet.has(name) || requiredSet.has(name)) return;
    if(allowSet.has(name)){
      const span=document.createElement('span');
      span.className='chip';
      span.textContent=name;
      span.onclick=()=>{ span.classList.toggle('active'); if(span.classList.contains('active')) selected.add(name); else selected.delete(name); };
      mCustom.appendChild(span);
    }
  });
  if(!mCustom.children.length){
    const span=document.createElement('span'); span.className='muted'; span.textContent='لا إضافات قابلة للتخصيص لهذا المشروب.'; mCustom.appendChild(span);
  }
  const nonList = CATALOG.filter(n=>!allowSet.has(n) && !requiredSet.has(n));
  mNon.textContent = nonList.length? nonList.join('، '): '—';

  mAddToOrder.onclick=()=>{ addToOrder({ drink:d, extras:[...selected] }); modal.style.display='none'; };
modal.style.display = 'flex';
modal.classList.add('show');
modal.classList.remove('show');

}
// نُعرّفها عالميًا ليستدعيها الكرت:
window.openDetails = openDetails;

/* ========= Render أولي ========= */
function render(){ renderReady(); setCountsUI(); }
render();

/* ========= الطلب ========= */
const ORDER=[];
function addToOrder({drink,extras}){ ORDER.push({id:drink.id,name:drink.name,extras:extras||[]}); renderOrder(); }
function renderOrder(){
  const list=$('#orderList');
  const count=$('#orderCount');
  if(!list||!count) return;
  list.innerHTML='';
  ORDER.forEach((it,idx)=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`<div class="row"><strong>${it.name}</strong><span class="muted" style="margin-inline-start:auto">#${idx+1}</span></div>
    <div class="muted">إضافات: ${it.extras && it.extras.length? it.extras.join('، '):'بدون إضافات'}</div>`;
    list.appendChild(card);
  });
  count.textContent=ORDER.length+" عناصر";
}
$('#copyOrder')?.addEventListener('click', ()=>{
  const text=ORDER.map((it,i)=>`${i+1}. ${it.name} — إضافات: ${it.extras && it.extras.length? it.extras.join('، '):'بدون'}`).join('\n');
  navigator.clipboard && navigator.clipboard.writeText(text);
});
$('#clearOrder')?.addEventListener('click', ()=>{ ORDER.length=0; renderOrder(); });

// اجعل addToOrder متاحة للاختبارات الخارجية (tests.js)
window.addToOrder = addToOrder;

/* ========= تحسينات خفيفة للأداء ========= */
(function throttleRenders(){
  const rafThrottle=(fn)=>{ let ticking=false, lastArgs=null; return function(...args){ lastArgs=args; if(!ticking){ ticking=true; requestAnimationFrame(()=>{ fn.apply(this,lastArgs); ticking=false; }); } } };
  if(typeof window.renderReady==='function'){ const _rr = window.renderReady; window.renderReady = rafThrottle(_rr); }
})();


/* ========= فحص مبسط (اختياري) يظهر أسفل اليسار ========= */
(function miniSmoke(){
  try{
    const outId='testStatus';
    let out = document.getElementById(outId);
    if(!out){
      out=document.createElement('div');
      out.id=outId;
      out.style.cssText='position:fixed;left:12px;bottom:12px;background:#fff8;border:1px solid var(--b);border-radius:10px;padding:6px 10px;font-size:12px;color:#0f172a;z-index:1000';
      document.body.appendChild(out);
    }
    const ok=[];
    ok.push(Array.isArray(DRINKS) && DRINKS.length>=35 ? '✅ DRINKS loaded' : '❌ DRINKS missing');
    ok.push('✅ UI ready');
    out.textContent=ok.join(' • ');
  }catch(e){}
})();

