/************ إعدادات الحالة ************/
let mode = 'pattern';           // 'pattern' | 'algebra'
let voiceOn = true;
let currentAnswer = null;
let tries = 0, streak = 0, best = 0;

const msgEl     = document.getElementById('message');
const qArea     = document.getElementById('questionArea');
const optsEl    = document.getElementById('options');
const btnNew    = document.getElementById('btnNew');
const btnPattern= document.getElementById('btnPattern');
const btnAlgebra= document.getElementById('btnAlgebra');
const btnVoice  = document.getElementById('btnVoice');
const triesEl   = document.getElementById('tries');
const streakEl  = document.getElementById('streak');
const bestEl    = document.getElementById('best');

/************ أدوات مساعدة ************/
function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function speak(text){
  if(!voiceOn) return;
  try{
    if(window.speechSynthesis){
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }catch(e){}
}
function okText(){ return pick(['👏 ممتاز!','🌟 أحسنت!','🎉 شاطر!','💪 ممتاز يا بطل!','😻 رائع!']); }
function badText(){ return pick(['❌ حاول مرة أخرى','🤔 قريب! جرّب ثانية','💡 ركّز شوي','🙌 أنت قدّها']); }

/************ توليد أسئلة الأنماط ************/
// نمط حسابي: a, a+d, a+2d, a+3d, ?
function makeArithmeticPattern(){
  let d=0; while(d===0) d = randInt(-5,5);
  const a = randInt(1,30);
  const seq = [a, a+d, a+2*d, a+3*d];
  const answer = a+4*d;
  return { seq, answer, explain: `نمط حسابي بزيادة ${d>0?`+${d}`:`${d}`}` };
}
// نمط هندسي مبسّط: a, a*r, a*r², a*r³, ?
function makeGeometricPattern(){
  const r = pick([2,3]);
  const a = randInt(1,6);
  const seq = [a, a*r, a*r*r, a*r*r*r];
  const answer = a*r*r*r*r;
  return { seq, answer, explain: `نمط هندسي ×${r}` };
}
function generatePatternQuestion(){
  const gen = Math.random()<0.7 ? makeArithmeticPattern : makeGeometricPattern;
  return gen();
}

/************ توليد أسئلة الجبر ************/
function makeAlgebraQuestion(){
  const type = pick(['add','sub','mul','div']);
  let a,b,x,question,answer;

  if(type==='add'){ // x + a = b
    a = randInt(1,20); x = randInt(0,20); b = x + a;
    question = `x + ${a} = ${b}`; answer = x;
  }else if(type==='sub'){ // x - a = b  => x = a+b
    a = randInt(1,20); b = randInt(0,20); x = a + b;
    question = `x - ${a} = ${b}`; answer = x;
  }else if(type==='mul'){ // a*x = b  (a في [2..9])
    a = randInt(2,9); x = randInt(1,10); b = a*x;
    question = `${a}x = ${b}`; answer = x;
  }else{ // div: x / a = b  => x = a*b
    a = randInt(2,9); b = randInt(1,10); x = a*b;
    question = `x ÷ ${a} = ${b}`; answer = x;
  }
  return { question, answer };
}

/************ عرض سؤال وأنشاء الخيارات ************/
function colorClass(i){ return ['c1','c2','c3','c4','c5'][i%5]; }

function renderPattern(){
  const { seq, answer, explain } = generatePatternQuestion();
  currentAnswer = answer;

  qArea.innerHTML = `
    <div class="seq">
      <div class="box">${seq[0]}</div>
      <div class="box">${seq[1]}</div>
      <div class="box">${seq[2]}</div>
      <div class="box">${seq[3]}</div>
      <div class="box">؟</div>
    </div>
    <div class="badge">${explain}</div>
  `;

  // خيارات
  const opts = [answer];
  while(opts.length<4){
    let delta = Math.max(1, Math.round(Math.abs(answer)*0.15));
    let cand = answer + pick([-2,-1,1,2])*delta;
    cand = Math.max(0, cand);
    if(!opts.includes(cand)) opts.push(cand);
  }
  shuffle(opts);

  optsEl.innerHTML = '';
  opts.forEach((n,i)=>{
    const btn = document.createElement('button');
    btn.className = `opt ${colorClass(i)}`;
    btn.innerHTML = `<div class="box">${n}</div>`;
    btn.onclick = () => onPick(n, btn);
    optsEl.appendChild(btn);
  });

  msgEl.className = 'row msg hint';
  msgEl.textContent = 'ما هو الحد التالي في النمط؟';
}

function renderAlgebra(){
  const { question, answer } = makeAlgebraQuestion();
  currentAnswer = answer;

  qArea.innerHTML = `
    <div class="seq">
      <div class="box" style="width:auto;padding:0 18px;font-family:inherit;">${question}</div>
    </div>
    <div class="badge">اختر قيمة <b>x</b> الصحيحة</div>
  `;

  // خيارات
  const opts = [answer];
  while(opts.length<4){
    let delta = Math.max(1, Math.round(Math.abs(answer)*0.2));
    let cand = answer + pick([-2,-1,1,2])*delta;
    cand = Math.max(0, cand);
    if(!opts.includes(cand)) opts.push(cand);
  }
  shuffle(opts);

  optsEl.innerHTML = '';
  opts.forEach((n,i)=>{
    const btn = document.createElement('button');
    btn.className = `opt ${colorClass(i)}`;
    btn.innerHTML = `<div class="box">${n}</div>`;
    btn.onclick = () => onPick(n, btn);
    optsEl.appendChild(btn);
  });

  msgEl.className = 'row msg hint';
  msgEl.textContent = 'اختر قيمة x الصحيحة';
}

/************ تحكّم عام ************/
function render(){
  if(mode==='pattern') renderPattern();
  else renderAlgebra();
}
function newQuestion(){
  render();
}
btnNew.onclick = newQuestion;

btnPattern.onclick = () => {
  mode='pattern';
  btnPattern.classList.add('on');
  btnAlgebra.classList.remove('on');
  newQuestion();
};
btnAlgebra.onclick = () => {
  mode='algebra';
  btnAlgebra.classList.add('on');
  btnPattern.classList.remove('on');
  newQuestion();
};

function onPick(value, btn){
  tries++; triesEl.textContent = tries;
  if(value===currentAnswer){
    streak++; if(streak>best){best=streak; bestEl.textContent=best;}
    streakEl.textContent = streak;

    msgEl.className='row msg ok';
    const text = okText();
    msgEl.textContent = text;
    speak(text);
    playSuccess();
    confettiOnce();
    setTimeout(newQuestion, 700);
  }else{
    streak=0; streakEl.textContent=streak;

    msgEl.className='row msg bad';
    const text = badText();
    msgEl.textContent = text;
    speak(text);
    playClickBad();
    btn.style.transform='scale(0.97)';
    setTimeout(()=>btn.style.transform='',200);
  }
}

function toggleVoice(){
  voiceOn = !voiceOn;
  btnVoice.textContent = voiceOn ? '🔈 صوت: يعمل' : '🔇 صوت: متوقف';
}

render(); // أول سؤال
