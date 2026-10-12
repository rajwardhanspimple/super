export function burst(g,x,y,color,count=12) {
 for(let i=0;i<count;i++)g.particles.push({x,y,vx:(Math.random()-.5)*240,vy:-70-Math.random()*190,life:.5+Math.random()*.5,color,size:2+Math.random()*4});
}
export function popup(g,x,y,text,color='#fff7bb'){g.popups.push({x,y,text,color,life:1.2});}
export function animateEffects(g,dt){
 g.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=470*dt;p.life-=dt;});g.particles=g.particles.filter(p=>p.life>0);
 g.popups.forEach(p=>{p.y-=28*dt;p.life-=dt;});g.popups=g.popups.filter(p=>p.life>0);
}
