# scraper.py

import requests
from bs4 import BeautifulSoup

# Target URL
URL = "https://agriwelfare.gov.in/en/Major"

# Headers to mimic a browser visit
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def fetch_schemes():
    try:
        response = requests.get(URL, headers=HEADERS)
        response.raise_for_status()
        html_content = response.content
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {URL}: {e}")
        return []

    soup = BeautifulSoup(html_content, "html.parser")
    schemes = []

    table = soup.find("table")
    if not table:
        print("No table found on the page.")
        return schemes

    rows = table.find_all("tr")[1:]  # Skip header
    for row in rows:
        cols = row.find_all("td")
        if len(cols) >= 3:
            title = cols[1].get_text(strip=True)
            date = cols[2].get_text(strip=True)
            link_tag = cols[1].find("a")
            link = link_tag['href'] if link_tag and 'href' in link_tag.attrs else ''
            if link and not link.startswith("http"):
                link = "https://agriwelfare.gov.in" + link
            schemes.append({
                "title": title,
                "date": date,
                "link": link
            })
    return schemes
