// ======================
//  لعبة الحروف — V7
// ======================

// --- الحروف والحقول ---
const LETTERS = [
  'أ','ب','ت','ث','ج','ح','خ',
  'د','ذ','ر','ز','س','ش',
  'ص','ض','ط','ظ','ع','غ',
  'ف','ق','ك','ل','م','ن','هـ','و','ي'
];

// أسماء الحروف للنطق
const LETTER_NAMES = {
  'أ': 'ألف',
  'ب': 'باء',
  'ت': 'تاء',
  'ث': 'ثاء',
  'ج': 'جيم',
  'ح': 'حاء',
  'خ': 'خاء',
  'د': 'دال',
  'ذ': 'ذال',
  'ر': 'راء',
  'ز': 'زاي',
  'س': 'سين',
  'ش': 'شين',
  'ص': 'صاد',
  'ض': 'ضاد',
  'ط': 'طاء',
  'ظ': 'ظاء',
  'ع': 'عين',
  'غ': 'غين',
  'ف': 'فاء',
  'ق': 'قاف',
  'ك': 'كاف',
  'ل': 'لام',
  'م': 'ميم',
  'ن': 'نون',
  'هـ': 'هاء',
  'و': 'واو',
  'ي': 'ياء'
};

// إضافة حقل "أكلة" بعد "نبات"
const FIELDS = [
  'اسم علم مذكّر',
  'اسم علم مؤنّث',
  'حيوان',
  'طائر',
  'نبات',
  'أكلة',
  'جماد',
  'دولة',
  'مدينة'
];

const STORAGE_KEY = 'lettersGameStateV7';

// --- مراجع العناصر من الصفحة ---
const roomCodeInput = document.getElementById('roomCode');
const roundDurationSelect = document.getElementById('roundDuration');
const roundDurationWrapper = document.getElementById('roundDurationWrapper');
const startRoundBtn = document.getElementById('startRoundBtn');
const endGameBtn = document.getElementById('endGameBtn');
const newMatchBtn = document.getElementById('newMatchBtn');
const themeToggleBtn = document.getElementById('themeToggle');
const themeLabelSpan = document.getElementById('themeLabel');

const currentRoundSpan = document.getElementById('currentRound');
const usedLettersCountSpan = document.getElementById('usedLettersCount');
const nowTimeSpan = document.getElementById('nowTime');
const syncInfoSpan = document.getElementById('syncInfo');
const scheduledStartSpan = document.getElementById('scheduledStart');
const preCountdownSpan = document.getElementById('preCountdown');
const roundCountdownSpan = document.getElementById('roundCountdown');
const currentLetterSpan = document.getElementById('currentLetter');
const flipLettersSpan = document.getElementById('flipLetters');

const roundTotalSpan = document.getElementById('roundTotal');
const globalTotalSpan = document.getElementById('globalTotal');
const fieldsContainer = document.getElementById('fieldsContainer');
const saveRoundBtn = document.getElementById('saveRoundBtn');
const roundsTableBody = document.getElementById('roundsTableBody');
const flashOverlay = document.getElementById('flashOverlay');

// --- حالة اللعبة ---
let gameActive = true;
let currentRound = 0;
let pendingRound = null;
let preCountdownTimer = null;
let flipLettersTimer = null;
let roundTimer = null;
let scheduledStartTime = null;
let usedLetters = [];
let globalTotal = 0;
let roundFields = [];
const roundResults = {};
let durationLocked = false;

// =======================
//      جزء الصوتيات 🎶
// =======================
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

// توليد نغمة واحدة
function playBeep(freq, startOffsetSec, durationSec, volume = 0.25) {
  const ctx = getAudioCtx();
  if (!ctx) return;

  const startTime = ctx.currentTime + startOffsetSec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, startTime + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + durationSec + 0.05);
}

// تشغيل لحن عبارة عن مجموعة نغمات
function playMelody(notes) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  notes.forEach(n => {
    playBeep(n.freq, n.t, n.dur, n.vol);
  });
}

// لحن بداية الجولة (تصاعدي)
function playStartMelody() {
  playMelody([
    { freq: 523.25, t: 0.00, dur: 0.18, vol: 0.3 },
    { freq: 659.25, t: 0.20, dur: 0.18, vol: 0.3 },
    { freq: 783.99, t: 0.40, dur: 0.25, vol: 0.32 },
    { freq: 1046.50, t: 0.70, dur: 0.25, vol: 0.35 }
  ]);
}

// لحن نهاية الجولة (تنازلي)
function playEndMelody() {
  playMelody([
    { freq: 880.00, t: 0.00, dur: 0.22, vol: 0.28 },
    { freq: 698.46, t: 0.22, dur: 0.22, vol: 0.26 },
    { freq: 587.33, t: 0.42, dur: 0.22, vol: 0.24 },
    { freq: 440.00, t: 0.60, dur: 0.30, vol: 0.22 }
  ]);
}

// =======================
//   نطق الحرف المختار 🔊
// =======================
function speakLetter(letter) {
  if (!('speechSynthesis' in window)) return;
  const name = LETTER_NAMES[letter] || letter;
  const utter = new SpeechSynthesisUtterance(`حرف ${name}`);
  utter.lang = 'ar-SA';
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

// السماح بإعادة النطق عند الضغط على الحرف
currentLetterSpan.addEventListener('click', () => {
  const letter = currentLetterSpan.textContent.trim();
  if (letter && letter !== '—') {
    speakLetter(letter);
  }
});

// =======================
//      الثيم: نهاري / كهربائي
// =======================
function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  if (theme === 'day') {
    themeLabelSpan.textContent = 'نهاري';
  } else {
    themeLabelSpan.textContent = 'أزرق كهربائي';
  }
  localStorage.setItem('lettersGameTheme', theme);
}

const savedTheme = localStorage.getItem('lettersGameTheme') || 'day';
applyTheme(savedTheme);

themeToggleBtn.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme') || 'day';
  const next = current === 'day' ? 'electric' : 'day';
  applyTheme(next);
});

// =======================
//    بناء الحقول للجولة
// =======================
function buildFields() {
  fieldsContainer.innerHTML = '';
  roundFields = [];
  FIELDS.forEach((labelText) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'field-card';

    const header = document.createElement('div');
    header.className = 'field-header';
    header.innerHTML = `<span>${labelText}</span><span>كلمة + درجة</span>`;
    wrapper.appendChild(header);

    const wordInput = document.createElement('input');
    wordInput.type = 'text';
    wordInput.placeholder = 'اكتب الكلمة هنا';
    wordInput.disabled = true;
    wrapper.appendChild(wordInput);

    const scoreWrapper = document.createElement('div');
    scoreWrapper.className = 'score-input';
    const scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'الدرجة:';

    const scoreSelect = document.createElement('select');
    const opts = [
      { value: '', label: '—' },
      { value: '0', label: '0' },
      { value: '5', label: '5' },
      { value: '10', label: '10' }
    ];
    opts.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      scoreSelect.appendChild(opt);
    });
    scoreSelect.disabled = true;

    // عند تغيير الدرجة: لو الكلمة فاضية، نجبر الدرجة على 0
    scoreSelect.addEventListener('change', () => {
      if (wordInput.value.trim() === '') {
        scoreSelect.value = '0';
      }
      updateRoundTotal();
    });

    // لو اللاعب مسح الكلمة بعد ما كتبها، نرجّع الدرجة 0
    wordInput.addEventListener('input', () => {
      if (wordInput.value.trim() === '') {
        scoreSelect.value = '0';
        updateRoundTotal();
      }
    });

    scoreWrapper.appendChild(scoreLabel);
    scoreWrapper.appendChild(scoreSelect);
    wrapper.appendChild(scoreWrapper);

    fieldsContainer.appendChild(wrapper);

    roundFields.push({
      wordInput,
      scoreInput: scoreSelect,
      scoreWrapper
    });
  });
}

function updateRoundTotal() {
  let sum = 0;
  roundFields.forEach(f => {
    const wordEmpty = f.wordInput.value.trim() === '';
    let v = 0;
    if (!wordEmpty) {
      const vRaw = f.scoreInput.value;
      v = vRaw === '' ? 0 : parseInt(vRaw, 10);
    } else {
      // لو الكلمة فاضية نضمن أن القيمة 0
      f.scoreInput.value = '0';
    }
    if (!isNaN(v)) sum += v;
  });
  roundTotalSpan.textContent = sum;
}

function setWordInputsEnabled(enabled) {
  roundFields.forEach(f => {
    f.wordInput.disabled = !enabled;
  });
}

function setScoreInputsEnabled(enabled) {
  roundFields.forEach(f => {
    f.scoreInput.disabled = !enabled;
  });
}

function showScores(show) {
  roundFields.forEach(f => {
    f.scoreWrapper.style.display = show ? 'flex' : 'none';
  });
}

function clearCurrentRoundInputs() {
  roundFields.forEach(f => {
    f.wordInput.value = '';
    f.scoreInput.value = '0';
  });
  roundTotalSpan.textContent = '0';
}

// =======================
//      الوقت والهاش
// =======================
function updateNowTime() {
  const now = new Date();
  nowTimeSpan.textContent = now.toLocaleTimeString('ar-SA', { hour12: false });
}
setInterval(updateNowTime, 500);
updateNowTime();

function getNextMinuteDate() {
  const now = new Date();
  const next = new Date(now);
  next.setSeconds(0, 0);
  if (now.getSeconds() > 0 || now.getMilliseconds() > 0) {
    next.setMinutes(next.getMinutes() + 1);
  }
  return next;
}

function formatTime(date) {
  if (!date) return '—';
  return date.toLocaleTimeString('ar-SA', { hour12: false });
}

function hashStringToInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickLetter(roomCode, roundNumber) {
  if (!roomCode || roundNumber <= 0) return '—';
  const baseSeed = hashStringToInt(roomCode + '#' + roundNumber);
  let availableLetters = LETTERS.slice();

  usedLetters.forEach(l => {
    const idx = availableLetters.indexOf(l);
    if (idx !== -1) availableLetters.splice(idx, 1);
  });

  // لو خلصت الأحرف نرجّع الدورة من جديد
  if (availableLetters.length === 0) {
    availableLetters = LETTERS.slice();
    usedLetters = [];
  }

  const idx = baseSeed % availableLetters.length;
  return availableLetters[idx];
}

// =======================
//   مؤثر الأحرف المتقلبة
// =======================
function startFlipLetters() {
  stopFlipLetters();
  flipLettersTimer = setInterval(() => {
    let out = '';
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * LETTERS.length);
      out += LETTERS[randomIndex] + ' ';
    }
    flipLettersSpan.textContent = out.trim();
  }, 50);
}

function stopFlipLetters() {
  if (flipLettersTimer) {
    clearInterval(flipLettersTimer);
    flipLettersTimer = null;
  }
  flipLettersSpan.textContent = '';
}

// =======================
//  حفظ واستعادة الحالة
// =======================
function saveState() {
  try {
    const rounds = [];
    for (const key in roundResults) {
      const rNum = parseInt(key, 10);
      const entry = roundResults[key];
      if (!entry) continue;
      rounds.push({
        round: rNum,
        letter: entry.letter,
        total: entry.total
      });
    }
    rounds.sort((a, b) => a.round - b.round);
    const data = {
      currentRound,
      usedLetters,
      globalTotal,
      rounds
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    currentRound = data.currentRound || 0;
    currentRoundSpan.textContent = currentRound;

    usedLetters = Array.isArray(data.usedLetters) ? data.usedLetters : [];
    usedLettersCountSpan.textContent = usedLetters.length;

    globalTotal = data.globalTotal || 0;
    globalTotalSpan.textContent = globalTotal;
    roundTotalSpan.textContent = '0';

    roundsTableBody.innerHTML = '';
    for (const d of (data.rounds || [])) {
      const tr = document.createElement('tr');
      const tdRound = document.createElement('td');
      const tdLetter = document.createElement('td');
      const tdTotal = document.createElement('td');

      tdRound.textContent = d.round;
      tdLetter.innerHTML = `<span class="letter-tag">${d.letter}</span>`;
      tdTotal.textContent = d.total;

      tr.appendChild(tdRound);
      tr.appendChild(tdLetter);
      tr.appendChild(tdTotal);
      roundsTableBody.appendChild(tr);

      roundResults[d.round] = {
        total: d.total,
        letter: d.letter,
        row: tr,
        tdTotal
      };
    }

    if (data.rounds && data.rounds.length > 0) {
      syncInfoSpan.textContent = 'تم استعادة نتائج سابقة. يمكنك متابعة اللعب أو بدء مباراة جديدة.';
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
}

// =======================
//   العد التنازلي لبداية الجولة
// =======================
function startPreCountdown() {
  clearInterval(preCountdownTimer);
  preCountdownTimer = null;

  if (!scheduledStartTime) {
    preCountdownSpan.textContent = '—';
    return;
  }

  startFlipLetters();

  preCountdownTimer = setInterval(() => {
    const now = new Date();
    const diffMs = scheduledStartTime - now;
    if (diffMs <= 0) {
      clearInterval(preCountdownTimer);
      preCountdownTimer = null;
      preCountdownSpan.textContent = '00:00';
      stopFlipLetters();
      beginRoundNow();
    } else {
      const diffSec = Math.floor(diffMs / 1000);
      const mm = String(Math.floor(diffSec / 60)).padStart(2, '0');
      const ss = String(diffSec % 60).padStart(2, '0');
      preCountdownSpan.textContent = `${mm}:${ss}`;
    }
  }, 250);
}

// =======================
//     وميض الخلفية (طبقة كاملة)
// =======================
function flashBackground() {
  if (!flashOverlay) return;
  flashOverlay.classList.remove('show');
  void flashOverlay.offsetWidth;
  flashOverlay.classList.add('show');
}

// =======================
//     عدّاد وقت الجولة
// =======================
function startRoundCountdown(durationSeconds) {
  clearInterval(roundTimer);
  roundTimer = null;

  let remaining = durationSeconds;
  updateRoundTimerDisplay(remaining, durationSeconds);

  roundTimer = setInterval(() => {
    remaining--;

    // تنبيه خاص عند بقاء 10 ثواني
    if (remaining === 10) {
      syncInfoSpan.textContent = 'بقي ١٠ ثواني! استعدوا للانتهاء.';
      playBeep(880, 0, 0.18, 0.28);
    }

    // وميض برتقالي عند آخر 5 ثواني
    if (remaining === 5) {
      flashBackground();
    }

    if (remaining <= 0) {
      clearInterval(roundTimer);
      roundTimer = null;
      roundCountdownSpan.textContent = 'انتهى الوقت';
      roundCountdownSpan.classList.remove('timer-green', 'timer-yellow', 'timer-red');
      roundCountdownSpan.classList.add('timer-red');
      syncInfoSpan.textContent = 'انتهى وقت الجولة، اختر الدرجات ثم سجّل الجولة أو ابدأ جولة جديدة.';
      setWordInputsEnabled(false);
      showScores(true);
      setScoreInputsEnabled(true);
      saveRoundBtn.disabled = false;

      // لحن نهاية الجولة
      playEndMelody();
    } else {
      updateRoundTimerDisplay(remaining, durationSeconds);
    }
  }, 1000);
}

function updateRoundTimerDisplay(remaining, total) {
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  roundCountdownSpan.textContent = `${mm}:${ss}`;

  roundCountdownSpan.classList.remove('timer-green', 'timer-yellow', 'timer-red');
  const fraction = remaining / total;
  if (fraction > 0.6) {
    roundCountdownSpan.classList.add('timer-green');
  } else if (fraction > 0.3) {
    roundCountdownSpan.classList.add('timer-yellow');
  } else {
    roundCountdownSpan.classList.add('timer-red');
  }
}

// =======================
//     بداية الجولة فعليًا
// =======================
function beginRoundNow() {
  if (!gameActive) return;
  if (!pendingRound || !scheduledStartTime) return;

  const roomCode = roomCodeInput.value.trim();
  if (!roomCode) {
    alert('الرجاء إدخال كود الغرفة أولًا.');
    return;
  }

  // أول تفاعل بداية جولة يفعّل الصوت
  getAudioCtx();

  currentRound = pendingRound;
  currentRoundSpan.textContent = currentRound;
  syncInfoSpan.textContent = 'الجولة قيد اللعب الآن ✅';

  // قفل مدة الجولة بعد أول جولة وإخفائها
  if (!durationLocked) {
    durationLocked = true;
    roundDurationWrapper.style.display = 'none';
  }

  const letter = pickLetter(roomCode, currentRound);
  currentLetterSpan.textContent = letter;

  if (!usedLetters.includes(letter)) {
    usedLetters.push(letter);
    usedLettersCountSpan.textContent = usedLetters.length;
  }

  // نطق الحرف المختار
  speakLetter(letter);

  clearCurrentRoundInputs();
  setWordInputsEnabled(true);
  showScores(false);
  setScoreInputsEnabled(false);
  saveRoundBtn.disabled = true;

  const duration = parseInt(roundDurationSelect.value, 10) || 60;
  startRoundCountdown(duration);

  pendingRound = null;
  scheduledStartTime = null;
  scheduledStartSpan.textContent = '—';
  preCountdownSpan.textContent = '—';

  // لحن بداية الجولة
  playStartMelody();

  saveState();
}

// =======================
//        الأحداث
// =======================
startRoundBtn.addEventListener('click', () => {
  if (!gameActive) {
    alert('اللعبة منتهية. ابدأ مباراة جديدة بإعادة ضبط اللعبة.');
    return;
  }

  const roomCode = roomCodeInput.value.trim();
  if (!roomCode) {
    alert('الرجاء إدخال كود الغرفة قبل بدء الجولات.');
    return;
  }

  const nextMinute = getNextMinuteDate();
  const nextMinuteKey = nextMinute.toISOString().slice(0,16);

  if (pendingRound && scheduledStartTime) {
    const currentKey = scheduledStartTime.toISOString().slice(0,16);
    if (currentKey === nextMinuteKey) {
      syncInfoSpan.textContent = 'جولة واحدة قيد التحضير لهذه الدقيقة. انتظر البداية.';
      return;
    }
  }

  pendingRound = currentRound + 1;
  scheduledStartTime = nextMinute;
  scheduledStartSpan.textContent = formatTime(scheduledStartTime);
  syncInfoSpan.textContent = 'جولة جديدة قيد التحضير… ستبدأ عند بداية الدقيقة التالية.';
  preCountdownSpan.textContent = '00:00';

  setWordInputsEnabled(false);
  setScoreInputsEnabled(false);
  showScores(false);
  clearCurrentRoundInputs();
  currentLetterSpan.textContent = '—';

  startPreCountdown();
});

saveRoundBtn.addEventListener('click', () => {
  if (!gameActive) return;
  if (currentRound === 0) {
    alert('لم تبدأ أي جولة بعد.');
    return;
  }

  // نضمن أن الحقول الفارغة درجتها 0 قبل الحساب
  roundFields.forEach(f => {
    if (f.wordInput.value.trim() === '') {
      f.scoreInput.value = '0';
    }
  });
  updateRoundTotal();

  const roundTotal = parseInt(roundTotalSpan.textContent, 10) || 0;
  const letter = currentLetterSpan.textContent || '—';

  if (roundResults[currentRound]) {
    const oldTotal = roundResults[currentRound].total;
    globalTotal = globalTotal - oldTotal + roundTotal;
    roundResults[currentRound].total = roundTotal;
    roundResults[currentRound].tdTotal.textContent = roundTotal;
  } else {
    globalTotal += roundTotal;

    const tr = document.createElement('tr');
    const tdRound = document.createElement('td');
    const tdLetter = document.createElement('td');
    const tdTotal = document.createElement('td');

    tdRound.textContent = currentRound;
    tdLetter.innerHTML = `<span class="letter-tag">${letter}</span>`;
    tdTotal.textContent = roundTotal;

    tr.appendChild(tdRound);
    tr.appendChild(tdLetter);
    tr.appendChild(tdTotal);
    roundsTableBody.appendChild(tr);

    roundResults[currentRound] = {
      total: roundTotal,
      letter,
      row: tr,
      tdTotal
    };
  }

  globalTotalSpan.textContent = globalTotal;
  syncInfoSpan.textContent = 'تم تسجيل الجولة. تعديل الدرجات لنفس الجولة لن يضيف صفًا جديدًا.';

  saveState();
});

endGameBtn.addEventListener('click', () => {
  if (!confirm('هل أنت متأكد من إنهاء اللعبة؟ يمكنك بدء مباراة جديدة في أي وقت.')) {
    return;
  }
  gameActive = false;
  startRoundBtn.disabled = true;
  endGameBtn.disabled = true;
  saveRoundBtn.disabled = true;
  setWordInputsEnabled(false);
  setScoreInputsEnabled(false);
  clearInterval(preCountdownTimer);
  clearInterval(roundTimer);
  stopFlipLetters();
  syncInfoSpan.textContent = 'اللعبة منتهية. اضغط "ابدأ مباراة جديدة" لإعادة التشغيل.';
  saveState();
});

newMatchBtn.addEventListener('click', () => {
  if (!confirm('إعادة ضبط المباراة ستصفر الجولات والنتائج والسجل. هل أنت متأكد؟')) return;

  currentRound = 0;
  pendingRound = null;
  scheduledStartTime = null;
  usedLetters = [];
  globalTotal = 0;
  durationLocked = false;
  roundDurationWrapper.style.display = '';

  for (const key in roundResults) {
    delete roundResults[key];
  }
  roundsTableBody.innerHTML = '';

  currentRoundSpan.textContent = '0';
  usedLettersCountSpan.textContent = '0';
  globalTotalSpan.textContent = '0';
  roundTotalSpan.textContent = '0';
  currentLetterSpan.textContent = '—';
  scheduledStartSpan.textContent = '—';
  preCountdownSpan.textContent = '—';
  roundCountdownSpan.textContent = '—';
  syncInfoSpan.textContent = 'تم بدء مباراة جديدة. اضغط "ابدأ جولة جديدة" لبدء اللعب.';
  flipLettersSpan.textContent = '';

  clearInterval(preCountdownTimer);
  clearInterval(roundTimer);
  stopFlipLetters();
  preCountdownTimer = null;
  roundTimer = null;

  clearCurrentRoundInputs();
  setWordInputsEnabled(false);
  setScoreInputsEnabled(false);
  showScores(false);
  saveRoundBtn.disabled = true;

  gameActive = true;
  startRoundBtn.disabled = false;
  endGameBtn.disabled = false;

  localStorage.removeItem(STORAGE_KEY);
});

// =======================
//      تهيئة البداية
// =======================
buildFields();
loadState();
