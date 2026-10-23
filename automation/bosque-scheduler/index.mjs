import {createHash, timingSafeEqual} from 'node:crypto';

const FIRST='2026-10-11',LAST='2026-10-30';
const SITE='https://campeach-rd.github.io/Campeach/reels/';
const API='https://campeach-instagram.nomanychat.workers.dev';
const MEDIA='https://campeach-event-media.nomanychat.workers.dev';
const HOOKS=['Junta a tu coro.','Acampa. Baila.','Halloween en el bosque.','Tu escapada con house.',
 'Dos días. Mil recuerdos.','Naturaleza y música.','Cambia la rutina.','Arma tu plan.',
 'Tu disfraz. Tu aventura.','Ven con tu gente.','Baila bajo las estrellas.','Un finde diferente.',
 'El bosque te espera.','Camping con ritmo.','Octubre se vive aquí.','Desconecta. Acampa.',
 'DJs y naturaleza.','Tu coro. Tu camping.','House. Disfraces.','Mañana nos vemos.'];
export const localDay=(now)=>new Date(now.getTime()-4*3600000).toISOString().slice(0,10);
const campaign=(date)=>/^2026-10-\d\d$/.test(date)&&date>=FIRST&&date<=LAST;
const index=(date)=>Math.round((Date.parse(date)-Date.parse(FIRST))/86400000);
export function caption(date){return `🎃 ${HOOKS[index(date)]}
Ritmo del Bosque — Halloween 2026.
📍 Villa Altagracia • 31 de octubre al 1 de noviembre.
🏕️ 2 días y 1 noche: sábado 10 a. m. a domingo 6 p. m.
🎶 DJs House, Afro House, Techno y electrónica. Camping, disfraces, búsqueda del tesoro, senderismo, río y cascada.
🎟️ General RD$1,500 (acceso los 2 días).
Entrada + transporte RD$2,000; entrada + carpa RD$2,200; entrada + transporte + carpa RD$2,500.
Coro de 3 RD$3,700 (acceso para 3 personas).
Consulta condiciones y disponibilidad con Campeach.
💬 Comenta INFO, INF o HALLOWEEN para recibir los detalles por DM.
Compra tus entradas con Campeach por WhatsApp: 829-937-0674.
Imágenes de una edición anterior; programación de Halloween 2026.
#CampeachRD #Halloween2026 #CampingRD #HouseMusic #VillaAltagracia`;}

async function api(env,path,options={}){
 return env.INSTAGRAM.fetch(API+path,{...options,headers:{Authorization:'Bearer '+env.ADMIN_TOKEN,'Content-Type':'application/json'},signal:AbortSignal.timeout(360000)});
}
async function selectVideo(env,date,recovery,head=fetch){
 const prepared=SITE+`ritmo-bosque-${date}.mp4`;
 try{
  const r=await head(prepared,{method:'HEAD',signal:AbortSignal.timeout(30000)});
  if(r.ok&&r.headers.get('content-type')?.includes('video/mp4'))return {videoUrl:prepared,source:'daily-hyperframes'};
 }catch(e){console.warn(JSON.stringify({event:'daily_video_head_failed',date,message:e.message}));}
 if(recovery)throw Error('Pending daily MP4 is not available; recovery blocked');
 const variant=['coro','reserva','inmersivo'][index(date)%3];
 const url=MEDIA+`/ritmo-del-bosque-2026-${variant}.mp4`;
 const fallback=await env.MEDIA.fetch(url,{method:'HEAD'});
 if(!fallback.ok||!fallback.headers.get('content-type')?.includes('video/mp4'))throw Error('Daily and approved fallback videos unavailable');
 return {videoUrl:url,source:'approved-fallback'};
}
export async function run(env,date,{dry=false,recovery=false,now=new Date(),head=fetch}={}){
 const today=localDay(now),yesterday=localDay(new Date(now.getTime()-86400000));
 if(!campaign(date))return {skipped:true,reason:'outside-promotion'};
 if(env.CAMPAIGN_AUTOPUBLISH_ENABLED!=='true')return {skipped:true,reason:'editorial-pause'};
 if(recovery ? date!==yesterday : date!==today)throw Error('Date must be today, or yesterday for explicit recovery');
 const hour=new Date(now.getTime()-4*3600000).getUTCHours();
 if(!dry&&!recovery&&(hour<18||hour>=21))return {skipped:true,reason:'outside-publish-window'};
 const key='bosque-daily-'+date;
 const saved=await env.RECEIPTS.get(key,'json');
 if(saved?.mediaId)return {...saved,skipped:true};
 const selected=await selectVideo(env,date,recovery,head);
 if(dry){const health=await api(env,'/instagram/admin/automation-status');if(!health.ok)throw Error('Instagram service authentication failed');return {date,...selected,dry:true,idempotencyKey:key};}
 const response=await api(env,'/instagram/admin/publish-reel',{method:'POST',body:JSON.stringify({...selected,caption:caption(date),campId:'ritmo-del-bosque-2026',campName:'Ritmo del Bosque Halloween 2026',idempotencyKey:key})});
 if(!response.ok)throw Error('Instagram publication HTTP '+response.status);
 const result=await response.json();
 if(!result.mediaId)throw Error('Publication has no media receipt');
 // Save first: a permalink lookup failure must never trigger another publication.
 const receipt={date,...selected,...result,idempotencyKey:key,publishedAt:now.toISOString(),recovery};
 await env.RECEIPTS.put(key,JSON.stringify(receipt));
 const verified=await api(env,'/instagram/admin/event-media?id='+encodeURIComponent(result.mediaId));
 if(verified.ok){receipt.permalink=(await verified.json()).permalink;await env.RECEIPTS.put(key,JSON.stringify(receipt));}
 console.log(JSON.stringify({event:'bosque_publication',...receipt}));return receipt;
}
function authorized(request,env){
 if(!env.ADMIN_TOKEN)return false;
 const hash=(v)=>createHash('sha256').update(v).digest();
 return timingSafeEqual(hash(request.headers.get('authorization')||''),hash('Bearer '+env.ADMIN_TOKEN));
}
export default {
 async scheduled(controller,env){
  const now=new Date(),date=localDay(new Date(controller.scheduledTime));
  try{const result=await run(env,date,{now});console.log(JSON.stringify({event:'bosque_cron',cron:controller.cron,...result}));}
  catch(e){
   console.error(JSON.stringify({event:'bosque_cron_failed',date,message:e.message}));
   await env.RECEIPTS.put('failure:'+date,JSON.stringify({date,message:e.message,at:now.toISOString()}));throw e;
  }
 },
 async fetch(request,env){
  const url=new URL(request.url);
  if(url.pathname==='/health')return Response.json({service:'bosque-scheduler',enabled:env.CAMPAIGN_AUTOPUBLISH_ENABLED==='true',time:'18:00 America/Santo_Domingo',retries:'18:10,18:25',end:LAST});
  if(!authorized(request,env))return new Response('Unauthorized',{status:401});
  try{
   const date=url.searchParams.get('date')||localDay(new Date());
   if(url.pathname==='/admin/check'&&request.method==='GET')return Response.json(await run(env,date,{dry:true}));
   if(url.pathname==='/admin/receipt'&&request.method==='GET')return Response.json(await env.RECEIPTS.get('bosque-daily-'+date,'json'));
   if(url.pathname==='/admin/recover'&&request.method==='POST')return Response.json(await run(env,date,{recovery:true}));
   return new Response('Not found',{status:404});
  }catch(e){console.error(JSON.stringify({event:'bosque_admin_failed',message:e.message}));return Response.json({error:e.message},{status:502});}
 }
};
