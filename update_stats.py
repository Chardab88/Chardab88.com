import json
import shutil
import requests
from bs4 import BeautifulSoup

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
}


# ----------------------------
# Helpers
# ----------------------------

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
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
            shutil.copyfile(file, file.replace(".json", "_backup.json"))
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

backup_files()

session = requests.Session()

r = session.get(
    url,
    headers=HEADERS,
    timeout=30
)

if r.status_code != 200:
    print(f"Failed: HTTP {r.status_code}")
    quit()

soup = BeautifulSoup(r.text, "html.parser")

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