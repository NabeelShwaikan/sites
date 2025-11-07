// مؤثر بسيط عند النجاح (وميض الكونفيتي)
function confettiBurst(){
  const body=document.body;
  for(let i=0;i<20;i++){
    const c=document.createElement("i");
    c.className="confetti";
    c.style.left=Math.random()*100+"%";
    c.style.background=`hsl(${Math.random()*360},90%,60%)`;
    c.style.animation=`fall ${Math.random()*2+1}s linear forwards`;
    body.appendChild(c);
    setTimeout(()=>c.remove(),2500);
  }
}

document.addEventListener("click",e=>{
  if(e.target.id==="countNow") confettiBurst();
});
