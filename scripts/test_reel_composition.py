import unittest
from html.parser import HTMLParser
from reel_composition import build_composition, display_copy
from reel_elevenlabs import aligned_segments

class Headings(HTMLParser):
    def __init__(self):
        super().__init__(); self.active=False; self.text=[]; self.tags=[]
    def handle_starttag(self,tag,attrs):
        if tag=='h1': self.active=True
        elif self.active: self.tags.append(tag)
    def handle_endtag(self,tag):
        if tag=='h1': self.active=False
    def handle_data(self,data):
        if self.active: self.text.append(data)

class ReelRegressionTests(unittest.TestCase):
    def test_price_whitespace_is_one_text_node(self):
        # Inline-block per-word HTML is the real published regression.
        phrase='Desde RD$700 por noche; camping no incluye equipos'
        doc=build_composition([[phrase,'Tarifa de referencia']],[{'start':0}],32,1,None,False)
        parser=Headings(); parser.feed(doc)
        self.assertEqual(parser.text,['RD$700'])
        self.assertEqual(parser.tags,[])
        self.assertIn(phrase,doc)
        self.assertNotIn('class="word"',doc)
    def test_hook_spaces_and_html_escaping(self):
        title='Camping & playa: ¿vamos juntos?'
        parser=Headings();parser.feed(build_composition([[title,'El Valle']],[{'start':0}],32,1,None,False))
        self.assertEqual(parser.text,[title])
    def test_unknown_price_format_keeps_all_conditions(self):
        original='Cotizar según grupo; sin equipos'
        self.assertEqual(display_copy([original,'Confirmar'],2)[1:],(original,'Confirmar'))
    def test_only_narration_is_audible_when_music_disabled(self):
        class Media(HTMLParser):
            def __init__(self): super().__init__(); self.videos=[]; self.audio=[]
            def handle_starttag(self,tag,attrs):
                if tag=='video': self.videos.append(dict(attrs))
                if tag=='audio': self.audio.append(dict(attrs))
        parser=Media();parser.feed(build_composition([['Hola mundo','El Valle']],[{'start':0}],32,1,28,False))
        self.assertTrue(parser.videos)
        self.assertTrue(all('muted' in v for v in parser.videos))
        self.assertEqual([a['src'] for a in parser.audio],['assets/voice.wav'])
    def test_story_only_uses_beach_opening_for_confirmed_beach(self):
        from reel_storytelling import storytelling_segments
        camp={'name':'El Valle','location':'Samaná','tags':['Playa']}
        plan={'segments':['hook','fact','Desde RD$700, sin equipos','second','confirm','cta']}
        story=storytelling_segments(camp,plan)
        self.assertIn('mar',story[0]);self.assertEqual(story[2],plan['segments'][2])
        camp['tags']=['Montaña']
        self.assertNotIn('mar',storytelling_segments(camp,plan)[0])
    def test_alignment_preserves_accents_and_segment_boundaries(self):
        texts=['¿Vamos a Samaná?','Comenta INFO.']; chars=list(' '.join(texts))
        alignment={'characters':chars,'character_start_times_seconds':[i*.1 for i in range(len(chars))],
                   'character_end_times_seconds':[(i+1)*.1 for i in range(len(chars))]}
        result=aligned_segments(texts,alignment)
        self.assertEqual(result[1]['start'],(len(texts[0])+1)*.1)
        self.assertEqual(result[-1]['end'],len(chars)*.1)
        alignment['characters'][0]='!'
        with self.assertRaises(RuntimeError): aligned_segments(texts,alignment)

if __name__=='__main__':unittest.main()
