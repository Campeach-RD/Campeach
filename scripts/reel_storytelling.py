"""Short, catalog-grounded narration for the six reel scenes."""

def storytelling_segments(camp, plan, compact=False):
    # Preserve editorial scene order, including budget and checklist variants.
    # Each price/condition and access fact comes from the existing content plan.
    location = camp['location']
    name = camp['name']
    beach = any('playa' in str(t).lower() for t in camp.get('tags', []))
    opening = ('Imagínate cambiar el ruido de la ciudad por una noche cerca del mar.'
               if beach else 'Imagínate dejar atrás la rutina y cambiar de ambiente por una noche.')
    texts = list(plan['segments'])
    texts[0] = opening + f' Tu próxima escapada puede ser en {name}.'
    texts[4] = 'Antes de salir, confirma la tarifa final, las condiciones y la disponibilidad.'
    texts[5] = '¿Te ves aquí? Comenta INFO y te enviamos la ficha del campamento por mensaje directo.'
    if compact:
        texts[0] = f'¿Te imaginas tu próxima escapada de camping en {location}?'
        texts[4] = 'Confirma tarifa final, condiciones y disponibilidad.'
        texts[5] = 'Comenta INFO y te enviamos la ficha por mensaje directo.'
    return texts
