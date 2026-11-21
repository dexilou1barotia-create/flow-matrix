class Game{
constructor(cv,cb){this.cv=cv;this.x=cv.getContext('2d');this.cb=cb;this.lv=null;this.paused=true;this.over=true;this.stroke=false;this.hn=[];this.hintT=0;this.fl=0;this.last=performance.now();
 cv.addEventListener('pointerdown',e=>this.down(e));cv.addEventListener('pointermove',e=>this.move(e));
 addEventListener('pointerup',()=>this.up());addEventListener('pointercancel',()=>this.up());
 addEventListener('resize',()=>this.resize());
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&this.lv&&!this.over&&!this.paused)cb.pause()});
 requestAnimationFrame(t=>this.loop(t))}
load(lv){this.lv=lv;this.n=lv.n;this.bl=new Set(lv.blocked);this.end={};
 lv.pairs.forEach((p,i)=>{this.end[p[0]]=i;this.end[p[1]]=i});
 this.paths=lv.pairs.map(()=>[]);this.hist=[];this.moves=0;this.hints=0;this.hintsLeft=3;this.left=lv.time;
 this.started=false;this.paused=false;this.over=false;this.stroke=false;this.active=null;this.hn=[];this.fl=0;this.bombs=[];this.fx=[];this.pt=0;this.nextBomb=lv.bomb?lv.bomb.first:1e9;this.sync();this.resize()}
resize(){if(!this.lv)return;const s=Math.floor(Math.min(this.cv.parentElement.clientWidth-4,innerHeight*.56,600)),d=window.devicePixelRatio||1;
 if(s<50)return;this.cv.style.width=this.cv.style.height=s+'px';this.cv.width=this.cv.height=s*d;this.cs=this.cv.width/this.n}
sync(){this.own=new Int8Array(this.n*this.n).fill(-1);this.paths.forEach((p,i)=>p.forEach(c=>this.own[c]=i))}
complete(i){const p=this.paths[i];return p.length>1&&this.end[p[p.length-1]]===i&&p[0]!==p[p.length-1]}
cellAt(e){const r=this.cv.getBoundingClientRect(),n=this.n,x=Math.floor((e.clientX-r.left)/r.width*n),y=Math.floor((e.clientY-r.top)/r.height*n);
 return x<0||y<0||x>=n||y>=n?-1:y*n+x}
snap(){this.hist.push(this.paths.map(p=>p.slice()));if(this.hist.length>100)this.hist.shift()}
down(e){if(this.over||this.paused)return;e.preventDefault();const c=this.cellAt(e);if(c<0||this.bl.has(c))return;
 const bi=this.bombs.findIndex(b=>b.c===c);if(bi>=0){this.bombs.splice(bi,1);this.cb.snd('link');this.cb.toast('Bomb defused!');return}
 let i=this.end[c];const isEnd=i!==undefined;if(!isEnd){i=this.own[c];if(i<0)return}
 this.snap();if(isEnd)this.paths[i]=[c];else this.paths[i].length=this.paths[i].indexOf(c)+1;
 this.active=i;this.stroke=true;this.started=true;try{this.cv.setPointerCapture(e.pointerId)}catch(x){}this.sync()}
move(e){if(!this.stroke||this.active===null||this.over||this.paused)return;e.preventDefault();const c=this.cellAt(e),n=this.n;if(c<0)return;
 for(let g=0;g<20&&this.active!==null;g++){const p=this.paths[this.active],l=p[p.length-1];if(l===c)break;
  const lr=l/n|0,lc=l%n,cr=c/n|0,cc=c%n;let nx;
  if(lr===cr)nx=l+(cc>lc?1:-1);else if(lc===cc)nx=l+(cr>lr?n:-n);else break;
  if(!this.step(nx))break}}
step(c){const i=this.active,p=this.paths[i],k=p.indexOf(c);
 if(k>=0){p.length=k+1;this.sync();return true}
 if(this.bl.has(c)){this.fl=performance.now()+300;return false}if(this.complete(i))return false;
 const e=this.end[c];if(e!==undefined&&e!==i){this.fl=performance.now()+300;return false}
 const o=this.own[c];if(o>=0&&o!==i){const q=this.paths[o];q.length=q.indexOf(c)}
 p.push(c);this.sync();if(this.complete(i)){this.cb.snd('link');this.active=null}return true}
up(){if(!this.stroke)return;this.stroke=false;this.active=null;
 if(JSON.stringify(this.hist[this.hist.length-1])===JSON.stringify(this.paths))this.hist.pop();else this.moves++;
 const L=this.lv;
 if(L.pairs.every((_,i)=>this.complete(i))&&(!L.full||this.own.every((o,c)=>o>=0||this.bl.has(c))))this.finish(true);
 else if(L.maxMoves&&this.moves>L.maxMoves)this.finish(false,'moves');
 else if(L.pairs.every((_,i)=>this.complete(i)))this.cb.toast('Almost there! Fill all remaining spaces on the board to complete this level.')}
undo(){if(this.over||this.paused||!this.hist.length)return;this.paths=this.hist.pop();this.sync()}
reset(){if(this.over||this.paused)return;this.snap();this.paths=this.lv.pairs.map(()=>[]);this.moves++;this.sync();if(this.lv.maxMoves&&this.moves>this.lv.maxMoves)this.finish(false,'moves')}
useHint(){if(this.over||this.paused)return;if(this.hintsLeft<=0){this.cb.toast('No hints left!');return}
 const i=this.paths.findIndex((_,x)=>!this.complete(x));let hn,m;
 if(i>=0){hn=this.lv.pairs[i].slice();m='Try connecting the '+['cyan','pink','orange','green','purple','yellow','red'][i]+' dots.'}
 else{const c=this.own.findIndex((o,x)=>o<0&&!this.bl.has(x));if(c<0)return;hn=[c];m='Fill this empty space.'}
 this.hn=hn;this.hintT=performance.now()+3500;this.hints++;this.hintsLeft--;this.cb.toast(m+' Hints left: '+this.hintsLeft)}
spawnBomb(){const own=[];this.own.forEach((o,c)=>{if(o>=0)own.push(c)});if(!own.length)return false;this.bombs.push({c:own[Math.floor(Math.random()*own.length)],at:this.pt+3});this.cb.snd('tick');this.cb.toast('BOMB! Tap it to defuse before it explodes!');return true}
bombTick(){const B=this.lv.bomb;if(B&&this.pt>=this.nextBomb)this.nextBomb=this.pt+(this.spawnBomb()?B.every*(.8+Math.random()*.4):4);
 for(let k=this.bombs.length-1;k>=0;k--){const b=this.bombs[k];if(this.pt>=b.at){this.bombs.splice(k,1);this.boom(b.c)}}}
boom(c){const n=this.n,r=c/n|0,q=c%n,hit=x=>Math.abs((x/n|0)-r)<=1&&Math.abs(x%n-q)<=1;
 this.paths.forEach(p=>{const j=p.findIndex((x,i)=>i>0&&hit(x));if(j>0)p.length=j});this.sync();this.fx.push({c,t:performance.now()+500});this.cb.snd('boom');this.cb.toast('BOOM! Your lines were damaged.')}
finish(win,why){this.over=true;this.stroke=false;this.active=null;const L=this.lv,r=this.left/L.time;
 const stars=!win?0:(r>=.45&&this.hints===0&&this.moves<=L.k*3)?3:(r>=.2&&this.hints<=1)?2:1;
 const score=0;
 this.cb.end({win,why,stars,score,time:Math.round(L.time-this.left),moves:this.moves,hints:this.hints,left:this.left,ratio:r})}
loop(t){const dt=Math.min((t-this.last)/1000,.25);this.last=t;
 if(this.lv){if(!this.over&&!this.paused&&this.started){this.left-=dt;this.pt+=dt;this.bombTick();this.cb.play(dt);const s=Math.ceil(this.left);
  if(this.left<=0){this.left=0;this.finish(false,'time')}else if(s!==this._s&&s<=10){this.cb.snd('tick')}this._s=s}
  this.cb.tick(this);this.draw(t)}
 requestAnimationFrame(x=>this.loop(x))}
draw(t){const x=this.x,n=this.n,cs=this.cs,W=this.cv.width;if(!cs)return;x.clearRect(0,0,W,W);x.shadowBlur=0;
 x.strokeStyle='rgba(0,240,255,.2)';x.lineWidth=1;x.beginPath();for(let i=0;i<=n;i++){x.moveTo(i*cs,0);x.lineTo(i*cs,W);x.moveTo(0,i*cs);x.lineTo(W,i*cs)}x.stroke();
 const ct=c=>[(c%n+.5)*cs,((c/n|0)+.5)*cs];
 this.bl.forEach(c=>{const[a,b]=ct(c),h=cs*.2;x.fillStyle='rgba(120,130,170,.2)';x.fillRect(a-cs/2+3,b-cs/2+3,cs-6,cs-6);x.strokeStyle='rgba(170,180,220,.5)';x.lineWidth=2;x.beginPath();x.moveTo(a-h,b-h);x.lineTo(a+h,b+h);x.moveTo(a+h,b-h);x.lineTo(a-h,b+h);x.stroke()});
 this.paths.forEach((p,i)=>{if(p.length<2)return;const col=this.lv.colors[i];x.strokeStyle=col;x.shadowColor=col;x.shadowBlur=cs*.35;x.lineWidth=cs*.3;x.lineCap=x.lineJoin='round';x.beginPath();p.forEach((c,j)=>{const[a,b]=ct(c);j?x.lineTo(a,b):x.moveTo(a,b)});x.stroke()});
 this.lv.pairs.forEach((pr,i)=>pr.forEach(c=>{const[a,b]=ct(c),col=this.lv.colors[i];x.shadowColor=col;x.shadowBlur=cs*.4;x.fillStyle=col;x.beginPath();x.arc(a,b,cs*.3,0,7);x.fill();x.shadowBlur=0;x.fillStyle='#050816';x.beginPath();x.arc(a,b,cs*.11,0,7);x.fill()}));
 x.shadowBlur=0;
 this.bombs.forEach(b=>{const[a,c2]=ct(b.c),rem=Math.max(1,Math.ceil(b.at-this.pt)),pu=(Math.sin(t/90)+1)/2,r=b.c/n|0,q=b.c%n,x0=Math.max(0,q-1),y0=Math.max(0,r-1);
  x.fillStyle='rgba(255,59,59,'+(.12+.14*pu)+')';x.fillRect(x0*cs,y0*cs,(Math.min(n-1,q+1)-x0+1)*cs,(Math.min(n-1,r+1)-y0+1)*cs);
  x.textAlign='center';x.textBaseline='middle';x.font=(cs*.6)+'px sans-serif';x.fillStyle='#fff';x.fillText('💣',a,c2);x.font='800 '+(cs*.32)+'px sans-serif';x.fillStyle='#ffe600';x.fillText(String(rem),a+cs*.28,c2-cs*.3)});
 this.fx=this.fx.filter(f=>f.t>performance.now());this.fx.forEach(f=>{const[a,b]=ct(f.c),k=1-(f.t-performance.now())/500;x.strokeStyle='rgba(255,138,0,'+(1-k)+')';x.lineWidth=cs*.2;x.beginPath();x.arc(a,b,cs*(.5+k*1.2),0,7);x.stroke()});
 if(performance.now()<this.hintT)this.hn.forEach(c=>{const[a,b]=ct(c),pu=(Math.sin(t/120)+1)/2;x.strokeStyle='#fff';x.lineWidth=3;x.globalAlpha=.4+.6*pu;x.beginPath();x.arc(a,b,cs*(.28+.15*pu),0,7);x.stroke();x.globalAlpha=1});
 if(performance.now()<this.fl){x.strokeStyle='#ff3b3b';x.lineWidth=6;x.strokeRect(3,3,W-6,W-6)}}
}
