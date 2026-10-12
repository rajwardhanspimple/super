export const WIDTH = 1120, HEIGHT = 560, WORLD_END = 4400;
export const WORLDS = [
 {name:'Sunlit Meadows',subtitle:'Every great adventure starts with a leap.',tag:'THE GREEN HILLS',sky:['#68cbe0','#e1f6cf'],hill:'#72b99b',mountain:'#acd6ba',grass:'#80cb66',soil:'#896044',accent:'#ffd568'},
 {name:'Twilight Grove',subtitle:'Follow the fireflies into the unknown.',tag:'THE ENCHANTED FOREST',sky:['#282d64','#bd82b5'],hill:'#494578',mountain:'#69608c',grass:'#87bca5',soil:'#514661',accent:'#b8f9ce'},
 {name:'Golden Summit',subtitle:'One last climb. A legendary finish.',tag:'THE SKY KINGDOM',sky:['#ed9776','#ffe1a8'],hill:'#bb9478',mountain:'#d5b997',grass:'#dad497',soil:'#97745a',accent:'#fff5af'}
];
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function createWorld(level=0,carry={}) {
 const platforms=[{x:0,y:450,w:900,h:150,ground:true},{x:1050,y:450,w:780,h:150,ground:true},{x:1970,y:450,w:970,h:150,ground:true},{x:3100,y:450,w:1300,h:150,ground:true}];
 const ledges=[[340,350,150],[600,270,150],[850,340,240],[1250,345,160],[1500,265,150],[1790,340,240],[2180,355,140],[2440,280,180],[2740,340,180],[2900,345,260],[3310,350,160],[3550,270,160],[3790,345,160]];
 ledges.forEach(([x,y,w],i)=>platforms.push({x,y:y-(level===2&&i%3===0?25:0),w,h:22}));
 const coins=[];
 platforms.forEach((p,i)=>{if(p.ground){for(let x=p.x+160;x<p.x+p.w-100;x+=140)coins.push({x,y:397,w:20,h:24,taken:false});}else{for(let x=p.x+25;x<p.x+p.w-15;x+=40)coins.push({x,y:p.y-42,w:20,h:24,taken:false});}});
 const stars=[{x:650,y:210,w:26,h:26,taken:false},{x:1530,y:205,w:26,h:26,taken:false},{x:3590,y:210,w:26,h:26,taken:false}];
 const enemies=[540,1320,1680,2300,2670,3380,3890].map((x,i)=>({x,y:422,w:30,h:28,vx:(i%2?1:-1)*(45+level*18),min:x-100,max:x+110,alive:true}));
 return {level,theme:WORLDS[level],player:{x:80,y:390,w:26,h:38,vx:0,vy:0,grounded:false,facing:1,coyote:0,jumpBuffer:0},platforms,coins,stars,enemies,particles:[],popups:[],blocks:[{x:485,y:312,w:34,h:34,used:false},{x:1390,y:310,w:34,h:34,used:false},{x:2340,y:315,w:34,h:34,used:false}],checkpoint:{x:2110,y:450,active:false},spawn:80,goal:{x:4180,y:450},camera:0,clock:0,time:180,lives:carry.lives??3,score:carry.score??0,totalCoins:carry.totalCoins??0,levelCoins:0,starCount:0,invincible:0,status:'ready',events:[],shake:0};
}
