import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=name=>readFile(new URL(name,root),'utf8');
const [html,css,engine,app,adaptive]=await Promise.all(['index.html','styles.css','engine.js','app.js','adaptive.js'].map(read));
const wallpaper=await readFile(new URL('assets/ai-wallpaper.png',root));
const wallpaperCss=css.replace("url('/assets/ai-wallpaper.png')",()=>"url('data:image/png;base64,"+wallpaper.toString('base64')+"')");
const bundled=html.replace('<link rel="stylesheet" href="/styles.css">',()=>'<style>'+wallpaperCss.replace(/@import[^;]+;/g,'')+'</style>').replace('<script type="module" src="/app.js"></script>',()=>'<script>\n(()=>{\n'+adaptive.replace(/export function /g,'function ' )+'\n'+engine.replace('export function generate','function generate')+'\n'+app.replace(/^import .*?;$/gm,'')+'\n})();\n</script>');
await mkdir(new URL('dist/',root),{recursive:true});await writeFile(new URL('dist/AIM-Studio.html',root),bundled);console.log('Built dist/AIM-Studio.html');
