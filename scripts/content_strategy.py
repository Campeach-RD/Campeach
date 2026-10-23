"""Catalog-backed editorial plans shared by the reel and carousel pipelines."""
from datetime import datetime
from zoneinfo import ZoneInfo

ANGLES = ("budget", "experience", "access", "checklist")


def local_day():
    return datetime.now(ZoneInfo("America/Santo_Domingo")).date()


def camp_order(priority, history, day=None):
    day = day or local_day()
    # Keep proven destinations in the mix without excluding discovery.
    if day.weekday() in (0, 1, 4):
        preferred = "el-valle" if day.weekday() in (1, 4) else "ocoa"
    else:
        others = [c for c in priority if c not in ("ocoa", "el-valle")] or priority
        preferred = others[day.toordinal() % len(others)]
    last = history[-1].get("campId") if history else None
    start = day.toordinal() % len(priority)
    ordered = list(dict.fromkeys([preferred] + priority[start:] + priority[:start]))
    return [c for c in ordered if c in priority and c != last] + ([last] if last in priority else [])


def content_plan(camp, history=(), day=None):
    day = day or local_day()
    previous = [r.get("contentAngle") for r in history
                if str(r.get("campId", "")).replace("ñ", "n") == camp["id"].replace("ñ", "n")]
    highlights = list(dict.fromkeys(camp.get("highlights", [])))
    first = highlights[0] if highlights else "Camping en la naturaleza"
    second = highlights[1] if len(highlights) > 1 else camp["location"]
    access = next((h for h in highlights if "4x4" in h.lower()), None)
    eligible = [a for a in ANGLES if a != "access" or access]
    unused = [a for a in eligible if a not in previous[-3:]]
    angle = unused[0] if unused else next(a for a in eligible if a != previous[-1])
    name, price = camp["name"], camp["priceNote"]
    hooks = {
        "budget": f"Camping en {name}: ¿cuánto cuesta?",
        "experience": f"Así es acampar en {name}.",
        "access": f"Camping en {name}: ¿necesitas 4x4?",
        "checklist": f"Antes de acampar en {name}, mira esto.",
    }
    detail = access if angle == "access" else first
    cta = "Comenta INFO y te enviamos la ficha de este campamento por DM."
    segments = [hooks[angle], f"En {camp['location']}: {detail.lower()}.",
                f"La tarifa de referencia es {price.lower()}.",
                f"También encontrarás: {second.lower()}.",
                "La tarifa final, las condiciones y la disponibilidad requieren confirmación.", cta]
    titles = [[hooks[angle], camp["location"]], [name, detail],
              [price, "Tarifa de referencia"], [second, name],
              ["ANTES DE RESERVAR", "Disponibilidad y condiciones por confirmar"],
              ["COMENTA INFO", "Recibe la ficha por DM"]]
    if angle == 'budget':
        segments[1], segments[2] = segments[2], segments[1]
        titles[1], titles[2] = titles[2], titles[1]
    elif angle == 'checklist':
        facts = [h for h in highlights if any(word in h.lower() for word in ('restaurante', '4x4', 'incluye'))]
        fact = facts[0] if facts else first
        segments[1] = f'En {name}, ten presente: {fact.lower()}.'
        titles[1] = ['PLANIFICA TU VISITA', fact]
    caption = (f"🏕️ {hooks[angle]}\n📍 {camp['location']}\n💰 {price}\n\n"
               f"• {detail}\n• {second}\n\n"
               f"Tarifa final, condiciones y disponibilidad por confirmar.\n{cta}\n\n"
               "#CampeachRD #CampingRD #RepublicaDominicana")
    return {"contentAngle": angle, "hook": hooks[angle], "segments": segments,
            "titles": titles, "caption": caption, "strategyVersion": "2026-10-23"}
