let ctx;
export function unlockAudio(){try{ctx??=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();}catch{}}
export function playSound(name,enabled=true){
 if(!enabled||!ctx)return;
 const tunes={jump:[[320,.07],[480,.1]],coin:[[880,.06],[1320,.12]],star:[[660,.08],[880,.08],[1100,.08],[1320,.2]],stomp:[[160,.08],[90,.08]],hurt:[[260,.1],[180,.12],[100,.18]],checkpoint:[[523,.1],[659,.1],[784,.2]],win:[[523,.12],[659,.12],[784,.12],[1046,.3]]};
 let t=ctx.currentTime;for(const [f,d]of tunes[name]||[]){const o=ctx.createOscillator(),v=ctx.createGain();o.type=name==='hurt'?'sawtooth':'square';o.frequency.setValueAtTime(f,t);v.gain.setValueAtTime(.035,t);v.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(v);v.connect(ctx.destination);o.start(t);o.stop(t+d);t+=d;}
}
