import requests
import json
import time
from dotenv import load_dotenv
import cloudscraper
import os
from collections import Counter

PLAYERS_LIST = {
# # Team Liquid
#     'Insania ': {
#         'pos': 2
#     },
#     'm1CKe': {
#         'pos': 0
#     },
#     'Nisha': {
#         'pos': 1
#     },
#     'Saberlight': {
#         'pos': 0
#     },
#     'Boxi': {
#         'pos': 2
#     },
# # PARIVISION
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
# # BetBoom Team
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
# # Team Tidebound
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
    # 'Yatoro': {
    #     'pos': 0
    # }
#     'Miposhka': {
#         'pos': 2
#     },
#     'Collapse': {
#         'pos': 0
#     },
#     'rue': {
#         'pos': 2
#     },
#     'Larl': {
#         'pos': 1
#     },
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
# # Tundra Esports
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
    'Tobi': {
        'pos': 2
    },
    # 'Whitemon': {
    #     'pos': 2
    # },
# # Natus Vincere
#     'gotthejuice': {
#         'pos': 0
#     },
#     'Niku': {
#         'pos': 1
#     },
#     'pma': {
#         'pos': 0
#     },
#     'KG_Zayac': {
#         'pos': 2
#     },
#     'Riddys': {
#         'pos': 2
#     },
# # Nigma Galaxy
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
# # Aurora Gaming
#     'Nightfall': {
#         'pos': 0
#     },
#     'kiyotaka': {
#         'pos': 1
#     },
#     'TORONTOTOKYO': {
#         'pos': 0
#     },
#     'Mira': {
#         'pos': 2
#     },
#     'panto': {
#         'pos': 2
#     },
# # Xtreme Gaming
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
# # Team Nemesis
#     "Erice": {
#         'pos': 2
#     },
#     "Mac": {
#         'pos': 1
#     },
#     "Jîng": {
#         'pos': 2
#     },
#     "raven": {
#         'pos': 0
#     },
#     "Akashi": {
#         'pos': 0
#     },
# # Wildcard
#     'Yamsun': {
#         'pos': 0
#     },
#     'RCY': {
#         'pos': 1
#     },
#     'Fayde': {
#         'pos': 0
#     },
#     'Bignum': {
#         'pos': 2
#     },
#     'Speeed': {
#         'pos': 2
#     },
# # Heroic
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
# # BOOM Esports
#     'Jaunuel': {
#         'pos': 2
#     },
#     'TIMS': {
#         'pos': 2
#     },
#     'Jabz': {
#         'pos': 0
#     },
#     'Armel': {
#         'pos': 1
#     },
#     'JACKBOYS': {
#         'pos': 0
#     },
# # # Yakult Brothers
#     'flyfly': {
#         'pos': 0
#     },
#     'Beyond': {
#         'pos': 0
#     },
#     'BoBoKa': {
#         'pos': 2
#     },
#     'Oli~': {
#         'pos': 2
#     },
#     'Emo': {
#         'pos': 1
#     }
}

load_dotenv()
API_TOKEN = os.getenv("STRATZ_TOKEN")

stratzUrl = "https://api.stratz.com/graphql"
scraper = cloudscraper.create_scraper()

with open("active_items.json", "r", encoding="utf-8") as f:
    items_active = json.load(f)

items_set = set(items_active)

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

def addPlayerFields(league_id, player, match_r):
    if player['name'] not in player_stat:
        player_stat[player['name']] = {}

    if league_id not in player_stat[player['name']]:
        player_stat[player['name']][league_id] = {
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
            "subtitles": {
                "0_kills": 0,
                "lowest_networth": 0,
                "bbs_before_30min": 0,
                "most_deaths": 0,
                "4+_active_items": 0,
                "most_assists": 0,
                "9_slots": 0,
                "lost_games": 0,
                "most_voice_lines": 0
            }
        }

        if "general" not in player_stat[player['name']]:
            player_stat[player['name']]["general"] = {}

        player_stat[player['name']]["general"]["team_logo"] = (match_r['radiant_team']['logo_url'] if player['isRadiant'] else match_r['dire_team']['logo_url'])
        player_stat[player['name']]["general"]["pos"] = PLAYERS_LIST[player['name']]['pos']
    
        if PLAYERS_LIST[player['name']]['pos'] in (0, 1):
            player_stat[player['name']][league_id]['stats']['red'] = {
                "kills": [],
                "deaths": [],
                "creep_score": [],
                "gpm": [],
                "madstone_collected": [],
                "tower_kills": [],
            }
        if PLAYERS_LIST[player['name']]['pos'] in (1, 2):
            player_stat[player['name']][league_id]['stats']['blue'] = {
                "obs_placed": [],
                "camps_stacked": [],
                "runes_grabbed": [],
                "watchers_taken": [],
                "smokes_used": [],
            }
        if PLAYERS_LIST[player['name']]['pos'] in (0, 1, 2):
            player_stat[player['name']][league_id]['stats']['green'] = {
                "roshan_kills": [],
                "teamfight_participation": [],
                "stuns": [],
                "courier_kills": [],
                "tormentor_kills": [],
                "firstblood": [],
            }

for league_id in leagues_ids:
    matches = requests.get(f"https://api.opendota.com/api/leagues/{league_id}/matches").json()
    total_matches_count = 0
    time.sleep(1.2)

    for match in matches:
        match_id = match['match_id']
        match_r = requests.get(f"https://api.opendota.com/api/matches/{match_id}").json()
        stratzAPI = scraper.post(
            stratzUrl,
            json = {"query": """{
                match(id: MATCH_ID) {
                    firstBloodTime
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

        playersStratz = {
            p["heroId"]: p["dotaPlus"]["level"] if p.get('dotaPlus') else 0
            for p in stratzAPI.json()['data']['match']['players']
        }

        firstbloodTime = stratzAPI.json()['data']['match']['firstBloodTime']
        time.sleep(1.2)
        
        max_retries = 3
        for attempt in range(max_retries):
            if "players" in match_r:
                break
            else:
                print(f"Не удалось получить данные {match} (попытка {attempt + 1})")
                if attempt < max_retries - 1:
                    time.sleep(3)
                    match_r = requests.get(f"https://api.opendota.com/api/matches/{match_id}").json()
        else:
            print(f"Не удалось получить данные о матче {match} после {max_retries} попыток")
            continue

        allPlayers = match_r['players']

        max_assists = max(p.get('assists', 0) for p in allPlayers)
        most_assists = [p for p in allPlayers if p.get('assists', 0) == max_assists]

        max_deaths = max(p.get('deaths', 0) for p in allPlayers)
        most_deaths = [p for p in allPlayers if p.get('deaths', 0) == max_deaths]

        min_networth = min(p.get('net_worth', 0) for p in allPlayers)
        lowest_networth = [p for p in allPlayers if p.get('net_worth', 0) == min_networth]

        is_match_counted = False
        is_tormentor_kill = False

        chat_events = match_r['chat']
        chat_counts = Counter(e['player_slot'] for e in chat_events if e['type'] == 'chatwheel')

        if chat_counts:
            max_chat_count = max(chat_counts.values())
            top_chatwheel_players = [slot for slot, count in chat_counts.items() if count == max_chat_count]
        else:
            top_chatwheel_players = []

        for player in match_r['players']:
            if player['name'] not in PLAYERS_LIST:
                continue

            if player['name'] not in player_stat:
                player_stat[player['name']] = {}
            if league_id not in player_stat[player['name']]:
                addPlayerFields(league_id, player, match_r)

            if player['name'] in PLAYERS_LIST:
                if player in lowest_networth:
                    player_stat[player['name']][league_id]['subtitles']['lowest_networth'] += 1

                if player in most_deaths:
                    player_stat[player['name']][league_id]['subtitles']['most_deaths'] += 1

                if player in most_assists:
                    player_stat[player['name']][league_id]['subtitles']['most_assists'] += 1

                if player['player_slot'] in top_chatwheel_players:
                    player_stat[player['name']][league_id]['subtitles']['most_voice_lines'] += 1

                if player['lose']:
                    player_stat[player['name']][league_id]['subtitles']['lost_games'] += 1

                active_items = 0
                for id in range(6):
                    item_key = f"item_{id}"
                    item_id = player.get(item_key)
                    if item_id in items_set:
                        active_items += 1

                if active_items >= 4:
                    player_stat[player['name']][league_id]['subtitles']['4+_active_items'] += 1

                for slot in range(6):
                    item_key = f"item_{slot}"
                    backpack_key = f"backpack_{slot}"
                    if player.get(item_key, 0) == 0:
                        break
                    if slot < 3 and player.get(backpack_key, 0) == 0:
                        break
                else:
                    player_stat[player['name']][league_id]['subtitles']['9_slots'] += 1

                if not is_match_counted:
                    total_matches_count += 1
                    is_match_counted = True

                if player['buyback_log'] and player['buyback_log'][0]['time'] < 1800:
                    player_stat[player['name']][league_id]['subtitles']['bbs_before_30min'] += 1

                if player['name'] not in player_stat:
                    addPlayerFields(league_id, player, match_r)
                elif league_id not in player_stat[player['name']]:
                    addPlayerFields(league_id, player, match_r)
                else:
                    if PLAYERS_LIST[player['name']]['pos'] in (0, 1) and 'red' in player_stat[player['name']][league_id]['stats']:
                        player_stat[player['name']][league_id]['stats']['red']['kills'].append(player['kills'])
                        if player['kills'] == 0:
                            player_stat[player['name']][league_id]['subtitles']['0_kills'] += 1
                        player_stat[player['name']][league_id]['stats']['red']['deaths'].append(player['deaths'])
                        player_stat[player['name']][league_id]['stats']['red']['creep_score'].append(player['last_hits'] + player['denies'])
                        player_stat[player['name']][league_id]['stats']['red']['gpm'].append(player['gold_per_min'])
                        player_stat[player['name']][league_id]['stats']['red']['madstone_collected'].append(player.get('item_uses', {}).get('madstone_bundle', 0))
                        player_stat[player['name']][league_id]['stats']['red']['tower_kills'].append(player['towers_killed'])
                    if PLAYERS_LIST[player['name']]['pos'] in (1, 2) and 'blue' in player_stat[player['name']][league_id]['stats']:
                        player_stat[player['name']][league_id]['stats']['blue']['obs_placed'].append(player['obs_placed'])
                        player_stat[player['name']][league_id]['stats']['blue']['camps_stacked'].append(player['camps_stacked'])
                        player_stat[player['name']][league_id]['stats']['blue']['runes_grabbed'].append(player['rune_pickups'])
                        player_stat[player['name']][league_id]['stats']['blue']['watchers_taken'].append(player.get('ability_uses', {}).get('ability_lamp_use', 0))
                        player_stat[player['name']][league_id]['stats']['blue']['smokes_used'].append(player.get('item_uses', {}).get('smoke_of_deceit', 0))
                    if PLAYERS_LIST[player['name']]['pos'] in (0, 1, 2) and 'green' in player_stat[player['name']][league_id]['stats']:
                        player_stat[player['name']][league_id]['stats']['green']['roshan_kills'].append(player['roshans_killed'])
                        player_stat[player['name']][league_id]['stats']['green']['teamfight_participation'].append(player['teamfight_participation'])
                        player_stat[player['name']][league_id]['stats']['green']['stuns'].append(player['stuns'])
                        player_stat[player['name']][league_id]['stats']['green']['courier_kills'].append(player['courier_kills'])
                        player_stat[player['name']][league_id]['stats']['green']['firstblood'].append(player['firstblood_claimed'])
                        player_stat[player['name']][league_id]['stats']['green']['tormentor_kills'].append(player.get('killed', {}).get('npc_dota_miniboss', 0))

                for cosmetic in player['cosmetics']:
                    if cosmetic['item_rarity'] == 'arcana':
                        player_stat[player['name']][league_id]['titles']['games_with_arcana'] += 1
                        break

                if "picks_bans" in match_r and match_r["picks_bans"]:
                    for picks in match_r['picks_bans']:
                        if picks.get('is_pick'):
                            if picks['team'] == player['team_number'] and picks['hero_id'] == player['hero_id']:
                                player_stat[player['name']][league_id]['titles']['first_pick'] += 1
                            break

                    for picks in reversed(match_r['picks_bans']):
                        if picks['hero_id'] == player['hero_id']:
                            player_stat[player['name']][league_id]['titles']['last_pick'] += 1
                        break
                
                if playersStratz[player['hero_id']] >= 25:
                    player_stat[player['name']][league_id]['titles']['games_with_hero_master'] += 1

                attr = heroes_data[str(player['hero_id'])]['attr']
                match attr:
                    case "str":
                        player_stat[player['name']][league_id]['titles']['str'] += 1
                    case "agi":
                        player_stat[player['name']][league_id]['titles']['agi'] += 1
                    case "int":
                        player_stat[player['name']][league_id]['titles']['int'] += 1
                    case "all":
                        player_stat[player['name']][league_id]['titles']['all'] += 1
                
                if heroes_data[str(player['hero_id'])]['isgreen']:
                    player_stat[player['name']][league_id]['titles']['green'] += 1

                if heroes_data[str(player['hero_id'])]['isblue']:
                    player_stat[player['name']][league_id]['titles']['blue'] += 1

                if heroes_data[str(player['hero_id'])]['isred']:
                    player_stat[player['name']][league_id]['titles']['red'] += 1

                if heroes_data[str(player['hero_id'])]['isundead']:
                    player_stat[player['name']][league_id]['titles']['undead'] += 1
                
                if heroes_data[str(player['hero_id'])]['ishorns']:
                    player_stat[player['name']][league_id]['titles']['horns'] += 1

                if heroes_data[str(player['hero_id'])]['isbearded']:
                    player_stat[player['name']][league_id]['titles']['bearded'] += 1

                if heroes_data[str(player['hero_id'])]['isaquatic']:
                    player_stat[player['name']][league_id]['titles']['aquatic'] += 1

            is_tormentor_kill = player['killed_by'].get('npc_dota_miniboss', 0) > 0
            
        if is_tormentor_kill:
            leagues_data[str(league_id)]['total_deaths_from_torm'] += 1

        if firstbloodTime > 600:
            leagues_data[str(league_id)]['firstblood_before_10min'] += 1

        if firstbloodTime < 0:
            leagues_data[str(league_id)]['firstblood_before_horn'] += 1

        if match['duration'] < 1500:
            leagues_data[str(league_id)]['games<25min'] += 1

    leagues_data[str(league_id)]['total_matches_parsed'] = total_matches_count

with open('players_stat.json', "w", encoding="utf-8") as f:
    json.dump(player_stat, f, ensure_ascii=False, indent=4)

with open('leagues.json', "w", encoding="utf-8") as f:
    json.dump(leagues_data, f, ensure_ascii=False, indent=4)