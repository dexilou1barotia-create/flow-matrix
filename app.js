(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const S=Store.load(),NAMES=['EASY','MEDIUM','HARD'],ENM=['EASY','MEDIUM','HARD'];
let cur=1,G,mode='main',E=null,df='all',DEV=false;
const ACH=[['First Connection','Complete your first level',d=>d.n>=1],['Puzzle Beginner','Complete 5 levels',d=>d.n>=5],['Color Master','Complete 15 levels',d=>d.n>=15],['Matrix Expert','Complete all 30 levels',d=>d.n>=30],['Perfect Flow','Complete a level with 3 stars',d=>d.s3],['No Hints Needed','Complete a level without hints',d=>d.nohint],['Speed Solver','Win a level with half the time left',d=>d.fast],
['First Endless Run','Start an Endless run',d=>d.er>=1],['5 Puzzles Completed','Solve 5 Endless puzzles',d=>d.et>=5],['10 Puzzles Completed','Solve 10 Endless puzzles',d=>d.et>=10],['25 Puzzles Completed','Solve 25 Endless puzzles',d=>d.et>=25],['50 Puzzles Completed','Solve 50 Endless puzzles',d=>d.et>=50],['100 Puzzles Completed','Solve 100 Endless puzzles',d=>d.et>=100],
['Easy Endless Master','Clear Easy Endless level 10',d=>d.eb[0]>=10],['Medium Endless Master','Clear Medium Endless level 10',d=>d.eb[1]>=10],['Hard Endless Master','Clear Hard Endless level 10',d=>d.eb[2]>=10],['Streak Master','Win 10 puzzles in a row',d=>d.es>=10],['Ultimate Matrix Player','Unlock every other achievement',()=>false]];
const fmt=s=>{s=Math.max(0,Math.ceil(s));return String(s/60|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const save=()=>{if(!DEV)Store.save(S)},done=L=>S.done[L],open=L=>DEV||L==1||!!S.done[L-1],T=(e,t)=>{if(e.textContent!==t)e.textContent=t};
const stars=n=>'★'.repeat(n)+'☆'.repeat(3-n);
function totals(){const v=Object.entries(S.done).map(([L,r])=>({L:+L,...r})),m=d=>v.filter(x=>Math.floor((x.L-1)/10)===d);
 return{n:v.length,st:v.reduce((a,b)=>a+b.stars,0),sc:v.reduce((a,b)=>a+b.score,0),ms:[0,1,2].map(d=>m(d).reduce((a,b)=>a+b.score,0)),mc:[0,1,2].map(d=>m(d).length),time:v.reduce((a,b)=>a+b.time,0),bt:v.length?Math.min(...v.map(x=>x.time)):0,ret:Object.values(S.att).reduce((a,b)=>a+Math.max(0,b-1),0),h:S.hintsTot||0}}
const rank=t=>t.st>=80&&t.h<=5&&t.ret<=10?'Ultimate Flow Master':t.st>=70?'Matrix Champion':t.st>=55?'Flow Master':t.st>=40?'Color Connector':'Matrix Beginner';
function checkAch(){const t=totals(),d={n:t.n,...S.flags,et:S.end.total,er:S.end.runs,es:S.end.st,eb:S.end.rec.map(r=>r.bl)},nw=[];
 ACH.forEach((a,i)=>{if(!S.ach.includes(i)&&(a[2](d)||(i===ACH.length-1&&S.ach.length+nw.length>=ACH.length-1)))nw.push(i)});
 if(nw.length){S.ach.push(...nw);save();setTimeout(()=>{Snd.play('ach');toast('Achievement unlocked: '+nw.map(i=>ACH[i][0]).join(', '))},900)}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2400)}
function ov(h,c){$('#ov').innerHTML='<div class="panel '+(c||'')+'">'+h+'</div>';$('#ov').classList.add('on')}
const closeOv=()=>$('#ov').classList.remove('on');
function show(id){closeOv();if(id!=='game'&&G)G.paused=true;$$('.screen').forEach(s=>s.classList.toggle('active',s.id===id));$('#back').style.display=id==='menu'?'none':'block';
 ({menu:renderMenu,levels:renderLevels,ach:renderAch,dash:renderDash,endm:renderEndm,set:()=>['sfx','music','anim'].forEach(k=>$('#'+k).checked=S.set[k])})[id]?.();save();scrollTo(0,0)}
function renderMenu(){const u=S.end.unlocked||DEV;$('#endb').textContent=u?'∞ ENDLESS FLOW':'🔒 ENDLESS FLOW';T($('#endlock'),u?'':totals().n+'/30 levels completed. Finish all 30 to unlock Endless Flow.')}
function renderLevels(){const t=totals();
 $('#stats').innerHTML=`<span>Completed <b>${t.n}/30</b></span><span>Stars <b>${t.st}/90</b></span><span>Score <b>${t.sc}</b></span><span>Best time <b>${t.bt?fmt(t.bt):'--:--'}</b></span><span>Playtime <b>${Math.floor(S.play/60)}m</b></span>`;
 $('#lvgrid').innerHTML=NAMES.map((nm,d)=>`<h3 class="d${d}">${nm} MODE ${t.mc[d]}/10${d&&!open(d*10+1)?' 🔒':''}</h3><div class="pb"><i style="width:${t.mc[d]*10}%"></i></div><div class="lg">`+[...Array(10)].map((_,i)=>{const L=d*10+i+1,r=done(L),o=open(L);return`<button class="lv ${r?'done':''} ${o?'':'locked'}" data-act="lvl" data-n="${L}">${o?i+1:'🔒'}<small>${r?stars(r.stars):o?'new':'locked'}</small></button>`}).join('')+'</div>').join('')}
function renderAch(){$('#achl').innerHTML=ACH.map((a,i)=>`<div class="ach ${S.ach.includes(i)?'on':''}"><b>${S.ach.includes(i)?'★':'🔒'}</b><div><strong>${a[0]}</strong><br>${a[1]}</div></div>`).join('')}
function renderDash(){const t=totals();
 $('#dst').innerHTML=`<span>Total score <b>${t.sc}</b></span><span>Levels <b>${t.n}/30</b></span><span>Easy <b>${t.ms[0]}</b></span><span>Medium <b>${t.ms[1]}</b></span><span>Hard <b>${t.ms[2]}</b></span><span>Playtime <b>${Math.floor(S.play/60)}m</b></span><span>Best time <b>${t.bt?fmt(t.bt):'--'}</b></span><span>Retries <b>${t.ret}</b></span><span>Hints <b>${t.h}</b></span><span>Rank <b>${rank(t)}</b></span>`;
 $('#flt').innerHTML=[['all','All Levels'],['0','Easy'],['1','Medium'],['2','Hard']].map(f=>`<button class="btn ${df===f[0]?'on':''}" data-act="df:${f[0]}">${f[1]}</button>`).join('');
 let h='<table class="tb"><tr><th>Mode</th><th>Lv</th><th>Best score</th><th>Best time</th><th>Tries</th><th>Hints</th><th>Status</th></tr>';
 for(let L=1;L<=30;L++){const d=Math.floor((L-1)/10);if(df!=='all'&&+df!==d)continue;const r=done(L);
  h+=`<tr class="${r?'':'lk'}"><td>${NAMES[d]}</td><td>${(L-1)%10+1}</td><td>${r?r.score:'—'}</td><td>${r?fmt(r.time):'—'}</td><td>${S.att[L]||0}</td><td>${r&&r.hints!==undefined?r.hints:'—'}</td><td class="ok">${r?'✔ '+stars(r.stars):open(L)?'<span style="color:#fff">Open</span>':'Locked'}</td></tr>`}
 $('#dtb').innerHTML=h+'</table>'}
function renderEndm(){const e=S.end,r=e.rec,row=(n,f)=>`<tr><td>${n}</td>${r.map(x=>'<td>'+f(x)+'</td>').join('')}</tr>`;
 $('#endrec').innerHTML=`<h3>PERSONAL RECORDS</h3><table class="tb"><tr><th></th>${ENM.map(n=>'<th>'+n+'</th>').join('')}</tr>${row('Highest level',x=>x.bl||'—')}${row('Best score',x=>x.bs||'—')}${row('Best streak',x=>x.st||'—')}${row('Most in a run',x=>x.most||'—')}${row('Time survived',x=>fmt(x.tt))}</table><p class="legend">Fastest puzzle: ${e.fast?fmt(e.fast):'—'} · Total puzzles: ${e.total} · Best streak: ${e.st} · Runs: ${e.runs}</p>`}
const RT={full:'FULL BOARD: every usable cell must be covered by a path. Joining the dots is not enough.',blocked:'BLOCKED CELLS: cells marked X can’t be used.',moves:'LIMITED MOVES: each line you draw (and each board reset) counts as a move. When your moves run out, the level is over. Be careful!',bomb:'BOMBS: a bomb appears with a 3-second countdown and a red danger zone. Tap the bomb to defuse it, or it erases your lines inside the red zone.','TIME RUSH':'TIME RUSH: a shorter timer. Move fast!','MATRIX LOCK':'MATRIX LOCK: extra blocked cells. Plan around them.','PERFECT PATH':'PERFECT PATH: only a few moves are allowed. Plan before you draw.'};
function setup(l,label){G.load(l);T($('#lvl'),label);$('#note').textContent=[l.full?'Fill every usable cell.':'Join each pair of dots.',l.blocked.length?'X cells are blocked.':'',l.maxMoves?'Max '+l.maxMoves+' moves.':'',l.special?l.special+'!':'',l.bomb?'Bombs will appear!':''].join(' ');
 document.body.classList.toggle('endmode',mode==='end');$('#nextb').style.display=mode==='end'?'none':'';$('#nextb').disabled=!done(cur)||cur>=30;G.resize();
 const r=[];if(l.special)r.push(l.special);[l.full&&'full',l.blocked.length&&'blocked',l.maxMoves&&'moves',l.bomb&&'bomb'].filter(Boolean).forEach(k=>{if(!S.seen[k]){S.seen[k]=1;r.push(k)}});
 if(r.length){save();ov(`<h2 class="glow">${l.special?'SPECIAL CHALLENGE':'NEW RULE'}</h2>`+r.map(k=>'<p class="lesson">'+RT[k]+'</p>').join('')+'<button class="btn" data-act="no">GOT IT</button>')}}
function start(n){mode='main';cur=n;S.att[n]=(S.att[n]||0)+1;show('game');setup(LEVELS[n-1],NAMES[LEVELS[n-1].diff]+' · LEVEL '+((n-1)%10+1))}
function startEnd(d,lv){mode='end';E={d,lv:lv||1,score:0,streak:0,best:0,solved:0,tt:0,pb:0};S.end.runs++;checkAch();nextEnd()}
function nextEnd(){mode='end';const l=FlowGen.endless(E.d,E.lv);show('game');setup(l,'ENDLESS '+ENM[E.d]+' · LV '+E.lv)}
function pause(){if(G.over||G.paused||!$('#game').classList.contains('active'))return;G.paused=true;save();
 ov(`<h2>PAUSED</h2><p>The timer is frozen.</p><div class="stack"><button class="btn" data-act="resume">RESUME</button>${mode==='main'?'<button class="btn" data-act="replay">RESTART LEVEL</button>':''}<button class="btn" data-act="back">${mode==='end'?'ENDLESS MENU':'LEVEL SELECTION'}</button><button class="btn" data-act="go:menu">MAIN MENU</button></div>`)}
const mscore=(l,r,a)=>Math.max(50,Math.round((l.k*100+l.n*l.n*2)*(1+l.diff*.5)+r.left*3-r.hints*60-Math.max(0,r.moves-l.k*2)*3-Math.max(0,a-1)*20));
const escore=(l,r,s)=>Math.max(30,Math.round(((l.k*80+l.n*l.n*2)*(1+l.diff*.4)+r.left*3+(!r.hints&&r.moves<=l.k+2?100:0)-r.hints*50)*(1+Math.min(s,10)*.1)));
function modeScreen(dm){const t=totals();
 if(dm===2){S.end.unlocked=1;save();ov(`<h2 class="epic">ULTIMATE CONGRATULATIONS!</h2><p><b>You completed all 30 levels of Flow Matrix!</b></p><p>You have conquered Easy Mode, Medium Mode, and Hard Mode.</p><p>You successfully completed the ultimate Color Connection challenge!</p><ul class="res"><li>Levels <b>${t.n}/30</b></li><li>Easy <b>${t.mc[0]}/10</b></li><li>Medium <b>${t.mc[1]}/10</b></li><li>Hard <b>${t.mc[2]}/10</b></li><li>Total score <b>${t.sc}</b></li><li>Overall time <b>${fmt(t.time)}</b></li><li>Retries <b>${t.ret}</b></li><li>Hints used <b>${t.h}</b></li></ul><p class="glow big">RANK: ${rank(t)}</p><p class="glow">∞ ENDLESS FLOW UNLOCKED! Easy, Medium and Hard Endless are now open.</p><div class="stack"><button class="btn" data-act="go:dash">View Full Score Dashboard</button><button class="btn" data-act="go:levels">Review All Levels</button><button class="btn" data-act="replayall">Replay Game</button><button class="btn" data-act="go:endm">Play Endless Flow</button><button class="btn" data-act="go:menu">Back to Dashboard</button></div>`,'epic');return}
 const M=[['CONGRATULATIONS!','You successfully completed all 10 levels of Easy Mode!','You’ve mastered the basics of Flow Matrix. Are you ready for a greater challenge?','Medium Mode is now unlocked!','Continue to Medium Mode',11],['AMAZING! YOU DID IT!','You completed all 10 levels of Medium Mode!','Your skills are getting stronger. Now it’s time to face the ultimate challenge.','Hard Mode is now unlocked!','Continue to Hard Mode',21]][dm];
 ov(`<h2 class="epic">${M[0]}</h2><p><b>${M[1]}</b></p><p>${M[2]}</p><p class="glow big">${M[3]}</p><p>${NAMES[dm]} score: ${t.ms[dm]}</p><div class="stack"><button class="btn" data-act="lvl" data-n="${M[5]}">${M[4]}</button><button class="btn" data-act="go:dash">View My Scores</button><button class="btn" data-act="go:menu">Back to Dashboard</button></div>`,'epic')}
function end(r){save();const l=G.lv;
 if(mode==='end')return endEnd(r,l);
 S.hintsTot=(S.hintsTot||0)+r.hints;
 if(!r.win){Snd.play('lose');const mv=r.why==='moves';save();ov(`<h2 class="bad">${mv?'OUT OF MOVES!':'TIME’S UP!'}</h2><p>${mv?'You used too many moves. Plan a cleaner route!':'Your time has run out. Don’t give up! Try again and complete the matrix.'}</p><ul class="res"><li>Final time <b>${mv?fmt(r.left):'00:00'}</b></li><li>Level <b>${(cur-1)%10+1} · ${NAMES[l.diff]}</b></li><li>Moves <b>${r.moves}</b></li><li>Hints <b>${r.hints}</b></li></ul><div class="stack"><button class="btn" data-act="replay">TRY AGAIN</button><button class="btn" data-act="go:levels">LEVEL SELECTION</button><button class="btn" data-act="go:menu">MAIN MENU</button></div>`);return}
 Snd.play('win');const p=done(cur),a=S.att[cur]||1,sc=mscore(l,r,a);
 S.done[cur]={stars:Math.max(r.stars,p?p.stars:0),score:Math.max(sc,p?p.score:0),time:p?Math.min(p.time,r.time):r.time,hints:p?Math.min(p.hints??9,r.hints):r.hints};
 const f=S.flags;if(r.stars===3)f.s3=1;if(!r.hints)f.nohint=1;if(r.ratio>=.5)f.fast=1;
 const dm=Math.floor((cur-1)/10),t=totals();$('#nextb').disabled=cur>=30;save();checkAch();
 if(cur%10===0&&t.mc[dm]===10&&!S.shown[dm]){S.shown[dm]=1;save();modeScreen(dm);return}
 ov(`<h2 class="glow">MATRIX COMPLETED!</h2><p>Congratulations! You’ve successfully connected all the colors.</p><p>${NAMES[l.diff]} · Level ${(cur-1)%10+1}</p><div>${[1,2,3].map(i=>`<span class="st ${i<=r.stars?'on':''}" style="animation-delay:${i*.25}s">★</span>`).join('')}</div><ul class="res"><li>Score <b>${sc}</b></li><li>Time <b>${fmt(r.time)}</b></li><li>Moves <b>${r.moves}</b></li><li>Hints <b>${r.hints}</b></li><li>Tries <b>${a}</b></li><li>Best score <b>${S.done[cur].score}</b></li></ul><div class="stack">${cur<30?'<button class="btn" data-act="next">NEXT LEVEL</button>':''}<button class="btn" data-act="replay">REPLAY LEVEL</button><button class="btn" data-act="go:levels">LEVEL SELECTION</button><button class="btn" data-act="go:menu">MAIN MENU</button></div>`)}
function endEnd(r,l){const R=S.end.rec[E.d],X=S.end;R.tt+=r.time;E.tt+=r.time;
 if(r.win){Snd.play('win');E.streak++;const sc=escore(l,r,E.streak),old=R.bs;E.score+=sc;E.solved++;E.best=Math.max(E.best,E.streak);if(E.score>old)E.pb=1;
  X.total++;X.st=Math.max(X.st,E.streak);X.fast=X.fast?Math.min(X.fast,r.time):r.time;X.most=Math.max(X.most,E.solved);
  R.bl=Math.max(R.bl,E.lv);R.bs=Math.max(R.bs,E.score);R.st=Math.max(R.st,E.streak);R.most=Math.max(R.most,E.solved);E.lv++;save();checkAch();
  ov(`<h2 class="glow">PUZZLE CLEARED!</h2><p>+${sc} points · Streak ×${E.streak}</p><ul class="res"><li>Run score <b>${E.score}</b></li><li>Next level <b>${E.lv}</b></li><li>Time <b>${fmt(r.time)}</b></li><li>Hints <b>${r.hints}</b></li></ul><div class="stack"><button class="btn" data-act="enext">NEXT PUZZLE</button><button class="btn" data-act="go:endm">ENDLESS MENU</button></div>`)}
 else{Snd.play('lose');save();checkAch();ov(`<h2 class="bad">GAME OVER</h2><ul class="res"><li>Mediumy <b>${ENM[E.d]}</b></li><li>Level reached <b>${E.lv}</b></li><li>Puzzles completed <b>${E.solved}</b></li><li>Final score <b>${E.score}</b></li><li>Highest streak <b>${E.best}</b></li><li>Time played <b>${fmt(E.tt)}</b></li></ul><p class="glow">${E.pb?'NEW PERSONAL BEST!':'Personal best: '+R.bs}</p><div class="stack"><button class="btn" data-act="eagain">TRY AGAIN</button><button class="btn" data-act="go:endm">CHANGE MEDIUMY</button><button class="btn" data-act="go:endm">BACK TO ENDLESS MENU</button><button class="btn" data-act="go:menu">BACK TO DASHBOARD</button></div>`)}}
function tick(g){T($('#timer'),fmt(g.left));const tm=$('#timer');tm.classList.toggle('low',g.left<=30&&g.left>10);tm.classList.toggle('crit',g.left<=10);
 const k=g.lv.k,cn=g.paths.filter((_,i)=>g.complete(i)).length,tot=g.n*g.n-g.bl.size,fl=g.own.reduce((a,o)=>a+(o>=0),0);
 T($('#mv'),'Moves '+g.moves+(g.lv.maxMoves?'/'+g.lv.maxMoves:''));$('#mv').classList.toggle('bad',!!g.lv.maxMoves&&g.lv.maxMoves-g.moves<=2);
 T($('#hud'),'Colors '+cn+'/'+k+' · '+(k-cn)+' left · Board '+Math.round(fl/tot*100)+'%'+(mode==='end'?' · Score '+E.score+' · Streak '+E.streak+' · Solved '+E.solved:''));T($('#hintb'),'Hint ('+g.hintsLeft+')')}
const act={go:a=>show(a),play:()=>{let n=1;while(n<30&&done(n))n++;start(n)},
 lvl:(_,b)=>{const n=+b.dataset.n;open(n)?start(n):toast('Complete the previous level first')},
 undo:()=>G.undo(),hint:()=>G.useHint(),pause,resume:()=>{closeOv();G.paused=false},
 reset:()=>{if(G.over||G.paused)return;G.paused=true;ov('<h2>RESTART THE BOARD?</h2><p>This clears all your lines and costs 1 move. Your timer keeps its time.</p><div class="stack"><button class="btn danger" data-act="yesreset">YES, CLEAR</button><button class="btn" data-act="no">CANCEL</button></div>')},
 yesreset:()=>{closeOv();G.paused=false;G.reset()},
 next:()=>{if(mode==='main'&&cur<30&&done(cur))start(cur+1)},replay:()=>start(cur),replayall:()=>start(1),
 back:()=>{const m={levels:'menu',ach:'menu',how:'menu',set:'menu',dash:'menu',endm:'menu',game:mode==='end'?'endm':'levels'};show(m[$('.screen.active').id]||'menu')},
 endm:()=>S.end.unlocked||DEV?show('endm'):ov(`<h2 class="bad">ENDLESS FLOW — LOCKED</h2><p>Complete all 30 main levels to unlock unlimited Flow Matrix challenges.</p><p class="glow">${totals().n}/30 levels completed.</p><button class="btn" data-act="no">OK</button>`),
 estart:p=>startEnd(+p),enext:()=>nextEnd(),eagain:()=>startEnd(E.d),df:p=>{df=p;renderDash()},
 wipe:()=>ov('<h2 class="bad">RESET PROGRESS?</h2><p>This erases all levels, scores, Endless records and achievements on this device.</p><div class="stack"><button class="btn danger" data-act="yes">YES, RESET</button><button class="btn" data-act="no">CANCEL</button></div>'),
 yes:()=>{Store.reset();location.reload()},no:()=>{closeOv();if($('#game').classList.contains('active')&&!G.over)G.paused=false}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;Snd.init();Snd.play('click');const[a,p]=b.dataset.act.split(':');if(act[a])act[a](p,b)});
document.addEventListener('change',e=>{const k=e.target.id;if(!['sfx','music','anim'].includes(k))return;S.set[k]=e.target.checked;apply();save()});
document.addEventListener('keydown',e=>{if(!$('#game').classList.contains('active'))return;const k=e.key.toLowerCase();
 if(k==='escape')($('#ov').classList.contains('on')&&G.paused&&!G.over?act.resume():pause());else if(k==='r')act.reset();else if(k==='u')G.undo()});
addEventListener('beforeunload',save);
function apply(){Snd.on=S.set.sfx;Snd.mus=S.set.music;document.body.classList.toggle('noanim',!S.set.anim)}
G=new Game($('#cv'),{snd:k=>Snd.play(k),toast,tick,end,pause,play:dt=>{S.play+=dt}});apply();renderMenu();
window.FM={start,startEnd,modeScreen,ov,closeOv,show,toast,setDev:v=>{DEV=v;document.body.classList.toggle('dev',v);renderMenu()}};
})();
