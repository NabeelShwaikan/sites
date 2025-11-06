
let soundsOn = true;

// منظّف للنص قبل النطق: يسمح فقط بالعربية + أرقام + مسافات + بعض الترقيم
function ttsClean(s){
  if(!s) return '';
  const allowed = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF0-9\u0660-\u0669\s!\?،\.؛\-]/gu;
  let out = '';
  for(const ch of s){
    if(allowed.test(ch)) out += ch;
    allowed.lastIndex = 0;
  }
  out = out.replace(/\s{2,}/g,' ').trim();
  return out || 'أحسنت أحسنت!';
}

function speak(text,type='ok'){
  if(!soundsOn) return;
  try{
    const say = ttsClean(text);
    const u = new SpeechSynthesisUtterance(say);
    u.lang='ar';
    if(type==='ok'){u.rate=1.12; u.pitch=1.08; u.volume=1;}
    else {u.rate=0.85; u.pitch=0.6; u.volume=1;}
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
    showBubble(text); // الفقاعة تعرض النص الأصلي (قد يحوي إيموجي)
  }catch(e){}
}

function toggleVoice(){
  soundsOn=!soundsOn;
  const msgEl = document.getElementById('message');
  if(msgEl){ msgEl.className='row msg hint'; msgEl.textContent = soundsOn? '🎙️ الصوت مفعل':'🔇 الصوت متوقف'; }
}

function soundBeeps(){ try{ const u=new SpeechSynthesisUtterance('بيب'); u.lang='ar'; u.rate= 1.6; speechSynthesis.speak(u);}catch(e){} }

// إصلاح Chrome: تفعيل النطق بعد أول نقرة
window.addEventListener('click', () => {
  try{ speechSynthesis.resume(); }catch(e){}
}, {once:true});

// فقّاعة الكلام
function showBubble(text){
  const b = document.getElementById('speechBubble');
  if(!b) return;
  b.textContent = text;
  b.classList.add('show');
  setTimeout(()=>{ b.classList.remove('show'); }, 1600);
}
