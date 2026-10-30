import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {timingSafeEqual} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {requestTurn} from './api/assistant.mjs';
const files={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/styles.css':['styles.css','text/css'],'/engine.js':['engine.js','text/javascript'],'/adaptive.js':['adaptive.js','text/javascript']};
export function createServer({env=process.env,fetchImpl=fetch}={}){
 let windowStart=0,requests=0;
 return http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');
  const pathname=new URL(req.url,'http://localhost').pathname;
  const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  if(pathname.startsWith('/api/')){
   const origin=req.headers.origin;
   const ownHost=req.headers.host;
   const allowed=new Set((env.AIM_ALLOWED_ORIGINS||'https://hacksumn.github.io').split(',').map(s=>s.trim()).filter(Boolean));
   if(origin&&!allowed.has(origin)&&origin!==`http://${ownHost}`&&origin!==`https://${ownHost}`)return json(403,{error:'This website is not allowed to access this server.'});
   if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');}
   if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
   const configured=Boolean(env.AIM_OPENAI_API_KEY&&env.AIM_ACCESS_TOKEN);
   const actual=Buffer.from(req.headers.authorization||''),expected=Buffer.from(`Bearer ${env.AIM_ACCESS_TOKEN}`);
   const authorized=actual.length===expected.length&&timingSafeEqual(actual,expected);
   if(pathname==='/api/status'&&req.method==='GET'){if(req.headers.authorization&&configured&&!authorized)return json(401,{error:'The personal access code is incorrect.'});return json(200,{configured,model:env.AIM_MODEL||'gpt-4.1-mini',requiresAccessCode:true});}
   if(pathname!=='/api/chat')return json(404,{error:'API route not found.'});
   if(req.method!=='POST')return json(405,{error:'Use POST for chat.'});
   if(!configured)return json(503,{error:'Live AI is not configured. Add the server API key and personal access code in your hosting settings.'});
   if(!authorized)return json(401,{error:'The personal access code is missing or incorrect.'});
   if(!req.headers['content-type']?.startsWith('application/json'))return json(415,{error:'Send a JSON request.'});
   if(Date.now()-windowStart>60000){windowStart=Date.now();requests=0;}if(requests>=20)return json(429,{error:'Please wait a minute before sending more messages.'});
   try{
    const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>60000){json(413,{error:'Conversation is too large. Start a new conversation or shorten your message.'});req.resume();return;}chunks.push(chunk);}
    let body;try{body=JSON.parse(Buffer.concat(chunks).toString());}catch{return json(400,{error:'Invalid JSON request.'});}
    const m=body?.messages;if(!Array.isArray(m)||!m.length||m.length>16||!m.every(x=>x&&['user','assistant'].includes(x.role)&&typeof x.content==='string'&&x.content.trim().length>0&&x.content.length<=12000)||m.at(-1).role!=='user')return json(400,{error:'Send 1–16 user/assistant messages, ending with a user message, each at most 12,000 characters.'});
    if(body.targetModel&&!['ChatGPT','Claude','Grok'].includes(body.targetModel))return json(400,{error:'Choose ChatGPT, Claude, or Grok as the prompt target.'});
    requests++;const turn=await requestTurn(m,{key:env.AIM_OPENAI_API_KEY,model:env.AIM_MODEL||'gpt-4.1-mini',targetModel:body.targetModel||'ChatGPT',fetchImpl});return json(200,turn);
   }catch(e){return json(e.status||502,{error:e.name==='TimeoutError'?'The AI request timed out. Try again.':e.status?e.message:'The AI could not return a complete response. Please try again.'});}
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Method not allowed');}
  const f=files[pathname];if(!f){res.writeHead(404);return res.end('Not found');}
  try{const content=await readFile(new URL(f[0],import.meta.url));res.writeHead(200,{'Content-Type':f[1]+'; charset=utf-8','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:content);}catch{res.writeHead(500);res.end('Unable to load app');}
 });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)createServer().listen(Number(process.env.PORT)||3000,'0.0.0.0');
