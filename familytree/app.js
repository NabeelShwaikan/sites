// =============================
// مفاتيح التخزين والثيم
// =============================
const KEY_DATA = 'clean_tree_data_v1';
const KEY_THEME = 'clean_tree_theme';

function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  try{ localStorage.setItem(KEY_THEME, t); }catch{}
}
(function () {
  const t = (()=>{
    try{ return localStorage.getItem(KEY_THEME) || 'light'; }catch{ return 'light'; }
  })();
  applyTheme(t);
  const btnTheme = document.getElementById('btnTheme');
  if (btnTheme) btnTheme.onclick = () =>
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
})();

// =============================
// تبويبات الصفحات
// =============================
document.querySelectorAll('.tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const p = tab.dataset.page;
    document.querySelectorAll('main > section').forEach(sec=>sec.hidden = (sec.id !== 'page-' + p));
    if (p === 'data') renderTable();
  });
});

// =============================
// البيانات وإعادة الفهرسة
// =============================
let PEOPLE = load();
let byId = {};
let childrenOf = {};

function load(){
  try {
    const j = JSON.parse(localStorage.getItem(KEY_DATA) || '[]');
    return Array.isArray(j) ? j : [];
  } catch { return [] }
}
function save(){ try{ localStorage.setItem(KEY_DATA, JSON.stringify(PEOPLE)); }catch{} }
function reindex(){
  byId = Object.fromEntries(PEOPLE.map(p => [p.id, p]));
  childrenOf = {};
  PEOPLE.forEach(p => {
    const k = p.fatherId || 'root';
    (childrenOf[k] ??= []).push(p);
  });
}
reindex();

// =============================
// مكوّنات SVG + حقول
// =============================
const svg       = document.getElementById('svg');
const gBranches = document.getElementById('branches');
const gNodes    = document.getElementById('nodes');
const vp        = document.getElementById('vp');
const canvasDiv = document.querySelector('.canvas'); // لإظهار التلميح الفارغ

// تلميح فارغ عند عدم وجود بيانات
function ensureEmptyHint(){
  if (!canvasDiv) return;
  let hint = document.getElementById('emptyHint');
  if (!hint){
    hint = document.createElement('div');
    hint.id = 'emptyHint';
    hint.className = 'emptyHint';
    hint.innerHTML = `<div>لا توجد بيانات بعد — اضغط <b>+ إضافة فرد</b> لإنشاء الجذر (بدون أب)</div>`;
    canvasDiv.appendChild(hint);
  }
  hint.style.display = PEOPLE.length ? 'none' : 'grid';
}

// =============================
// تحريك/تكبير
// =============================
let scale = 1, tx = 0, ty = 0;
function applyTf(){ if (vp) vp.setAttribute('transform', `translate(${tx},${ty}) scale(${scale})`); }
function zoomBy(f, cx=null, cy=null){
  const old = scale;
  scale = Math.max(0.3, Math.min(4, scale * f));
  if (!svg) return applyTf();

  const pt = svg.createSVGPoint();
  pt.x = (cx ?? svg.clientWidth / 2);
  pt.y = (cy ?? svg.clientHeight / 2);
  const ctm = svg.getScreenCTM && svg.getScreenCTM();
  if (ctm && ctm.inverse) {
    const p = pt.matrixTransform(ctm.inverse());
    tx = p.x - (p.x - tx) * (scale/old);
    ty = p.y - (p.y - ty) * (scale/old);
  }
  applyTf();
}
function panBy(dx, dy){ tx += dx; ty += dy; applyTf(); }

// السحب — لا يبدأ على الاسم
let dragging=false, lastX=0, lastY=0;
if (svg){
  svg.addEventListener('pointerdown', e=>{
    if (e.target.closest && e.target.closest('.nameBadge')) return;
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
    try{ svg.setPointerCapture(e.pointerId); }catch{}
  });
  svg.addEventListener('pointermove', e=>{
    if(!dragging) return;
    panBy(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX; lastY = e.clientY;
  });
  svg.addEventListener('pointerup', e=>{
    if (dragging){
      dragging = false;
      try { svg.releasePointerCapture(e.pointerId); } catch {}
    }
  });
  svg.addEventListener('wheel', e=>{
    e.preventDefault();
    zoomBy((e.deltaY < 0) ? 1.1 : 1/1.1, e.clientX, e.clientY);
  }, {passive:false});
}

// أزرار الزووم
const btnZoomIn  = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnFit     = document.getElementById('btnFit');
if (btnZoomIn)  btnZoomIn.onclick  = ()=> zoomBy(1.2);
if (btnZoomOut) btnZoomOut.onclick = ()=> zoomBy(1/1.2);
if (btnFit)     btnFit.onclick     = ()=> fitView();

// =============================
// قياسات وتخطيط
// =============================
const topY = 60;

function maxDepth(){
  let depth = 0;
  const roots = childrenOf['root'] || [];
  const stack = roots.map(r => ({ id:r.id, level:1 }));
  while (stack.length){
    const { id, level } = stack.pop();
    depth = Math.max(depth, level);
    (childrenOf[id] || []).forEach(ch => stack.push({ id: ch.id, level: level+1 }));
  }
  return Math.max(depth, 1);
}

function updateCanvasSize(){
  if (!svg) return { W:1200, H:680, rootX:600, rootY:640, rMin:120, rGap:110 };

  const depth = maxDepth();
  const rMin  = 120;
  const rGap  = 110;
  const rootY = topY + rMin + (depth - 1) * rGap + 40;
  const W     = 1200;
  const H     = rootY + 40;

  svg.setAttribute('width',  W);
  svg.setAttribute('height', H);
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const ground = svg.querySelector('.ground');
  if (ground){
    ground.setAttribute('y', H - 40);
    ground.setAttribute('width', W);
    ground.setAttribute('height', 40);
  }
  return { W, H, rootX: W/2, rootY, rMin, rGap };
}

function fitView(){
  if (!svg || !vp){ scale=1; tx=0; ty=0; return applyTf(); }
  try{
    const bb = vp.getBBox();
    const vb = svg.viewBox.baseVal;
    if (!bb || bb.width===0 || bb.height===0){ scale=1; tx=0; ty=0; return applyTf(); }
    const pad = 40;
    const sx = (vb.width  - pad*2) / bb.width;
    const sy = (vb.height - pad*2) / bb.height;
    scale = Math.max(0.3, Math.min(2.5, Math.min(sx, sy)));
    tx = (vb.x + vb.width/2)  - (bb.x + bb.width/2)  * scale;
    ty = (vb.y + vb.height/2) - (bb.y + bb.height/2) * scale;
    applyTf();
  }catch{
    scale = 1; tx = 0; ty = 0; applyTf();
  }
}

// =============================
// بناء التخطيط والرسم
// =============================
function countLeaves(id){
  const kids = childrenOf[id] || [];
  if (!kids.length) return 1;
  let s = 0; kids.forEach(k=> s += countLeaves(k.id));
  return s;
}
function layoutRadial(){
  const roots = childrenOf['root'] || [];
  const layout = {};
  if (!roots.length) return layout;

  const G = updateCanvasSize();
  const leafCount = new Map(); PEOPLE.forEach(p=> leafCount.set(p.id, countLeaves(p.id)));
  const total = roots.reduce((a,p)=> a + (leafCount.get(p.id) || 1), 0) || 1;
  const a0 = Math.PI * 0.15, a1 = Math.PI * 0.85;

  function placeSubtree(id, level, span){
    const r    = G.rMin + (level - 1) * G.rGap;
    const aMid = span.mid;
    const x    = G.rootX + r * Math.cos(aMid);
    const y    = G.rootY - r * Math.sin(aMid);
    layout[id] = { x, y, level };

    const kids = childrenOf[id] || [];
    if (!kids.length) return;

    let t = kids.reduce((s,k)=> s + (leafCount.get(k.id) || 1), 0);
    let a = span.start;
    for (const k of kids){
      const share = (leafCount.get(k.id) || 1) / t;
      const w     = share * (span.end - span.start);
      const next  = { start:a, end:a+w, mid:a+w/2 };
      placeSubtree(k.id, level+1, next);
      a += w;
    }
  }

  let a = a0;
  for (const r of roots){
    const w = ((leafCount.get(r.id) || 1) / total) * (a1 - a0);
    placeSubtree(r.id, 1, { start:a, end:a+w, mid:a+w/2 });
    a += w;
  }
  return layout;
}
function path(x1,y1,x2,y2,thick){
  const mx = (x1 + x2) / 2;
  const p  = document.createElementNS('http://www.w3.org/2000/svg','path');
  p.setAttribute('d', `M ${x1} ${y1} C ${mx} ${y1-40}, ${mx} ${y2+40}, ${x2} ${y2}`);
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke', '#6b4226');
  p.setAttribute('stroke-width', thick);
  p.setAttribute('stroke-linecap', 'round');
  return p;
}
function makeBadge(x,y,txt){
  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.classList.add('nameBadge');

  const t = document.createElementNS('http://www.w3.org/2000/svg','text');
  t.setAttribute('x', x); t.setAttribute('y', y); t.textContent = txt;
  g.appendChild(t);

  // قياس النص: إلحاق مؤقت ثم قياس
  gNodes.appendChild(g);
  const bb = t.getBBox();
  g.remove();

  const padX = 14, padY = 8;
  const w = Math.max(40, bb.width  + padX*2);
  const h = Math.max(24, bb.height + padY*2);

  const r = document.createElementNS('http://www.w3.org/2000/svg','rect');
  r.setAttribute('x', x - w/2);
  r.setAttribute('y', y - h/2);
  r.setAttribute('width',  w);
  r.setAttribute('height', h);
  r.setAttribute('rx', h/2);
  r.setAttribute('ry', h/2);

  g.appendChild(r);
  g.appendChild(t);
  return g;
}
function draw(filtered=null){
  if (!gBranches || !gNodes) return;

  gBranches.innerHTML = '';
  gNodes.innerHTML    = '';

  const layout = layoutRadial();
  if (!Object.keys(layout).length) { applyTf(); ensureEmptyHint(); return; }

  const vis = filtered
    ? PEOPLE.filter(p => filtered.has(p.id) && layout[p.id])
    : PEOPLE.filter(p => layout[p.id]);

  // الفروع
  for (const c of vis){
    if (!c.fatherId) continue;
    if (filtered && !filtered.has(c.fatherId)) continue;
    const a = layout[c.fatherId], b = layout[c.id];
    if (!a || !b) continue;
    gBranches.appendChild(path(a.x,a.y,b.x,b.y, Math.max(2, 9-(b.level-1)*1.4)));
  }

  // العقد (البيضاويات)
  for (const p of vis){
    const pos = layout[p.id]; if(!pos) continue;
    const badge = makeBadge(pos.x, pos.y, p.name);
    badge.setAttribute('title', `المعرف: ${p.id} (يُنسخ عند النقر)`);
    badge.dataset.id = p.id;
    badge.addEventListener('click', ()=>{
      select(p.id);
      toast(`المعرف: ${p.id} — نُسخ للحافظة`);
      copyIdToClipboard(p.id);
    });
    gNodes.appendChild(badge);
  }

  ensureEmptyHint();
  applyTf();
}

// =============================
// تفاصيل الشخص والاختيار
// =============================
const nameEl   = document.getElementById('name');
const lineageEl= document.getElementById('lineage');
const dobEl    = document.getElementById('dob');
const ageEl    = document.getElementById('age');
const pidEl    = document.getElementById('pid');
let currentId  = null;

function ageOf(d){
  if(!d) return '—';
  const x=new Date(d+'T00:00:00'), now=new Date();
  let a = now.getFullYear() - x.getFullYear();
  const m = now.getMonth() - x.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < x.getDate())) a--;
  return Math.max(a, 0);
}
function benChain(p){
  const names=[]; let cur=p;
  while (cur){ names.push(cur.name); cur = cur.fatherId ? byId[cur.fatherId] : null; }
  return names.join(' بن ');
}
function select(id){
  const p = byId[id]; if (!p) return;
  currentId = id;
  if (nameEl){ nameEl.textContent = p.name; nameEl.setAttribute('title', `المعرف: ${p.id}`); }
  if (lineageEl) lineageEl.textContent = 'سلسلة النسب: ' + benChain(p);
  if (dobEl)     dobEl.textContent     = 'الميلاد: ' + (p.dob || '—');
  if (ageEl)     ageEl.textContent     = 'العمر: ' + ageOf(p.dob) + ' سنة';
  if (pidEl)     pidEl.textContent     = 'المعرف: ' + p.id;
  draw(branchSet(id));
  toggleEditDelete();
}
function branchSet(id){
  const set = new Set();
  let cur = byId[id];
  while (cur){ set.add(cur.id); cur = cur.fatherId ? byId[cur.fatherId] : null; }
  const st = [id];
  while (st.length){
    const u = st.pop();
    (childrenOf[u] || []).forEach(ch => { set.add(ch.id); st.push(ch.id); });
  }
  return set;
}
function toggleEditDelete(){
  const has = !!currentId && !!byId[currentId];
  const btnE = document.getElementById('btnEdit');
  const btnD = document.getElementById('btnDelete');
  if (btnE) btnE.disabled = !has;
  if (btnD) btnD.disabled = !has;
}

// =============================
// بحث/طباعة
// =============================
const btnReset = document.getElementById('btnReset');
const qInput   = document.getElementById('q');
const btnPrint = document.getElementById('btnPrint');

if (btnReset) btnReset.onclick = ()=>{
  if (qInput) qInput.value = '';
  currentId = null; draw(null); toggleEditDelete();
};
if (qInput) qInput.addEventListener('input', e=>{
  const q = (e.target.value || '').trim();
  if (!q){ draw(null); return; }
  const hits = PEOPLE.filter(p => (p.name || '').includes(q)).map(p=>p.id);
  if (!hits.length){ draw(null); return; }
  const all = new Set();
  hits.forEach(id=> branchSet(id).forEach(x => all.add(x)));
  draw(all);
});
if (btnPrint) btnPrint.onclick = ()=> window.print();

// =============================
// حوار الإضافة/التعديل (+ بديل)
// =============================
const dlg      = document.getElementById('dlgPerson');
const f_name   = document.getElementById('f_name');
const f_id     = document.getElementById('f_id');
const f_dob    = document.getElementById('f_dob');
const f_father = document.getElementById('f_father');

function dlgOpen(){ try{ dlg.showModal(); }catch{ dlg.style.display='block'; } }
function dlgClose(){ try{ dlg.close('cancel'); }catch{ dlg.style.display='none'; } }

const btnCancel = document.getElementById('btnCancel');
const btnSave   = document.getElementById('f_save');
const btnAdd    = document.getElementById('btnAdd');
const btnAdd2   = document.getElementById('btnAdd2');
const btnEdit   = document.getElementById('btnEdit');
const btnDelete = document.getElementById('btnDelete');

if (btnCancel) btnCancel.onclick = ()=> dlgClose();
if (btnSave)   btnSave.onclick   = (e)=>{ e.preventDefault(); saveDialog(); };
if (btnAdd)    btnAdd.onclick    = ()=> openAdd();
if (btnAdd2)   btnAdd2.onclick   = ()=> openAdd();
if (btnEdit)   btnEdit.onclick   = ()=>{ if(!currentId) return alert('اختر شخصًا'); openEdit(currentId); };
if (btnDelete) btnDelete.onclick = ()=>{ if(!currentId) return alert('اختر شخصًا'); delCascade(currentId); };

function fillFather(selfId=null, selected=null){
  if (!f_father) return;
  f_father.innerHTML = '<option value="">— بدون أب (جذر) —</option>';
  PEOPLE
    .filter(p => p.id !== selfId)
    .sort((a,b) => (a.name||'').localeCompare(b.name||'', 'ar'))
    .forEach(p=>{
      const o = document.createElement('option');
      o.value = p.id; o.textContent = `${p.name} (${p.id})`;
      f_father.appendChild(o);
    });
  f_father.value = selected || '';
}
function genId(){ let i=1; while(byId['p'+i]) i++; return 'p'+i; }

function openAdd(){
  fillFather();
  if (f_name) f_name.value='';
  if (f_id)   f_id.value='';
  if (f_dob)  f_dob.value='';
  const err = document.getElementById('err_name'); if (err) err.style.display='none';
  dlgOpen(); if (f_name) f_name.focus();
}
function openEdit(id){
  const p = byId[id]; if (!p) return;
  fillFather(id, p.fatherId || '');
  if (f_name) f_name.value = p.name || '';
  if (f_id)   f_id.value   = p.id   || '';
  if (f_dob)  f_dob.value  = p.dob  || '';
  const err = document.getElementById('err_name'); if (err) err.style.display='none';
  dlgOpen(); if (f_name) f_name.focus();
}
function saveDialog(){
  const name     = (f_name && f_name.value ? f_name.value.trim() : '');
  let id         = (f_id && f_id.value ? f_id.value.trim() : '');
  const dob      = (f_dob && f_dob.value ? f_dob.value : null);
  const fatherId = (f_father && f_father.value ? f_father.value : null);

  if (!name){
    const err = document.getElementById('err_name');
    if (err){ err.textContent = 'الاسم مطلوب'; err.style.display='block'; }
    return;
  }
  // منع إضافة إناث لهذه النسخة
  if (name.includes(' بنت ') || name.startsWith('بنت ') || name.endsWith(' بنت')){
    const err = document.getElementById('err_name');
    if (err){ err.textContent = 'هذه النسخة للذكور فقط'; err.style.display='block'; }
    return;
  }

  const editing = (f_id && f_id.value && byId[f_id.value.trim()]) ? true : false;
  if (!id) id = genId();

  if (editing){
    const oldId = f_id.value.trim();
    if (id !== oldId && byId[id]) return alert('معرّف موجود مسبقًا');
    PEOPLE = PEOPLE.filter(p => p.id !== oldId);
    PEOPLE.push({ id, name, dob, fatherId });
    PEOPLE.forEach(p => { if (p.fatherId === oldId) p.fatherId = id; });
  } else {
    if (byId[id]) return alert('معرّف موجود مسبقًا، اتركه فارغًا للتوليد');
    PEOPLE.push({ id, name, dob, fatherId });
  }
  reindex(); save(); draw(null); renderTable(); select(id); dlgClose();
}

// حذف متسلسل (حذف الجد يحذف ذريته)
function collectDesc(rootId){
  const out = new Set(); const st=[rootId];
  while (st.length){
    const u = st.pop();
    (childrenOf[u] || []).forEach(ch=>{
      if (!out.has(ch.id)){ out.add(ch.id); st.push(ch.id); }
    });
  }
  out.delete(rootId);
  return out;
}
function delCascade(id){
  const p = byId[id]; if (!p) return;
  const n = collectDesc(id).size;
  if (!confirm(`سيُحذف ${p.name} وذريته (${n})`)) return;
  const del = collectDesc(id); del.add(id);
  PEOPLE = PEOPLE.filter(x => !del.has(x.id));
  reindex(); save(); draw(null); renderTable(); currentId=null; toggleEditDelete();
}

// =============================
// جدول البيانات
// =============================
const tbody      = document.getElementById('tbody');
const qTable     = document.getElementById('qTable');
const countBadge = document.getElementById('countBadge');

if (qTable) qTable.addEventListener('input', renderTable);
if (tbody) tbody.addEventListener('click', e=>{
  const b = e.target.closest && e.target.closest('button'); if(!b) return;
  const id = b.getAttribute('data-id'); if(!id) return;
  const act= b.getAttribute('data-act');
  if (act === 'edit') openEdit(id);
  if (act === 'del')  delCascade(id);
});
function renderTable(){
  if (!tbody) return;
  tbody.innerHTML = '';
  const query = (qTable && qTable.value) ? qTable.value : '';
  const rows = PEOPLE
    .filter(p=> !query || (p.name||'').includes(query) || (p.id||'').includes(query))
    .sort((a,b) => (a.name||'').localeCompare(b.name||'','ar'));
  rows.forEach(p=>{
    const tr = document.createElement('tr');
    const father = p.fatherId ? (byId[p.fatherId]?.name || p.fatherId) : '—';
    tr.innerHTML =
      `<td>${p.id||'—'}</td><td>${p.name||'—'}</td><td>${father}</td><td>${p.dob||'—'}</td><td>${ageOf(p.dob)}</td>
       <td><button class="btn" data-act="edit" data-id="${p.id}">تعديل</button>
           <button class="btn danger" data-act="del"  data-id="${p.id}">حذف</button></td>`;
    tbody.appendChild(tr);
  });
  if (countBadge) countBadge.textContent = `${rows.length} فرد`;
}

// =============================
// تصدير/استيراد
// =============================
const btnExport = document.getElementById('btnExport');
const btnImport = document.getElementById('btnImport');
const fileImport= document.getElementById('fileImport');

if (btnExport) btnExport.onclick = ()=>{
  const blob = new Blob([JSON.stringify(PEOPLE, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'family.json';
  a.click();
  URL.revokeObjectURL(a.href);
};
if (btnImport) btnImport.onclick = ()=>{
  const f = fileImport;
  if (!f || !f.files || !f.files[0]) return alert('اختر ملفًا أولاً');
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const arr = JSON.parse(reader.result);
      if (!Array.isArray(arr)) return alert('صيغة غير صحيحة');
      PEOPLE = arr; reindex(); save(); draw(null); renderTable(); currentId=null; toggleEditDelete(); fitView();
    }catch{ alert('تعذر قراءة الملف'); }
  };
  reader.readAsText(f.files[0],'utf-8');
};

// =============================
// Toast + نسخ المعرّف
// =============================
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{
    t.classList.remove('show');
    setTimeout(()=> t.remove(), 200);
  }, 1800);
}
async function copyIdToClipboard(id){
  try{ await navigator.clipboard.writeText(id); }
  catch(e){ /* قد يُقيَّد في بعض البيئات */ }
}

// =============================
// تشغيل أولي
// =============================
draw(null);
renderTable();
fitView();
ensureEmptyHint();
