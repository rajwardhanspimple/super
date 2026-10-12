import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorld,WORLDS} from '../src/world.js';
import {update,hurt} from '../src/physics.js';
const idle={};
function tick(g,seconds,input=idle){for(let i=0;i<Math.ceil(seconds*120);i++)update(g,input,1/120);}
test('three worlds have complete playable geometry',()=>{assert.equal(WORLDS.length,3);for(let i=0;i<3;i++){const g=createWorld(i);assert.equal(g.stars.length,3);assert.ok(g.coins.length>40);assert.equal(g.status,'ready');assert.ok(g.platforms.some(p=>p.x+p.w>=g.goal.x));}});
test('ready and pause freeze gameplay',()=>{const g=createWorld();tick(g,1,{right:true});assert.equal(g.player.x,80);assert.equal(g.time,180);g.status='paused';tick(g,1);assert.equal(g.time,180);});
test('player lands on ground and jumps',()=>{const g=createWorld();g.status='playing';tick(g,.5);assert.equal(g.player.y,412);assert.ok(g.player.grounded);update(g,{jumpPressed:true,jump:true},1/120);assert.ok(g.player.vy<0);assert.ok(g.player.y<412);});
test('short tap jumps are lower than held jumps',()=>{const peak=held=>{const g=createWorld();g.status='playing';tick(g,.5);update(g,{jumpPressed:true,jump:true},1/120);let y=g.player.y;for(let i=0;i<65;i++){update(g,{jump:held},1/120);y=Math.min(y,g.player.y);}return y;};assert.ok(peak(true)<peak(false)-25);});
test('coins and stars award points only once',()=>{const g=createWorld();g.status='playing';g.player.x=g.coins[0].x;g.player.y=g.coins[0].y;update(g,idle,1/120);assert.equal(g.totalCoins,1);assert.equal(g.score,100);update(g,idle,1/120);assert.equal(g.totalCoins,1);g.coins.forEach(c=>c.taken=true);g.player.x=g.stars[0].x;g.player.y=g.stars[0].y;const beforeStar=g.score;update(g,idle,1/120);assert.equal(g.starCount,1);assert.equal(g.score,beforeStar+1000);});
test('damage respawns and invincibility prevents repeat hits',()=>{const g=createWorld();g.status='playing';hurt(g);assert.equal(g.lives,2);assert.equal(g.player.x,80);hurt(g);assert.equal(g.lives,2);g.invincible=0;hurt(g);g.invincible=0;hurt(g);assert.equal(g.status,'lost');});
test('checkpoint becomes new respawn location',()=>{const g=createWorld();g.status='playing';g.player.x=2150;g.player.y=400;update(g,idle,1/120);assert.ok(g.checkpoint.active);hurt(g);assert.equal(g.player.x,2145);});
test('enemy can be stomped',()=>{const g=createWorld();g.status='playing';const e=g.enemies[0];g.player.x=e.x;g.player.y=e.y-g.player.h-1;g.player.vy=220;update(g,idle,1/120);assert.equal(e.alive,false);assert.ok(g.player.vy<0);assert.equal(g.score,200);});
test('goal ends world and carries scores',()=>{const g=createWorld();g.status='playing';g.player.x=4190;update(g,idle,1/120);assert.equal(g.status,'won');const next=createWorld(1,g);assert.equal(next.score,g.score);assert.equal(next.lives,g.lives);assert.equal(next.starCount,0);});
test('timer expiration ends game',()=>{const g=createWorld();g.status='playing';g.time=.001;update(g,idle,1/120);assert.equal(g.status,'lost');});
