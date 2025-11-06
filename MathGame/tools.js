
function decParse(v){
  if(typeof v!== 'string') v = String(v);
  v = v.trim().replace(',', '.');
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}
function decApply(factor){
  const input = document.getElementById('decIn');
  const output = document.getElementById('decOut');
  const n = decParse(input ? input.value : '');
  if(n===null){ if(output) output.textContent='—'; return; }
  const r = n * factor;
  if(output) output.textContent = Number(r.toFixed(10)).toString();
  playPopFX();
}

// ===== حاسبة "خلّيني أحسِب" ضمن أدوات المهارات =====
function toggleCalcPanel(){
  const panel = document.getElementById('calcPanel');
  if(!panel) return;
  const show = panel.style.display !== 'flex';
  panel.style.display = show ? 'flex' : 'none';
  if(show){
    const aEl = document.getElementById('calcA');
    if(aEl) aEl.focus();
  }
}

// تحويل أرقام عربية إلى إنجليزية + التعامل مع الفواصل
function calcToNumber(s){
  if(s==null) return NaN;
  s = (''+s).trim();
  const ar='٠١٢٣٤٥٦٧٨٩', en='0123456789';
  let t='';
  for(const ch of s){
    const i = ar.indexOf(ch);
    t += i>-1? en[i] : ch;
  }
  t = t.replace(',', '.');
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : NaN;
}

function calcCompute(){
  const aEl = document.getElementById('calcA');
  const bEl = document.getElementById('calcB');
  const opEl = document.getElementById('calcOp');
  const outEl = document.getElementById('calcOut');
  if(!aEl || !bEl || !opEl || !outEl) return;

  const a = calcToNumber(aEl.value);
  const b = calcToNumber(bEl.value);
  const op = opEl.value;

  if(Number.isNaN(a) || Number.isNaN(b)){
    outEl.textContent = '⚠️ أدخل أرقامًا صحيحة.';
    return; // بدون صوت تقييم
  }

  let res = null;
  if(op==='+') res = a + b;
  else if(op==='-') res = a - b;
  else if(op==='×') res = a * b;
  else if(op==='÷'){
    if(b===0){
      outEl.textContent = '🚫 لا يمكن القسمة على صفر';
      return;
    }
    res = a / b;
  }

  outEl.textContent = typeof fmt==='function' ? fmt(res) : String(res);
}
