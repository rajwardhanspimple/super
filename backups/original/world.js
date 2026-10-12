export const WIDTH = 960, HEIGHT = 480, WORLD_END = 3400;
export function createWorld() {
 const platforms = [
  {x:0,y:400,w:850,h:80}, {x:970,y:400,w:700,h:80},
  {x:1810,y:400,w:1590,h:80},
  {x:300,y:300,w:160,h:24}, {x:590,y:250,w:120,h:24},
  {x:1100,y:300,w:180,h:24}, {x:1450,y:260,w:140,h:24},
  {x:1970,y:310,w:140,h:24}, {x:2250,y:245,w:180,h:24},
  {x:2650,y:310,w:160,h:24}
 ];
 return {player:{x:70,y:350,w:28,h:40,vx:0,vy:0,grounded:false,facing:1}, platforms,
  coins:[350,400,630,670,1150,1200,1490,1540,2010,2060,2290,2350,2690,2750,2950].map((x,i)=>({x,y:[270,270,220,220,270,270,230,230,280,280,215,215,280,280,350][i],w:18,h:22,taken:false})),
  enemies:[{x:560,min:480,max:780},{x:1300,min:1290,max:1620},{x:2150,min:2120,max:2450},{x:2900,min:2850,max:3150}].map(e=>({...e,y:374,w:30,h:26,vx:-65,dead:false})),
  blocks:[{x:190,y:285,w:36,h:36,used:false},{x:226,y:285,w:36,h:36,used:false},{x:1320,y:280,w:36,h:36,used:false},{x:2490,y:280,w:36,h:36,used:false}],
  checkpoint:{x:1850,active:false}, particles:[], age:0, coinsCollected:0,
  score:0,lives:3,time:180,status:'playing',camera:0,jumpHeld:false,invincible:0};
}
export function overlap(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
