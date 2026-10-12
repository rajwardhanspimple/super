import {useEffect,useRef,forwardRef,useImperativeHandle} from 'react';
import {WIDTH,HEIGHT,createWorld} from './world.js';
import {update} from './physics.js';
import {render} from './render.js';
import {playSound,unlockAudio} from './audio.js';
const empty=()=>({left:false,right:false,jump:false,run:false,jumpPressed:false});
const GameCanvas=forwardRef(function GameCanvas({onState,onPause,sound},ref){
 const canvas=useRef(null),game=useRef(createWorld()),input=useRef(empty()),audio=useRef(sound),report=useRef(onState),pause=useRef(onPause);
 audio.current=sound;report.current=onState;pause.current=onPause;
 function snapshot(){const g=game.current;report.current({level:g.level,status:g.status,lives:g.lives,score:g.score,coins:g.totalCoins,stars:g.starCount,time:Math.ceil(g.time),progress:Math.min(100,Math.round(g.player.x/4180*100)),checkpoint:g.checkpoint.active});}
 useImperativeHandle(ref,()=>({
 start(){unlockAudio();game.current.status='playing';snapshot();canvas.current.focus();},
 restart(){game.current=createWorld(game.current.level);game.current.status='playing';input.current=empty();unlockAudio();snapshot();canvas.current.focus();},
 next(){const g=game.current;if(g.level<2){game.current=createWorld(g.level+1,g);game.current.status='playing';}else{game.current=createWorld();game.current.status='playing';}input.current=empty();snapshot();canvas.current.focus();},
 pause(){const g=game.current;if(g.status==='playing')g.status='paused';else if(g.status==='paused')g.status='playing';input.current=empty();snapshot();},
 control(key,held){unlockAudio();if(key==='jump'&&held&&!input.current.jump)input.current.jumpPressed=true;input.current[key]=held;},
 fullscreen(){const el=canvas.current.closest('.game-shell');if(document.fullscreenElement)document.exitFullscreen?.();else el.requestFullscreen?.().catch(()=>{});}
 }));
 useEffect(()=>{
 const keys={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',ShiftLeft:'run',ShiftRight:'run'};
 const down=e=>{if(e.target instanceof HTMLButtonElement||e.target instanceof HTMLInputElement)return;if(keys[e.code]){e.preventDefault();unlockAudio();const k=keys[e.code];if(k==='jump'&&!input.current.jump&&!e.repeat)input.current.jumpPressed=true;input.current[k]=true;}if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat){e.preventDefault();pause.current();}};
 const up=e=>{if(keys[e.code]){e.preventDefault();input.current[keys[e.code]]=false;}};
 const blur=()=>{input.current=empty();if(game.current.status==='playing'){game.current.status='paused';snapshot();}};
 const visibility=()=>{if(document.hidden)blur();};
 window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
 const c=canvas.current.getContext('2d');c.imageSmoothingEnabled=false;let raf,last=0,acc=0,notify=0;
 function frame(now){const elapsed=last?Math.min(.05,(now-last)/1000):0;last=now;acc+=elapsed;
 while(acc>=1/120){update(game.current,input.current,1/120);input.current.jumpPressed=false;acc-=1/120;}
 for(const event of game.current.events.splice(0))playSound(event,audio.current);
 render(c,game.current);notify+=elapsed;if(notify>.1){snapshot();notify=0;}raf=requestAnimationFrame(frame);
 }snapshot();raf=requestAnimationFrame(frame);
 return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 return <canvas ref={canvas} width={WIDTH} height={HEIGHT} tabIndex={0} aria-label="Pixel Quest platform game. Move with arrows or A and D; jump with space; hold Shift to sprint."/>;
});
export default GameCanvas;
