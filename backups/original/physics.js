import {HEIGHT,WIDTH,WORLD_END,overlap} from './world.js';
import {burst,animateEffects} from './effects.js';
export function hurt(g) {
 if(g.invincible>0||g.status!=='playing') return;
 g.lives--;g.invincible=2;burst(g,g.player.x+14,g.player.y+20,'#ff8c85');
 Object.assign(g.player,{x:g.checkpoint.active?1900:70,y:320,vx:0,vy:0});
 if(g.lives<=0) g.status='lost';
}
export function update(g,input,dt) {
 if(g.status!=='playing') return;
 animateEffects(g,dt);
 const p=g.player;
 p.coyote=p.grounded ? 0.1 : Math.max(0,(p.coyote||0)-dt);
 if(input.jump&&!g.jumpHeld) p.buffer=.12;
 else p.buffer=Math.max(0,(p.buffer||0)-dt);
 if(!input.jump&&g.jumpHeld&&p.vy< -180) p.vy=-180;
 g.jumpHeld=input.jump;
 const direction=Number(input.right)-Number(input.left),speed=input.sprint?310:235;
 const target=direction*speed;
 p.vx+=(target-p.vx)*Math.min(1,dt*(p.grounded?15:8));
 if(direction) p.facing=direction;
 if(p.buffer>0&&p.coyote>0) {p.vy=-490;p.grounded=false;p.coyote=0;p.buffer=0;burst(g,p.x+14,p.y+40,'#e9e6c9',5);}
 const solids=g.platforms.concat(g.blocks);
 p.x+=p.vx*dt;
 for(const b of solids) if(overlap(p,b)) p.x=p.vx>0?b.x-p.w:b.x+b.w;
 p.x=Math.max(0,Math.min(WORLD_END-p.w,p.x));
 const oldBottom=p.y+p.h,oldTop=p.y;
 p.vy=Math.min(760,p.vy+1180*dt);p.y+=p.vy*dt;p.grounded=false;
 for(const b of solids) {
 if(p.x+p.w<=b.x||p.x>=b.x+b.w) continue;
 if(p.vy>=0&&oldBottom<=b.y&&p.y+p.h>=b.y) {p.y=b.y-p.h;p.vy=0;p.grounded=true;}
 else if(p.vy<0&&oldTop>=b.y+b.h&&p.y<=b.y+b.h) {
 p.y=b.y+b.h;p.vy=0;
 if('used' in b&&!b.used) {b.used=true;g.score+=100;g.coinsCollected++;burst(g,b.x+18,b.y,'#ffdc65',18);}
 }
 }
 if(p.y>HEIGHT+80) hurt(g);
 for(const coin of g.coins) if(!coin.taken&&overlap(p,coin)) {coin.taken=true;g.score+=100;g.coinsCollected++;burst(g,coin.x+9,coin.y+11,'#ffe181');}
 for(const e of g.enemies) {
 if(e.dead) continue;
 e.x+=e.vx*dt;
 if(e.x<e.min) {e.x=e.min;e.vx=Math.abs(e.vx);} if(e.x>e.max) {e.x=e.max;e.vx=-Math.abs(e.vx);}
 if(overlap(p,e)) {
 if(p.vy>0&&oldBottom<=e.y+10) {e.dead=true;p.vy=-340;g.score+=250;burst(g,e.x+15,e.y+10,'#cf886a',16);}
 else hurt(g);
 }
 }
 if(!g.checkpoint.active&&p.x>g.checkpoint.x) {g.checkpoint.active=true;g.score+=500;burst(g,g.checkpoint.x,300,'#8ff0cc',25);}
 if(p.x>WORLD_END-130) {g.status='won';g.score+=Math.ceil(g.time)*10;burst(g,p.x,p.y,'#ffda74',60);}
 g.camera+=(Math.max(0,Math.min(WORLD_END-WIDTH,p.x-340))-g.camera)*Math.min(1,dt*7);
 g.time=Math.max(0,g.time-dt);if(!g.time) g.status='lost';
}
