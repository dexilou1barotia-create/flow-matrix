// 30 levels built with a seeded generator. Each puzzle is made by cutting one
// continuous route through the grid into color paths, so every level is
// guaranteed solvable (the solution is stored in `sol` and used for hints).
const FlowGen=(()=>{
const COLORS=['#00f0ff','#ff2bd6','#ff8a00','#39ff14','#b36bff','#ffe600','#ff3b3b'];
const rng=s=>()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
const nb=(c,n)=>{const r=c/n|0,q=c%n,o=[];if(r>0)o.push(c-n);if(r<n-1)o.push(c+n);if(q>0)o.push(c-1);if(q<n-1)o.push(c+1);return o};
function ham(n,bl,free,R){const v=new Uint8Array(n*n);bl.forEach(b=>v[b]=1);let c;do{c=Math.floor(R()*n*n)}while(v[c]);
 const p=[c];v[c]=1;
 while(p.length<free){const o=nb(c,n).filter(x=>!v[x]);if(!o.length)return null;
  const sc=o.map(x=>[nb(x,n).filter(y=>!v[y]).length+R()*.9,x]).sort((a,b)=>a[0]-b[0]).map(z=>z[1]);
  c=sc[0];v[c]=1;p.push(c)}
 return p}
function snake(n){const p=[];for(let r=0;r<n;r++)for(let q=0;q<n;q++)p.push(r*n+(r%2?n-1-q:q));return p}
function build(n,k,nBlocked,seed){const R=rng(seed);let p=null,bl=new Set();
 for(let t=0;t<3000&&!p;t++){bl=new Set();while(bl.size<nBlocked)bl.add(Math.floor(R()*n*n));p=ham(n,bl,n*n-nBlocked,R)}
 if(!p){bl=new Set();p=snake(n)}
 const len=Array(k).fill(3);for(let i=3*k;i<p.length;i++)len[Math.floor(R()*k)]++;
 const sol=[],pairs=[];let pos=0;len.forEach(l=>{const s=p.slice(pos,pos+l);pos+=l;sol.push(s);pairs.push([s[0],s[l-1]])});
 return{blocked:[...bl],pairs,sol}}
function endless(diff,e){
 const n=Math.min([7,8,9][diff],[4,5,6][diff]+Math.floor((e-1)/[4,3,3][diff])),
 k=Math.min(7,n,[2,3,4][diff]+Math.floor((e-1)/[3,3,2][diff])),
 si=e%5===0?(e/5-1)%3:-1,sp=si<0?'':['TIME RUSH','MATRIX LOCK','PERFECT PATH'][si];
 let nBl=e<3?0:Math.min(Math.floor(n*n/8),Math.floor((e-1)/3)+diff);if(sp==='MATRIX LOCK')nBl=Math.min(nBl+3,Math.floor(n*n/6));
 for(let seed=e*101+diff*17;;seed++){const b=build(n,k,nBl,seed),f=b.sol.flat();
  if(new Set(f).size!==f.length||f.length!==n*n-b.blocked.length)continue; // discard invalid boards
  return{id:e,diff,n,k,nBl,seed,colors:COLORS,blocked:b.blocked,pairs:b.pairs,full:true,special:sp,time:Math.round([60,120,180][diff]*(sp==='TIME RUSH'?.7:1)),bomb:diff===2?{first:15,every:Math.max(12,Math.round(30-e*1.2))}:null,maxMoves:sp==='PERFECT PATH'?k+2:k+Math.ceil(k*Math.max([1.2,1,.8][diff],[3,2.2,1.6][diff]-e*.05))}}}
const FROZEN=[[[],[[8,22],[21,2]]],[[],[[14,11],[10,18]]],[[],[[16,4],[9,22]]],[[],[[12,21],[20,0],[1,4]]],[[],[[14,17],[22,1],[6,4]]],[[],[[16,17],[12,4],[3,6]]],[[],[[18,22],[21,1],[6,8]]],[[],[[0,24],[19,13],[14,8]]],[[],[[8,19],[24,15],[16,2],[1,6]]],[[],[[14,13],[12,6],[11,21],[16,24]]],[[],[[0,32],[33,16],[22,21],[15,13]]],[[],[[2,3],[4,31],[30,22],[21,18]]],[[2,17,33],[[10,3],[9,34],[28,25],[19,1]]],[[14,26,18,15],[[16,2],[8,6],[12,29],[35,27],[33,30]]],[[23,30],[[26,6],[0,11],[17,13],[19,22],[28,29]]],[[0,15,44],[[20,11],[4,35],[42,30],[23,32],[25,41]]],[[11,18,24,29],[[16,12],[19,39],[46,15],[8,28],[35,36]]],[[2,16],[[47,6],[5,43],[42,25],[18,30],[29,15],[14,9]]],[[6,25,36],[[28,40],[39,29],[22,0],[1,24],[31,4],[11,3]]],[[0,25,40,19],[[18,8],[1,4],[11,27],[26,47],[46,44],[43,30]]],[[33,59,22,44],[[40,17],[25,51],[43,62],[63,3],[11,31]]],[[53,41,45,37,11],[[33,59],[51,38],[30,6],[5,17],[9,12]]],[[63,17,2,3,34,46],[[31,61],[60,50],[42,10],[11,51],[52,4],[5,14]]],[[30,33,9],[[36,58],[59,52],[51,19],[18,11],[3,5],[6,31]]],[[42,40,38,9],[[46,6],[14,8],[16,19],[27,25],[24,48],[56,54]]],[[65,43,50,62,54],[[72,77],[78,61],[52,51],[60,9],[0,15],[24,30],[21,47]]],[[17,34,66,8,65,64],[[53,26],[25,2],[1,24],[33,75],[74,22],[23,31],[30,29]]],[[39,22,20],[[73,18],[9,29],[30,5],[6,32],[31,58],[59,70],[71,74]]],[[61,11,62,72],[[2,73],[74,55],[46,3],[4,48],[57,32],[23,25],[26,60]]],[[65,72,4,8,57],[[45,76],[77,61],[62,6],[5,31],[32,2],[11,56],[55,0]]]]; // fixed puzzles: same on every browser
const list=[];
for(let L=1;L<=30;L++){
 const d=L<=10?0:L<=20?1:2,n=d==0?5:d==1?(L<=15?6:7):(L<=25?8:9),
 k=d==0?(L<=3?2:L<=8?3:4):d==1?(L<=13?4:L<=17?5:6):(L<=22?5:L<=25?6:7),
 nBl=d==0?0:d==1?(L<=12?0:2+L%3):3+L%4,seed=L*7919+13,b=FROZEN[L-1]?{blocked:FROZEN[L-1][0],pairs:FROZEN[L-1][1]}:build(n,k,nBl,seed);
 list.push({id:L,diff:d,n,k,nBl,seed,colors:COLORS,blocked:b.blocked,pairs:b.pairs,full:true,time:[60,120,180][d],bomb:d==2?{first:18,every:Math.round(32-(L-21)*1.6)}:null,maxMoves:k+Math.ceil(k*([3,2.2,1.6][d]-((L-1)%10)/9*[1,.8,.6][d]))});
}
return{build,endless,list}})();
const LEVELS=FlowGen.list;
