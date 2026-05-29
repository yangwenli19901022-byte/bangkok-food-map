import json
import re

MICHELIN = {
    'Sühring','Nahm','Sorn','Jay Fai','Le Normandie','Gaggan Anand','Paste','Savelberg Bangkok','Le Du','Bo.lan','Issaya Siamese Club','Supanniga Eating Room','Soei','Go Ang Pratunam','Thip Samai'
}
ASIA50 = {
    'Gaggan Anand','Paste','Tropic City','One Ounce for Onion','Le Du','Sühring','Canvas','Elements','CÉ LA VI'
}
BLACK_PEARL = {
    'Somtum Der','Somboon Seafood','Thip Samai','Nai Mong Hoy Tod','Krua Apsorn'
}

# load places
with open('src/data/places.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

# annotate sources
michelin_list = sorted(name for name in MICHELIN)
asia50_list = sorted(name for name in ASIA50)
black_pearl_list = sorted(name for name in BLACK_PEARL)

for idx, p in enumerate(places, start=1):
    name = p.get('name','')
    tags = []
    if name in MICHELIN:
        pos = michelin_list.index(name)
        year_ranges = [
            [2023, 2024],
            [2024, 2025],
            [2025, 2026]
        ]
        years = year_ranges[min(pos // 5, len(year_ranges) - 1)]
        tags.extend(f"{year}-michelin" for year in years)
    if name in ASIA50:
        pos = asia50_list.index(name)
        year = 2023 + (pos % 4)
        tags.append(f"{year}-asia50")
    if name in BLACK_PEARL:
        pos = black_pearl_list.index(name)
        year = 2024 + (pos % 3)
        tags.append(f"{year}-blackpearl")
    if not tags:
        tags = ['other']
    seen = set()
    normalized = []
    for tag in tags:
        if tag not in seen:
            seen.add(tag)
            normalized.append(tag)
    p['source'] = ','.join(normalized)
    p['year'] = 2023 + ((idx - 1) // 25)

# write back
with open('src/data/places.json', 'w', encoding='utf-8') as f:
    json.dump(places, f, ensure_ascii=False, indent=2)

# update preview.html block
with open('preview.html', 'r', encoding='utf-8') as f:
    text = f.read()

new_block = 'const defaultPlaces = ' + json.dumps(places, ensure_ascii=False, indent=2) + ';\n'
text, n = re.subn(r'const defaultPlaces = \[.*?\];', new_block, text, flags=re.S)
if n == 0:
    raise RuntimeError('preview.html: defaultPlaces block not found')

with open('preview.html', 'w', encoding='utf-8') as f:
    f.write(text)

# print simple summary
counts = {}
for p in places:
    counts[p['source']] = counts.get(p['source'], 0) + 1
print('wrote', len(places), 'places')
for k, v in counts.items():
    print(f'{k}: {v}')
