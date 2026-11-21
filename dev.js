// Developer mode (owner tools). Client-side only: it hides the tools from normal players
// but is NOT real security. Nothing done in developer mode is saved.
(()=>{
const $=s=>document.querySelector(s),HASH=8067775687742418;
const cyrb53=(str,seed=0)=>{let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;for(let i=0,ch;i<str.length;i++){ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507);h1^=Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507);h2^=Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0)};
let tm=null;
function answer(l,label){const sol=FlowGen.build(l.n,l.k,l.nBl,l.seed).sol,c=$('#dcv'),W=c.width=c.height=Math.min(360,innerWidth-40),cs=W/l.n,x=c.getContext('2d'),mx=Math.max(...sol.map(p=>p.length)),ct=q=>[(q%l.n+.5)*cs,((q/l.n|0)+.5)*cs];let t=0;clearInterval(tm);
 const paint=()=>{x.clearRect(0,0,W,W);x.strokeStyle='rgba(0,240,255,.25)';x.lineWidth=1;x.beginPath();for(let i=0;i<=l.n;i++){x.moveTo(i*cs,0);x.lineTo(i*cs,W);x.moveTo(0,i*cs);x.lineTo(W,i*cs)}x.stroke();
  l.blocked.forEach(q=>{const[a,b]=ct(q);x.fillStyle='rgba(150,160,200,.3)';x.fillRect(a-cs/2+2,b-cs/2+2,cs-4,cs-4)});
  sol.forEach((p,i)=>{x.strokeStyle=l.colors[i];x.lineWidth=cs*.3;x.lineCap=x.lineJoin='round';x.shadowColor=l.colors[i];x.shadowBlur=cs*.2;x.beginPath();p.slice(0,t).forEach((q,j)=>{const[a,b]=ct(q);j?x.lineTo(a,b):x.moveTo(a,b)});x.stroke()});x.shadowBlur=0;
  l.pairs.forEach((p,i)=>p.forEach(q=>{const[a,b]=ct(q);x.fillStyle=l.colors[i];x.beginPath();x.arc(a,b,cs*.3,0,7);x.fill();x.fillStyle='#050816';x.beginPath();x.arc(a,b,cs*.1,0,7);x.fill()}))};
 $('#dinfo').textContent=label+' · '+l.n+'x'+l.n+' · '+l.k+' colors · '+l.time+'s'+(l.maxMoves?' · max '+l.maxMoves+' moves':'')+(l.special?' · '+l.special:'');
 paint();tm=setInterval(()=>{t++;paint();if(t>=mx)clearInterval(tm)},140)}
function panel(){const s=$('#dlv');if(!s.options.length)for(let i=1;i<=30;i++)s.add(new Option(['Easy','Medium','Hard'][Math.floor((i-1)/10)]+' '+((i-1)%10+1),i));FM.show('dev')}
const eLv=()=>FlowGen.endless(+$('#ded').value,Math.max(1,+$('#den').value||1));
document.addEventListener('click',e=>{const b=e.target.closest('[data-dev]');if(!b)return;const a=b.dataset.dev;
 if(a==='open')FM.ov('<h2>DEVELOPER LOGIN</h2><input id="dpw" class="inp" type="password" placeholder="Password" autocomplete="off"><div class="stack"><button class="btn" data-dev="login">ENTER</button><button class="btn" data-act="no">CANCEL</button></div>');
 else if(a==='login'){if(cyrb53($('#dpw').value)===HASH){FM.setDev(true);FM.closeOv();panel();FM.toast('Developer mode ON. Nothing is saved.')}else FM.toast('Wrong password')}
 else if(a==='show'){const l=LEVELS[+$('#dlv').value-1];answer(l,'Level '+l.id)}
 else if(a==='play')FM.start(+$('#dlv').value);
 else if(a==='eshow')answer(eLv(),'Endless '+['Easy','Medium','Hard'][+$('#ded').value]+' LV '+$('#den').value);
 else if(a==='eplay')FM.startEnd(+$('#ded').value,Math.max(1,+$('#den').value||1));
 else if(a[0]==='e'&&a.length===2)FM.modeScreen(+a[1]);
 else if(a==='out')location.reload()});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='dpw')document.querySelector('[data-dev=login]').click()});
})();
