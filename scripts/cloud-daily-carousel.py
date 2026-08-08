import argparse
import json
import os
import random
from datetime import datetime, timezone
from pathlib import Path

from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account
from PIL import Image, ImageOps, UnidentifiedImageError

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / "automation" / "work"
OUTPUT = ROOT / "public" / "carousels"
HISTORY = ROOT / "automation" / "carousel-history.json"
PRIORITY = ["el-valle", "ocoa", "bonao", "santiago", "villa-altagracia", "monsenor", "jarabacoa", "hato-mayor"]
FOLDERS = {
    "el-valle": "1MxEuhPn_xT4q5C83Wr_y38v3EJcMf6DN", "ocoa": "1ryIJvw-N6qZWXXDqMI5K4Z6_6_9B1oap",
    "bonao": "1qCeYOLNWdsNMVytow_tEBC3iiSaWktkV", "santiago": "1dNr9CiGktTvu0qGhdRgrR4tggbOS_8eg",
    "villa-altagracia": "1Sj0DrXzfZBrkIEDOYaYXNub6Dxc6oRWY", "monsenor": "1bJfkVd1G9odkm7Yr1HTREV19b0PQBRns",
    "jarabacoa": "1YXKJG5a2ZTJypNdlX2HYsEHBsQAFsZGQ", "hato-mayor": "1FOJipb6kI_BfCAqqjEKGz6f3kqOGPo7Q",
}

def read_json(path, fallback):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else fallback

def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

def session():
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(os.environ["GOOGLE_SERVICE_ACCOUNT_JSON"]),
        scopes=["https://www.googleapis.com/auth/drive.readonly"],
    )
    return AuthorizedSession(credentials)

def list_images(client, root_folder):
    images, queue = [], [(root_folder, 0)]
    while queue:
        folder, depth = queue.pop(0)
        response = client.get("https://www.googleapis.com/drive/v3/files", params={
            "q": f"'{folder}' in parents and trashed = false", "pageSize": 1000,
            "fields": "files(id,name,mimeType)", "supportsAllDrives": "true", "includeItemsFromAllDrives": "true",
        }, timeout=60)
        response.raise_for_status()
        for item in response.json().get("files", []):
            if item.get("mimeType", "").startswith("image/"):
                images.append(item)
            elif item.get("mimeType") == "application/vnd.google-apps.folder" and depth < 3:
                queue.append((item["id"], depth + 1))
    return images

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--camp", default="")
    args = parser.parse_args()
    history = read_json(HISTORY, [])
    last = history[-1]["campId"] if history else None
    if args.camp:
        camp = args.camp
    else:
        ordered = PRIORITY[datetime.now(timezone.utc).toordinal() % len(PRIORITY):] + PRIORITY[:datetime.now(timezone.utc).toordinal() % len(PRIORITY)]
        camp = next(item for item in ordered if item != last)
    if camp not in PRIORITY:
        raise ValueError(f"Campamento no permitido: {camp}")
    client = session()
    images = list_images(client, FOLDERS[camp])
    recently_used = {file_id for entry in history[-20:] if entry.get("campId") == camp for file_id in entry.get("files", [])}
    fresh = [item for item in images if item["id"] not in recently_used]
    candidates = fresh if len(fresh) >= 6 else images
    if len(candidates) < 4:
        raise RuntimeError(f"No hay suficientes fotos para {camp}")
    random.Random(int(datetime.now(timezone.utc).strftime("%Y%m%d"))).shuffle(candidates)
    selected = candidates
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    outputs = []
    WORK.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    used = []
    for item in selected:
        if len(outputs) == 6:
            break
        index = len(outputs) + 1
        source = WORK / f"carousel-source-{index}"
        try:
            response = client.get(f"https://www.googleapis.com/drive/v3/files/{item['id']}?alt=media", timeout=180)
            response.raise_for_status()
            source.write_bytes(response.content)
            output = OUTPUT / f"{stamp}-{camp}-{index:02}.jpg"
            with Image.open(source) as image:
                image.load()
                image = ImageOps.exif_transpose(image).convert("RGB")
                ImageOps.fit(image, (1080, 1350), method=Image.Resampling.LANCZOS).save(output, "JPEG", quality=90, optimize=True)
            outputs.append(str(output.relative_to(ROOT)).replace("\\", "/"))
            used.append(item)
        except (UnidentifiedImageError, OSError, ValueError) as error:
            print(f"Se omite imagen incompatible {item['id']}: {type(error).__name__}")
            source.unlink(missing_ok=True)
    if len(outputs) < 4:
        raise RuntimeError(f"No hay cuatro fotos válidas para {camp}")
    entry = {"date": stamp, "campId": camp, "files": [item["id"] for item in used], "outputs": outputs}
    if not any(item.get("date") == stamp for item in history):
        history.append(entry)
    write_json(HISTORY, history)
    write_json(WORK / "carousel-result.json", entry)

if __name__ == "__main__":
    main()
