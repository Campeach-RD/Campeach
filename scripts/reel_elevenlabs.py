"""Paid ElevenLabs narration with character alignment and credential-free cache."""
import base64
import hashlib
import json
import os
from pathlib import Path
import subprocess
import requests

DEFAULT_VOICE = 'FGY2WhTYpPnrIDTdsKH5'  # Laura, standard multilingual voice; narration requested in Spanish.


def aligned_segments(texts, alignment):
    chars = alignment['characters']
    starts = alignment['character_start_times_seconds']
    ends = alignment['character_end_times_seconds']
    full_text = ' '.join(texts)
    if ''.join(chars) != full_text or len(chars) != len(starts) or len(chars) != len(ends):
        raise RuntimeError('Voice alignment does not match the complete script')
    result, cursor = [], 0
    for text in texts:
        if not text:
            raise ValueError('Narration segments cannot be empty')
        end = cursor + len(text)
        result.append({'text': text, 'start': starts[cursor], 'end': ends[end-1],
                       'duration': ends[end-1] - starts[cursor]})
        cursor = end + 1
    return result


def check_commercial_access():
    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key:
        raise RuntimeError('Configure ELEVENLABS_API_KEY; publication stopped')
    response = requests.get('https://api.elevenlabs.io/v1/user/subscription',
                            headers={'xi-api-key':key},timeout=30)
    if response.status_code != 200:
        raise RuntimeError(f'Cannot verify ElevenLabs account: HTTP {response.status_code}')
    if response.json().get('tier') in (None, 'free'):
        raise RuntimeError('ElevenLabs Free has no commercial voiceover license. Activate a compatible plan before publishing Campeach promotions.')
    return key


def generate_voice(texts, output):
    key = check_commercial_access()
    voice = os.environ.get('ELEVENLABS_VOICE_ID', DEFAULT_VOICE)
    payload = {'text': ' '.join(texts), 'model_id': 'eleven_multilingual_v2', 'language_code': 'es',
               'voice_settings': {'stability': .43, 'similarity_boost': .75,
                                  'style': .25, 'use_speaker_boost': True, 'speed': 1.04}}
    digest = hashlib.sha256(json.dumps([voice,payload], sort_keys=True).encode()).hexdigest()
    cache = Path(os.environ.get('CAMPEACH_VOICE_CACHE', '/tmp/campeach-voice')) / 'elevenlabs'
    cache.mkdir(parents=True, exist_ok=True)
    cached = cache / (digest + '.json')
    if cached.exists():
        data = json.loads(cached.read_text())
    else:
        headers = {'xi-api-key': key}
        response = requests.post(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps',
                                 params={'output_format':'mp3_44100_128'}, headers=headers,
                                 json=payload, timeout=120)
        if response.status_code != 200:
            # Do not log provider response bodies or request headers containing credentials.
            raise RuntimeError(f'ElevenLabs HTTP {response.status_code}; check voice access, credits and plan. Publication stopped.')
        data = response.json()
        aligned_segments(texts, data['alignment'])
        cached.write_text(json.dumps(data))
    timings = aligned_segments(texts, data['alignment'])
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    mp3 = output.with_suffix('.mp3')
    mp3.write_bytes(base64.b64decode(data['audio_base64'], validate=True))
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(mp3),'-ar','48000','-ac','1',str(output)], check=True)
    output.with_suffix('.json').write_text(json.dumps(timings, ensure_ascii=False))
    return timings


if __name__ == '__main__':
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument('--preflight',action='store_true',required=True)
    parser.parse_args()
    check_commercial_access()
    print('ElevenLabs narration access verified')
