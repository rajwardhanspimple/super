import { createElement as h, useEffect, useRef } from 'react';
import { HEIGHT, WIDTH, createWorld } from './world.js';
import { update } from './physics.js';

const held = new Set();
const keyMap = { left: ['ArrowLeft','a','A'], right: ['ArrowRight','d','D'], jump: ['ArrowUp','w','W',' '], sprint: ['Shift'] };
const isHeld = (name) => keyMap[name].some((key) => held.has(key));

export default function GameCanvas({ paused, onStats }) {
 const canvasRef = useRef(null);
 const gameRef = useRef(createWorld());
 useEffect(() => {
 const down = (event) => {
 held.add(event.key);
 if (keyMap.jump.includes(event.key) || keyMap.left.includes(event.key) || keyMap.right.includes(event.key)) event.preventDefault();
 if (!event.repeat && event.key.toLowerCase() === 'p') {
 const g = gameRef.current;
 if (g.status === 'playing' || g.status === 'paused') g.status = g.status === 'paused' ? 'playing' : 'paused';
 }
 if (!event.repeat && event.key.toLowerCase() === 'r') gameRef.current = createWorld();
 };
 const up = (event) => held.delete(event.key);
 const clear = () => held.clear();
 window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', clear);
 return () => { clear(); window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', clear); };
 }, []);
 useEffect(() => {
 const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); let frame; let previous = performance.now();
 const loop = (now) => {
 const dt = Math.min((now - previous) / 1000, 0.035); previous = now;
 const g = gameRef.current;
 if (!paused && g.status === 'playing') update(g, {left:isHeld('left'),right:isHeld('right'),jump:isHeld('jump'),sprint:isHeld('sprint')}, dt);
 draw(ctx, g, paused); onStats?.({score:g.score,lives:g.lives,time:Math.ceil(g.time),status:g.status});
 frame = requestAnimationFrame(loop);
 };
 frame = requestAnimationFrame(loop); return () => cancelAnimationFrame(frame);
 }, [paused, onStats]);
 const touch = (key, active) => { if (active) held.add(key); else held.delete(key); };
 const button = (label, key, className='') => h('button',{className:'touch-button '+className,'aria-label':label,onPointerDown:()=>touch(key,true),onPointerUp:()=>touch(key,false),onPointerLeave:()=>touch(key,false)},label);
 return h('div',{className:'canvas-wrap'},h('canvas',{ref:canvasRef,width:WIDTH,height:HEIGHT,'aria-label':'Advanced Pixel Quest platformer'}),h('div',{className:'canvas-help'},'ARROWS / A D MOVE · SHIFT SPRINT · SPACE JUMP · P PAUSE · R RESET'),h('div',{className:'touch-controls'},button('←','ArrowLeft'),button('→','ArrowRight'),button('JUMP',' ' ,'jump-button')));
}

function draw(ctx, g, paused) {
 const c=g.camera; ctx.clearRect(0,0,WIDTH,HEIGHT);
 const sky=ctx.createLinearGradient(0,0,0,HEIGHT); sky.addColorStop(0,'#4a9bb4'); sky.addColorStop(.58,'#a6d9cf'); sky.addColorStop(1,'#d6e4bb'); ctx.fillStyle=sky; ctx.fillRect(0,0,WIDTH,HEIGHT);
 ctx.save(); ctx.translate(-c*.12,0); drawSun(ctx,760,72); drawCloud(ctx,130,82,1); drawCloud(ctx,700,125,.72); drawCloud(ctx,1080,68,.55); ctx.restore();
 ctx.save(); ctx.translate(-c*.22,0); drawMountains(ctx); ctx.restore();
 ctx.save(); ctx.translate(-c*.38,0); drawBushes(ctx,g.age); ctx.restore();
 ctx.save(); ctx.translate(-c,0);
 for(const block of g.platforms) drawGround(ctx,block);
 for(const block of g.blocks) drawBonusBlock(ctx,block,g.age);
 for(const coin of g.coins) if(!coin.taken) drawCoin(ctx,coin,g.age);
 for(const enemy of g.enemies) if(!enemy.dead) drawEnemy(ctx,enemy,g.age);
 drawCheckpoint(ctx,g.checkpoint,g.age); drawFlag(ctx,3260,155); drawPlayer(ctx,g.player,g.age);
 for(const p of g.particles) {ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size);ctx.globalAlpha=1;}
 ctx.restore();
 drawHud(ctx,g);
 if(paused||g.status!=='playing') drawOverlay(ctx,g,paused);
}
function drawHud(ctx,g) { ctx.fillStyle='#112b35cc';ctx.fillRect(16,14,928,44);ctx.fillStyle='#ffe58c';ctx.font='bold 17px VT323, monospace';ctx.fillText('COINS '+g.coinsCollected,32,42);ctx.fillStyle='#fff4dc';ctx.fillText('SCORE '+String(g.score).padStart(5,'0'),170,42);ctx.fillText('LIVES '+g.lives,400,42);ctx.fillText('TIME '+Math.ceil(g.time),820,42); }
function drawOverlay(ctx,g,paused) { ctx.fillStyle='#102c2fcc';ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.textAlign='center';ctx.fillStyle='#fff1c9';ctx.font='bold 32px Press Start 2P, monospace';ctx.fillText(g.status==='won'?'LEVEL CLEAR!':g.status==='lost'?'GAME OVER':'PAUSED',WIDTH/2,HEIGHT/2-12);ctx.font='20px VT323, monospace';ctx.fillText(paused?'Use the pause button or P to resume':g.status==='playing'?'Press P to continue':'Press R to restart',WIDTH/2,HEIGHT/2+32);ctx.textAlign='left'; }
function pixel(ctx,x,y,w,h,color) {ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
function drawPlayer(ctx,p,age) { const bob=p.grounded&&Math.abs(p.vx)>5?Math.sin(age * 16) * 2:0; const x=p.x,y=p.y+bob; if(p.invincible>0&&Math.floor(age * 14)%2===0)return; pixel(ctx,x+5,y+10,19,25,'#24364c');pixel(ctx,x+2,y+4,25,10,'#cf4d43');pixel(ctx,x+7,y+1,18,7,'#e96a51');pixel(ctx,x+8,y+14,15,13,'#efb287');pixel(ctx,x+20,y+17,7,4,'#24364c');pixel(ctx,x+3,y+33,10,7,'#273449');pixel(ctx,x+17,y+33,10,7,'#273449');pixel(ctx,x+1,y+39,13,3,'#182334');pixel(ctx,x+16,y+39,13,3,'#182334');}
function drawEnemy(ctx,e,age) { const x=e.x,y=e.y+Math.sin(age * 8+e.x) * 1.5;pixel(ctx,x+3,y+8,24,16,'#75453f');pixel(ctx,x+6,y+2,18,12,'#b96855');pixel(ctx,x+8,y+5,4,5,'#fff4dc');pixel(ctx,x+19,y+5,4,5,'#fff4dc');pixel(ctx,x+9,y+7,3,3,'#263449');pixel(ctx,x+20,y+7,3,3,'#263449');pixel(ctx,x,y+23,12,4,'#4a343a');pixel(ctx,x+18,y+23,12,4,'#4a343a');}
function drawGround(ctx,b) { pixel(ctx,b.x,b.y,b.w,b.h,'#5a984c');pixel(ctx,b.x,b.y,b.w,8,'#315d42');for(let x=b.x+8;x<b.x+b.w;x+=32){pixel(ctx,x,b.y+18,13,5,'#76ae58');pixel(ctx,x+15,b.y+31,13,5,'#467c47');} }
function drawBonusBlock(ctx,b,age) { pixel(ctx,b.x,b.y,b.w,b.h,b.used?'#92714b':'#d49a46');pixel(ctx,b.x+3,b.y+3,b.w-6,b.h-6,'#f1bf5a');if(!b.used){pixel(ctx,b.x+13,b.y+8,10,5,'#fff0a0');pixel(ctx,b.x+9,b.y+13,5,12,'#fff0a0');pixel(ctx,b.x+22,b.y+13,5,12,'#fff0a0');pixel(ctx,b.x+13,b.y+25,10,5,'#fff0a0');}else pixel(ctx,b.x+4,b.y+4,b.w-8,b.h-8,'#a77d4e'); }
function drawCoin(ctx,coin,age) {const scale=.72 + .28 * Math.abs(Math.sin(age * 5+coin.x));const w=14 * scale;pixel(ctx,coin.x+9-w/2,coin.y+3,w,17,'#e4a83f');pixel(ctx,coin.x+11-w/2,coin.y+5,w/3,11,'#fff0a0');}
function drawCheckpoint(ctx,cp,age) {const x=cp.x;pixel(ctx,x,175,6,225,'#f3e5c4');pixel(ctx,x+6,180,42,28,cp.active?'#55d7a5':'#d96655');pixel(ctx,x-7,397,28,8,'#4a6d4d');}
function drawFlag(ctx,x,y) {pixel(ctx,x,y,7,245,'#fff0cf');pixel(ctx,x+7,y,64,34,'#ec6252');pixel(ctx,x+7,y+10,48,5,'#ffd36e');pixel(ctx,x-10,397,30,8,'#4a6d4d');}
function drawSun(ctx,x,y){ctx.fillStyle='#ffe28b';ctx.beginPath();ctx.arc(x,y,32,0,Math.PI * 2);ctx.fill();}
function drawCloud(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#edf3db';ctx.beginPath();ctx.arc(0,12,22,0,Math.PI * 2);ctx.arc(30,0,30,0,Math.PI * 2);ctx.arc(66,12,21,0,Math.PI * 2);ctx.fill();ctx.restore();}
function drawMountains(ctx){ctx.fillStyle='#6b9d76';for(let x=-300;x<3900;x+=510){ctx.beginPath();ctx.moveTo(x,400);ctx.lineTo(x+210,130);ctx.lineTo(x+480,400);ctx.fill();}ctx.fillStyle='#527f6b';for(let x=-100;x<3900;x+=650){ctx.beginPath();ctx.moveTo(x,400);ctx.lineTo(x+180,190);ctx.lineTo(x+430,400);ctx.fill();}}
function drawBushes(ctx,age){for(let x=-100;x<3900;x+=270){const y=370+Math.sin(age*1.5+x)*1;ctx.fillStyle='#4e935f';ctx.beginPath();ctx.arc(x,y,38,Math.PI,0);ctx.arc(x+42,y-8,48,Math.PI,0);ctx.arc(x+90,y,35,Math.PI,0);ctx.fill();}}
