function getParam(name){
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || "";
}

const topic = getParam("topic");
const topicTitle = document.getElementById("topicTitle");
const rows = document.getElementById("rows");
const qInput = document.getElementById("q");
const levelSel = document.getElementById("level");
const regSel = document.getElementById("register");
const metaInfo = document.getElementById("metaInfo");

let SENTENCES = [];

async function load(){
  if(!topic){
    topicTitle.textContent = "— لا يوجد موضوع محدد";
    return;
  }
  // find display title from meta
  try {
    const metaRes = await fetch("data/topics_meta.json");
    const meta = await metaRes.json();
    const t = meta.find(m => m.key === topic);
    topicTitle.textContent = t ? t.title : topic;
  } catch(e){
    topicTitle.textContent = topic;
  }

  try {
    const res = await fetch(`data/${encodeURIComponent(topic)}.json`);
    SENTENCES = await res.json();
  } catch(e){
    console.error("Failed to load sentences:", e);
    SENTENCES = [];
  }
  render();
}

function render(){
  const q = (qInput.value || "").trim().toLowerCase();
  const lvl = levelSel.value || "";
  const reg = regSel.value || "";

  const filtered = SENTENCES.filter(s => {
    let ok = true;
    if (q) {
      const hay = `${s.en} ${s.ar} ${s.ar_pron}`.toLowerCase();
      ok = hay.includes(q);
    }
    if (ok && lvl) ok = (s.level === lvl);
    if (ok && reg) ok = (s.register === reg);
    return ok;
  });

  rows.innerHTML = "";
  for (const s of filtered){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.level || ""}</td>
      <td>${s.register || ""}</td>
      <td>${escapeHTML(s.en || "")}</td>
      <td>${escapeHTML(s.ar || "")}</td>
      <td>${escapeHTML(s.ar_pron || "")}</td>
      <td>${(s.tags||[]).map(t=>`<span class="tag">${escapeHTML(String(t))}</span>`).join(" ")}</td>
    `;
    rows.appendChild(tr);
  }

  metaInfo.textContent = `عدد الجمل المعروضة: ${filtered.length} / الإجمالي: ${SENTENCES.length}`;
}

function escapeHTML(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[m]));
}

qInput.addEventListener("input", render);
levelSel.addEventListener("change", render);
regSel.addEventListener("change", render);

load();