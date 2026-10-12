export function burst(game,x,y,color,count=12) {
 for(let i=0;i<count;i++) game.particles.push({x,y,vx:(Math.random()-.5)*180,vy:-40-Math.random()*170,life:.5+Math.random()*.4,color,size:2+Math.random()*3});
}
export function animateEffects(game,dt) {
 game.age+=dt;
 game.invincible=Math.max(0,game.invincible-dt);
 for(const p of game.particles) {p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=420*dt;p.life-=dt;}
 game.particles=game.particles.filter(p=>p.life>0);
}
