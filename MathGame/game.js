/************ Helpers (لازم تكون قبل أي استخدام) ************/
function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function digitLen(n){ return String(Math.abs(n)).length; }
function fmt(n){ return String(n); } // بدّلها لاحقًا إلى n.toLocaleString('ar-EG') لو حاب أرقام عربية
function shuffleInPlace(a){
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
// أصوات/مؤثرات اختيارية (آمنة لو ما فيه صوت)
function speak(msg, tone){
  try{
    if(window.speechSynthesis){
      const u = new SpeechSynthesisUtterance(msg);
      u.lang = 'ar';
      // ممكن تخصّص نبرة حسب tone: 'ok' | 'bad'
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }catch(e){}
}
function celebrate(){ /* TODO: مؤثر بصري لطيف */ }
function showStreakRewards(){ /* TODO: شارات/نجوم */ }


/************ حالة اللعبة ************/
let level=1, score=0, tries=0, easyMode=false, streak=0, best=0;

const msgEl   = document.getElementById('message');
const charsEl = document.getElementById('chars');
const optsEl  = document.getElementById('options');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const triesEl = document.getElementById('tries');
const streakEl= document.getElementById('streak');
const bestEl  = document.getElementById('best');

const praise = [
  '👏 ممتاز! إجابة صحيحة','🌟 بطل! واصل','🎉 شاطر!','💪 عبقري الحساب','😻 يا سلام عليك!','🚀 رحلة نجومية!',
  'كفو عليك يا الذيب!','انت كذا!','طيب يا وحش!'
];
const tryAgain = [
  '❌ حاول مرة أخرى','🤔 قريبة جدًا — جرّب ثانية','🙌 تقدر عليها!','💡 فكر شوي وعدّل الإجابة',
  'يا واد كبّك البهللة!','انت صاحي من جدّك؟'
];

/************ توليد مسألة (1..99 رقم/رقمين) ************/
function makeProblem(){
  const oneOrTwo = () => (Math.random() < 0.5 ? 1 : 2);
  const randByDigits = (d) => d===1 ? randInt(1,9) : randInt(10,99);

  let a,b,op,ans;
  const ops = easyMode ? ['+','-'] : ['+','-','×','÷'];
  op = pick(ops);

  if(op === '+'){
    const d1 = oneOrTwo(), d2 = oneOrTwo();
    a = randByDigits(d1); b = randByDigits(d2); ans = a + b;
  } else if(op === '-'){
    const d1 = oneOrTwo(), d2 = oneOrTwo();
    a = randByDigits(d1); b = randByDigits(d2);
    if(b > a) [a,b] = [b,a];
    ans = a - b;
  } else if(op === '×'){
    const d1 = oneOrTwo(), d2 = oneOrTwo();
    a = randByDigits(d1); b = randByDigits(d2); ans = a * b;
  } else if(op === '÷'){
    let attempts = 0;
    while(true){
      a = randInt(1,99);
      const divisors = [];
      for(let i=1;i<=Math.min(99,a);i++){ if(a % i === 0) divisors.push(i); }
      const candidates = divisors.filter(x => x>=1 && x<=99);
      if(candidates.length){
        b = pick(candidates);
        ans = a / b;
        break;
      }
      attempts++; if(attempts>200){ a=20; b=10; ans=2; break; }
    }
  }
  return {a,b,op,ans};
}

/************ عناصر واجهة ************/
function operandHTML(n, op){
  const color = op==='+' ? 'c2' : op==='-' ? 'c3' : op==='×' ? 'c4' : 'c5';
  const len = digitLen(n);
  return `<div class="char ${color} float"><div class="face">😊</div><div class="num" data-len="${len}">${fmt(n)}</div></div>`;
}
function teacherHTML(op){
  const cls = op==='+' ? 'op-add' : op==='-' ? 'op-sub' : op==='×' ? 'op-mul' : 'op-div';
  return `<div class="teacher bounce c5 ${cls}"><div class="sign">${op}</div><div class="board">اختر الناتج</div></div>`;
}
function optionHTML(n, colorClass){
  const len = digitLen(n);
  return `
    <button class="btn opt" data-val="${n}">
      <div class="char ${colorClass} float">
        <div class="face">🤖</div>
        <div class="num" data-len="${len}">${fmt(n)}</div>
      </div>
    </button>`;
}

/************ جولة جديدة ************/
window.currentAnswer = null;
function newRound(){
  const p = makeProblem();
  window.currentAnswer = p.ans;
  charsEl.innerHTML = operandHTML(p.a,p.op) + teacherHTML(p.op) + operandHTML(p.b,p.op);

  let choices = [p.ans];
  while(choices.length<4){
    const step = Math.max(1, Math.round(Math.abs(p.ans) * 0.05));
    let candidate = p.ans + ([-3,-2,-1,1,2,3][Math.floor(Math.random()*6)])*step;
    if(candidate<0) candidate = Math.abs(candidate);
    if(!choices.includes(candidate)) choices.push(candidate);
  }
  shuffleInPlace(choices);

  const colors=['c1','c2','c3','c4'];
  optsEl.innerHTML = '';
  choices.forEach((n,i)=>{
    optsEl.insertAdjacentHTML('beforeend', optionHTML(n, colors[i%colors.length]));
  });
  [...optsEl.querySelectorAll('.btn')].forEach(btn=>{
    btn.addEventListener('click',()=>onPick(Number(btn.dataset.val), btn));
  });

  msgEl.className='row msg hint';
  msgEl.textContent='اختر الإجابة الصحيحة لمساعدة أصدقائنا! 🌟';
}

/************ التحقق من الاختيار ************/
function onPick(value, btn){
  tries++; triesEl.textContent=tries;
  if(value===window.currentAnswer){
    streak++; if(streak>best){best=streak; bestEl.textContent=best;}
    streakEl.textContent=streak;
    score+=10; scoreEl.textContent=score; level = Math.floor(score/50)+1; levelEl.textContent=level;

    msgEl.className='row msg ok'; 
    const msg = pick(praise);
    msgEl.textContent = msg;
    btn.classList.add('wiggle');
    speak(msg,'ok');
    celebrate();
    showStreakRewards();
    setTimeout(newRound, 700);
  }else{
    streak=0; streakEl.textContent=streak;
    msgEl.className='row msg bad'; 
    const msg = pick(tryAgain);
    msgEl.textContent = msg;
    speak(msg,'bad');
    btn.classList.add('wiggle');
    setTimeout(()=>btn.classList.remove('wiggle'),600);
  }
}

/************ اختبارات ذاتية (Console) ************/
function selfTests(){
  console.log('تشغيل اختبارات ذاتية…');
  let seen={add:false, sub:false, mul:false, div:false};
  for(let i=0;i<160;i++){
    const p = makeProblem();
    console.assert(p.a>=1 && p.a<=99 && p.b>=1 && p.b<=99, 'operand out of 1..99', p);
    if(p.op==='÷') console.assert(p.b!==0 && p.a % p.b === 0, 'division exact failed', p);
    if(p.op==='+') seen.add=true; if(p.op==='-') seen.sub=true; if(p.op==='×') seen.mul=true; if(p.op==='÷') seen.div=true;
  }
  console.assert(seen.add && seen.sub && seen.mul && seen.div, 'ops coverage failed');
}


/* =========================================================
   📊 مهارة: جمع البيانات وتنظيمها (تعمل داخل نفس الصفحة)
   المتطلبات في HTML (إن أردت تفعيلها من الواجهة):
   <button id="btn-skill-data" class="chip">📊 جمع البيانات</button>
   <section id="skill-data" class="tool hidden"></section>
   مع CSS الجداول/المخطط الذي أرسلته لك سابقًا.
   ========================================================= */
(function(){
  const skillBtn = document.getElementById('btn-skill-data');
  const skillBox = document.getElementById('skill-data');
  if(!skillBox){ return; } // لو ما فيه حاوية، تجاهل إضافة المهارة

  const DATA_THEMES = {
    fruits:["🍎","🍌","🍓","🍉","🍇","🍊"],
    animals:["🐶","🐱","🐰","🦊","🦁","🐼"],
    transport:["🚗","🚌","🚲","🚕","🚑","🚒"],
    sports:["⚽","🏀","🎾","🏈","🥎","🏐"],
    weather:["☀️","🌧️","⛅","🌩️","🌨️","🌪️"],
    school:["✏️","📘","📏","✂️","🖍️","📎"],
    shapes:["🔴","🟡","🔺","🔷","⬛","⭐"],
    food:["🍕","🍔","🍟","🌭","🥗","🍩"],
    daily:["🛏️","🍽️","📚","🎮","📱","🚿"]
  };
  const DATA_COLORS=["c1","c2","c3","c4","c5"];
  const DATA_MIN=18, DATA_MAX=28;

  let dataSet = DATA_THEMES.fruits;
  let dataItems = [];

  function startDataSkill(){
    // ممكن توقف مؤقّت لعبتك هنا لو عندك one: pauseGameRound?.();

    skillBox.classList.remove('hidden');
    skillBox.innerHTML = `
      <h3>📊 جمع البيانات وتنظيمها</h3>

      <div class="row" style="gap:10px;align-items:center;justify-content:center;">
        <label class="mini">المجموعة:</label>
        <select id="dataTheme" class="btn-sm">
          <option value="fruits">🍎 فواكه</option>
          <option value="animals">🐶 حيوانات</option>
          <option value="transport">🚗 نقل</option>
          <option value="sports">⚽ رياضات</option>
          <option value="weather">☀️ طقس</option>
          <option value="school">✏️ مدرسة</option>
          <option value="shapes">🔷 أشكال</option>
          <option value="food">🍔 أطعمة</option>
          <option value="daily">🕒 يوميات</option>
          <option value="mix">🔀 عشوائي</option>
        </select>

        <button id="dataNew"   class="btn-sm">🔄 جولة جديدة</button>
        <button id="dataCount" class="btn-sm">🧮 عدّ العناصر</button>
        <button id="dataClose" class="btn-sm" style="border-color:#f43f5e;">✖ إغلاق</button>
      </div>

      <div id="dataTiles" class="characters" style="margin-top:10px;"></div>

      <div id="dataResults" class="results hidden" style="margin-top:10px;">
        <h4>النتيجة</h4>
        <div class="grid">
          <div>
            <h4>جدول التكرارات</h4>
            <table id="dataTable"></table>
          </div>
          <div>
            <h4>مخطط الأعمدة</h4>
            <div id="dataChart" class="chart"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('dataTheme').onchange = dataNewRound;
    document.getElementById('dataNew').onclick   = dataNewRound;
    document.getElementById('dataCount').onclick = dataCount;
    document.getElementById('dataClose').onclick = () => {
      skillBox.classList.add('hidden');
      skillBox.innerHTML = '';
      // استئناف اللعبة إن رغبت: resumeGameRound?.();
    };

    dataNewRound();
  }

  function updateTheme(){
    const sel = document.getElementById('dataTheme');
    const val = sel ? sel.value : 'fruits';
    if(val === 'mix'){
      const all = Object.values(DATA_THEMES).flat();
      const mix = new Set();
      while(mix.size<6){ mix.add(all[randInt(0,all.length-1)]); }
      dataSet = [...mix];
    }else{
      dataSet = DATA_THEMES[val] || DATA_THEMES.fruits;
    }
  }

  function dataNewRound(){
    updateTheme();
    const tiles   = document.getElementById('dataTiles');
    const results = document.getElementById('dataResults');
    if(results) results.classList.add('hidden');
    if(!tiles) return;

    tiles.innerHTML = '';
    dataItems = [];
    const total = randInt(DATA_MIN, DATA_MAX);
    for(let i=0;i<total;i++){
      const e = pick(dataSet);
      const c = pick(DATA_COLORS);
      dataItems.push(e);
      tiles.insertAdjacentHTML('beforeend', `
        <div class="char ${c}">
          <div class="face">🤖</div>
          <div class="num">${e}</div>
        </div>
      `);
    }
  }

  function dataFreq(){
    const m=new Map();
    dataSet.forEach(x=>m.set(x,0));
    dataItems.forEach(x=>m.set(x,(m.get(x)||0)+1));
    return m;
  }

  function dataRenderTable(freq){
    const table = document.getElementById('dataTable');
    if(!table) return;
    let html = `<tr><th>العنصر</th><th>التكرار</th></tr>`;
    dataSet.forEach(e=>{
      html += `<tr><td>${e}</td><td class="val">${freq.get(e)||0}</td></tr>`;
    });
    table.innerHTML = html;
  }

  function dataRenderChart(freq){
    const chart = document.getElementById('dataChart');
    if(!chart) return;
    chart.innerHTML = '';
    const vals = dataSet.map(e=>freq.get(e)||0);
    const max  = Math.max(1, ...vals);
    dataSet.forEach((e,i)=>{
      const v = vals[i];
      const h = (v/max)*180;
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.height = `${Math.max(8,h)}px`;
      bar.innerHTML = `<span class="emoji">${e}</span><span class="label">${v}</span>`;
      chart.appendChild(bar);
    });
  }

  function dataCount(){
    const results = document.getElementById('dataResults');
    const freq = dataFreq();
    dataRenderTable(freq);
    dataRenderChart(freq);
    if(results) results.classList.remove('hidden');
  }

  if(skillBtn) skillBtn.addEventListener('click', startDataSkill);
  window.startDataSkill = startDataSkill; // تشغيل برمجيًا إن احتجت
})();

/************ بدء اللعبة ************/
try { newRound(); } catch(e){ console.error(e); }
