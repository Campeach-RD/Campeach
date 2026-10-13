import assert from 'node:assert/strict';
import worker,{run,localDay,caption} from './index.mjs';
const records=new Map();let publishes=0;
const env={ADMIN_TOKEN:'test-only',RECEIPTS:{get:async(k)=>records.get(k)||null,put:async(k,v)=>records.set(k,JSON.parse(v))},
 MEDIA:{fetch:async()=>new Response(null,{headers:{'content-type':'video/mp4'}})},
 INSTAGRAM:{fetch:async(url,o)=>{if(url.endsWith('/publish-reel')){publishes++;const b=JSON.parse(o.body);assert.equal(b.idempotencyKey,'bosque-daily-2026-10-13');assert.ok(b.caption.includes('829-937-0674'));return Response.json({mediaId:'123'});}return Response.json({permalink:'https://www.instagram.com/reel/test/'});}}};
const head=async()=>new Response(null,{headers:{'content-type':'video/mp4'}});
assert.equal(localDay(new Date('2026-10-13T02:30:00Z')),'2026-10-12');
assert.equal((await run(env,'2026-10-13',{now:new Date('2026-10-13T21:59:00Z'),head})).reason,'outside-publish-window');
assert.equal((await run(env,'2026-10-13',{now:new Date('2026-10-13T22:00:00Z'),head,dry:true})).dry,true);assert.equal(publishes,0);
const result=await run(env,'2026-10-13',{now:new Date('2026-10-13T22:00:00Z'),head});assert.equal(result.source,'daily-hyperframes');
assert.equal((await run(env,'2026-10-13',{now:new Date('2026-10-13T22:10:00Z'),head})).skipped,true);assert.equal(publishes,1);
assert.equal((await run(env,'2026-11-01',{now:new Date('2026-11-01T22:00:00Z'),head})).reason,'outside-promotion');
await assert.rejects(run(env,'2026-10-12',{now:new Date('2026-10-13T22:00:00Z'),head}),/Date/);
await assert.rejects(run(env,'2026-10-11',{now:new Date('2026-10-13T13:00:00Z'),head,recovery:true}),/Date/);
await assert.rejects(run(env,'2026-10-12',{now:new Date('2026-10-13T13:00:00Z'),head:async()=>new Response(null,{status:404}),recovery:true}),/Pending/);
records.clear();const fallback=await run(env,'2026-10-13',{now:new Date('2026-10-13T22:00:00Z'),head:async()=>new Response(null,{status:404}),dry:true});assert.equal(fallback.source,'approved-fallback');
assert.equal((await worker.fetch(new Request('https://test/admin/check'),env)).status,401);
assert.ok(caption('2026-10-12').startsWith('🎃 Acampa. Baila.'));
console.log('PASS: AST dates, 18h gate, no dry publication, receipts/idempotency, end date, recovery boundaries, unavailable recovery blocked, approved fallback, unauthorized denial, caption.');
