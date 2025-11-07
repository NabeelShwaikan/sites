
const confLayer = document.getElementById('confettiLayer');
let boost=false;
function toggleBoost(btn){ boost=!boost; document.body.classList.toggle('boost',boost); if(btn) btn.textContent = boost? '✨ طور خرافي: مُفعل' : '✨ طور خرافي'; }
function celebrate(){
  if(!confLayer) return;
  confLayer.innerHTML='';
  const n = boost? 60 : 24;
  for(let i=0;i<n;i++){
    const bit=document.createElement('i');
    bit.style.left = Math.random()*100+'%';
    bit.style.top = '-10px';
    bit.style.color = ['#22d3ee','#a78bfa','#f59e0b','#22c55e'][i%4];
    bit.style.animation = `fall ${700+Math.random()*600}ms ease-out forwards`;
    confLayer.appendChild(bit);
  }
  setTimeout(()=>confLayer.innerHTML='',1200);
}
function fireStars(){
  const count = boost? 12 : 6;
  for(let i=0;i<count;i++){
    const s=document.createElement('div');
    s.textContent='⭐'; s.style.position='absolute';
    s.style.left=(50+Math.random()*200)+'px'; s.style.top=(200+Math.random()*80)+'px';
    s.style.fontSize= boost? '30px':'24px'; s.style.opacity='1'; s.style.transition='1s';
    document.body.appendChild(s);
    requestAnimationFrame(()=>{ s.style.transform='translateY(-60px)'; s.style.opacity='0'; });
    setTimeout(()=>s.remove(),900);
  }
}
function playPopFX(){ soundBeeps(); fireStars(); }

function showBadge(type){
  const b=document.createElement('div'); b.className='badge ' + (type||'');
  b.textContent = type==='gold' ? '🏆 ذهبية' : type==='silver' ? '🥈 فضية' : '🥉 برونزية';
  const st=document.querySelector('.stage'); if(st){ st.appendChild(b); setTimeout(()=>b.remove(),1600); }
}
function showRibbon(txt){
  const r=document.createElement('div'); r.className='ribbon'; r.textContent=txt;
  const st=document.querySelector('.stage'); if(st){ st.appendChild(r); setTimeout(()=>r.remove(),1400); }
}
function showGift(){
  const g=document.createElement('div'); g.className='gift'; g.textContent='🎁';
  const st=document.querySelector('.stage'); if(st){ st.appendChild(g); requestAnimationFrame(()=>g.classList.add('show')); setTimeout(()=>g.remove(),900); }
}
function showStreakRewards(){
  if(window.streak===5) showBadge('');
  if(window.streak===10) showBadge('silver');
  if(window.streak===15){ showBadge('gold'); showRibbon('أسطورة الحساب!'); }
}
