import json
import unittest
from datetime import date, timedelta
from pathlib import Path
from PIL import Image
from content_strategy import content_plan, camp_order
from carousel_layout import add_editorial_copy


class EditorialPlanTests(unittest.TestCase):
    def test_catalog_destinations_rotate_and_keep_catalog_prices(self):
        catalog = json.loads((Path(__file__).resolve().parents[1] / 'worker/catalog.generated.json').read_text())
        for camp in catalog['camps']:
            history = []
            for offset in range(8):
                plan = content_plan(camp, history, date(2026, 10, 23) + timedelta(days=offset))
                with self.subTest(camp=camp['id'], offset=offset):
                    self.assertEqual(len(plan['segments']), 6)
                    self.assertEqual(len(plan['titles']), 6)
                    self.assertIn(camp['priceNote'], plan['caption'])
                    self.assertTrue(any(camp['priceNote'] in text for text in plan['segments']))
                    self.assertLessEqual(len(plan['caption']), 2200)
                    self.assertEqual(plan['caption'].count('Comenta INFO'), 1)
                    self.assertNotIn('WhatsApp', plan['caption'])
                    if history:
                        self.assertNotEqual(plan['contentAngle'], history[-1]['contentAngle'])
                    if offset < 4:
                        for i, (title, detail) in enumerate(plan['titles'], 1):
                            add_editorial_copy(Image.new('RGB', (1080, 1350)), title, detail, i)
                history.append({'campId': camp['id'], 'contentAngle': plan['contentAngle']})

    def test_priorities_and_no_consecutive_destination(self):
        priority = ['ocoa', 'el-valle', 'bonao', 'santiago']
        self.assertEqual(camp_order(priority, [], date(2026, 10, 26))[0], 'ocoa')
        self.assertEqual(camp_order(priority, [], date(2026, 10, 30))[0], 'el-valle')
        self.assertNotEqual(camp_order(priority, [{'campId': 'ocoa'}], date(2026, 10, 26))[0], 'ocoa')


if __name__ == '__main__':
    unittest.main()
