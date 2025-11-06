
// حالة اللعبة
let level=1, score=0, tries=0, easyMode=false, streak=0, best=0;

const msgEl = document.getElementById('message');
const charsEl = document.getElementById('chars');
const optsEl  = document.getElementById('options');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const triesEl = document.getElementById('tries');
const streakEl = document.getElementById('streak');
const bestEl = document.getElementById('best');

const praise = [
  '👏 ممتاز! إجابة صحيحة','🌟 بطل! واصل','🎉 شاطر!','💪 عبقري الحساب','😻 يا سلام عليك!','🚀 رحلة نجومية!',
  'كفو عليك يا الذيب!','انت كذا!','طيب يا وحش!'
];
const tryAgain = [
  '❌ حاول مرة أخرى','🤔 قريبة جدًا — جرّب ثانية','🙌 تقدر عليها!','💡 فكر شوي وعدّل الإجابة',
  'يا واد كبّك البهللة!','انت صاحي من جدّك؟'
];

// توليد مسألة (1..99 رقم/رقمين)
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

// عناصر واجهة
function operandHTML(n, op){
  const color = op==='+' ? 'c2' : op==='-' ? 'c3' : op==='×' ? 'c4' : 'c5';
  const len = digitLen(n);
  return `<div class="char ${color} float"><div class="face">😊</div><div class="num" data-len="${len}">`+fmt(n)+`</div></div>`;
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
        <div class="num" data-len="${len}">`+fmt(n)+`</div>
      </div>
    </button>`;
}

// جولة جديدة
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

// اختبارات ذاتية (Console)
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
