import requests
import json
import time

filename = 'players_stat.json'

with open("leagues.json", "r", encoding="utf-8") as f:
    leagues_data = json.load(f)

PLAYERS_LIST = {
# Team Liquid
    # 'Insania ': {
    #     'pos': 2
    # },
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
#     'Satanic': {
#         'pos': 0
#     },
#     'No[o]ne-': {
#         'pos': 1
#     },
#     'DM': {
#         'pos': 0
#     },
#     '9Class': {
#         'pos': 2
#     },
#     'Dukalis': {
#         'pos': 2
#     },
# # BetBoom Team
#     'Pure': {
#         'pos': 0
#     },
#     'gpk~': {
#         'pos': 1
#     },
#     'MieRo': {
#         'pos': 0
#     },
#     'Save-': {
#         'pos': 2
#     },
#     'Kataomi`': {
#         'pos': 2
#     },
# # Team Tidebound
#     'shiro': {
#         'pos': 0
#     },
#     'NothingToSay': {
#         'pos': 1
#     },
#     'Bach': {
#         'pos': 0
#     },
#     'planet': {
#         'pos': 2
#     },
#     'y`': {
#         'pos': 2
#     },
# # Team Spirit
#     'Yatoro': {
#         'pos': 0
#     },
#     'Miposhka': {
#         'pos': 2
#     },
#     'Collapse': {
#         'pos': 0
#     },
#     'rue': {
#         'pos': 2
#     },
    # 'Larl': {
    #     'pos': 1
    # },
# Team Falcons
#     'skiter': {
#         'pos': 0
#     },
#     'Malr1ne': {
#         'pos': 1
#     },
#     'AMMAR_THE_F': {
#         'pos': 0
#     },
#     'Cr1t-': {
#         'pos': 2
#     },
#     'Sneyking': {
#         'pos': 2
#     },
# # Tundra Esports
#     'Crystallis': {
#         'pos': 0
#     },
#     'bzm': {
#         'pos': 1
#     },
#     '33': {
#         'pos': 0
#     },
#     'Saksa': {
#         'pos': 2
#     },
#     # 'Whitemon': {
#     #     'pos': 2
#     # },
    'Tobi': {
        'pos': '2'
    }
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
#     'OmaR': {
#         'pos': 2
#     },
#     'GH': {
#         'pos': 2
#     },
#     'No!ob™': {
#         'pos': 0
#     },
#     'SumaiL-': {
#         'pos': 1
#     },
#     'Ghost': {
#         'pos': 0
#     },
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
#     'Ame': {
#         'pos': 0
#     },
#     'Xm': {
#         'pos': 1
#     },
#     'Xxs': {
#         'pos': 0
#     },
#     'XinQ': {
#         'pos': 2
#     },
#     'xNova': {
#         'pos': 2
#     },
# # Team Nemesis

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
#     'Yuma': {
#         'pos': 0
#     },
#     '4nalog丶01': {
#         'pos': 1
#     },
#     'Wisper': {
#         'pos': 0
#     },
#     'Scofield': {
#         'pos': 2
#     },
#     'KingJungles': {
#         'pos': 2
#     },
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
# # Yakult Brothers
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

try:
    with open(filename, 'r', encoding='utf-8') as f:
        player_stat = json.load(f)
except FileNotFoundError:
    player_stat = {}

leagues_ids = list(map(int, leagues_data.keys()))

# heroes = requests.get(f"https://api.opendota.com/api/heroes").json()

for league_id in leagues_ids:
    matches = requests.get(f"https://api.opendota.com/api/leagues/{league_id}/matches").json()
    time.sleep(1.2)

    for match in matches:
        match_r = requests.get(f"https://api.opendota.com/api/matches/{match['match_id']}").json()
        time.sleep(1.2)

        if "players" not in match_r:
            print(f"Не удалось получить данные {match['match_id']}")
            break
        
        for player in match_r['players']:
            if player['name'] in PLAYERS_LIST:
                if player['name'] not in player_stat:
                    player_stat[player['name']] = {
                        "stats": {},
                        "heroes": {},
                        "general": {
                            "team_logo": match_r['radiant_team']['logo_url'] if player['isRadiant'] else match_r['dire_team']['logo_url'],
                            "pos": PLAYERS_LIST[player['name']]['pos']
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
                
                if 'heroes' not in player_stat[player['name']]:
                    player_stat[player['name']]['heroes'] = {}

                heroes = player_stat[player['name']]['heroes']
                if player['hero_id'] in heroes:
                    heroes[player['hero_id']] += 1
                else:
                    heroes[player['hero_id']] = 1

                if 'leagues' not in player_stat[player['name']]:
                    player_stat[player['name']]['leagues'] = []

                if league_id not in player_stat[player['name']]['leagues']:
                    player_stat[player['name']]['leagues'].append(league_id)

with open(filename, "w", encoding="utf-8") as f:
    json.dump(player_stat, f, ensure_ascii=False, indent=4)