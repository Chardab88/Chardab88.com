import requests
import json
import re
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

SCHEDULE_URL = "https://www.racing-reference.info/raceyear/2026/W"

NAME_FIXES = {
    "A.J. Allmendinger": "AJ Allmendinger",
    "B.J. McLeod": "BJ McLeod",
    "John H. Nemechek": "John Hunter Nemechek",
    "Shane van Gisbergen": "Shane Van Gisbergen",
    "Corey Lajoie": "Corey LaJoie",
}


def normalize_name(name):
    name = re.sub(r"\s+", " ", name.strip())
    return NAME_FIXES.get(name, name)


def load_json(filename):
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_latest_race_url():
    print("Finding latest race...")

    r = requests.get(SCHEDULE_URL, headers=HEADERS, timeout=20)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")

    race_links = []

    for a in soup.find_all("a", href=True):
        href = a["href"]

        m = re.search(r"/race/(\d{4}-\d+)/W", href)
        if m:
            race_num = int(m.group(1).split("-")[1])
            race_links.append((race_num, href))

    if not race_links:
        raise Exception("Could not locate race links")

    race_links.sort(key=lambda x: x[0])

    latest = race_links[-1][1]

    if not latest.startswith("http"):
        latest = "https://www.racing-reference.info" + latest

    print(f"Latest race: {latest}")

    return latest


def build_lookup(drivers):
    return {
        normalize_name(d["name"]): d
        for d in drivers
    }


def increment_driver(driver, finish, start_pos, laps_led, status, carnum):
    driver["starts"] = driver.get("starts", 0) + 1

    if carnum:
        driver["carnum"] = carnum

    if finish == 1:
        driver["wins"] = driver.get("wins", 0) + 1

    if "top 5s" in driver:
        if finish <= 5:
            driver["top 5s"] += 1

    if "top 10s" in driver:
        if finish <= 10:
            driver["top 10s"] += 1

    if "poles" in driver:
        if start_pos == 1:
            driver["poles"] += 1

    if "laps lead" in driver:
        driver["laps lead"] += laps_led

    if "dnfs" in driver:
        if "running" not in status.lower():
            driver["dnfs"] += 1


def process_race():

    drivers = load_json("drivers.json")
    easy = load_json("easy_drivers.json")
    hilo = load_json("hilodriv.json")

    drivers_lookup = build_lookup(drivers)
    easy_lookup = build_lookup(easy)
    hilo_lookup = build_lookup(hilo)

    race_url = get_latest_race_url()

    r = requests.get(race_url, headers=HEADERS, timeout=20)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, "html.parser")

    tables = soup.find_all("table")

    race_table = None

    for table in tables:
        txt = table.get_text(" ", strip=True)

        if (
            "Driver" in txt
            and "Status" in txt
            and "Led" in txt
            and "Pos" in txt
        ):
            race_table = table
            break

    if not race_table:
        raise Exception("Race results table not found")

    print("Processing race results...")

    rows = race_table.find_all("tr")

    for row in rows:

        cols = row.find_all("td")

        if len(cols) < 10:
            continue

        try:
            finish = int(cols[0].get_text(strip=True))
            start_pos = int(cols[1].get_text(strip=True))
            carnum = int(cols[2].get_text(strip=True))
        except:
            continue

        driver_name = normalize_name(
            cols[3].get_text(" ", strip=True)
        )

        status = cols[7].get_text(" ", strip=True)

        try:
            laps_led = int(cols[8].get_text(strip=True))
        except:
            laps_led = 0

        if driver_name in drivers_lookup:
            increment_driver(
                drivers_lookup[driver_name],
                finish,
                start_pos,
                laps_led,
                status,
                carnum
            )

        if driver_name in easy_lookup:
            increment_driver(
                easy_lookup[driver_name],
                finish,
                start_pos,
                laps_led,
                status,
                carnum
            )

        if driver_name in hilo_lookup:
            increment_driver(
                hilo_lookup[driver_name],
                finish,
                start_pos,
                laps_led,
                status,
                carnum
            )

    print("Processing DNQs...")

    dnq_table = None

    for table in tables:

        txt = table.get_text(" ", strip=True)

        if "Failed to qualify" in txt:
            dnq_table = table
            break

    if dnq_table:

        for row in dnq_table.find_all("tr"):

            cols = row.find_all("td")

            if len(cols) < 2:
                continue

            name = normalize_name(
                cols[1].get_text(" ", strip=True)
            )

            if name in hilo_lookup:
                hilo_lookup[name]["dnqs"] = (
                    hilo_lookup[name].get("dnqs", 0) + 1
                )

    save_json("drivers.json", drivers)
    save_json("easy_drivers.json", easy)
    save_json("hilodriv.json", hilo)

    print("Finished.")


if __name__ == "__main__":
    process_race()