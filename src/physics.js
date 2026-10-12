import {HEIGHT,WIDTH,WORLD_END,overlap} from './world.js';
import {burst,popup,animateEffects} from './effects.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function hurt(g){
 if(g.invincible>0||g.status!=='playing')return;
 g.lives--;g.events.push('hurt');g.shake=12;burst(g,g.player.x+13,g.player.y+20,'#ff9c83',20);
 if(g.lives<=0){g.status='lost';return;}
 Object.assign(g.player,{x:g.spawn,y:380,vx:0,vy:0,grounded:false,coyote:0,jumpBuffer:0});g.invincible=2;g.camera=clamp(g.spawn-160,0,WORLD_END-WIDTH);
}
export function update(g,input,dt){
 g.clock+=dt;animateEffects(g,dt);g.shake=Math.max(0,g.shake-dt*40);
 if(g.status!=='playing')return;
 g.time=Math.max(0,g.time-dt);g.invincible=Math.max(0,g.invincible-dt);
 if(g.time<=0){g.lives=1;hurt(g);return;}
 const p=g.player;
 p.coyote=p.grounded?.11:Math.max(0,p.coyote-dt);
 p.jumpBuffer=input.jumpPressed?.13:Math.max(0,p.jumpBuffer-dt);
 const direction=(input.right?1:0)-(input.left?1:0),speed=input.run?330:245;
 p.vx+=((direction*speed)-p.vx)*Math.min(1,dt*(direction?12:17));
 if(direction)p.facing=direction;
 if(p.jumpBuffer>0&&p.coyote>0){p.vy=-570;p.grounded=false;p.coyote=0;p.jumpBuffer=0;g.events.push('jump');burst(g,p.x+13,p.y+38,'#faf3cb',5);}
 if(!input.jump&&p.vy< -220)p.vy+=1700*dt;
 p.vy=Math.min(750,p.vy+1450*dt);
 const solids=[...g.platforms,...g.blocks];
 p.x+=p.vx*dt;p.x=clamp(p.x,0,WORLD_END-p.w);
 for(const s of solids)if(overlap(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w;p.vx=0;}
 const previousBottom=p.y+p.h;p.y+=p.vy*dt;p.grounded=false;
 for(const s of solids)if(overlap(p,s)){
 if(p.vy>=0){p.y=s.y-p.h;p.vy=0;p.grounded=true;}
 else {p.y=s.y+s.h;p.vy=0;if('used' in s&&!s.used){s.used=true;g.score+=100;g.totalCoins++;g.levelCoins++;burst(g,s.x+17,s.y,'#ffda70',14);popup(g,s.x,s.y-15,'+100');g.events.push('coin');}}
 }
 for(const c of g.coins)if(!c.taken&&overlap(p,c)){c.taken=true;g.score+=100;g.totalCoins++;g.levelCoins++;burst(g,c.x+10,c.y+12,'#ffe08c',8);g.events.push('coin');}
 for(const s of g.stars)if(!s.taken&&overlap(p,s)){s.taken=true;g.score+=1000;g.starCount++;burst(g,s.x+13,s.y+13,'#fff9b2',26);popup(g,s.x,s.y,'+1000');g.events.push('star');}
 for(const e of g.enemies){if(!e.alive)continue;e.x+=e.vx*dt;if(e.x<e.min||e.x+e.w>e.max)e.vx*=-1;
 if(overlap(p,e)){if(p.vy>0&&previousBottom<=e.y+12){e.alive=false;p.vy=-380;g.score+=200;burst(g,e.x+15,e.y+14,'#f3b096',16);popup(g,e.x,e.y,'+200');g.events.push('stomp');}else{hurt(g);return;}}
 }
 if(p.y>HEIGHT+80){g.invincible=0;hurt(g);return;}
 if(!g.checkpoint.active&&p.x>g.checkpoint.x){g.checkpoint.active=true;g.spawn=g.checkpoint.x+35;g.score+=250;popup(g,g.checkpoint.x,g.checkpoint.y-105,'CHECKPOINT','#bdffd9');g.events.push('checkpoint');}
 if(p.x>g.goal.x){g.score+=Math.ceil(g.time)*10;g.status='won';g.events.push('win');burst(g,p.x,p.y,'#ffdf87',65);}
 const target=clamp(p.x-WIDTH*.32,0,WORLD_END-WIDTH);g.camera+=(target-g.camera)*Math.min(1,dt*7);
}
