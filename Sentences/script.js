// عناصر الواجهة
const cardsRoot = document.getElementById("cardsRoot");
const searchInput = document.getElementById("search");
const levelGroup = document.getElementById("levelGroup");
const registerGroup = document.getElementById("registerGroup");
const statTopics = document.getElementById("stat-topics");
const statSentences = document.getElementById("stat-sentences");

let activeLevel = "";
let activeRegister = "";
let TOPICS = [];

/* بناء بطاقة موضوع واحدة — الرابط دائماً إلى sentences.html */
function makeCard(t) {
  const el = document.createElement("a");
  el.className = `card ${t.status === "ready" ? "ready" : "soon"}`;

  const href = `sentences.html?topic=${encodeURIComponent(t.key)}`;
  el.href = href;

  el.dataset.topic = t.key;
  el.dataset.title = t.title || t.key;
  el.dataset.levels = (t.levels || []).join(",");
  el.dataset.registers = (t.registers || []).join(",");

  el.innerHTML = `
    <div class="card-head">
      <span class="badge ${t.status === "ready" ? "success" : "soon"}">
        ${t.status === "ready" ? "جاهز" : "قريبًا"}
      </span>
      <span class="count">${t.count || 0} جملة</span>
    </div>
    <h3>${t.title || t.key}</h3>
    <p class="muted">${t.desc || ""}</p>
    <div class="meta">
      <span class="pill">A1–B2</span>
      <span class="pill">رسمي + Street Light</span>
    </div>
  `;
  return el;
}

function render() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  cardsRoot.innerHTML = "";

  const filtered = TOPICS.filter(t => {
    let ok = true;
    if (q) {
      const hay = `${t.title || ""} ${t.key || ""}`.toLowerCase();
      ok = hay.includes(q);
    }
    if (ok && activeLevel) ok = (t.levels || []).includes(activeLevel);
    if (ok && activeRegister) ok = (t.registers || []).includes(activeRegister);
    return ok;
  });

  filtered.forEach(t => cardsRoot.appendChild(makeCard(t)));
}

function updateStats() {
  const ready = TOPICS.filter(t => t.status === "ready");
  const topicsCount = ready.length;
  const sentencesCount = ready.reduce((sum, t) => sum + (t.count || 0), 0);
  statTopics.textContent = String(topicsCount);
  statSentences.textContent = String(sentencesCount);
}

function activateChip(groupEl, chipEl) {
  if (!groupEl || !chipEl) return;
  groupEl.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chipEl.classList.add("active");
}

levelGroup?.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeLevel = btn.dataset.level || "";
  activateChip(levelGroup, btn);
  render();
});

registerGroup?.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeRegister = btn.dataset.register || "";
  activateChip(registerGroup, btn);
  render();
});

searchInput?.addEventListener("input", render);

(async function init(){
  try{
    const res = await fetch("data/topics_meta.json", { cache: "no-store" });
    const meta = await res.json();
    TOPICS = meta.map(t => ({
      key: t.key,
      title: t.title || t.key,
      status: t.status || "ready",
      levels: t.levels || ["A1","A2","B1","B2"],
      registers: t.registers || ["neutral","formal","street_light"],
      count: t.count || 0,
      desc: t.desc || ""
    }));
    updateStats();
    render();
  }catch(e){
    console.error("Failed to load topics meta:", e);
  }
})();
