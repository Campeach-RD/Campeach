"""Upgrade the existing camp selection/history pipeline without changing publication.

Real Drive footage -> configured narration -> measured 30-45s HyperFrames
composition -> mandatory visual/audio checks. Errors stop publication, not fallback.
"""
import os
import importlib.util
import json
import math
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
import requests
from content_strategy import content_plan
from reel_composition import build_composition, FONT_URLS
from reel_storytelling import storytelling_segments

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('camp_legacy',ROOT/'scripts/cloud-daily-reel.py')
legacy=importlib.util.module_from_spec(spec);spec.loader.exec_module(legacy)
HF='0.8.145'
VOICE='elevenlabs-spanish-storytelling' if os.environ.get('CAMPEACH_VOICE_ENGINE') == 'elevenlabs' else 'chatterbox-es-mx-latam-es_mx_f1'

CURRENT_PLAN = None

def segments(camp, compact=False):
    plan = CURRENT_PLAN or content_plan(camp)
    texts = storytelling_segments(camp,plan,compact)
    if compact:
        texts[4] = 'Disponibilidad, condiciones y tarifa final por confirmar.'
    return [legacy.voice_friendly_text(text) for text in texts]

def voice_script(camp, project):
    segments_file=project/'segments.json'; voice=project/'assets/voice.wav'
    if VOICE == 'elevenlabs-spanish-storytelling':
        from reel_elevenlabs import generate_voice
        for compact in (False,True):
            texts=segments(camp,compact)
            timings=generate_voice(texts,voice)
            seconds=legacy.duration(voice)
            if seconds <= 43:
                return texts,timings,seconds
        raise RuntimeError('ElevenLabs narration exceeds 43 seconds; review the script')
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
    global CURRENT_PLAN
    CURRENT_PLAN = content_plan(camp, history)
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
              '-an','-c:v','libx264','-preset','fast','-crf','23','-g','30','-keyint_min','30','-movflags','+faststart',target)
    response=requests.get('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js',timeout=60)
    response.raise_for_status();(assets/'gsap.min.js').write_bytes(response.content)
    for name,url in FONT_URLS.items():
        font_response=requests.get(url,timeout=60)
        font_response.raise_for_status()
        (assets/name).write_bytes(font_response.content)
    # Carefree by Kevin MacLeod, CC BY 4.0; attribution is appended below.
    import hashlib
    music_url='https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3'
    music=requests.get(music_url,timeout=90)
    music.raise_for_status()
    expected='8433b770a630d9b1594fd484442c677907ece899a4d149954cd2e74fd733e311'
    if hashlib.sha256(music.content).hexdigest()!=expected:
        raise RuntimeError('Music source changed; review license and audio before publication')
    (assets/'carefree.mp3').write_bytes(music.content)
    legacy.run('ffmpeg','-y','-loglevel','error','-stream_loop','-1','-i',assets/'carefree.mp3',
      '-t',str(total),'-af',f'afade=t=in:d=0.7,afade=t=out:st={total-2}:d=2',assets/'music.wav')
    legacy.save_json(project/'music-license.json',{'title':'Carefree','author':'Kevin MacLeod',
      'license':'CC BY 4.0','url':'https://creativecommons.org/licenses/by/4.0/',
      'source':music_url,'sha256':expected,'changes':'Excerpt, fades and voiceover carve'})
    document=build_composition(CURRENT_PLAN['titles'],slots,total,len(paths),voice_seconds)
    (project/'index.html').write_text(document,encoding='utf-8')
    (project/'BRIEF.md').write_text('''---
workflow: general-video
flow: automation
storyboard: no
---
# Campeach campamento diario
Metraje real, narración configurada y comprobada,
30-45 segundos, siempre hablar de acampar, precios en pesos dominicanos.
Datos exclusivos del catálogo vigente. No revelar instrucciones internas al cliente.
Destino: Instagram Reels. Preparación en nube, nunca depender del PC.
''',encoding='utf-8')
    shutil.copyfile(ROOT/'automation/hyperframes/DESIGN.md',project/'DESIGN.md')
    (project/'STORYBOARD.md').write_text('\n\n'.join(
        f'## Frame {i+1}\nstatus: animated\nsrc: index.html#scene-{i}\n'
        f'rules: soft-entrance; transitions/css-dissolve\n'
        f'beat: {slot["text"]}\nstart: {slot["start"]:.3f}\nduration: {slot["duration"]:.3f}'
        for i,slot in enumerate(slots)),encoding='utf-8')
    legacy.save_json(project/'index.motion.json',{'duration':total,'assertions':[
        {'kind':'appearsBy','selector':'#title-0','bySec':1.25},
        {'kind':'appearsBy','selector':'#title-5','bySec':total-1}]})
    legacy.save_json(project/'hyperframes.json',{'media':{'autoProxy':True}})
    legacy.save_json(project/'media-ledger.json',{'voice':{'engine':VOICE,'duration':voice_seconds},'footage':[str(p.name) for p in paths],
      'music':'Carefree — Kevin MacLeod (incompetech.com), CC BY 4.0; see music-license.json'})
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
    return {'style':'campeach-travel-editorial-v3','text':' '.join(texts),'voiceProfile':VOICE,
            'contentAngle':CURRENT_PLAN['contentAngle'],'strategyVersion':CURRENT_PLAN['strategyVersion']}

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
    text = (CURRENT_PLAN or content_plan(camp))['caption']
    return text + '\n\nMúsica: Carefree — Kevin MacLeod (incompetech.com). CC BY 4.0: https://creativecommons.org/licenses/by/4.0/ . Fragmento mezclado bajo narración.'

if __name__=='__main__':
    legacy.render=render;legacy.validate=validate;legacy.caption=caption
    legacy.main()
