"""The approved official Mexican Chatterbox voice, executed on a free CPU runner.

Pinned source and weights match the installed/approved local voice. No Edge fallback,
no paid API, and no use of the public demo's 300-character truncation.
"""
import argparse
import json
import os
import sys
from pathlib import Path
import requests

SPACE = 'ResembleAI/Chatterbox-Multilingual-TTS-es-mx-latam'
SPACE_REV = '0d2648c4c1637eccfa8d45c7e192a0ad8d5b1fca'
MX_REV = '27e595bf2fe7be0533ca299d9afafcde08b7cca7'
BASE_REV = '5bb1f6ee58e50c3b8d408bc82a6d3740c2db6e18'
REFERENCE = 'https://storage.googleapis.com/chatterbox-demo-samples/mtl-v3-single-language-prompts/es-latam/es_mx_f1.wav'

def prepare(cache):
    from huggingface_hub import snapshot_download, hf_hub_download
    source = snapshot_download(SPACE, repo_type='space', revision=SPACE_REV,
                               allow_patterns=['chatterbox/**'], cache_dir=str(cache/'hub'))
    model = cache/'approved-model'; model.mkdir(parents=True, exist_ok=True)
    for repo, rev, filename in [
        ('ResembleAI/Chatterbox-Multilingual-es-mx-latam', MX_REV, 't3_es_mx_latam.safetensors'),
        *[('ResembleAI/chatterbox', BASE_REV, name) for name in
          ['s3gen.pt', 've.pt', 'grapheme_mtl_merged_expanded_v1.json']],
    ]:
        downloaded = Path(hf_hub_download(repo, filename, revision=rev, cache_dir=str(cache/'hub')))
        dest = model/filename
        if not dest.exists(): dest.symlink_to(downloaded.resolve())
    reference = model/'es_mx_f1.wav'
    if not reference.exists():
        response = requests.get(REFERENCE, timeout=120); response.raise_for_status()
        reference.write_bytes(response.content)
    return Path(source)/'chatterbox'/'src', model, reference

def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--segments', required=True)
    parser.add_argument('--output', required=True); args=parser.parse_args()
    cache=Path(os.environ.get('CAMPEACH_VOICE_CACHE', str(Path.home()/'.cache/campeach-voice')))
    source, model_dir, reference=prepare(cache)
    sys.path.insert(0,str(source))
    import torch
    import torchaudio
    from chatterbox.tts import ChatterboxTTS
    torch.set_num_threads(4)
    model=ChatterboxTTS.from_local(str(model_dir),device='cpu',
          t3_filename='t3_es_mx_latam.safetensors',s3gen_filename='s3gen.pt')
    model.prepare_conditionals(str(reference),exaggeration=0.72)
    segments=json.loads(Path(args.segments).read_text(encoding='utf-8'))
    chunks=[]; timings=[]; cursor=0.0
    for index,text in enumerate(segments):
        if not text or len(text)>300: raise RuntimeError('Unsplit or empty narration segment')
        torch.manual_seed(126+index)
        with torch.inference_mode():
            wave=model.generate(text,language_id='es',exaggeration=0.72,cfg_weight=0.38)
        wave=wave.detach().cpu()
        seconds=wave.shape[-1]/model.sr
        if seconds<=0.5 or seconds>20: raise RuntimeError('Invalid voice segment duration')
        timings.append({'text':text,'start':cursor,'duration':seconds})
        chunks.extend([wave,torch.zeros((wave.shape[0],int(model.sr*0.12)))])
        cursor+=seconds+0.12
        print(f'Voice segment {index+1}/{len(segments)}: {seconds:.2f}s',flush=True)
    output=Path(args.output); output.parent.mkdir(parents=True,exist_ok=True)
    torchaudio.save(str(output),torch.cat(chunks,dim=-1),model.sr)
    output.with_suffix('.json').write_text(json.dumps(timings,ensure_ascii=False),encoding='utf-8')

if __name__=='__main__': main()
