import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const axePath=process.env.AXE_CORE_PATH||require.resolve('axe-core/axe.min.js');
const html=await readFile(new URL('../dist/AIM-Studio.html',import.meta.url),'utf8');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1600,height:1100}});const origin='http://localhost:3111';
const reports=[];
try{
 await page.route('**/*',r=>r.request().url()===origin+'/'?r.fulfill({status:200,contentType:'text/html',body:html}):r.abort());
 await page.route('https://access-chat.example/**',r=>{const headers={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,OPTIONS'};if(r.request().method()==='OPTIONS')return r.fulfill({status:204,headers});if(r.request().url().endsWith('/api/status'))return r.fulfill({status:200,headers,json:{configured:true}});return r.fulfill({status:200,headers,json:{reply:'Let’s narrow this down to the outcome you need.',questions:[{question:'Which direction matters most?',options:['A practical plan','A deeper explanation']}],aim:{role:'An independent expert researcher',context:'Personal learning and practical use',mission:'A specific, evidence-aware outcome'},variants:[{label:'Precision',prompt:'Act as a specialist. Develop a practical plan and state assumptions.'},{label:'Deep exploration',prompt:'Compare primary evidence, counterarguments, and uncertainties.'}],assumptions:['Your preferred depth is not confirmed.'],ready:true}});});
 async function scan(name){await page.addScriptTag({path:axePath});const result=await page.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));reports.push({state:name,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});console.log(name+': '+result.violations.length+' automated accessibility violations');}
 await page.goto(origin+'/#chat');await scan('desktop welcome');await page.screenshot({path:'/tmp/aim-chat-welcome.png',fullPage:true});
 await page.locator('#chat-settings').evaluate(e=>e.open=true);await scan('desktop connection settings');await page.locator('#chat-endpoint').fill('https://access-chat.example');await page.locator('#chat-access').fill('synthetic-code');await page.locator('#chat-connect').click();await page.waitForFunction(()=>!document.querySelector('#chat-input').disabled);await page.locator('#chat-input').fill('Help me understand this topic');await page.locator('#chat-send').click();await page.locator('#chat-variants section').first().waitFor();await scan('desktop conversation with choices and drafts');await page.screenshot({path:'/tmp/aim-chat-connected.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await scan('mobile conversation, reduced motion');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await writeFile('/tmp/aim-accessibility-report.json',JSON.stringify(reports,null,2));if(reports.some(x=>x.violations.length))process.exitCode=1;
}finally{await browser.close();}
