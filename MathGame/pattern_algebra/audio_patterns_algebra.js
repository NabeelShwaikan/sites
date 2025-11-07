/* ====== أصوات الصفحة ====== */
const sClickBad  = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_1b7a1c4f8a.mp3");
const sSuccess   = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_84e61fce5c.mp3");

function playSuccess(){ try{sSuccess.currentTime=0; sSuccess.play();}catch(e){} }
function playClickBad(){ try{sClickBad.currentTime=0; sClickBad.play();}catch(e){} }

/* ====== TTS عربي منقّى بدون قراءة الإيموجي والرموز ====== */

// نخزّن صوت عربي (إن وُجد) لاستخدامه لاحقًا
let __arVoice = null;

/** اختيار صوت عربي إن وُجد */
function __pickArabicVoice(){
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return voices.find(v => v.lang?.toLowerCase().startsWith('ar'))
      || voices.find(v => /ar|sa|eg|ma|ae|jo|tn/i.test(v.lang||''))  // بدائل قريبة
      || null;
}

/** إزالة الإيموجي والرموز حتى لا يقرأها TTS */
function __stripEmojiAndSymbols(s){
  return String(s)
    // إزالة الإيموجي، ZWJ، و VARIATION SELECTOR
    .replace(/[\p{Extended_Pictographic}\u200D\uFE0F]/gu, '')
    // الإبقاء على العربية/الأرقام/المسافات وبعض الترقيم
    .replace(/[^\p{Script=Arabic}\d\s\.\!\?،؟\-]/gu, '')
    // ترتيب المسافات
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** تهيئة بسيطة للنبرة حسب الحالة */
function __voiceTune(u, tone){
  if(tone === 'ok'){ u.rate = 1.05; u.pitch = 1.05; u.volume = 1.0; }
  else if(tone === 'bad'){ u.rate = 0.95; u.pitch = 0.9; u.volume = 0.95; }
}

/** الدالة المستخدمة في اللعبة: تنطق نصًّا عربيًّا بدون إيموجي */
function speak(msg, tone){
  try{
    if(!window.speechSynthesis) return;

    // تنقية النص قبل النطق (يمنع قراءة أسماء الإيموجي)
    const t = __stripEmojiAndSymbols(msg);
    if(!t) return;

    const u = new SpeechSynthesisUtterance(t);
    u.lang = 'ar';

    // اختيار الصوت العربي (مرة واحدة)
    if(!__arVoice){
      __arVoice = __pickArabicVoice();
      // لبعض المتصفحات: الأصوات تصل لاحقًا
      if(!__arVoice){
        window.speechSynthesis.onvoiceschanged = () => {
          __arVoice = __pickArabicVoice();
        };
      }
    }
    if(__arVoice) u.voice = __arVoice;

    __voiceTune(u, tone);

    // أوقف أي نطق سابق ثم انطق الجملة الجديدة
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }catch(e){
    // نتجاهل أي خطأ حتى لا يتوقف اللعب
  }
}
