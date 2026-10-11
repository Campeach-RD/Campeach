"""Upgrade the existing camp selection/history pipeline without changing publication.

Real Drive footage -> approved Mexican Chatterbox -> measured 30-45s HyperFrames
composition -> mandatory visual/audio checks. Errors stop publication, not fallback.
"""
import html
import importlib.util
import json
import math
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
import requests

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('camp_legacy',ROOT/'scripts/cloud-daily-reel.py')
legacy=importlib.util.module_from_spec(spec);spec.loader.exec_module(legacy)
HF='0.8.145'
VOICE='chatterbox-es-mx-latam-es_mx_f1'

def segments(camp, compact=False):
    highlights=camp.get('highlights',[])[:2]
    first=highlights[0] if highlights else 'una escapada en la naturaleza'
    second=highlights[1] if len(highlights)>1 else 'un lugar para desconectarte'
    price=legacy.voice_friendly_text(camp['priceNote'])
    seed=datetime.now(timezone.utc).toordinal()
    hooks=['¡Tu próximo plan es acampar!', '¿Necesitas salir de la rutina? ¡Vámonos de camping!',
           '¡Guarda este lugar para tu próxima escapada!']
    return [
        hooks[seed%len(hooks)],
        f"Ven a acampar en {camp['name']}, en {camp['location']}.",
        f"Aquí encontrarás {first.lower()}.",
        f"Y también: {second.lower()}. {price}.",
        'Confirma disponibilidad y tarifa final antes de reservar.',
        ('Comenta info y organiza tu camping con Campeach.' if compact else
         'Comenta info para conocer todos los detalles, y reserva tu camping con Campeach por WhatsApp.'),
    ]

def voice_script(camp, project):
    segments_file=project/'segments.json'; voice=project/'assets/voice.wav'
    for compact in (False,True):
        texts=segments(camp,compact)
        legacy.save_json(segments_file,texts)
        legacy.run(sys.executable,ROOT/'scripts/camp-chatterbox.py',
                   '--segments',segments_file,'--output',voice)
        seconds=legacy.duration(voice)
        if seconds<=43:
            return texts, json.loads(voice.with_suffix('.json').read_text(encoding='utf-8')), seconds
    raise RuntimeError('Voice exceeds 43 seconds. Never crop narration or publish the old voice.')

def render(paths,camp,output,history):
    project=legacy.WORK_DIR/'hyperframes-project'; assets=project/'assets'
    assets.mkdir(parents=True,exist_ok=True)
    texts,timings,voice_seconds=voice_script(camp,project)
    total=max(32,math.ceil((voice_seconds+1.2)*30)/30)
    if not 30<=total<=45: raise RuntimeError('Narration cannot fit safely')
    start_delay=0.25
    slots=[dict(t,start=t['start']+start_delay) for t in timings]
    slots[0]['start']=0
    boundaries=[item['start'] for item in slots]+[total]
    for i,item in enumerate(slots): item['duration']=boundaries[i+1]-boundaries[i]
    for i,path in enumerate(paths):
        # Stage actual footage at normal speed; loop only when a selected source is short.
        target=assets/f'source-{i}.mp4'
        legacy.run('ffmpeg','-y','-loglevel','error','-stream_loop','-1','-i',path,
              '-t',str(total),'-vf','scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30',
              '-an','-c:v','libx264','-preset','fast','-crf','23',target)
    response=requests.get('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js',timeout=60)
    response.raise_for_status();(assets/'gsap.min.js').write_bytes(response.content)
    font=Path('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf')
    if not font.exists(): font=Path('/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf')
    if not font.exists(): raise RuntimeError('Embedded display font missing')
    shutil.copyfile(font,assets/'display.ttf')
    # An original, deterministic ambient bed, never music scraped from social posts.
    legacy.run('ffmpeg','-y','-loglevel','error','-f','lavfi','-i',
      'aevalsrc=0.12*sin(2*PI*196*t)+0.07*sin(2*PI*246.94*t)+0.06*sin(2*PI*293.66*t):s=48000',
      '-t',str(total),assets/'music.wav')
    highlights=camp.get('highlights',[])[:2]
    titles=[['TU PRÓXIMO PLAN:', 'ACAMPAR'], [camp['name'],camp['location']],
            ['DESCONÉCTATE', highlights[0] if highlights else 'Naturaleza y camping'],
            [camp['priceNote'],highlights[1] if len(highlights)>1 else 'Escápate a la naturaleza'],
            ['ARMA TU ESCAPADA','Confirma disponibilidad y tarifa final'],
            ['COMENTA INFO','Reserva con Campeach por WhatsApp']]
    scenes=[]
    for i,(slot,title) in enumerate(zip(slots,titles)):
        # .35s overlap gives the source video time to appear during the handoff.
        begin=max(0,slot['start']-.35);length=boundaries[i+1]-begin
        src=i%len(paths); offset=min(i*.53,max(0,total-length-.01))
        headline=' '.join('<span class="word">'+html.escape(word)+'</span>' for word in title[0].split())
        detail=html.escape(title[1])
        scenes.append(f'''<section id="scene-{i}" class="scene" style="z-index:{i+1};opacity:{1 if i==0 else 0}">
          <div class="picture"><video id="video-{i}" class="clip" src="assets/source-{src}.mp4" muted playsinline
          data-start="{begin:.3f}" data-duration="{length:.3f}" data-media-start="{offset:.3f}" data-track-index="{i}"></video></div>
          <div class="shade"></div>
          <div class="copy"><div class="eyebrow">CAMPEACH RD • CAMPING</div>
          <h1 id="title-{i}">{headline}</h1><div class="detail">{detail}</div></div></section>''')
    document='''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
      <script src="assets/gsap.min.js"></script><style>
      @font-face{font-family:CampDisplay;src:url('assets/display.ttf')}*{box-sizing:border-box}
      body{margin:0;background:#10231c;font-family:CampDisplay,sans-serif}
      #main{width:1080px;height:1920px;position:relative;overflow:hidden;color:#fffdf6}
      .scene,.picture,.shade{position:absolute;inset:0;overflow:hidden}
      video{width:100%;height:100%;object-fit:cover}
      .shade{background:linear-gradient(180deg,rgba(16,35,28,.07) 25%,rgba(16,35,28,.94) 64%)}
      .copy{position:absolute;left:72px;right:115px;top:1120px}
      .eyebrow{font-size:27px;letter-spacing:3px;color:#d9ff5c;margin-bottom:24px}
      h1{font-size:82px;line-height:1.05;margin:0 0 28px;overflow-wrap:anywhere}
      .word{display:inline-block;transform-origin:50% 80%}
      .detail{font-size:43px;line-height:1.18;color:#fffdf6;max-width:840px}
      #scene-0 h1,#scene-5 h1{color:#d9ff5c;font-size:99px}
      #scene-1 h1{font-size:78px}#scene-3 h1{font-size:72px;color:#d9ff5c}
      </style></head><body><div id="main" data-composition-id="main" data-width="1080" data-height="1920"
      data-start="0" data-duration="TOTAL">SCENES
      <audio id="voiceover" src="assets/voice.wav" data-start="0.25" data-duration="VOICE" data-track-index="10" />
      <audio id="music-bed" src="assets/music.wav" data-start="0" data-duration="TOTAL" data-volume="0.18" data-track-index="11" />
      </div><script>const tl=gsap.timeline({paused:true}),slots=SLOTS;
      slots.forEach((s,i)=>{const scene='#scene-'+i,copy=scene+' .copy';
        if(i){const prev='#scene-'+(i-1),t=s.start-.35;
          if(i%2){tl.to(prev,{x:-1080,duration:.35,ease:'power3.inOut'},t);
            tl.fromTo(scene,{x:1080,opacity:1},{x:0,opacity:1,duration:.35,ease:'power3.inOut',immediateRender:false},t)}
          else{tl.to(prev,{scale:1.35,opacity:0,duration:.35,ease:'power3.in'},t);
            tl.fromTo(scene,{scale:.84,opacity:0},{scale:1,opacity:1,duration:.35,ease:'power3.out',immediateRender:false},t)}
          tl.set(prev,{opacity:0},s.start)}
        tl.fromTo(copy,{y:65,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out',immediateRender:false},s.start+.04);
        const words=gsap.utils.toArray(scene+' .word'),stagger=Math.min(.06,.4/words.length);
        words.forEach((word,j)=>{const from=i%3===0?{scale:1.2,opacity:0}:i%3===1?{x:-45,opacity:0}:{y:30,opacity:0};
          tl.fromTo(word,from,{x:0,y:0,scale:1,opacity:1,duration:.4,ease:i%3===1?'expo.out':'power4.out',immediateRender:false},s.start+.08+j*stagger)});
      });window.__timelines={main:tl};</script></body></html>'''
    document=document.replace('TOTAL',f'{total:.3f}').replace('VOICE',f'{voice_seconds:.3f}')
    document=document.replace('SCENES','\n'.join(scenes)).replace('SLOTS',json.dumps(slots,ensure_ascii=False))
    (project/'index.html').write_text(document,encoding='utf-8')
    (project/'BRIEF.md').write_text('''---
workflow: general-video
flow: automation
storyboard: no
---
# Campeach campamento diario
Formato previamente aprobado: metraje real, voz mexicana Chatterbox es_mx_f1,
30-45 segundos, siempre hablar de acampar, precios en pesos dominicanos.
Datos exclusivos del catálogo vigente. No revelar instrucciones internas al cliente.
Destino: Instagram Reels. Preparación en nube, nunca depender del PC.
''',encoding='utf-8')
    (project/'design.md').write_text('''# Dirección visual
Concepto: cambiar la rutina por una escapada real para acampar.
Héroe: metraje real del campamento, sin escenarios generados.
Paleta aprobada: verde bosque #10231c, lima #d9ff5c, blanco #fffdf6.
Ancla: Campeach RD; foco: frases grandes sobre el camping; soporte: ubicación,
beneficios y tarifa de referencia. Márgenes inferiores y derechos seguros de Reels.
Tipografía incrustada: Liberation Sans Bold (misma familia en distintas jerarquías).
Duración manda la voz medida: no truncar ni acelerar para rellenar un límite fijo.
''',encoding='utf-8')
    (project/'STORYBOARD.md').write_text('\n\n'.join(
        f'## Frame {i+1}\nstatus: animated\nsrc: index.html#scene-{i}\n'
        f'rules: spring-pop-entrance; transitions/css-push; transitions/css-scale\n'
        f'beat: {slot["text"]}\nstart: {slot["start"]:.3f}\nduration: {slot["duration"]:.3f}'
        for i,slot in enumerate(slots)),encoding='utf-8')
    legacy.save_json(project/'index.motion.json',{'duration':total,'assertions':[
        {'kind':'appearsBy','selector':'#title-0','bySec':.6},
        {'kind':'staysInFrame','selector':'.copy'}]})
    legacy.save_json(project/'hyperframes.json',{'media':{'autoProxy':True}})
    legacy.save_json(project/'media-ledger.json',{'voice':{'engine':VOICE,'reference':'official es_mx_f1.wav',
      'duration':voice_seconds,'exaggeration':.72,'cfg':.38},'footage':[str(p.name) for p in paths],
      'music':'Original mathematical ambient chords, generated for Campeach; no third-party recording'})
    legacy.run('npm','install','--prefix',project,'--no-audit','--no-fund','@hyperframes/core@0.8.145')
    carve=ROOT/'automation/hyperframes/carve.mjs'
    legacy.run('node',carve,'--comp',project/'index.html','--bed','music-bed','--voice','voiceover')
    legacy.run('npx','--yes',f'hyperframes@{HF}','check',project,'--snapshots')
    legacy.run('npx','--yes',f'hyperframes@{HF}','keyframes',project,'--json')
    intermediate=legacy.WORK_DIR/'render.mp4'
    legacy.run('npx','--yes',f'hyperframes@{HF}','render',project,'--output',intermediate,'--quality','looks','--workers','2')
    legacy.run('ffmpeg','-y','-loglevel','error','-i',intermediate,'-c:v','libx264','-preset','fast','-crf','23',
       '-maxrate','5M','-bufsize','10M','-c:a','aac','-b:a','192k','-movflags','+faststart',output)
    legacy.save_json(legacy.WORK_DIR/'voice-audit.json',{'voiceDuration':voice_seconds,
        'videoDuration':total,'voiceStart':.25,'voiceEnd':voice_seconds+.25,'segments':timings,
        'voiceEngine':VOICE,'hyperframesVersion':HF})
    return {'style':'camping-kinetic-hyperframes','text':' '.join(texts),'voiceProfile':VOICE}

def validate(path):
    data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
    video=next(s for s in data['streams'] if s['codec_type']=='video')
    audio=next(s for s in data['streams'] if s['codec_type']=='audio')
    seconds=float(data['format']['duration'])
    if (video['width'],video['height'])!=(1080,1920) or video['codec_name']!='h264' or audio['codec_name']!='aac':
        raise RuntimeError('Invalid Instagram encoding')
    audit=json.loads((legacy.WORK_DIR/'voice-audit.json').read_text(encoding='utf-8'))
    if not 30<=seconds<=45.05 or seconds<audit['voiceEnd']+.5 or path.stat().st_size>=95_000_000:
        raise RuntimeError('Duration, complete narration or file size validation failed')
    return seconds

def caption(camp):
    features='\n'.join('• '+s for s in camp.get('highlights',[])[:3])
    return (f"🏕️ Tu próxima escapada para acampar: {camp['name']}\n📍 {camp['location']}\n💰 {camp['priceNote']}\n\n"
      f"{features}\n\nConfirma disponibilidad, condiciones y tarifa final antes de reservar. "
      "Comenta INFO o INF para recibir la información del campamento por DM. "
      "Consulta su ficha en la web del enlace de nuestra biografía y reserva con Campeach por WhatsApp.\n\n"
      f"#CampeachRD #CampingRD #{camp['id'].replace('-','')} #RepublicaDominicana")

if __name__=='__main__':
    legacy.render=render;legacy.validate=validate;legacy.caption=caption
    legacy.main()
