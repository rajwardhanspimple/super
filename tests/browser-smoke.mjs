import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1080}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173');await page.getByRole('button',{name:'Let’s play',exact:true}).waitFor();
 await page.screenshot({path:'tests/desktop-preview.png',fullPage:true});
 await page.getByRole('button',{name:'Let’s play',exact:true}).click();await page.waitForTimeout(500);await page.keyboard.press('Space');await page.keyboard.down('ArrowRight');await page.waitForTimeout(800);await page.keyboard.up('ArrowRight');
 await page.keyboard.press('p');await page.getByText('Adventure on pause.',{exact:true}).waitFor();await page.getByRole('button',{name:'Back to the adventure'}).click();
 await page.getByRole('button',{name:'Restart world',exact:true}).click();await page.waitForTimeout(200);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'tests/mobile-preview.png',fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,'Mobile layout must not overflow');
 assert.deepEqual(errors,[],'No browser runtime errors');console.log('Browser smoke passed: start, keyboard movement/jump, pause/resume, restart, responsive mobile, no runtime errors.');
}finally{await browser.close();}
