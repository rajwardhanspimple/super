import {WIDTH,HEIGHT,WORLD_END} from './world.js';
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function star(c,x,y,r,color){c.fillStyle=color;c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.46:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();}
function cloud(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);for(const [a,b,r]of [[0,0,24],[26,-15,30],[55,-7,24],[76,4,17]])ellipse(c,a,b,r,r,'#ffffffbb');rect(c,-10,0,85,18,'#ffffffbb');c.restore();}
function hero(c,p,t){
 c.save();c.translate(Math.round(p.x+p.w/2),Math.round(p.y));c.scale(p.facing,1);const step=p.grounded?Math.sin(t*18)*Math.min(3,Math.abs(p.vx)/50):2;
 rect(c,-10,27+step,8,10,'#293d4c');rect(c,3,27-step,8,10,'#293d4c');rect(c,-12,35+step,11,4,'#594135');rect(c,2,35-step,12,4,'#594135');
 rect(c,-10,18,21,14,'#416e9e');rect(c,-12,17,7,10,'#d96550');rect(c,9,18,6,10,'#d96550');rect(c,-14,24,6,7,'#ffd0a1');rect(c,10,24,6,7,'#ffd0a1');rect(c,-5,17,3,11,'#90bcd1');rect(c,5,17,3,11,'#90bcd1');rect(c,-4,25,3,3,'#ffe18d');rect(c,5,25,3,3,'#ffe18d');
 rect(c,-9,6,20,13,'#ffc794');rect(c,-10,7,5,9,'#714a39');rect(c,7,9,3,4,'#283949');rect(c,10,12,5,5,'#ffd3a1');rect(c,3,16,9,3,'#714a39');rect(c,-10,0,21,8,'#ed7257');rect(c,-7,-3,15,5,'#ed7257');rect(c,-11,5,28,4,'#f88b66');rect(c,-2,0,5,5,'#fff4d8');c.restore();
}
export function render(c,g){
 const {theme:t,camera:cam,clock:time}=g;
 const sky=c.createLinearGradient(0,0,0,HEIGHT);sky.addColorStop(0,t.sky[0]);sky.addColorStop(1,t.sky[1]);c.fillStyle=sky;c.fillRect(0,0,WIDTH,HEIGHT);
 ellipse(c,910-cam*.04,92,51,51,g.level===1?'#ffefd3':'#fff3bd');ellipse(c,910-cam*.04,92,68,68,'#fff9c51c');
 for(let i=0;i<10;i++)cloud(c,((i*270-cam*.14+time*3)%(WIDTH+300)+WIDTH+300)%(WIDTH+300)-140,85+(i%3)*45,.7+(i%2)*.3);
 for(let layer=0;layer<2;layer++)for(let i=-1;i<15;i++){const x=i*330-cam*(layer?.32:.17);ellipse(c,x,445,230,layer?150+(i%3)*30:235+(i%3)*20,layer?t.hill:t.mountain);}
 c.save();c.translate(-cam+(g.shake?Math.sin(time*70)*g.shake:0),0);
 for(let i=0;i<24;i++){const x=i*205+110,y=450;if(g.platforms.some(p=>p.ground&&x>p.x&&x<p.x+p.w)){rect(c,x,y-100,12,100,'#648570');ellipse(c,x+6,y-115,42,48,t.hill);ellipse(c,x-18,y-90,35,30,t.grass);ellipse(c,x+31,y-96,35,34,t.grass);}}
 for(const p of g.platforms){if(p.x+p.w<cam-50||p.x>cam+WIDTH+50)continue;
 rect(c,p.x,p.y+8,p.w,p.h-8,t.soil);rect(c,p.x,p.y,p.w,10,t.grass);rect(c,p.x,p.y,p.w,3,'#c3e89d');rect(c,p.x,p.y+10,p.w,4,'#283c3225');
 for(let x=p.x+10;x<p.x+p.w-5;x+=32){rect(c,x,p.y+19,13,5,'#fff4cf18');if(p.ground){rect(c,x+11,p.y+44,7,6,'#332b3825');rect(c,x-2,p.y+76,17,5,'#fff4cf12');}}
 if(!p.ground){rect(c,p.x,p.y+20,p.w,3,'#3a404344');}else for(let x=p.x+25;x<p.x+p.w;x+=89){rect(c,x,p.y-5,2,5,t.grass);rect(c,x+3,p.y-8,2,8,t.grass);ellipse(c,x+7,p.y-6,3,3,x%2?'#fff4b4':'#ffc4b4');}
 }
 for(const b of g.blocks){rect(c,b.x,b.y,b.w,b.h,b.used?'#b19a79':'#eab856');rect(c,b.x+3,b.y+3,b.w-6,b.h-6,b.used?'#998566':'#ffdc7c');rect(c,b.x,b.y+b.h-3,b.w,3,'#8e6546');c.fillStyle=b.used?'#d7c7a1':'#98632f';c.font='bold 24px monospace';c.textAlign='center';c.fillText(b.used?'·':'?',b.x+17,b.y+26);}
 for(const coin of g.coins)if(!coin.taken){const x=coin.x+10,y=coin.y+12+Math.sin(time*3+coin.x)*3,w=4+Math.abs(Math.cos(time*3+coin.x)) *5;ellipse(c,x,y,w+2,12,'#bf843c');ellipse(c,x,y-1,w,10,'#ffe18b');rect(c,x-1,y-6,2,10,'#fff5c0');}
 for(const s of g.stars)if(!s.taken){const y=s.y+13+Math.sin(time*3)*5;ellipse(c,s.x+13,y,23,23,'#fff6b02a');star(c,s.x+13,y,16,'#fff3a2');rect(c,s.x+9,y-3,2,4,'#96774e');rect(c,s.x+16,y-3,2,4,'#96774e');}
 for(const e of g.enemies)if(e.alive){const bob=Math.sin(time*9+e.x)*2;ellipse(c,e.x+15,e.y+28,17,4,'#27334228');rect(c,e.x+2,e.y+22,10,6,'#4b3b43');rect(c,e.x+19,e.y+22,10,6,'#4b3b43');ellipse(c,e.x+15,e.y+16+bob,15,13,'#bc6e67');ellipse(c,e.x+15,e.y+9+bob,17,10,'#e19b7d');rect(c,e.x+6,e.y+10+bob,6,7,'#fff0d5');rect(c,e.x+19,e.y+10+bob,6,7,'#fff0d5');rect(c,e.x+8,e.y+12+bob,3,4,'#34323f');rect(c,e.x+20,e.y+12+bob,3,4,'#34323f');}
 const cp=g.checkpoint;rect(c,cp.x,cp.y-102,5,102,'#efe9d6');rect(c,cp.x+5,cp.y-101,36,23,cp.active?'#a9eed0':'#849a9c');rect(c,cp.x-7,cp.y-6,20,6,'#8a856e');
 const goal=g.goal;rect(c,goal.x,goal.y-210,6,210,'#fff2cc');ellipse(c,goal.x+3,goal.y-213,7,7,'#fff0b0');c.fillStyle='#ed7d68';c.beginPath();c.moveTo(goal.x+6,goal.y-205);c.lineTo(goal.x+80,goal.y-182);c.lineTo(goal.x+6,goal.y-159);c.fill();star(c,goal.x+29,goal.y-182,9,'#fff4ce');
 rect(c,goal.x+94,goal.y-112,115,112,'#e5d2ad');rect(c,goal.x+86,goal.y-120,130,15,'#f8e5be');for(let i=0;i<5;i++)rect(c,goal.x+87+i*27,goal.y-136,15,20,'#f8e5be');rect(c,goal.x+133,goal.y-55,35,55,'#6c6e68');ellipse(c,goal.x+150,goal.y-53,17,18,'#6c6e68');rect(c,goal.x+108,goal.y-86,15,20,'#8b9b8c');rect(c,goal.x+179,goal.y-86,15,20,'#8b9b8c');
 if(g.invincible<=0||Math.floor(time*15)%2===0)hero(c,g.player,time);
 for(const p of g.particles){c.globalAlpha=Math.min(1,p.life*2);rect(c,p.x,p.y,p.size,p.size,p.color);}c.globalAlpha=1;
 c.font='bold 16px monospace';c.textAlign='center';for(const p of g.popups){c.globalAlpha=Math.min(1,p.life*2);c.fillStyle=p.color;c.fillText(p.text,p.x,p.y);}c.globalAlpha=1;c.restore();
 const fade=c.createLinearGradient(0,HEIGHT-60,0,HEIGHT);fade.addColorStop(0,'#172d3100');fade.addColorStop(1,'#172d3130');c.fillStyle=fade;c.fillRect(0,HEIGHT-60,WIDTH,60);
}
