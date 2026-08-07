import argparse
import asyncio
import json
import os
import random
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

import edge_tts
import requests
from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account

ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "worker" / "catalog.generated.json"
HISTORY_PATH = ROOT / "automation" / "reel-history.json"
WORK_DIR = ROOT / "automation" / "work"
REELS_DIR = ROOT / "public" / "reels"
PRIORITY = ["el-valle", "ocoa", "bonao", "santiago", "villa-altagracia", "monsenor", "jarabacoa", "hato-mayor"]
FOLDERS = {
    "el-valle": "1MxEuhPn_xT4q5C83Wr_y38v3EJcMf6DN",
    "ocoa": "1ryIJvw-N6qZWXXDqMI5K4Z6_6_9B1oap",
    "bonao": "1qCeYOLNWdsNMVytow_tEBC3iiSaWktkV",
    "santiago": "1dNr9CiGktTvu0qGhdRgrR4tggbOS_8eg",
    "villa-altagracia": "1Sj0DrXzfZBrkIEDOYaYXNub6Dxc6oRWY",
    "monsenor": "1bJfkVd1G9odkm7Yr1HTREV19b0PQBRns",
    "jarabacoa": "1YXKJG5a2ZTJypNdlX2HYsEHBsQAFsZGQ",
    "hato-mayor": "1FOJipb6kI_BfCAqqjEKGz6f3kqOGPo7Q",
}


def run(*args):
    subprocess.run([str(item) for item in args], check=True)


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def choose_camp(requested, history):
    if requested:
        if requested not in PRIORITY:
            raise ValueError(f"Campamento no permitido: {requested}")
        return requested
    last = history[-1]["campId"] if history else None
    start = datetime.now(timezone.utc).toordinal() % len(PRIORITY)
    ordered = PRIORITY[start:] + PRIORITY[:start]
    return next(camp for camp in ordered if camp != last)


def drive_session():
    raw = os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"]
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(raw), scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    return AuthorizedSession(credentials)


def list_videos(session, root_folder):
    videos = []
    queue = [(root_folder, 0)]
    while queue:
        folder_id, depth = queue.pop(0)
        params = {
            "q": f"'{folder_id}' in parents and trashed = false",
            "pageSize": 1000,
            "fields": "files(id,name,mimeType,size)",
            "supportsAllDrives": "true",
            "includeItemsFromAllDrives": "true",
        }
        response = session.get("https://www.googleapis.com/drive/v3/files", params=params, timeout=60)
        response.raise_for_status()
        for item in response.json().get("files", []):
            mime = item.get("mimeType", "")
            if mime.startswith("video/") and int(item.get("size", 0)) <= 500_000_000:
                videos.append(item)
            elif mime == "application/vnd.google-apps.folder" and depth < 3:
                queue.append((item["id"], depth + 1))
    return videos


def select_videos(videos, history, camp_id):
    recently_used = {
        file_id for entry in history[-20:] if entry.get("campId") == camp_id for file_id in entry.get("files", [])
    }
    fresh = [item for item in videos if item["id"] not in recently_used]
    candidates = fresh if len(fresh) >= 4 else videos
    if len(candidates) < 4:
        raise RuntimeError(f"No hay cuatro videos disponibles para {camp_id}")
    seed = int(datetime.now(timezone.utc).strftime("%Y%m%d"))
    random.Random(seed).shuffle(candidates)
    return candidates[:12]


def is_vertical_source(path):
    data = json.loads(subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:stream_side_data=rotation", "-of", "json", path],
        check=True, capture_output=True, text=True,
    ).stdout)
    stream = data["streams"][0]
    rotations = [abs(int(item.get("rotation", 0))) for item in stream.get("side_data_list", [])]
    return stream["height"] > stream["width"] or any(rotation in (90, 270) for rotation in rotations)


def download_videos(session, selected):
    paths = []
    used = []
    for item in selected:
        index = len(paths)
        suffix = Path(item["name"]).suffix or ".mp4"
        path = WORK_DIR / f"source-{index}{suffix}"
        with session.get(
            f"https://www.googleapis.com/drive/v3/files/{item['id']}?alt=media",
            stream=True,
            timeout=300,
        ) as response:
            response.raise_for_status()
            with path.open("wb") as output:
                for chunk in response.iter_content(1024 * 1024):
                    if chunk:
                        output.write(chunk)
        if is_vertical_source(path):
            paths.append(path)
            used.append(item)
            if len(paths) == 4:
                break
        else:
            path.unlink(missing_ok=True)
    if len(paths) < 4:
        raise RuntimeError("No hay cuatro videos verticales utilizables")
    return paths, used


def duration(path):
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", path],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def ass_time(seconds):
    centiseconds = round(seconds * 100)
    return f"{centiseconds // 360000}:{(centiseconds // 6000) % 60:02}:{(centiseconds // 100) % 60:02}.{centiseconds % 100:02}"


def safe_text(value):
    return str(value).upper().replace("Á", "A").replace("É", "E").replace("Í", "I").replace("Ó", "O").replace("Ú", "U").replace("Ñ", "N")


def build_ass(camp, path):
    highlights = [safe_text(item) for item in camp.get("highlights", [])[:2]]
    while len(highlights) < 2:
        highlights.append("NATURALEZA Y AVENTURA")
    events = [
        (0.1, 2.4, "Hook", f"DESCUBRE {safe_text(camp['name'])}"),
        (2.5, 6.2, "Big", safe_text(camp["location"])),
        (6.3, 10.0, "Info", highlights[0]),
        (10.1, 14.0, "Big", safe_text(camp["priceNote"])),
        (14.1, 18.0, "Info", highlights[1]),
        (18.1, 24.0, "CTA", "COMENTA INFO\\NY RECIBE EL PDF"),
    ]
    lines = [
        "[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "ScaledBorderAndShadow: yes", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        "Style: Hook,Impact,92,&H00CC00FF,&H00FFFFFF,&H00101614,&HAA000000,-1,0,0,0,100,100,0,0,1,8,3,7,58,58,110,1",
        "Style: Big,Impact,80,&H00FFFFFF,&H000AF1FF,&H00101614,&HAA000000,-1,0,0,0,100,100,0,0,1,8,3,7,58,58,110,1",
        "Style: Info,Arial Black,58,&H00FFFFFF,&H000AF1FF,&H00101614,&HAA000000,-1,0,0,0,100,100,0,0,1,6,2,7,58,58,110,1",
        "Style: CTA,Impact,86,&H00CC00FF,&H00FFFFFF,&H00101614,&HAA000000,-1,0,0,0,100,100,0,0,1,8,3,7,58,58,110,1",
        "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]
    positions = [340, 1450, 360, 1450, 360, 1420]
    for (start, end, style, text), y in zip(events, positions):
        lines.append(f"Dialogue: 0,{ass_time(start)},{ass_time(end)},{style},,0,0,0,,{{\\fad(80,120)\\pos(70,{y})}}{text}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


async def create_voice(camp, path):
    highlight = camp.get("highlights", ["naturaleza y aventura"])[0]
    text = (
        f"¿Buscas una escapada diferente? Conoce {camp['name']}, en {camp['location']}. "
        f"{highlight}. {camp['priceNote']}. Confirma siempre disponibilidad y tarifa final antes de reservar. "
        "Comenta INFO y recibe el PDF con todos los detalles."
    )
    await edge_tts.Communicate(text, "es-DO-RamonaNeural", rate="+8%").save(str(path))


def render(paths, camp, output):
    ass = WORK_DIR / "overlay.ass"
    voice = WORK_DIR / "voice.mp3"
    audio = WORK_DIR / "audio.m4a"
    build_ass(camp, ass)
    asyncio.run(create_voice(camp, voice))
    run(
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "lavfi", "-t", "24", "-i", "anoisesrc=color=pink:amplitude=0.15",
        "-f", "lavfi", "-t", "24", "-i", "sine=frequency=196:sample_rate=48000",
        "-i", voice,
        "-filter_complex", "[0:a]lowpass=f=900,volume=0.07[a0];[1:a]volume=0.02,tremolo=f=3:d=0.18[a1];[2:a]adelay=180|180,volume=1.2,highpass=f=90,lowpass=f=8500[v];[a0][a1][v]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.94[a]",
        "-map", "[a]", "-c:a", "aac", "-b:a", "160k", audio,
    )
    inputs = []
    filters = []
    for index, path in enumerate(paths):
        start = max(0.0, min(1.0 + index, duration(path) - 6.1))
        inputs.extend(["-ss", str(start), "-t", "6", "-i", str(path)])
        filters.append(
            f"[{index}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,"
            f"eq=contrast=1.07:saturation=1.12:brightness=0.01,unsharp=5:5:0.45:3:3:0.2,format=yuv420p[v{index}]"
        )
    ass_path = str(ass).replace("\\", "/").replace(":", "\\:")
    filters.append("".join(f"[v{i}]" for i in range(4)) + f"concat=n=4:v=1:a=0,subtitles='{ass_path}'[v]")
    run(
        "ffmpeg", "-y", "-loglevel", "error", *inputs, "-i", audio,
        "-filter_complex", ";".join(filters), "-map", "[v]", "-map", "4:a:0",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-maxrate", "8M", "-bufsize", "16M", "-profile:v", "high", "-level", "4.1",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-shortest", output,
    )


def validate(path):
    data = json.loads(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration", "-of", "json", path],
        check=True, capture_output=True, text=True,
    ).stdout)
    video = next(stream for stream in data["streams"] if stream["codec_type"] == "video")
    audio = next((stream for stream in data["streams"] if stream["codec_type"] == "audio"), None)
    seconds = float(data["format"]["duration"])
    if video.get("width") != 1080 or video.get("height") != 1920 or not audio or not 15 <= seconds <= 35 or path.stat().st_size >= 95_000_000:
        raise RuntimeError(f"Validación fallida: {data}")
    return seconds


def caption(camp):
    highlights = "\n".join(f"• {item}" for item in camp.get("highlights", [])[:3])
    return (
        f"🏕️ {camp['name']}\n📍 {camp['location']}\n💰 {camp['priceNote']}\n\n{highlights}\n\n"
        "Comenta INFO y te enviamos por DM todos los detalles y el PDF del campamento.\n\n"
        f"#CampeachRD #CampingRD #{camp['id'].replace('-', '')} #RepublicaDominicana"
    )


def wait_for_public_url(url):
    for _ in range(60):
        response = requests.head(url, timeout=20)
        if response.status_code == 200 and response.headers.get("content-type", "").startswith("video/mp4"):
            return
        time.sleep(10)
    raise RuntimeError("El video no apareció en GitHub Pages")


def publish(url, camp, key):
    response = requests.post(
        os.environ.get("CAMPEACH_WORKER_URL", "https://campeach-instagram.nomanychat.workers.dev") + "/instagram/admin/publish-reel",
        headers={"Authorization": f"Bearer {os.environ['CAMPEACH_ADMIN_API_TOKEN']}"},
        json={
            "videoUrl": url,
            "caption": caption(camp),
            "campId": camp["id"],
            "campName": camp["name"],
            "pdfUrl": camp["pdfUrl"],
            "idempotencyKey": key,
        },
        timeout=360,
    )
    response.raise_for_status()
    return response.json()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--camp", default="")
    parser.add_argument("--render-only", action="store_true")
    args = parser.parse_args()
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    REELS_DIR.mkdir(parents=True, exist_ok=True)
    history = load_json(HISTORY_PATH)
    catalog = load_json(CATALOG_PATH)
    camp_id = choose_camp(args.camp, history)
    camp = next(item for item in catalog["camps"] if item["id"] == camp_id)
    session = drive_session()
    candidates = select_videos(list_videos(session, FOLDERS[camp_id]), history, camp_id)
    paths, selected = download_videos(session, candidates)
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    filename = f"{date}-{camp_id}.mp4"
    output = REELS_DIR / filename
    render(paths, camp, output)
    seconds = validate(output)
    result = {
        "date": datetime.now(timezone.utc).isoformat(),
        "campId": camp_id,
        "campName": camp["name"],
        "files": [item["id"] for item in selected],
        "fileNames": [item["name"] for item in selected],
        "duration": seconds,
        "output": str(output.relative_to(ROOT)).replace("\\", "/"),
        "caption": caption(camp),
        "pdfUrl": camp["pdfUrl"],
        "idempotencyKey": f"reel:{date}:{camp_id}",
    }
    save_json(WORK_DIR / "result.json", result)
    print(json.dumps(result, ensure_ascii=True))


if __name__ == "__main__":
    main()
