import json
import shutil
from pathlib import Path
import cloudscraper
from bs4 import BeautifulSoup

BASE_DIR = Path(__file__).resolve().parent

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/137.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,"
        "application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Referer": "https://www.racing-reference.info/",
}


# ----------------------------
# Helpers
# ----------------------------

def load_json(path):
    with open(BASE_DIR / path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(BASE_DIR / path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def normalize(name):
    return (
        name.replace("J.J.", "J. J.")
            .replace(" Jr.", " Jr")
            .replace(" III", "")
            .replace(".", "")
            .strip()
            .lower()
    )


def backup_files():
    files = [
        "hilodriv.json",
        "drivers.json",
        "easy_drivers.json"
    ]

    for file in files:
        try:
            shutil.copyfile(
                BASE_DIR / file,
                BASE_DIR / file.replace(".json", "_backup.json")
            )
            print(f"Backup created: {file}")
        except Exception as e:
            print(f"Backup failed for {file}: {e}")


# ----------------------------
# Load data
# ----------------------------

def build_lookup(data):
    return {
        normalize(d["name"]): d
        for d in data
    }


# ----------------------------
# Main
# ----------------------------

year = input("Enter year: ").strip()
race = input("Enter race number: ").strip()

url = f"https://www.racing-reference.info/race-results/{year}-{race}/W"

print(f"\nLoading {url}")

scraper = cloudscraper.create_scraper()

r = scraper.get(
    url,
    headers=HEADERS,
    timeout=30
)

html = r.text

if r.status_code != 200:
    print(f"Failed: HTTP {r.status_code}")
    print(f"Response URL: {r.url}")
    print(f"Server: {r.headers.get('Server', 'unknown')}")
    print(f"Content-Type: {r.headers.get('Content-Type', 'unknown')}")
    print(f"Content-Encoding: {r.headers.get('Content-Encoding', 'none')}")
    if r.headers.get("CF-Ray"):
        print(f"Cloudflare Ray ID: {r.headers['CF-Ray']}")
    body_preview = BeautifulSoup(r.text, "html.parser").get_text(" ", strip=True)
    if body_preview:
        print(f"Response details: {body_preview[:500]}")
    if r.status_code != 403:
        quit()

    saved_path = input("Path to saved race-results HTML (or press Enter to quit): ").strip().strip('"')
    if not saved_path:
        quit()

    html_path = Path(saved_path).expanduser()
    if not html_path.is_absolute():
        html_path = BASE_DIR / html_path
    try:
        html = html_path.read_text(encoding="utf-8", errors="replace")
    except OSError as error:
        print(f"Could not read saved HTML: {error}")
        quit()

soup = BeautifulSoup(html, "html.parser")
if not any(len(row.find_all("td")) == 10 for row in soup.find_all("tr")):
    print("No race-results table found; JSON files were not changed.")
    quit()

backup_files()

hilo = load_json("hilodriv.json")
drivers = load_json("drivers.json")
easy = load_json("easy_drivers.json")

hilo_lookup = build_lookup(hilo)
drivers_lookup = build_lookup(drivers)
easy_lookup = build_lookup(easy)

updated_drivers = set()

# ----------------------------
# Race Results
# ----------------------------

rows = soup.find_all("tr")

for row in rows:

    cols = row.find_all("td")

    if len(cols) != 10:
        continue

    try:
        pos = int(cols[0].get_text(strip=True))
        start = int(cols[1].get_text(strip=True))
        carnum = int(cols[2].get_text(strip=True))

        driver_link = cols[3].find("a")

        if not driver_link:
            continue

        driver_name = driver_link.get_text(strip=True)

        status = cols[7].get_text(strip=True).lower()

        try:
            led = int(cols[8].get_text(strip=True))
        except:
            led = 0

    except:
        continue

    norm = normalize(driver_name)

    updated_drivers.add(driver_name)

    # --------------------
    # HILO
    # --------------------

    if norm in hilo_lookup:

        d = hilo_lookup[norm]

        d["starts"] += 1

        if pos == 1:
            d["wins"] += 1

        if pos <= 5:
            d["top 5s"] += 1

        if pos <= 10:
            d["top 10s"] += 1

        if start == 1:
            d["poles"] += 1

        d["laps lead"] += led

        if status != "running":
            d["dnfs"] += 1

    # --------------------
    # DRIVERS
    # --------------------

    if norm in drivers_lookup:

        d = drivers_lookup[norm]

        d["starts"] += 1

        if pos == 1:
            d["wins"] += 1

        d["carnum"] = carnum

        if carnum not in d["forcarnum"]:
            d["forcarnum"].append(carnum)

    # --------------------
    # EASY_DRIVERS
    # --------------------

    if norm in easy_lookup:

        d = easy_lookup[norm]

        d["starts"] += 1

        if pos == 1:
            d["wins"] += 1

        d["carnum"] = carnum

        if carnum not in d["forcarnum"]:
            d["forcarnum"].append(carnum)


# ----------------------------
# DNQ TABLE
# ----------------------------

for table in soup.find_all("table"):

    text = table.get_text(" ", strip=True).lower()

    if "failed to qualify" not in text:
        continue

    print("DNQ table found")

    for row in table.find_all("tr"):

        cols = row.find_all("td")

        if len(cols) < 2:
            continue

        try:
            link = cols[1].find("a")

            if not link:
                continue

            name = link.get_text(strip=True)

            norm = normalize(name)

            if norm in hilo_lookup:
                hilo_lookup[norm]["dnqs"] += 1
                print(f"DNQ +1: {name}")

        except:
            pass


# ----------------------------
# Save
# ----------------------------

save_json("hilodriv.json", hilo)
save_json("drivers.json", drivers)
save_json("easy_drivers.json", easy)

print("\nDone.")
print(f"Processed {len(updated_drivers)} drivers.")