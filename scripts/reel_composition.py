"""Deterministic HyperFrames layout. Headline whitespace survives HTML minification."""
import html
import json
import re

FONT_URLS = {
    'bricolage.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/BricolageGrotesque%5Bopsz,wdth,wght%5D.ttf',
    'fraunces.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf',
}


def display_copy(title, index):
    headline, detail = title
    # Preserve the complete original price/conditions in the body, even if a new
    # catalog format is not recognized. Only the prominent price is extracted.
    price = re.search(r'(?:desde\s*)?(RD\$\s*[\d,.]+)', headline, re.I)
    if price:
        return 'TARIFA DE REFERENCIA · DESDE', price.group(1), headline
    if index == 0:
        return detail.upper(), headline, 'Una escapada con Campeach RD'
    if index == 5:
        return 'TU PRÓXIMA ESCAPADA', 'Comenta INFO', detail
    return 'ANTES DE IR' if index == 4 else 'CAMPING · CAMPEACH RD', headline, detail


def build_composition(titles, slots, total, source_count, voice_seconds=None, music=True):
    if len(titles) != len(slots) or not titles or source_count < 1:
        raise ValueError('Every scene needs copy, timing and actual footage')
    scenes = []
    ends = [s['start'] for s in slots[1:]] + [total]
    for i, (title, slot, end) in enumerate(zip(titles, slots, ends)):
        start = max(0, slot['start'] - .45)
        length = end - start
        label, headline, detail = display_copy(title, i)
        size = 108 if re.fullmatch(r'RD\$\s*[\d,.]+', headline) else (70 if len(headline) > 36 else 88)
        if i == 0:
            size = 78 if len(headline) > 36 else 96
        scenes.append(f'''<section id="scene-{i}" class="scene" style="z-index:{i + 1};opacity:{1 if i == 0 else 0}">
<div class="picture"><video id="video-{i}" src="assets/source-{i % source_count}.mp4" muted playsinline data-start="{start:.3f}" data-duration="{length:.3f}" data-track-index="{i}"></video></div>
<div class="scene-content"><div class="brand">CAMPEACH <span>RD</span></div>
<div class="panel"><div class="accent"></div><div class="eyebrow">{html.escape(label)}</div>
<h1 id="title-{i}" style="font-size:{size}px">{html.escape(headline)}</h1>
<p class="detail">{html.escape(detail)}</p><div class="counter">{i+1:02d} / {len(titles):02d}</div></div></div></section>''')
    audio = ''
    if voice_seconds is not None:
        audio += f'<audio id="voiceover" src="assets/voice.wav" data-start="0.25" data-duration="{voice_seconds:.3f}" data-track-index="10"></audio>'
    if music:
        audio += f'<audio id="music-bed" src="assets/music.wav" data-start="0" data-duration="{total:.3f}" data-volume="0.18" data-track-index="11"></audio>'
    return '''<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><script src="assets/gsap.min.js"></script><style>
@font-face{font-family:Bricolage;src:url('assets/bricolage.ttf')}@font-face{font-family:Fraunces;src:url('assets/fraunces.ttf')}
*{box-sizing:border-box}body{margin:0;background:#172321;font-family:Bricolage,sans-serif;color:#172321}
#main{width:1080px;height:1920px;position:relative;overflow:hidden}.scene,.picture{position:absolute;inset:0;overflow:hidden}
video{width:100%;height:100%;object-fit:cover}.scene-content{position:relative;display:flex;flex-direction:column;gap:30px;width:100%;height:100%;padding:260px 210px 620px 80px}
.brand{align-self:flex-start;background:#172321;color:#f6faf7;padding:14px 20px;font-size:26px;font-weight:700;letter-spacing:3px;border-radius:6px}.brand span{color:#ff9820}
.panel{margin-top:auto;background:#f6faf7;padding:32px 34px 25px;border-radius:8px;display:flex;flex-direction:column;gap:18px;box-shadow:0 12px 40px #17232122}
.accent{height:7px;width:68px;background:#01a1aa;transform-origin:left}.eyebrow{font-size:24px;font-weight:700;letter-spacing:2px;line-height:1.35}
h1{margin:0;font-weight:650;line-height:1.06;letter-spacing:-2px;white-space:normal;overflow-wrap:normal;word-break:normal;font-variant-numeric:tabular-nums}
.detail{margin:0;font-size:34px;font-weight:450;line-height:1.25}.counter{font-size:20px;letter-spacing:3px;border-top:1px solid #17232133;padding-top:14px}
#scene-0 .panel{margin-top:70px;margin-bottom:auto}#scene-0 h1{font-family:Fraunces,serif;font-weight:550}#scene-5 .accent{background:#ff9820}
</style></head><body><div id="main" data-composition-id="main" data-width="1080" data-height="1920" data-start="0" data-duration="TOTAL">SCENESAUDIO</div>
<script>const slots=SLOTS;const tl=gsap.timeline({paused:true});
slots.forEach((s,i)=>{const scene='#scene-'+i;if(i){tl.fromTo(scene,{opacity:0},{opacity:1,duration:.45,ease:'sine.inOut',immediateRender:false},s.start-.45);tl.set('#scene-'+(i-1),{opacity:0},s.start)}
const at=s.start+.12;
tl.from(scene+' .brand',{x:-18,opacity:0,duration:.3,ease:'sine.out',immediateRender:true},at);
tl.from(scene+' .panel',{y:26,opacity:0,duration:.55,ease:'power3.out',immediateRender:true},at);
tl.from(scene+' .accent',{scaleX:0,duration:.5,ease:'expo.out',immediateRender:true},at+.1);
tl.from(scene+' .eyebrow',{x:-10,opacity:0,duration:.45,ease:'sine.out',immediateRender:true},at+.12);
tl.from(scene+' h1',{y:20,opacity:0,duration:.9,ease:'power3.out',immediateRender:true},at+.2);
tl.from(scene+' .detail',{y:12,opacity:0,duration:.5,ease:'power2.out',immediateRender:true},at+.32);
tl.from(scene+' .counter',{opacity:0,duration:.5,ease:'power1.out',immediateRender:true},at+.38);
});window.__timelines={main:tl};</script></body></html>'''.replace('TOTAL', f'{total:.3f}').replace('SCENES', '\n'.join(scenes)).replace('AUDIO',audio).replace('SLOTS', json.dumps(slots, ensure_ascii=False))
