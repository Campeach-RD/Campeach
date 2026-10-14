"""Deterministic rotating Campeach covers, using only real source footage."""
import html
import json
import re
import subprocess
import shutil
from pathlib import Path
from datetime import datetime, timezone, timedelta

BRAND={'teal':'#01a1aa','orange':'#ff9820','ink':'#172321','paper':'#f6faf7'}
LAYOUTS=['postcard','banner','editorial','sunrise','frame','offset']
PHRASES=['TU ESCAPADA EMPIEZA AQUÍ','GUARDA ESTE PLAN','ACAMPAR CAMBIA LA RUTINA',
 'UN FINDE FUERA DE LO MISMO','DESCUBRE TU PRÓXIMO CAMPING','NATURALEZA Y BUENOS PLANES',
 'HAZ ESPACIO PARA UNA ESCAPADA','AQUÍ SE VIENE A DESCONECTAR',
 'TU PRÓXIMA HISTORIA AL AIRE LIBRE','SAL DE LA RUTINA','ARMA TU PLAN PARA ACAMPAR','VIVE EL CAMPING']

def plan(name,detail,date=None):
    date=date or datetime.now(timezone(timedelta(hours=-4))).date().isoformat()
    seed=datetime.fromisoformat(date).toordinal()
    # The evening event reel must not reuse the morning camp reel's layout.
    if name=='Ritmo del Bosque':seed+=3
    return {'date':date,'layout':LAYOUTS[seed%6],'headline':name,
      'hook':PHRASES[seed%12],'detail':detail,'offset':1.0+(seed%7)*.43,
      'brand':BRAND}

def markup(p):
    name=html.escape(p['headline']);hook=html.escape(p['hook']);detail=html.escape(p['detail'])
    size=104 if len(p['headline'])<18 else 82
    css=f'''
    @font-face{{font-family:CoverDisplay;src:url('assets/cover-font.ttf')}}
    #reel-cover{{position:absolute;inset:0;z-index:100;background:{BRAND['paper']};overflow:hidden;color:{BRAND['ink']};font-family:CoverDisplay,sans-serif}}
    #reel-cover .cover-photo{{position:absolute;inset:0;background:url('assets/cover-photo.jpg') center/cover no-repeat}}
    #reel-cover .cover-inner{{position:absolute;inset:0}}
    #reel-cover .cover-panel{{position:absolute;left:70px;right:130px;top:860px;padding:46px;background:{BRAND['paper']};border-bottom:22px solid {BRAND['teal']}}}
    #reel-cover .cover-brand{{font-size:28px;letter-spacing:4px;margin-bottom:26px;color:{BRAND['ink']}}}
    #reel-cover .cover-hook{{font-size:34px;line-height:1.2;margin:0 0 24px;color:{BRAND['ink']}}}
    #reel-cover .cover-title{{font-size:{size}px;line-height:1.04;letter-spacing:-2px;margin:0 0 28px;color:{BRAND['ink']};overflow-wrap:break-word}}
    #reel-cover .cover-detail{{font-size:35px;line-height:1.22;margin:0;color:{BRAND['ink']}}}
    #reel-cover.banner .cover-panel{{top:470px;background:{BRAND['teal']};border-bottom-color:{BRAND['orange']}}}
    #reel-cover.editorial .cover-panel{{top:800px;left:100px;right:150px;border-bottom:0;border-top:22px solid {BRAND['orange']}}}
    #reel-cover.editorial .cover-title{{font-size:{size+8}px}}
    #reel-cover.sunrise .cover-panel{{top:990px;background:{BRAND['orange']};border-bottom:0;border-top:22px solid {BRAND['teal']}}}
    #reel-cover.frame .cover-panel{{top:650px;left:100px;right:150px;text-align:center;border:16px solid {BRAND['teal']}}}
    #reel-cover.offset .cover-panel{{top:760px;left:170px;right:110px;background:{BRAND['paper']};border:0;border-top:30px solid {BRAND['teal']};border-bottom:16px solid {BRAND['orange']}}}
    '''
    cover=f'''<div id="reel-cover" class="clip {p['layout']}" data-start="0" data-duration="3.2" data-track-index="20">
    <div class="cover-photo"></div>
    <div class="cover-inner"><div class="cover-panel"><div class="cover-brand">CAMPEACH RD</div>
    <p class="cover-hook">{hook}</p><h2 class="cover-title">{name}</h2><p class="cover-detail">{detail}</p></div></div></div>'''
    return css,cover

def apply_cover(document,project,source,name,detail,date=None):
    p=plan(name,detail,date)
    fonts=[project/'assets/display.ttf',Path('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'),
      Path('/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf')]
    font=next((f for f in fonts if f.exists()),None)
    if not font:raise RuntimeError('Cover display font missing')
    shutil.copyfile(font,project/'assets/cover-font.ttf')
    subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(p['offset']),'-i',str(source),
      '-frames:v','1',str(project/'assets/cover-photo.jpg')],check=True)
    if not (project/'assets/cover-photo.jpg').exists():raise RuntimeError('Real cover frame unavailable')
    css,cover=markup(p)
    document=document.replace('</style>',css+'</style>',1)
    # Hide the old opening copy while its replacement cover is visible.
    # An untimed wrapper preserves all original video clip timings and tweens.
    first=re.search(r'<(section|div)\b[^>]*id="(?:scene-0|s1)"[^>]*>',document)
    if first:
        depth=1;end=None
        for tag in re.finditer(r'</?'+first[1]+r'\b[^>]*>',document[first.end():]):
            depth+=-1 if tag[0].startswith('</') else 1
            if depth==0:end=first.end()+tag.end();break
        if end is None:raise RuntimeError('Opening scene closing tag missing')
        document=document[:first.start()]+'<div id="cover-underlay" style="position:absolute;inset:0">'+document[first.start():end]+'</div>'+document[end:]
    # Insert inside the composition, not into a timed video ancestor.
    anchor=re.search(r'<(?:div|section)\b[^>]*data-composition-id="[^"]+"[^>]*>',document)
    if not anchor:raise RuntimeError('Composition root missing')
    document=document[:anchor.end()]+cover+document[anchor.end():]
    # Cover is fully legible at frame zero (automatic Reel preview), then exits.
    registration=re.search(r'window\.__timelines\s*(?:=|\[)',document)
    if not registration:raise RuntimeError('Registered GSAP timeline missing')
    timeline=re.search(r'(?:const|let|var)\s+(\w+)\s*=\s*gsap\.timeline',document)
    if not timeline:raise RuntimeError('GSAP timeline declaration missing')
    variable=timeline[1]
    motion=f"{variable}.to('#reel-cover .cover-panel',{{y:-18,duration:.45,ease:'power3.out'}},0);{variable}.to('#reel-cover .cover-inner',{{opacity:0,duration:.25,ease:'power2.in'}},2.95);"
    if first:motion+=f"{variable}.set('#cover-underlay',{{opacity:0}},0);{variable}.set('#cover-underlay',{{opacity:1}},3.2);"
    document=document[:registration.start()]+motion+document[registration.start():]
    (project/'cover-plan.json').write_text(json.dumps(p,ensure_ascii=False,indent=2),encoding='utf-8')
    (project/'cover.motion.json').write_text(json.dumps({'assertions':[{'kind':'appearsBy','selector':'#reel-cover .cover-title','bySec':.6}]}),encoding='utf-8')
    return document
