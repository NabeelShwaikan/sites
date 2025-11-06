
// Calculator modal logic: "خلّيني أحسِب"
(function(){
  const modal = document.getElementById('calcModal');
  const aEl = document.getElementById('calcA');
  const bEl = document.getElementById('calcB');
  const opEl = document.getElementById('calcOp');
  const outEl = document.getElementById('calcOut');

  function toNumber(s){
    if(s==null) return None;
    s = (''+s).trim();
    const ar='٠١٢٣٤٥٦٧٨٩'; const en='0123456789';
    let t='';
    for(const ch of s){
      const i = ar.indexOf(ch);
      t += i>-1? en[i] : ch;
    }
    t = t.replace(',', '.');
    const n = parseFloat(t);
    return Number.isFinite(n)? n: NaN;
  }

  function openCalc(){ modal?.classList.add('show'); setTimeout(()=>aEl?.focus(), 10); }
  function closeCalc(){ modal?.classList.remove('show'); }
  function compute(){
    if(!aEl || !bEl || !opEl || !outEl) return;
    const a = toNumber(aEl.value), b = toNumber(bEl.value);
    const op = opEl.value;
    if(Number.isNaN(a) || Number.isNaN(b)){
      outEl.textContent = '⚠️ أدخل أرقامًا صحيحة.';
      speak?.('أدخل أرقامًا صحيحة','bad');
      return;
    }
    let res = null;
    if(op==='+') res = a + b;
    else if(op==='-') res = a - b;
    else if(op==='×') res = a * b;
    else if(op==='÷'){
      if(b===0){ outEl.textContent = '🚫 لا يمكن القسمة على صفر'; speak?.('لا يمكن القسمة على صفر','bad'); return; }
      res = a / b;
    }
    outEl.textContent = fmt(res);
    speak?.('أحسنت أحسنت!','ok');
  }

  // expose to window
  window.openCalc = openCalc;
  window.closeCalc = closeCalc;
  window.calcCompute = compute;
})();
