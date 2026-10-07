/* =============== UTILIDADES =============== */
const $=s=>document.querySelector(s), R=(a,b)=>a+Math.random()*(b-a), P=a=>a[Math.random()*a.length|0];
const show=id=>{document.querySelectorAll('.scr').forEach(s=>s.classList.add('hid'));$('#'+id).classList.remove('hid')};
function toast(t){let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.style.display='block';clearTimeout(e.t);e.t=setTimeout(()=>e.style.display='none',1400)}
function burst(em,x,y,n=6){for(let i=0;i<n;i++){const p=document.createElement('span');p.className='p';p.textContent=em;p.style.left=x+R(-20,20)+'px';p.style.top=y+'px';p.style.setProperty('--dx',R(-60,60)+'px');$('#fx').appendChild(p);setTimeout(()=>p.remove(),1000)}}
const mid=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};

/* =============== ÁUDIO (Web Audio) =============== */
let AC,mute=false,mi;
function snd(f,d=.12,type='sine',v=.07){if(mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,AC.currentTime);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function music(i){clearInterval(mi);if(i<0)return;let k=0;const pat=[0,4,7,12,7,4,9,5];mi=setInterval(()=>snd(LV[i].root*2**(pat[k++%8]/12),.35,LV[i].wave,.03),420)}

/* =============== DADOS DAS FASES =============== */
const ST={banho:{e:'🛁',n:'Banho',pay:12},tosa:{e:'✂️',n:'Tosa',pay:14},comida:{e:'🍖',n:'Comida',pay:8},vet:{e:'🩺',n:'Consulta',pay:16},brinq:{e:'🧸',n:'Brinquedo',pay:6},adocao:{e:'🏡',n:'Adoção',pay:25}};
const DIET={'🐶':'🥩','🐱':'🐟','🐰':'🥕','🐹':'🌻','🐦':'🌾','🐢':'🥬'};
const BASE=['🐶','🐱','🐰','🐹','🐦','🐢'], MAGIC=['🦄','🐲','🦋','🐇','🧚'];
const B={mod:'',cp:0,wave:'triangle',pets:BASE,deco:'🪴🖼️🪴'};
const L=o=>({...B,...o});
const LV=[ // uma entrada por fase: é só adicionar/editar aqui para criar novos mapas
 L({n:'Pet Shop de Bairro',e:'🏡',c:['#ffe4ec','#ffd0a8'],goal:70,t:90,gap:7,pat:32,st:['banho','comida','tosa'],root:262,obs:'Tutorial: toque no pet e depois na estação do pedido!',pets:BASE.slice(0,4)}),
 L({n:'Shopping Center',e:'🏬',c:['#dff3ff','#e8d9ff'],goal:120,t:100,gap:5,pat:24,cp:.2,st:['banho','comida','tosa','vet'],root:294,obs:'Filas longas e clientes impacientes!',deco:'🛍️🏷️🛍️'}),
 L({n:'Pet Shop na Praia',e:'🏖️',c:['#fff3c4','#9be7ff'],goal:150,t:110,gap:4.6,pat:22,cp:.3,st:['banho','comida','tosa','vet'],mod:'sand',root:330,obs:'Pets cheios de areia: banho extra!',deco:'⛱️🌴🐚'}),
 L({n:'Pet Shop Espacial',e:'🚀',c:['#4a3f9a','#8f6fd8'],goal:170,t:120,gap:4.2,pat:20,cp:.4,st:['banho','comida','tosa','vet','brinq'],mod:'float',root:196,wave:'sine',obs:'Gravidade zero: as estações trocam de lugar!',deco:'🪐⭐🛰️'}),
 L({n:'Floresta Encantada',e:'🌲',c:['#d4f5d0','#cdb8ff'],goal:200,t:130,gap:4,pat:19,cp:.4,st:['banho','comida','tosa','vet','brinq'],pets:MAGIC,root:349,wave:'sine',obs:'Pets mágicos! Poções no lugar de remédios.',deco:'🍄🌳🍄',potion:1}),
 L({n:'Cruzeiro Pet',e:'🚢',c:['#cfeeff','#7fc8f8'],goal:230,t:140,gap:3.8,pat:18,cp:.5,st:['banho','comida','tosa','vet','brinq'],mod:'sway',root:247,obs:'O navio balança: minigames mais difíceis!',deco:'⚓🌊⚓'}),
 L({n:'Grande Festival Pet',e:'🎪',c:['#ffd6f0','#ffe58a'],goal:300,t:150,gap:3.4,pat:17,cp:.7,st:['banho','comida','tosa','vet','brinq','adocao'],pets:[...BASE,...MAGIC],root:392,obs:'Todas as estações e pedidos combinados!',deco:'🎈🏆🎈'})
];
const LNAME=i=>LV[i].n;

/* =============== PROGRESSO (só em memória) =============== */
let S={unl:1,stars:[],wallet:0,up:{speed:0,pat:0,deco:0,help:0}}, G=null;
const UP=[['speed','⚡ Esponja turbo','Minijogos mais rápidos'],['pat','🍵 Chá relaxante','+15% paciência'],['deco','🎀 Decoração','+10% moedas'],['help','🤖 Ajudante','Atende sozinho de tempos em tempos']];

/* =============== MENU / MAPA =============== */
$('#play').onclick=()=>{snd(523);openMap()};
$('#toMenu').onclick=()=>show('menu');
$('#toShop').onclick=()=>openShop('mapScr');
$('#mute').onclick=()=>{mute=!mute;$('#mute').textContent=mute?'🔇':'🔊'};
$('#quit').onclick=()=>{if(G){G.run=false;clearInterval(G.iv)}music(-1);openMap()};
function openMap(){
 document.body.style.background='linear-gradient(#ffe4ec,#ffd0a8)';
 const pts=[[9,72],[23,30],[37,72],[51,28],[65,72],[79,30],[91,72]];
 let h='<svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="'+pts.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 2"/></svg>';
 LV.forEach((l,i)=>{const ok=i<S.unl,s=S.stars[i]||0;
  h+=`<button class="node ${ok?'':'lock'}" style="left:${pts[i][0]}%;top:${pts[i][1]}%" data-i="${i}" ${ok?'':'disabled'}>${ok?l.e:'🔒'}<small>${'⭐'.repeat(s)||i+1}</small></button>`});
 $('#map').innerHTML=h;
 $('#map').onclick=e=>{const b=e.target.closest('.node');if(b&&!b.disabled)intro(+b.dataset.i)};
 $('#wal').textContent='💰 '+S.wallet;show('mapScr');
}
function intro(i){const l=LV[i];document.body.style.background=`linear-gradient(${l.c[0]},${l.c[1]})`;
 $('#intro').innerHTML=`<div class="big">${l.e}</div><h2>Fase ${i+1}: ${l.n}</h2><p class="pill">⚠️ ${l.obs}</p><p class="pill">🎯 Meta: ${l.goal} moedas em ${l.t}s</p><button id="go">Começar!</button><button class="alt" id="bk">Voltar</button>`;
 show('intro');$('#go').onclick=()=>start(i);$('#bk').onclick=openMap}

/* =============== JOGO =============== */
function start(i){
 const l=LV[i];
 G={i,l,time:l.t,coins:0,rep:5,combo:0,best:0,served:0,cs:[],sel:null,busy:null,sp:1,ev:R(15,25),hp:14-3*S.up.help,id:0,run:true,sts:[...l.st],sw:12};
 const g=G;$('#obj').textContent='🎯 '+l.goal+' moedas • '+l.obs;
 $('#deco').textContent=l.deco+'🎀'.repeat(S.up.deco);
 $('#game').className='scr '+l.mod;
 $('#cust').onclick=e=>{const d=e.target.closest('.c');if(d)pick(+d.dataset.id)};
 drawSt();show('game');music(i);addC();hud();
 g.iv=setInterval(tick,100);
}
function drawSt(){$('#stations').innerHTML=G.sts.map(k=>`<button class="st" data-k="${k}">${ST[k].e}<small>${k==='vet'&&G.l.potion?'Poção':ST[k].n}</small></button>`).join('');}
$('#stations').onclick=e=>{const b=e.target.closest('.st');if(b)useSt(b.dataset.k)};
function addC(famous){
 const g=G,l=g.l,q=[];const avail=l.st;
 let first=P(avail.filter(k=>k!=='adocao'||l.n.length));
 if(l.mod==='sand'&&Math.random()<.6&&avail.includes('banho'))first='banho';
 q.push(first);
 if(Math.random()<l.cp){let s=P(avail);if(s!==first)q.push(s)}
 const pet=P(l.pets), max=l.pat*(1+.6*(q.length-1))*(1+.15*S.up.pat);
 g.cs.push({id:g.id++,pet,q,p:max,max,fam:famous||Math.random()<.07,sand:l.mod==='sand'});renderC();
}
function renderC(){
 $('#cust').innerHTML=G.cs.map(c=>`<div class="c ${G.sel===c?'sel':''}" data-id="${c.id}"><div class="pe">${c.pet}</div><div class="nd">${c.q.map(k=>ST[k].e).join('')}</div><div class="bar"><i style="width:${c.p/c.max*100}%"></i></div>${c.fam?'<span class="star">⭐</span>':''}${c.sand?'<span class="sand">🏖️</span>':''}</div>`).join('');
}
function hud(){const g=G;$('#hc').textContent=`💰 ${g.coins}/${g.l.goal}`;$('#ht').textContent='⏱ '+Math.ceil(g.time);$('#hr').textContent='❤️'.repeat(g.rep)+'🖤'.repeat(5-g.rep);$('#hb').textContent='🔥 x'+g.combo}
function tick(){
 const g=G;if(!g||!g.run)return;
 g.time-=.1;g.sp-=.1;g.ev-=.1;g.hp-=.1;
 if(g.sp<=0){if(g.cs.length<4)addC();g.sp=R(.7,1.3)*g.l.gap}
 g.cs.slice().forEach(c=>{
  if(g.busy===c)return;c.p-=.1;
  if(c.p<=0){g.cs=g.cs.filter(x=>x!==c);if(g.sel===c)g.sel=null;g.rep--;g.combo=0;snd(200,.3,'sawtooth');toast('😢 Um cliente foi embora!');renderC();hud();if(g.rep<=0)endL()}
 });
 document.querySelectorAll('.c').forEach(d=>{const c=g.cs.find(x=>x.id==d.dataset.id);if(c){const b=d.querySelector('.bar i');b.style.width=c.p/c.max*100+'%';b.style.background=c.p/c.max<.3?'#ff4d4d':'#4cd964'}});
 // ajudante automático
 if(S.up.help&&g.hp<=0&&g.cs.length){g.hp=14-3*S.up.help;const c=g.cs.find(x=>x!==g.busy);if(c){const k=c.q[0];if(k!=='adocao'){c.q.shift();pay(c,k,1,0,true)}}}
 // eventos aleatórios
 if(g.ev<=0){g.ev=R(18,30);if(Math.random()<.5){toast('⭐ Cliente famoso chegou! Paga o dobro!');if(g.cs.length<4)addC(true)}else fugitive()}
 if(g.l.mod==='float'&&(g.sw-=.1)<=0){g.sw=12;g.sts.sort(()=>Math.random()-.5);drawSt();toast('🛸 As estações mudaram de lugar!')}
 hud();if(g.time<=0)endL();
}
function fugitive(){const g=G,e=document.createElement('div');e.className='run';e.textContent=P(g.l.pets);toast('🏃 Pet fujão! Pegue ele!');
 e.onpointerdown=()=>{g.coins+=15;burst('💰',...mid(e));snd(880);e.remove();hud()};e.onanimationend=()=>e.remove();document.body.appendChild(e)}
function pick(id){const g=G;if(g.busy)return;g.sel=g.cs.find(c=>c.id===id);snd(660,.08);renderC()}
function useSt(k){
 const g=G;if(!g||g.busy)return;
 if(!g.sel)return toast('Toque num pet primeiro! 👆');
 const c=g.sel;
 if(c.q[0]!==k){g.combo=0;snd(150,.25,'square');toast('❌ Não é esse o pedido!');hud();return}
 if(k==='brinq'||k==='adocao')return pay(c,k,1,0);
 g.busy=c;mini(k,c,errs=>{g.busy=null;pay(c,k,1,errs)});
}
function pay(c,k,_,errs,auto){
 const g=G;c.q.shift();
 let v=ST[k].pay*(1+.1*S.up.deco)*(1+Math.min(g.combo,5)*.1);
 const tip=(!auto&&errs===0)?Math.round(c.p/c.max*8):0;
 v=Math.round((v+tip)*(c.fam?2:1));
 g.coins+=v;g.served++;
 if(errs===0&&!auto){g.combo++;g.best=Math.max(g.best,g.combo)}else if(!auto)g.combo=0;
 const d=document.querySelector(`.c[data-id="${c.id}"]`),[x,y]=d?mid(d):[innerWidth/2,200];
 burst('💰',x,y,4);burst('💖',x,y,4);snd(784,.15);
 if(!c.q.length){g.cs=g.cs.filter(z=>z!==c);if(g.sel===c)g.sel=null;toast('😍 +'+v+' moedas!')}
 else c.p=Math.min(c.max,c.p+c.max*.25);
 renderC();hud();
}

/* =============== MINIJOGOS =============== */
function mini(k,c,cb){
 const m=$('#mini'),a=$('#arena');let errs=0,fin=false;a.innerHTML='';m.classList.remove('hid');
 const T={banho:['🛁 Banho!','Esfregue o pet até a sujeira sumir'],tosa:['✂️ Tosa!','Toque os pontos na ordem 1, 2, 3...'],comida:['🍖 Hora de comer!','Arraste a comida certa para a tigela'],vet:[G.l.potion?'🧪 Poção!':'🩺 Consulta!','Toque nos pontos ❓ e ache as pulgas 🪲']};
 $('#mt').textContent=T[k][0];$('#mh').textContent=T[k][1];
 const add=(cls,tx,x,y)=>{const e=document.createElement('div');e.className='it '+cls;e.textContent=tx;e.style.left=x+'px';e.style.top=y+'px';a.appendChild(e);return e};
 const sw=G.l.mod==='sway'?1.35:1, sp=1-.12*S.up.speed;
 const end=()=>{if(fin)return;fin=true;snd(880,.2);burst('💖',...mid(a),8);setTimeout(()=>{m.classList.add('hid');cb(errs)},400)};
 const bad=()=>{errs++;snd(150,.2,'square');a.classList.add('shake');setTimeout(()=>a.classList.remove('shake'),300)};
 add('pet',c.pet,160,140);
 if(k==='banho'){ // esfregar
  const n=Math.max(3,Math.round((6+(c.sand?3:0))*sp));let sp_=[];
  for(let i=0;i<n;i++){const e=add('','🟤',R(60,260),R(50,230));sp_.push({e,hp:6})}
  a.onpointermove=ev=>{const r=a.getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;
   if(Math.random()<.2)burst('🫧',ev.clientX,ev.clientY,1);
   sp_.forEach(s=>{if(s.hp>0&&Math.hypot(s.e.offsetLeft-x,s.e.offsetTop-y)<36){s.hp--;s.e.style.opacity=s.hp/6;if(s.hp<=0){s.e.remove();snd(1000,.05)}}});
   if(sp_.every(s=>s.hp<=0))end()};
 }
 if(k==='tosa'){ // seguir o contorno
  const n=Math.max(4,Math.round(6*sp));let nx=1;
  for(let i=1;i<=n;i++){const ang=i/n*Math.PI*2-Math.PI/2,b=add('num',i,160+105*sw*0+105*Math.cos(ang),140+95*Math.sin(ang));b.style.pointerEvents='auto';
   b.onpointerdown=()=>{if(i===nx){b.textContent='✂️';b.style.background='#4cd964';snd(500+i*80,.08);nx++;if(nx>n)end()}else bad()}}
 }
 if(k==='vet'){ // achar sintomas
  const sl=[[70,60],[250,60],[60,150],[260,150],[110,230],[220,230]].sort(()=>Math.random()-.5);let left=3;
  sl.forEach((p,i)=>{const e=add('','❓',p[0],p[1]);e.onpointerdown=()=>{if(e.done)return;e.done=1;if(i<3){e.textContent='✨';snd(900,.1);if(--left===0)end()}else{e.textContent='🍃';bad()}}});
 }
 if(k==='comida'){ // arrastar
  const right=DIET[c.pet]||'🍎',all=['🥩','🐟','🥕','🌻','🌾','🥬','🍎'].filter(f=>f!==right).sort(()=>Math.random()-.5).slice(0,2);
  add('','🥣',160,235).id='bowl';
  [right,...all].sort(()=>Math.random()-.5).forEach((f,i)=>{const e=add('',f,70+i*90,40);e.style.touchAction='none';let sx,sy;
   e.onpointerdown=ev=>{e.setPointerCapture(ev.pointerId);sx=ev.clientX;sy=ev.clientY;e.drag=1};
   e.onpointermove=ev=>{if(e.drag)e.style.transform=`translate(calc(-50% + ${ev.clientX-sx}px),calc(-50% + ${ev.clientY-sy}px))`};
   e.onpointerup=ev=>{e.drag=0;const r=$('#bowl').getBoundingClientRect();
    if(ev.clientX>r.left-20&&ev.clientX<r.right+20&&ev.clientY>r.top-20&&ev.clientY<r.bottom+20){if(f===right)end();else bad()}
    e.style.transform='translate(-50%,-50%)'}});
 }
}

/* =============== FIM DE FASE =============== */
function endL(){
 const g=G;if(!g.run)return;g.run=false;clearInterval(g.iv);music(-1);
 const win=g.rep>0&&g.coins>=g.l.goal;let st=0;
 if(win){st=1;if(g.coins>=g.l.goal*1.4)st=2;if(g.coins>=g.l.goal*1.8&&g.rep>=4)st=3;
  S.stars[g.i]=Math.max(S.stars[g.i]||0,st);S.unl=Math.max(S.unl,Math.min(7,g.i+2));snd(1046,.4)}
 S.wallet+=g.coins;
 const last=g.i===6;
 $('#end').innerHTML=`<div class="big">${win?(last?'🏆':'🎉'):'😿'}</div><h2>${win?(last?'Você é o campeão do Festival!':'Fase completa!'):(g.rep<=0?'Reputação esgotada!':'Meta não atingida')}</h2>
 <div class="big">${'⭐'.repeat(st)}${'☆'.repeat(3-st)}</div>
 <p class="pill">💰 ${g.coins}/${g.l.goal} • 🐾 ${g.served} serviços • 🔥 combo máx. ${g.best} • ❤️ ${g.rep}</p>
 <div>${win&&!last?'<button id="nx">Próxima fase ▶</button>':''}<button class="alt" id="sh">🛍️ Loja</button><button id="rt">Tentar de novo</button><button class="alt" id="mp">🗺️ Mapa</button></div>`;
 show('end');
 if($('#nx'))$('#nx').onclick=()=>intro(g.i+1);
 $('#sh').onclick=()=>openShop('end');$('#rt').onclick=()=>start(g.i);$('#mp').onclick=openMap;
}

/* =============== LOJA DE MELHORIAS =============== */
function openShop(back){
 const draw=()=>{
  $('#shop').innerHTML=`<h2>🛍️ Loja de melhorias</h2><p class="pill">💰 ${S.wallet}</p>`+UP.map(([k,n,d])=>{const lv=S.up[k],cost=50*(lv+1);
   return `<div class="row"><div><b>${n}</b> (nv ${lv}/3)<br><small>${d}</small></div><button data-k="${k}" ${lv>=3||S.wallet<cost?'disabled':''}>${lv>=3?'MAX':'💰 '+cost}</button></div>`}).join('')+'<button class="alt" id="sb">⬅ Voltar</button>';
  $('#sb').onclick=()=>back==='mapScr'?openMap():show(back);
 };
 $('#shop').onclick=e=>{const b=e.target.closest('button[data-k]');if(!b)return;const k=b.dataset.k,cost=50*(S.up[k]+1);
  if(S.wallet>=cost&&S.up[k]<3){S.wallet-=cost;S.up[k]++;snd(1200,.2);draw()}};
 draw();show('shop');
}