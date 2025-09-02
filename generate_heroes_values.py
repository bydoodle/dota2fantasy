import requests
import json
import time

filename = 'heroes.json'

with open(filename, "r", encoding="utf-8") as f:
    heroes_data = json.load(f)

for hero_id, hero in heroes_data.items():
    hero['isgreen'] = False
    hero["isblue"] = False
    hero["isred"] = False
    hero["isundead"] = False
    hero["ishorns"] = False
    hero["isbearded"] = False
    hero["isaquatic"] = False

with open(filename, "w", encoding="utf-8") as f:
    json.dump(heroes_data, f, ensure_ascii=False, indent=4)