"""Render approved event designs in GitHub Actions; publish with daily idempotency."""
import argparse
import hashlib
import html
import json
import os
import re
import subprocess
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'automation' / 'bosque-work'
TEMPLATES = ROOT / 'automation' / 'bosque'
HOST = 'https://campeach-event-media.nomanychat.workers.dev'
WORKER = 'https://campeach-instagram.nomanychat.workers.dev'
AST = timezone(timedelta(hours=-4))
HF = '0.8.145'
HOOKS = [
 ('Junta a tu', 'coro.'), ('Acampa.', 'Baila.'), ('Halloween', 'en el bosque.'),
 ('Tu escapada', 'con house.'), ('Dos días.', 'Mil recuerdos.'), ('Naturaleza', 'y música.'),
 ('Cambia', 'la rutina.'), ('Arma', 'tu plan.'), ('Tu disfraz.', 'Tu aventura.'),
 ('Ven con', 'tu gente.'), ('Baila bajo', 'las estrellas.'), ('Un finde', 'diferente.'),
 ('El bosque', 'te espera.'), ('Camping', 'con ritmo.'), ('Octubre', 'se vive aquí.'),
 ('Desconecta.', 'Acampa.'), ('DJs y', 'naturaleza.'), ('Tu coro.', 'Tu camping.'),
 ('House.', 'Disfraces.'), ('Mañana', 'nos vemos.')]

def save(file, data):
    file.parent.mkdir(parents=True, exist_ok=True)
    file.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

def download(url, file):
    file.parent.mkdir(parents=True, exist_ok=True)
    with requests.get(url, stream=True, timeout=120) as r:
        r.raise_for_status()
        with file.open('wb') as out:
            for chunk in r.iter_content(1024*1024): out.write(chunk)
    if file.stat().st_size < 100: raise RuntimeError('Empty downloaded media')

def probe(file):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(file)]))

def caption(hook):
    return f'''🎃 {hook}
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
#CampeachRD #Halloween2026 #CampingRD #HouseMusic #VillaAltagracia'''

def validate(file):
    p=probe(file); v=next(s for s in p['streams'] if s['codec_type']=='video')
    a=next(s for s in p['streams'] if s['codec_type']=='audio')
    assert (v['width'],v['height']) == (1080,1920)
    assert v['codec_name']=='h264' and a['codec_name']=='aac'
    assert 30 <= float(p['format']['duration']) <= 45.1
    assert file.stat().st_size > 1_000_000
    return p

def render(date):
    day=(datetime.fromisoformat(date)-datetime(2026,10,11)).days
    variant=['coro','reserva','inmersivo'][day%3]
    WORK.mkdir(parents=True,exist_ok=True)
    out=ROOT/'public'/'reels'/f'ritmo-bosque-{date}.mp4';out.parent.mkdir(parents=True,exist_ok=True)
    hook=' '.join(HOOKS[day])
    if day < 2:
        download(f'{HOST}/ritmo-del-bosque-2026-{variant}.mp4',out)
    else:
        project=WORK/'project'; assets=project/'assets';assets.mkdir(parents=True,exist_ok=True)
        for i in range(1,4):
            original=assets/f'original-{i}.mp4'
            download(f'{HOST}/bosque-source-{i}.mp4',original)
            subprocess.run(['ffmpeg','-y','-stream_loop','3','-i',str(original),'-t','20','-vf','scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920','-an','-c:v','libx264','-preset','fast','-crf','23',str(assets/f'source-{i}.mp4')],check=True)
        download(f'{HOST}/bosque-voice-{variant}.mp3',assets/'voice.mp3')
        download(f'{HOST}/bosque-original-music.wav',assets/'music.wav')
        download('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js',assets/'gsap.min.js')
        voice_duration=float(probe(assets/'voice.mp3')['format']['duration'])
        total=max(34,voice_duration+1.5)
        if total>45: raise RuntimeError('Narration too long; never truncate it')
        slot=total/4
        document=(TEMPLATES/f'{variant}.html').read_text(encoding='utf-8')
        document=document.replace('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js','assets/gsap.min.js')
        document=document.replace("src:local('Bahnschrift')","src:local('Liberation Sans')").replace("src:local('Consolas')","src:local('Liberation Mono')")
        # Preserve approved motion and copy, changing footage windows and hook each day.
        document=re.sub(r'data-duration="30"',f'data-duration="{total:.3f}"',document)
        document=document.replace('data-duration="7.5"',f'data-duration="{slot:.3f}"')
        for old,new in [('22.5',slot*3),('15',slot*2),('7.5',slot)]: document=document.replace(f'data-start="{old}"',f'data-start="{new:.3f}"')
        old_trans=[7.26,14.76,22.26]; new_trans=[slot*i-.24 for i in (1,2,3)]
        for old,new in zip(old_trans,new_trans): document=document.replace(f'data-start="{old}"',f'data-start="{new:.3f}"')
        document=document.replace('sc=[0,7.5,15,22.5]',f'sc={json.dumps([0,slot,slot*2,slot*3])}')
        document=document.replace('[7.26,14.76,22.26]',json.dumps(new_trans))
        document=document.replace(".from(q[3],", ".from(q[3] || q[2],")
        document=re.sub(r'(<div id="h1" class="title">).*?(</div>)',lambda m:m[1]+html.escape(HOOKS[day][0])+'<br><b>'+html.escape(HOOKS[day][1])+'</b>'+m[2],document,count=1)
        video_tags=list(re.finditer(r'<video\b[^>]+>',document))
        for j,match in reversed(list(enumerate(video_tags))):
            index=(day+j)%3+1;src=assets/f'source-{index}.mp4'
            available=float(probe(src)['format']['duration'])
            if available < slot: raise RuntimeError('Source too short for scene')
            offset=((day*1.17+j*.83) % max(.001,available-slot))
            tag=re.sub(r'src="[^"]+"',f'src="assets/source-{index}.mp4"',match[0])
            tag=tag.replace(' muted',f' data-media-start="{offset:.3f}" muted')
            document=document[:match.start()]+tag+document[match.end():]
        document=re.sub(r'src="media/voice/[^"]+"','src="assets/voice.mp3"',document)
        document=re.sub(r'src="media/bgm/[^"]+"','src="assets/music.wav"',document)
        document=re.sub(r'(<audio id="vo"[^>]*data-duration=")[^"]+',lambda m:m[1]+f'{voice_duration:.3f}',document)
        (project/'index.html').write_text(document,encoding='utf-8')
        save(project/'hyperframes.json',{'media':{'autoProxy':True}})
        subprocess.run(['npx','--yes',f'hyperframes@{HF}','check',str(project),'--snapshots'],check=True)
        intermediate=WORK/'render.mp4'
        subprocess.run(['npx','--yes',f'hyperframes@{HF}','render',str(project),'--output',str(intermediate),'--quality','looks','--workers','2'],check=True)
        subprocess.run(['ffmpeg','-y','-i',str(intermediate),'-c:v','libx264','-preset','fast','-crf','23','-maxrate','5M','-bufsize','10M','-c:a','aac','-b:a','192k','-movflags','+faststart',str(out)],check=True)
    p=validate(out)
    subprocess.run(['ffmpeg','-y','-ss','2','-i',str(out),'-frames:v','1',str(WORK/'preview.jpg')],check=True)
    result={'date':date,'variant':variant,'caption':caption(hook),'output':str(out.relative_to(ROOT)),'duration':p['format']['duration'],'idempotencyKey':'bosque-daily-'+date,'sha256':hashlib.sha256(out.read_bytes()).hexdigest()}
    save(WORK/'result.json',result);print(json.dumps(result,ensure_ascii=False))

def publish(dry):
    result=json.loads((WORK/'result.json').read_text(encoding='utf-8'))
    headers={'Authorization':'Bearer '+os.environ['CAMPEACH_ADMIN_API_TOKEN']}
    health=requests.get(WORKER+'/instagram/admin/automation-status',headers=headers,timeout=60);health.raise_for_status()
    url=os.environ['VIDEO_URL'];r=requests.head(url,allow_redirects=True,timeout=60);r.raise_for_status()
    assert 'video/mp4' in r.headers.get('content-type','')
    if dry: print('Cloud rehearsal: video and authenticated automation verified; no Instagram publication'); return
    now=datetime.now(AST);date=result['date']
    if now.date().isoformat()!=date or not '2026-10-11'<=date<='2026-10-30': raise RuntimeError('Publication date not today or outside campaign')
    target=now.replace(hour=18,minute=0,second=0,microsecond=0)
    while datetime.now(AST)<target: time.sleep(min(30,(target-datetime.now(AST)).total_seconds()))
    if datetime.now(AST).hour>=21: raise RuntimeError('Too late; do not publish stale event content')
    response=requests.post(WORKER+'/instagram/admin/publish-reel',headers=headers,json={'videoUrl':url,'caption':result['caption'],'campId':'ritmo-del-bosque-2026','campName':'Ritmo del Bosque Halloween 2026','idempotencyKey':result['idempotencyKey']},timeout=360)
    response.raise_for_status();receipt=response.json();assert receipt.get('mediaId')
    verified=requests.get(WORKER+'/instagram/admin/event-media',headers=headers,params={'id':receipt['mediaId']},timeout=60);verified.raise_for_status()
    result.update(receipt);result['permalink']=verified.json()['permalink'];result['videoUrl']=url
    save(ROOT/'automation'/'bosque-receipts'/f'{date}.json',result);print(result['permalink'])

def main():
    parser=argparse.ArgumentParser();parser.add_argument('mode',choices=['render','publish']);parser.add_argument('--date');parser.add_argument('--dry-run',action='store_true');args=parser.parse_args()
    if args.mode=='render':
        date=args.date or datetime.now(AST).date().isoformat()
        if not '2026-10-11'<=date<='2026-10-30': raise RuntimeError('Outside promotion window')
        render(date)
    else: publish(args.dry_run)

if __name__=='__main__': main()
