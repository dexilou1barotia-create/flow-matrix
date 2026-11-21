const Store={K:'flowmatrix.v1',
def:()=>({done:{},att:{},hintsTot:0,shown:{},seen:{},ach:[],flags:{},play:0,end:{unlocked:0,total:0,runs:0,fast:0,most:0,st:0,rec:[0,1,2].map(()=>({bl:0,bs:0,st:0,most:0,tt:0}))},set:{sfx:true,music:true,anim:true}}),
load(){try{const d=this.def(),s=JSON.parse(localStorage.getItem(this.K))||{};delete s.net;return Object.assign(d,s,{set:Object.assign(d.set,s.set),end:Object.assign(d.end,s.end)})}catch(e){return this.def()}},
save(s){try{localStorage.setItem(this.K,JSON.stringify(s))}catch(e){}},
reset(){try{localStorage.removeItem(this.K)}catch(e){}}};
