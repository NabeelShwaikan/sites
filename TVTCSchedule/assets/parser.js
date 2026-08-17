(function(root){
"use strict";
const OFFICIAL_HEADERS=["الفصل التدريبي","الوحدة التدريبية","القسم","نوع التدريب","رقم المدرب","اسم المدرب","اليوم","الوقت","عدد المحاضرات","المقرر","وصف المقرر","وصف المحاضرة","ر.مرجعي","من","إلى","المبنى","رقم القاعة","اسم القاعة","ساعات الاتصال"];
const DAYS=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const clean=v=>String(v??"").replace(/\s+/g," ").trim();
function normDay(v){let s=clean(v).replace(/[إأآ]/g,"ا");for(const d of DAYS)if(s.includes(d.replace(/[إأآ]/g,"ا")))return d;return clean(v)}
function time4(x){x=String(x||"").replace(/\D/g,"");if(x.length===3)x="0"+x;if(x.length!==4)return clean(x);return x.slice(0,2)+":"+x.slice(2)}
function minutes(t){let m=String(t).match(/^(\d{2}):(\d{2})$/);return m?+m[1]*60 + +m[2]:99999}
function parseRange(v){let a=clean(v).match(/(\d{3,4})\s*[-–—]\s*(\d{3,4})/);if(!a)return {start:"",end:""};let t1=time4(a[1]),t2=time4(a[2]);return minutes(t1)<=minutes(t2)?{start:t1,end:t2}:{start:t2,end:t1}}
function typeShort(v){v=clean(v);return v.replace(/\s*صباحي\s*/g,"").replace(/\s*مسائي\s*/g,"").trim()||v}
function csvMatrix(text){let rows=[],row=[],cell="",q=false;for(let i=0;i<text.length;i++){let c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++;continue}if(c==='"'){q=!q;continue}if(!q&&c===','){row.push(cell);cell="";continue}if(!q&&(c==='\n'||c==='\r')){if(c==='\r'&&n==='\n')i++;row.push(cell);cell="";if(row.some(x=>clean(x)))rows.push(row);row=[];continue}cell+=c}row.push(cell);if(row.some(x=>clean(x)))rows.push(row);return rows}
function rowsToObjects(matrix){if(!matrix.length)throw Error("الملف فارغ");let headers=matrix[0].map(x=>clean(String(x).replace(/^\uFEFF/,"")));let missing=OFFICIAL_HEADERS.filter(h=>!headers.includes(h));if(missing.length>6)throw Error("هذا الملف لا يطابق بنية تقرير جدول المدرب الرسمية");return matrix.slice(1).filter(r=>r.some(x=>clean(x))).map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??""])))}
function sortSession(a,b){let da=DAYS.indexOf(a.day),db=DAYS.indexOf(b.day);return (da<0?99:da)-(db<0?99:db)||minutes(a.start)-minutes(b.start)}
function officialRowsToData(rows){if(!rows.length)throw Error("لا توجد صفوف جدول");let r0=rows[0];let meta={term:clean(r0["الفصل التدريبي"]),unit:clean(r0["الوحدة التدريبية"]),department:clean(r0["القسم"]),trainingType:clean(r0["نوع التدريب"]),trainerId:clean(r0["رقم المدرب"]),trainerName:clean(r0["اسم المدرب"]),contactHours:clean(r0["ساعات الاتصال"])};
let sessions=rows.map(r=>{let tr=parseRange(r["الوقت"]);return {day:normDay(r["اليوم"]),start:tr.start,end:tr.end,courseCode:clean(r["المقرر"]),courseName:clean(r["وصف المقرر"]),type:typeShort(r["وصف المحاضرة"]),crn:clean(r["ر.مرجعي"]),roomNo:clean(r["رقم القاعة"]),roomName:clean(r["اسم القاعة"]),building:clean(r["المبنى"]),from:clean(r["من"]),to:clean(r["إلى"]),note:""}}).sort(sortSession);
return {meta,sessions};}
function parseCSVText(text){return officialRowsToData(rowsToObjects(csvMatrix(String(text).replace(/^\uFEFF/,""))))}
function parseExcelMatrix(matrix){return officialRowsToData(rowsToObjects(matrix))}
root.MasarScheduleParser={OFFICIAL_HEADERS,DAYS,clean,normDay,time4,minutes,parseRange,typeShort,csvMatrix,rowsToObjects,sortSession,officialRowsToData,parseCSVText,parseExcelMatrix};
})(typeof window!=="undefined"?window:globalThis);
