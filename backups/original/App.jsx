import { createElement as h, useState } from 'react';
import GameCanvas from './GameCanvas.jsx';
export default function App() {
 const [paused,setPaused]=useState(false);
 return h('main',{className:'app-shell'},
 h('header',{className:'topbar'},h('div',{className:'brand-mark'},'✦ PIXEL QUEST'),h('div',{className:'top-actions'},h('button',{className:'icon-button',onClick:()=>setPaused(!paused),'aria-label':'Pause or resume'},paused?'▶':'Ⅱ'),h('button',{className:'restart-button',onClick:()=>location.reload()},'↻ RESTART'))),
 h('section',{className:'hero-copy'},h('p',{className:'eyebrow'},'WORLD 1-1 • SUNNY MEADOWS'),h('h1',null,'ADVENTURE AWAITS'),h('p',{className:'intro'},'Run, jump, and stomp your way to the flag.')),
 h('section',{className:'game-card'},h(GameCanvas,{paused})),
 h('section',{className:'controls'},'← → / A D MOVE • SPACE JUMP • P PAUSE • R RESET'),
 h('footer',{className:'footer-note'},'COLLECT COINS • DEFEAT ENEMIES • REACH THE FLAG'));
}
