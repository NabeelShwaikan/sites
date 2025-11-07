// مجموعات العناصر
const THEMES = {
  fruits:["🍎","🍌","🍓","🍉","🍇","🍊"],
  animals:["🐶","🐱","🐰","🦊","🦁","🐼"],
  transport:["🚗","🚌","🚲","🚕","🚑","🚒"],
  sports:["⚽","🏀","🎾","🏈","🥎","🏐"],
  weather:["☀️","🌧️","⛅","🌩️","🌨️","🌪️"],
  school:["✏️","📘","📏","✂️","🖍️","📎"],
  shapes:["🔴","🟡","🔺","🔷","⬛","⭐"],
  food:["🍕","🍔","🍟","🌭","🥗","🍩"],
  daily:["🛏️","🍽️","📚","🎮","📱","🚿"]
};

const COLORS=["c1","c2","c3","c4","c5"];
const COUNT_MIN=18, COUNT_MAX=28;
const tiles=document.getElementById("tiles");
const results=document.getElementById("results");
const table=document.getElementById("freqTable");
const chart=document.getElementById("chart");
const btnNew=document.getElementById("newRound");
const btnCount=document.getElementById("countNow");
const themeSel=document.getElementById("themeSelect");

let currentSet=THEMES.fruits;
let data=[];

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a;}

function updateTheme(){
  const val=themeSel.value;
  if(val==="mix"){
    const all=Object.values(THEMES).flat();
    const mix=new Set();
    while(mix.size<6){mix.add(all[rand(0,all.length-1)]);}
    currentSet=[...mix];
  } else currentSet=THEMES[val]||THEMES.fruits;
}

function newRound(){
  playClick();
  updateTheme();
  results.classList.add("hidden");
  tiles.innerHTML="";
  data=[];
  const total=rand(COUNT_MIN,COUNT_MAX);
  for(let i=0;i<total;i++){
    const e=currentSet[rand(0,currentSet.length-1)];
    const c=COLORS[rand(0,COLORS.length-1)];
    data.push(e);
    tiles.insertAdjacentHTML("beforeend",`
      <div class="char ${c}">
        <div class="num">${e}</div>
      </div>`);
  }
}

function countData(){
  playClick();
  const map=new Map();
  currentSet.forEach(x=>map.set(x,0));
  data.forEach(x=>map.set(x,(map.get(x)||0)+1));
  renderTable(map);
  renderChart(map);
  results.classList.remove("hidden");
  playSuccess();
}

function renderTable(freq){
  let html="<tr><th>العنصر</th><th>التكرار</th></tr>";
  currentSet.forEach(e=>{
    const v=freq.get(e)||0;
    html+=`<tr><td>${e}</td><td class="val">${v}</td></tr>`;
  });
  table.innerHTML=html;
}

function renderChart(freq){
  chart.innerHTML="";
  const vals=currentSet.map(e=>freq.get(e)||0);
  const max=Math.max(1,...vals);
  currentSet.forEach((e,i)=>{
    const v=vals[i],h=(v/max)*180;
    const bar=document.createElement("div");
    bar.className="bar";
    bar.style.height=`${Math.max(8,h)}px`;
    bar.innerHTML=`<span class="emoji">${e}</span><span class="label">${v}</span>`;
    chart.appendChild(bar);
  });
}

// أحداث
btnNew.onclick=newRound;
btnCount.onclick=countData;
themeSel.onchange=newRound;

newRound();
