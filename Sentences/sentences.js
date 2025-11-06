/* ======================= sentences.js (FULL) ======================= */

/* ---------- Utils ---------- */
function getParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}
function escapeHTML(str){
  return String(str ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}

/* ---------- EN → AR transliteration ---------- */
/* هدفها نُطق عربي مقروء للجملة الإنجليزية بدون تشكيل */
function transliterateENToAR(input){
  if (!input) return "";
  let s = " " + input.trim()
    .replace(/[\u2019\u2018’]/g, "'")
    .replace(/[“”]/g, '"');

  // ترقيم عربي
  s = s.replace(/\?/g, "؟").replace(/,/g, "،");

  // مقاطع طويلة أولاً
  const rules = [
    [/tion/gi, "شن"], [/sion/gi, "جن"], [/ture/gi, "تشر"], [/sure/gi, "شر"],
    [/igh/gi, "اي"], [/ough/gi, "و"], [/eau/gi, "و"],

    [/qu/gi, "كو"], [/ph/gi, "ف"], [/ck/gi, "ك"], [/ch/gi, "تش"], [/sh/gi, "ش"],
    [/th(?![aeiou])/gi, "ذ"], [/th/gi, "ث"], [/ng/gi, "نج"], [/wh/gi, "و"],

    [/ee/gi, "ي"], [/ea/gi, "ي"], [/oo/gi, "و"], [/ou/gi, "او"], [/ow/gi, "او"],
    [/oi/gi, "وي"], [/ai/gi, "اي"], [/ay/gi, "اي"], [/oa/gi, "او"],
    [/e\b/gi, ""], // e ساكنة في نهاية الكلمة
  ];
  for (const [re, rep] of rules) s = s.replace(re, rep);

  // علل متبقية
  s = s.replace(/e/gi, "ي")
       .replace(/i/gi, "ي")
       .replace(/o/gi, "و")
       .replace(/u/gi, "و");

  // خريطة الحروف
  const map = {
    b:"ب", c:"ك", d:"د", f:"ف", g:"ج", h:"ه", j:"ج",
    k:"ك", l:"ل", m:"م", n:"ن", p:"ب", q:"ق", r:"ر",
    s:"س", t:"ت", v:"ف", w:"و", x:"كس", y:"ي", z:"ز",
    A:"ا", B:"ب", C:"ك", D:"د", E:"ي", F:"ف", G:"ج", H:"ه", I:"ي",
    J:"ج", K:"ك", L:"ل", M:"م", N:"ن", O:"و", P:"ب", Q:"ق", R:"ر",
    S:"س", T:"ت", U:"و", V:"ف", W:"و", X:"كس", Y:"ي", Z:"ز"
  };
  s = s.split("").map(ch => map[ch] ?? ch).join("");
  return s.replace(/\s+/g, " ").trim();
}

/* ---------- DOM refs ---------- */
const topic      = getParam("topic");
const topicTitle = document.getElementById("topicTitle");
const rows       = document.getElementById("rows");
const qInput     = document.getElementById("q");
const levelSel   = document.getElementById("level");
const regSel     = document.getElementById("register");
const metaInfo   = document.getElementById("metaInfo");

/* ---------- Data ---------- */
let SENTENCES = [];
let META = [];

/* ---------- Labels ---------- */
const ALLOWED_LEVELS = new Set(["A1","A2","B1","B2"]);
const ALLOWED_REGS   = new Set(["neutral","formal","street_light"]);

const LEVEL_LABEL = {
  "A1": "A1 — مبتدئ",
  "A2": "A2 — أساسي",
  "B1": "B1 — متوسط",
  "B2": "B2 — فوق المتوسط"
};
const REG_AR = { "formal":"رسمي", "street_light":"Street Light", "neutral":"محايد" };

/* ---------- Normalizer (يصحح ويولّد النطق) ---------- */
function fixItem(s){
  const arRegex = /[\u0600-\u06FF]/;
  const enRegex = /[A-Za-z]/;

  let en  = (s.en ?? "").trim();
  let ar  = (s.ar ?? "").trim();
  let arp = (s.ar_pron ?? "").trim();

  // لو انعكست اللغات بالملف نبدّلهم
  const enLooksArabic = arRegex.test(en) && !enRegex.test(en);
  const arLooksEnglish= enRegex.test(ar) && !arRegex.test(ar);
  if (enLooksArabic && arLooksEnglish){
    const tmp = en; en = ar; ar = tmp;
  }

  // لو النطق مفقود أو يساوي الترجمة → نولّده من EN
  if (!arp || arp === ar) arp = transliterateENToAR(en);

  const lvl = String(s.level ?? "").trim().toUpperCase();
  const reg = String(s.register ?? "").trim().toLowerCase();

  return {
    id: s.id || "",
    level: ALLOWED_LEVELS.has(lvl) ? lvl : "A1",
    register: ALLOWED_REGS.has(reg) ? reg : "neutral",
    en, ar, ar_pron: arp,
    tags: Array.isArray(s.tags) ? s.tags : (s.tags ? [String(s.tags)] : [])
  };
}

/* ---------- Resolve file name from meta ---------- */
async function resolveFileName(){
  try{
    if (META.length === 0){
      const r = await fetch("data/topics_meta.json", { cache:"no-store" });
      META = await r.json();
    }
    const m = META.find(x => x.key === topic);
    if (!m) return `${encodeURIComponent(topic)}.json`;
    return encodeURIComponent((m.file || `${m.key}.json`).trim());
  }catch{
    return `${encodeURIComponent(topic)}.json`;
  }
}

/* ---------- Load ---------- */
async function load(){
  if (!topic){
    topicTitle.textContent = "— لا يوجد موضوع محدد";
    return;
  }

  try{
    if (META.length === 0){
      const mr = await fetch("data/topics_meta.json", { cache:"no-store" });
      META = await mr.json();
    }
    const m = META.find(x => x.key === topic);
    topicTitle.textContent = m?.title || topic;
  }catch{
    topicTitle.textContent = topic;
  }

  try{
    const fileName = await resolveFileName();
    const res = await fetch(`data/sentences/${fileName}`, { cache:"no-store" });
    if (!res.ok) throw new Error(`تعذّر فتح: data/sentences/${decodeURIComponent(fileName)} (HTTP ${res.status})`);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("صيغة الملف ليست مصفوفة JSON.");
    SENTENCES = raw.map(fixItem);
  }catch(e){
    console.error(e);
    SENTENCES = [];
    rows.innerHTML = `<tr><td colspan="6" style="color:#ef4444">${escapeHTML(String(e.message||e))}</td></tr>`;
    metaInfo.textContent = `عدد الجمل المعروضة: 0 / الإجمالي: 0`;
    return;
  }

  render();
}

/* ---------- Render ---------- */
function render(){
  const q   = (qInput?.value || "").trim().toLowerCase();
  const lvl = levelSel?.value || "";
  const reg = regSel?.value || "";

  const filtered = SENTENCES.filter(s => {
    let ok = true;
    if (q){
      const hay = `${s.en} ${s.ar} ${s.ar_pron}`.toLowerCase();
      ok = hay.includes(q);
    }
    if (ok && lvl) ok = (s.level === lvl);
    if (ok && reg) ok = (s.register === reg);
    return ok;
  });

  rows.innerHTML = "";
  for (const s of filtered){
    const levelText = LEVEL_LABEL[s.level] || s.level;
    const regText   = REG_AR[s.register] || s.register;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <span class="level-badge" data-level="${escapeHTML(s.level)}">
          <span class="dot" aria-hidden="true"></span>
          ${escapeHTML(levelText)}
        </span>
      </td>
      <td>${escapeHTML(regText)}</td>
      <td><span class="en">${escapeHTML(s.en)}</span></td>
      <td>${escapeHTML(s.ar)}</td>
      <td>${escapeHTML(s.ar_pron)}</td>
      <td>${(s.tags||[]).map(t=>`<span class="tag">${escapeHTML(String(t))}</span>`).join(" ")}</td>
    `;
    rows.appendChild(tr);
  }

  metaInfo.textContent = `عدد الجمل المعروضة: ${filtered.length} / الإجمالي: ${SENTENCES.length}`;
}

/* ---------- Save with generated pronunciation ---------- */
async function saveWithPron(){
  try{
    const fileName = await resolveFileName();
    const res = await fetch(`data/sentences/${fileName}`, { cache:"no-store" });
    if (!res.ok) throw new Error(`تعذّر فتح الملف الأصلي (HTTP ${res.status})`);
    const raw = await res.json();
    const fixed = raw.map(fixItem);

    const blob = new Blob([JSON.stringify(fixed, null, 2)], {type: "application/json;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = decodeURIComponent(fileName);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);

    alert("تم توليد النطق وحفظ الملف — استبدل الملف في مجلد data/sentences.");
  }catch(e){
    console.error(e);
    alert("تعذّر حفظ الملف: " + (e?.message || e));
  }
}

/* ---------- Events ---------- */
qInput?.addEventListener("input", render);
levelSel?.addEventListener("change", render);
regSel?.addEventListener("change", render);
document.getElementById("savePron")?.addEventListener("click", saveWithPron);

/* ---------- Go ---------- */
load();
/* ===================== end of sentences.js ===================== */
