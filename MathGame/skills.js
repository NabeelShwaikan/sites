
let currentSkill = { type:null, ans:null };
const skillSuccessPool = ['أحسنت أحسنت!','يا سلام عليك!','ممتاز!','كفو عليك يا الذيب!','انت كذا!','طيب يا وحش!'];
const skillErrorPool = ['حاول مرة أخرى','فكّر شوي','قريب جدًا!','يا واد كبّك البهللة!','انت صاحي من جدّك؟'];

function setSkillQuestion(text, ans){
  const qEl=document.getElementById('skillQ'); const rEl=document.getElementById('skillR'); const aEl=document.getElementById('skillA');
  if(qEl) qEl.textContent=text; if(rEl) rEl.textContent='—'; if(aEl) aEl.value='';
  currentSkill={ ...currentSkill, ans: ans };
  hideChoices();
}
function showChoices(list, formatter){
  const box = document.getElementById('skillChoices');
  const ansRow = document.getElementById('skillAnswerRow');
  if(!box || !ansRow) return;
  box.innerHTML='';
  (list||[]).forEach(v=>{
    const b=document.createElement('button');
    b.className='btn-sm';
    b.textContent = formatter? formatter(v): String(v);
    b.addEventListener('click', ()=>checkSkillChoice(v));
    box.appendChild(b);
  });
  box.style.display = (list && list.length)? 'flex':'none';
  ansRow.style.display = (list && list.length)? 'none':'flex';
}
function hideChoices(){
  const box = document.getElementById('skillChoices');
  const ansRow = document.getElementById('skillAnswerRow');
  if(box){ box.style.display='none'; box.innerHTML=''; }
  if(ansRow){ ansRow.style.display='flex'; }
}
function checkSkillChoice(v){
  const resEl = document.getElementById('skillR');
  if(currentSkill==null){ if(resEl) resEl.textContent='—'; return; }
  if(String(v)===String(currentSkill.ans)){
    if(resEl){ resEl.textContent='👏 رائع!'; resEl.style.color='#22c55e';}
    const msg = skillSuccessPool[Math.floor(Math.random()*skillSuccessPool.length)];
    speak(msg,'ok'); celebrate();
    if(currentSkill.type==='mul') generateTablePractice();
    else if(currentSkill.type==='place') generatePlaceValue();
    else if(currentSkill.type==='cmp') generateComparison();
  }else{
    if(resEl){ resEl.textContent='❌ حاول مرة أخرى'; resEl.style.color='#ef4444'; }
    const msg = skillErrorPool[Math.floor(Math.random()*skillErrorPool.length)];
    speak(msg,'bad');
  }
}
function generateTablePractice(){
  const a = randInt(2,12), b = randInt(2,12); const ans=a*b;
  currentSkill.type='mul'; setSkillQuestion(`ما ناتج ${a} × ${b}؟`, ans);
  const choices = new Set([ans]);
  while(choices.size<4){
    const d = Math.max(1, Math.round(ans*0.05));
    choices.add(Math.max(0, ans + [-3,-2,-1,1,2,3][Math.floor(Math.random()*6)]*d));
  }
  showChoices([...choices].sort(()=>Math.random()-0.5));
}
function generatePlaceValue(){
  const labels = ['الآحاد','العشرات','المئات','الآلاف','عشرات الآلاف','مئات الآلاف'];
  const powers = [1,10,100,1000,10000,100000];
  const n = randInt(100, 999999);
  const len = String(n).length; const idx = Math.min(len-1, randInt(0, labels.length-1));
  const digit = Math.floor(n / powers[idx]) % 10; const ans = digit * powers[idx];
  currentSkill.type='place'; setSkillQuestion(`ما قيمة الرقم في منزلة ${labels[idx]} للعدد ${n}؟`, ans);
  const distract = new Set();
  for(let j=0;j<labels.length;j++){
    if(j===idx) continue; const d = Math.floor(n / powers[j]) % 10; distract.add(d * powers[j]); if(distract.size>=5) break;
  }
  const list = [ans, ...[...distract].filter(v=>v!==ans).slice(0,3)];
  while(list.length<4){ const k=[10,100,1000][Math.floor(Math.random()*3)]; const alt=(digit||1)*k; if(!list.includes(alt)) list.push(alt); }
  showChoices(list.sort(()=>Math.random()-0.5));
}
function generateComparison(){
  let a = randInt(0,9999); let b = randInt(0,9999); if(a===b) b+= (Math.random()<0.5?1:-1);
  const ans = a>b? '>' : a<b? '<' : '=';
  currentSkill.type='cmp'; setSkillQuestion(`اختر العلامة الصحيحة بين ${a} و ${b}:`, ans);
  showChoices(['>','<','=']);
}

function checkSkill(){
  const resEl = document.getElementById('skillR');
  const inputEl = document.getElementById('skillA');
  if(!resEl || !inputEl) return;
  const v = (inputEl.value||'').trim();
  if(v==='') { resEl.textContent='اكتب إجابة أو اختر خيارًا'; return; }
  checkSkillChoice(v);
}

/* Panels visibility */
function hideAllSkillPanels(){
  const ids = ['skillAnswerRow','skillChoices','skillQ','skillR'];
  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.style.display = 'none';
  });
}
function showSkillPanel(target){
  hideAllSkillPanels();
  if(target==='mul' || target==='place' || target==='cmp'){
    const q=document.getElementById('skillQ');
    const r=document.getElementById('skillR');
    if(q) q.style.display='block';
    if(r) r.style.display='block';
    const choices=document.getElementById('skillChoices');
    const ansRow=document.getElementById('skillAnswerRow');
    if(currentSkill && currentSkill.type==='cmp'){
      if(choices) choices.style.display='flex';
    }else{
      if(ansRow) ansRow.style.display='flex';
    }
  } else if(target==='calc'){
    const cp=document.getElementById('calcPanel');
    if(cp) cp.style.display='flex';
  }
}
