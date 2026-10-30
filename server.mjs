import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/styles.css':['styles.css','text/css'],'/engine.js':['engine.js','text/javascript'],'/adaptive.js':['adaptive.js','text/javascript']};
http.createServer(async(req,res)=>{const f=files[new URL(req.url,'http://localhost').pathname];if(!f){res.writeHead(404);return res.end('Not found');}try{res.writeHead(200,{'Content-Type':f[1]+'; charset=utf-8','X-Content-Type-Options':'nosniff'});res.end(await readFile(new URL(f[0],import.meta.url)));}catch{res.writeHead(500);res.end('Unable to load app');}}).listen(Number(process.env.PORT)||3000,'0.0.0.0');
