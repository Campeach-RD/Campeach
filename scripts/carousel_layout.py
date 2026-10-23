"""Measured text panels using the existing Campeach reel-cover palette."""
from pathlib import Path
from PIL import ImageDraw, ImageFont


def add_editorial_copy(image, title, detail, index):
    font_path = next((p for p in (
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') if Path(p).exists()), None)
    if not font_path:
        raise RuntimeError('Falta fuente para el texto editorial del carrusel')
    draw = ImageDraw.Draw(image)

    def wrap(text, font):
        lines, line = [], ''
        for word in text.split():
            if draw.textlength(word, font=font) > 880:
                raise RuntimeError('Una palabra del catálogo excede el ancho disponible')
            candidate = f'{line} {word}'.strip()
            if draw.textlength(candidate, font=font) > 880 and line:
                lines.append(line)
                line = word
            else:
                line = candidate
        return '\n'.join(lines + [line])

    for size in range(64, 35, -2):
        title_font = ImageFont.truetype(font_path, size)
        detail_font = ImageFont.truetype(font_path, 34)
        title_text, detail_text = wrap(title, title_font), wrap(detail, detail_font)
        title_height = draw.multiline_textbbox((0, 0), title_text, font=title_font, spacing=10)[3]
        detail_height = draw.multiline_textbbox((0, 0), detail_text, font=detail_font, spacing=8)[3]
        panel_height = 125 + title_height + detail_height
        if panel_height <= 610:
            break
    else:
        raise RuntimeError('El texto del catálogo no cabe en el carrusel')
    top = 1270 - panel_height
    draw.rectangle((55, top, 1025, 1270), fill='#f6faf7')
    draw.rectangle((55, top, 1025, top + 12), fill='#01a1aa')
    draw.text((95, top + 30), f'CAMPEACH RD  ·  {index}/6',
              font=ImageFont.truetype(font_path, 26), fill='#172321')
    draw.multiline_text((95, top + 78), title_text, font=title_font, spacing=10, fill='#172321')
    draw.multiline_text((95, top + 98 + title_height), detail_text,
                       font=detail_font, spacing=8, fill='#172321')
    return image
