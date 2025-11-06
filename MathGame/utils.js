
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}
function fmt(n){ try{ return Number(n).toLocaleString('ar-SA'); }catch(e){ return String(n); } }
function digitLen(n){ n = Math.abs(Math.trunc(Number(n)||0)); return String(n).length; }
function shuffleInPlace(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; }
