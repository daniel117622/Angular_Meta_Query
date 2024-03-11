import requests
import json
import os

def is_angular_project(repo_url):
    content_api_base = 'https://raw.githubusercontent.com'
    
    parts = repo_url.split("/")
    user, repo = parts[-2], parts[-1]
    package_json_url = f"{content_api_base}/{user}/{repo}/master/package.json"
    
    try:
        response = requests.get(package_json_url)
        response.raise_for_status()  
        package_json = response.json()
        dependencies = package_json.get('dependencies', {})
        devDependencies = package_json.get('devDependencies', {})
        angular_deps = [dep for dep in dependencies.keys() if dep.startswith('@angular/')]
        angular_dev_deps = [dep for dep in devDependencies.keys() if dep.startswith('@angular/')]
        
        return bool(angular_deps or angular_dev_deps)
    except requests.RequestException as e:
        return False
    except json.JSONDecodeError as e:
        return False

file_path = './data/urls.json'
def save_json(data, path):
    with open(path, 'w') as f:
        json.dump(data, f, indent=4)

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

if not os.path.exists(file_path):
    url = "https://api.github.com/search/repositories?q=angular+blog+created:>2022-01-01"
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload)
    data = json.loads(response.text)

    # Check if the '../data' directory exists, if not create it
    if not os.path.exists(os.path.dirname(file_path)):
        os.makedirs(os.path.dirname(file_path))
    
    save_json(data, file_path)
    print("Data loaded from git API")
else:
    data = load_json(file_path)
    print("Local copy exists.")


for repo in data["items"]:
   if is_angular_project(repo["html_url"]):
       print(repo["html_url"])