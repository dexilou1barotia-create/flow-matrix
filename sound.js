const Snd={ctx:null,on:true,mus:true,i:0,
init(){if(!this.ctx){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();const N=[220,277,330,415,330,277];setInterval(()=>{if(this.mus&&!document.hidden)this.tone(N[this.i++%6],.5,'triangle',.02)},420)}catch(e){}}
 if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()},
tone(f,d,type='sine',v=.07,t0=0){if(!this.ctx)return;const c=this.ctx,o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;
 o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d)},
play(k){if(!this.on)return;this.init();
 const T={click:[[660,.06]],link:[[523,.1],[784,.16]],win:[[523,.15],[659,.15],[784,.15],[1047,.35]],ach:[[880,.1],[1175,.1],[1568,.3]],lose:[[300,.2],[200,.4]],tick:[[900,.05]],boom:[[110,.3],[60,.4]]}[k]||[];
 T.forEach((n,i)=>this.tone(n[0],n[1],'square',.05,i*.12))}};
