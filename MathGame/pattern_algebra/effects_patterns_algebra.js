// كونفيتي بسيط مرة واحدة عند كل إجابة صحيحة
let confettiBusy = false;
function confettiOnce(){
  if(confettiBusy) return;
  confettiBusy = true;

  const layer = document.getElementById('confettiLayer');
  for(let i=0;i<18;i++){
    const c = document.createElement('i');
    c.className = 'cft';
    c.style.position='fixed';
    c.style.left = Math.random()*100 + '%';
    c.style.top  = '-20px';
    c.style.width='8px'; c.style.height='14px';
    c.style.background=`hsl(${Math.random()*360},90%,60%)`;
    c.style.borderRadius='2px';
    c.style.transform=`rotate(${Math.random()*180}deg)`;
    c.style.opacity='0.9';
    c.style.transition='transform 2s linear, top 2s linear, opacity 2.1s ease-out';
    layer.appendChild(c);
    const endTop = 100 + Math.random()*20;
    setTimeout(()=>{
      c.style.top = endTop+'vh';
      c.style.transform = `rotate(${360+Math.random()*180}deg)`;
      c.style.opacity='0.1';
    }, 10);
    setTimeout(()=>c.remove(), 2300+Math.random()*400);
  }

  setTimeout(()=>{ confettiBusy=false; }, 900);
}
