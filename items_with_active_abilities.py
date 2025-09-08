from dotenv import load_dotenv
import cloudscraper
import os
import json

load_dotenv()
API_TOKEN = os.getenv("STRATZ_TOKEN")

stratzUrl = "https://api.stratz.com/graphql"
scraper = cloudscraper.create_scraper()

stratzAPI = scraper.post(
    stratzUrl,
    json = {"query": """{
        constants {
            items {
                id
                stat {
                    behavior
                }
            }
        }
        }"""},
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
)
items = {
    i["id"]
    for i in stratzAPI.json()['data']['constants']['items']
    if i.get('stat') and i['stat'].get('behavior', 0) not in (0, 2, 4)
}

items_list = list(items)

with open("active_items.json", "w", encoding="utf-8") as f:
    json.dump(items_list, f, indent=4, ensure_ascii=False)