import requests
import json
import time
from dotenv import load_dotenv
import cloudscraper
import os

PLAYERS_LIST = {
# Team Liquid
    'Insania ': {
        'pos': 2
    },
    'm1CKe': {
        'pos': 0
    },
    'Nisha': {
        'pos': 1
    },
    'Saberlight': {
        'pos': 0
    },
    'Boxi': {
        'pos': 2
    },
# PARIVISION
    'Satanic': {
        'pos': 0
    },
    'No[o]ne-': {
        'pos': 1
    },
    'DM': {
        'pos': 0
    },
    '9Class': {
        'pos': 2
    },
    'Dukalis': {
        'pos': 2
    },
# BetBoom Team
    'Pure': {
        'pos': 0
    },
    'gpk~': {
        'pos': 1
    },
    'MieRo': {
        'pos': 0
    },
    'Save-': {
        'pos': 2
    },
    'Kataomi`': {
        'pos': 2
    },
# Team Tidebound
    'shiro': {
        'pos': 0
    },
    'NothingToSay': {
        'pos': 1
    },
    'Bach': {
        'pos': 0
    },
    'planet': {
        'pos': 2
    },
    'y`': {
        'pos': 2
    },
# Team Spirit
    'Yatoro': {
        'pos': 0
    },
    'Miposhka': {
        'pos': 2
    },
    'Collapse': {
        'pos': 0
    },
    'rue': {
        'pos': 2
    },
    'Larl': {
        'pos': 1
    },
# Team Falcons
    'skiter': {
        'pos': 0
    },
    'Malr1ne': {
        'pos': 1
    },
    'AMMAR_THE_F': {
        'pos': 0
    },
    'Cr1t-': {
        'pos': 2
    },
    'Sneyking': {
        'pos': 2
    },
# Tundra Esports
    'Crystallis': {
        'pos': 0
    },
    'bzm': {
        'pos': 1
    },
    '33': {
        'pos': 0
    },
    'Saksa': {
        'pos': 2
    },
    # 'Whitemon': {
    #     'pos': 2
    # },
# Natus Vincere
    'gotthejuice': {
        'pos': 0
    },
    'Niku': {
        'pos': 1
    },
    'pma': {
        'pos': 0
    },
    'KG_Zayac': {
        'pos': 2
    },
    'Riddys': {
        'pos': 2
    },
# Nigma Galaxy
    'OmaR': {
        'pos': 2
    },
    'GH': {
        'pos': 2
    },
    'No!ob™': {
        'pos': 0
    },
    'SumaiL-': {
        'pos': 1
    },
    'Ghost': {
        'pos': 0
    },
# Aurora Gaming
    'Nightfall': {
        'pos': 0
    },
    'kiyotaka': {
        'pos': 1
    },
    'TORONTOTOKYO': {
        'pos': 0
    },
    'Mira': {
        'pos': 2
    },
    'panto': {
        'pos': 2
    },
# Xtreme Gaming
    'Ame': {
        'pos': 0
    },
    'Xm': {
        'pos': 1
    },
    'Xxs': {
        'pos': 0
    },
    'XinQ': {
        'pos': 2
    },
    'xNova': {
        'pos': 2
    },
# Team Nemesis

# Wildcard
    'Yamsun': {
        'pos': 0
    },
    'RCY': {
        'pos': 1
    },
    'Fayde': {
        'pos': 0
    },
    'Bignum': {
        'pos': 2
    },
    'Speeed': {
        'pos': 2
    },
# Heroic
    'Yuma': {
        'pos': 0
    },
    '4nalog丶01': {
        'pos': 1
    },
    'Wisper': {
        'pos': 0
    },
    'Scofield': {
        'pos': 2
    },
    'KingJungles': {
        'pos': 2
    },
# BOOM Esports
    'Jaunuel': {
        'pos': 2
    },
    'TIMS': {
        'pos': 2
    },
    'Jabz': {
        'pos': 0
    },
    'Armel': {
        'pos': 1
    },
    'JACKBOYS': {
        'pos': 0
    },
# # Yakult Brothers
    'flyfly': {
        'pos': 0
    },
    'Beyond': {
        'pos': 0
    },
    'BoBoKa': {
        'pos': 2
    },
    'Oli~': {
        'pos': 2
    },
    'Emo': {
        'pos': 1
    }
}

load_dotenv()
API_TOKEN = os.getenv("STRATZ_TOKEN")

stratzUrl = "https://api.stratz.com/graphql"
scraper = cloudscraper.create_scraper()

with open("leagues.json", "r", encoding="utf-8") as f:
    leagues_data = json.load(f)

with open("heroes.json", "r", encoding="utf-8") as f:
    heroes_data = json.load(f)

try:
    with open('players_stat.json', 'r', encoding='utf-8') as f:
        player_stat = json.load(f)
except FileNotFoundError:
    player_stat = {}

leagues_ids = list(map(int, leagues_data.keys()))

for league_id in leagues_ids:
    matches = requests.get(f"https://api.opendota.com/api/leagues/{league_id}/matches").json()
    time.sleep(1.2)

    for match in matches:
        match_id = match['match_id']
        match_r = requests.get(f"https://api.opendota.com/api/matches/{match_id}").json()
        stratzAPI = scraper.post(
            stratzUrl,
            json = {"query": """{
                match(id: MATCH_ID) {
                    players {
                    heroId
                    dotaPlus {
                        level
                    }
                    }
                }
                }""".replace("MATCH_ID", str(match['match_id']))},
            headers = {"Authorization": f"Bearer {API_TOKEN}"}
        )
        playersDotaPlusArr = {p["heroId"]: p["dotaPlus"]["level"] if p["dotaPlus"] else 0 for p in stratzAPI.json()["data"]["match"]["players"]}
        time.sleep(1.2)
        
        max_retries = 3
        for attempt in range(max_retries):
            if "players" in match_r:
                break
            else:
                print(f"Не удалось получить данные {match} (попытка {attempt + 1})")
                if attempt < max_retries - 1:
                    time.sleep(3)
                    match_r = requests.get(f"https://api.opendota.com/api/matches/{match}").json()
        else:
            print(f"Не удалось получить данные о матче {match} после {max_retries} попыток")
            continue

        for player in match_r['players']:
            if player['name'] in PLAYERS_LIST:
                if player['name'] not in player_stat:
                    player_stat[player['name']] = {
                        "stats": {},
                        "titles": {
                            "str": 0,
                            "agi": 0,
                            "int": 0,
                            "all": 0,
                            "green": 0,
                            "blue": 0,
                            "red": 0,
                            "undead": 0,
                            "horns": 0,
                            "bearded": 0,
                            "aquatic": 0,
                            "first_pick": 0,
                            "last_pick": 0,
                            "games_with_arcana": 0,
                            "games_with_hero_master": 0
                        },
                        "general": {
                            "team_logo": match_r['radiant_team']['logo_url'] if player['isRadiant'] else match_r['dire_team']['logo_url'],
                            "pos": PLAYERS_LIST[player['name']]['pos'],
                        },
                        "leagues": []
                    }

                    if PLAYERS_LIST[player['name']]['pos'] in (0, 1):
                        player_stat[player['name']]['stats']['red'] = {
                            "kills": [player['kills']],
                            "deaths": [player['deaths']],
                            "creep_score": [player['last_hits'] + player['denies']],
                            "gpm": [player['gold_per_min']],
                            "madstone_collected": [player.get('item_uses', {}).get('madstone_bundle', 0)],
                            "tower_kills": [player['towers_killed']],
                        }
                    if PLAYERS_LIST[player['name']]['pos'] in (1, 2):
                        player_stat[player['name']]['stats']['blue'] = {
                            "obs_placed": [player['obs_placed']],
                            "camps_stacked": [player['camps_stacked']],
                            "runes_grabbed": [player['rune_pickups']],
                            "watchers_taken": [player.get('ability_uses', {}).get('ability_lamp_use', 0)],
                            "smokes_used": [player.get('item_uses', {}).get('smoke_of_deceit', 0)],
                        }
                    if PLAYERS_LIST[player['name']]['pos'] in (0, 1, 2):
                        player_stat[player['name']]['stats']['green'] = {
                            "roshan_kills": [player['roshans_killed']],
                            "teamfight_participation": [player['teamfight_participation']],
                            "stuns": [player['stuns']],
                            "courier_kills": [player['courier_kills']],
                            "tormentor_kills": [player.get('killed', {}).get('npc_dota_miniboss', 0)],
                            "firstblood": [player['firstblood_claimed']],
                        }
                else:
                    if PLAYERS_LIST[player['name']]['pos'] in (0, 1) and 'red' in player_stat[player['name']]['stats']:
                        player_stat[player['name']]['stats']['red']['kills'].append(player['kills'])
                        player_stat[player['name']]['stats']['red']['deaths'].append(player['deaths'])
                        player_stat[player['name']]['stats']['red']['creep_score'].append(player['last_hits'] + player['denies'])
                        player_stat[player['name']]['stats']['red']['gpm'].append(player['gold_per_min'])
                        player_stat[player['name']]['stats']['red']['madstone_collected'].append(player.get('item_uses', {}).get('madstone_bundle', 0))
                        player_stat[player['name']]['stats']['red']['tower_kills'].append(player['towers_killed'])
                    if PLAYERS_LIST[player['name']]['pos'] in (1, 2) and 'blue' in player_stat[player['name']]['stats']:
                        player_stat[player['name']]['stats']['blue']['obs_placed'].append(player['obs_placed'])
                        player_stat[player['name']]['stats']['blue']['camps_stacked'].append(player['camps_stacked'])
                        player_stat[player['name']]['stats']['blue']['runes_grabbed'].append(player['rune_pickups'])
                        player_stat[player['name']]['stats']['blue']['watchers_taken'].append(player.get('ability_uses', {}).get('ability_lamp_use', 0))
                        player_stat[player['name']]['stats']['blue']['smokes_used'].append(player.get('item_uses', {}).get('smoke_of_deceit', 0))
                    if PLAYERS_LIST[player['name']]['pos'] in (0, 1, 2) and 'green' in player_stat[player['name']]['stats']:
                        player_stat[player['name']]['stats']['green']['roshan_kills'].append(player['roshans_killed'])
                        player_stat[player['name']]['stats']['green']['teamfight_participation'].append(player['teamfight_participation'])
                        player_stat[player['name']]['stats']['green']['stuns'].append(player['stuns'])
                        player_stat[player['name']]['stats']['green']['courier_kills'].append(player['courier_kills'])
                        player_stat[player['name']]['stats']['green']['firstblood'].append(player['firstblood_claimed'])
                        player_stat[player['name']]['stats']['green']['tormentor_kills'].append(player.get('killed', {}).get('npc_dota_miniboss', 0))

                if 'leagues' not in player_stat[player['name']]:
                    player_stat[player['name']]['leagues'] = []

                if league_id not in player_stat[player['name']]['leagues']:
                    player_stat[player['name']]['leagues'].append(league_id)

                for cosmetic in player['cosmetics']:
                    if cosmetic['item_rarity'] == 'arcana':
                        player_stat[player['name']]['titles']['games_with_arcana'] += 1
                        break

                if "picks_bans" in match_r and match_r["picks_bans"]:
                    for picks in match_r['picks_bans']:
                        if picks.get('is_pick') and picks['team'] == player['team_number']:
                            if picks['hero_id'] == player['hero_id']:
                                player_stat[player['name']]['titles']['first_pick'] += 1
                            break

                    for picks in reversed(match_r['picks_bans']):
                        if picks['team'] == player['team_number']:
                            if picks['hero_id'] == player['hero_id']:
                                player_stat[player['name']]['titles']['last_pick'] += 1
                            break
                
                if playersDotaPlusArr[player['hero_id']] >= 25:
                    player_stat[player['name']]['titles']['games_with_hero_master'] += 1

                attr = heroes_data[str(player['hero_id'])]['attr']
                match attr:
                    case "str":
                        player_stat[player['name']]['titles']['str'] += 1
                    case "agi":
                        player_stat[player['name']]['titles']['agi'] += 1
                    case "int":
                        player_stat[player['name']]['titles']['int'] += 1
                    case "all":
                        player_stat[player['name']]['titles']['all'] += 1
                
                if heroes_data[str(player['hero_id'])]['isgreen']:
                    player_stat[player['name']]['titles']['green'] += 1

                if heroes_data[str(player['hero_id'])]['isblue']:
                    player_stat[player['name']]['titles']['blue'] += 1

                if heroes_data[str(player['hero_id'])]['isred']:
                    player_stat[player['name']]['titles']['red'] += 1

                if heroes_data[str(player['hero_id'])]['isundead']:
                    player_stat[player['name']]['titles']['undead'] += 1
                
                if heroes_data[str(player['hero_id'])]['ishorns']:
                    player_stat[player['name']]['titles']['horns'] += 1

                if heroes_data[str(player['hero_id'])]['isbearded']:
                    player_stat[player['name']]['titles']['bearded'] += 1

                if heroes_data[str(player['hero_id'])]['isaquatic']:
                    player_stat[player['name']]['titles']['aquatic'] += 1       

with open('players_stat.json', "w", encoding="utf-8") as f:
    json.dump(player_stat, f, ensure_ascii=False, indent=4)