window.Masar = window.Masar || {};
Masar.Services = Masar.Services || {};

Masar.Services.ParserService = (function(){
  function normalizeLine(line){
    return line.replace(/\t+/g,'|').replace(/\s{2,}/g,' ').trim();
  }

  function extractSourceDates(raw){
    const dates = {};
    const rajhi = raw.match(/الراجحي المالية\s*آخر تحديث\s*(\d{4}-\d{2}-\d{2})/);
    const osaimi = raw.match(/د\.?محمد بن سعود العصيمي\s*آخر تحديث\s*(\d{4}-\d{2}-\d{2})/);
    const albilad = raw.match(/البلاد المالية\s*آخر تحديث\s*(\d{4}-\d{2}-\d{2})/);
    if(rajhi) dates.rajhi = rajhi[1];
    if(osaimi) dates.osaimi = osaimi[1];
    if(albilad) dates.albilad = albilad[1];
    return dates;
  }

  function parsePastedText(raw){
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const rows = [];
    let currentSector = '';

    for(const original of lines){
      const line = normalizeLine(original);
      if(!line) continue;

      if(/^(New|ENG|الاشتراك|الدخول|البحث|دليل الشركات|السعودية|الأخبار|المزيد|ملاحظة|الأكثر مشاهدة|تابعونا|Argaam)/i.test(line)) continue;
      if(line.includes('رمز السهم') || line.includes('آخر تحديث') || line.includes('الشركات المتوافقة')) continue;

      const pipeParts = line.split('|').map(x => x.trim()).filter(x => x !== '');
      let symbol='', name='', flags=[];

      if(pipeParts.length >= 3 && /^\d{4}$/.test(pipeParts[0])){
        symbol = pipeParts[0];
        name = pipeParts[1] || '';
        flags = pipeParts.slice(2).map(x => /✔|✓|1|true/i.test(x));
      } else {
        const m = line.match(/^(\d{4})\s+(.+?)\s*([✔✓\s]*)$/);
        if(m){
          symbol = m[1];
          name = m[2].replace(/[✔✓]/g,'').trim();
          const checks = (original.match(/[✔✓]/g) || []).length;
          flags = checks === 3 ? [true,true,true] : checks === 2 ? [true,false,true] : checks === 1 ? [true,false,false] : [false,false,false];
        }
      }

      if(symbol && name){
        rows.push({
          symbol,
          name,
          sector: currentSector || 'غير مصنف',
          approvals: {
            rajhi: !!flags[0],
            osaimi: !!flags[1],
            albilad: !!flags[2]
          }
        });
      } else if(!/\d{4}/.test(line) && line.length < 80 && !/[✔✓]/.test(line)){
        currentSector = line;
      }
    }

    return { rows, sourceDates: extractSourceDates(raw) };
  }

  return { parsePastedText, extractSourceDates };
})();
