import requests
import json
from dotenv import load_dotenv
import os
load_dotenv()
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

with open("./data/angularRepos.json", 'r') as f:
    file = json.load(f)

headers = {}

def search_files_in_repo(page_idx):
    headers = {
        "Authorization" : f"BEARER {GITHUB_TOKEN}",
        "Accept" : "application/vnd.github.v3+json"
    }
    search_url = f"https://api.github.com/search/code?q=extension:component.html&per_page=100&page={page_idx}"
    response = requests.get(search_url, headers=headers)
    if response.status_code == 200:
        return response.json()

def convert_to_raw_github_url(url):
    # Replace the start of the URL
    raw_url = url.replace("https://github.com/", "https://raw.githubusercontent.com/")
    # Remove the "/blob" part which is present in GitHub URLs but not in the raw content URLs
    raw_url = raw_url.replace("/blob", "")
    return raw_url

print(GITHUB_TOKEN)
raw_urls = []
for page_idx in range(0,10):
    print(f"Page : {page_idx}")
    collection = search_files_in_repo(page_idx)
    if collection is not None: 
        page_idx = page_idx + 1
        for item in collection["items"]:
            raw_url = convert_to_raw_github_url(item['html_url'])
            print(raw_url)
            raw_urls.append(raw_url)
    
    # Save the raw URLs to a JSON file
with open('file_references.json', 'w') as json_file:
    json.dump(raw_urls, json_file, indent=4)