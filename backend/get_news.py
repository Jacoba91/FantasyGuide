from bs4 import BeautifulSoup
import json

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

print('begin \n')
# Setup Selenium WebDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)
driver.get("https://sports.yahoo.com/fantasy/football/news/")

# Wait for the page to load
time.sleep(2)

# Wait for the "Accept" button to be clickable and click it
try:
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="scroll-down-btn"]'))).click()
except Exception as e:
    print("To Bottom button not found or not clickable", e)

# Wait for the "Skip to Bottom" button to be clickable and click it
try:
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//*[@id="consent-page"]/div/div/div/form/div[2]/div[2]/button[1]'))).click()
except Exception as e:
    print("Accept button not found or not clickable", e)


last_height = driver.execute_script("return document.body.scrollHeight")

while True:
    # Scroll down to the bottom of the page
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    # Wait for new content to load
    time.sleep(2)

    # Calculate new scroll height and compare with last scroll height
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    last_height = new_height

# Now that you have scrolled the page, you can use Selenium to grab the content you need
content = driver.page_source

# Parse the HTML content
soup = BeautifulSoup(content, 'html.parser')

def extract_info_to_json():
    ul = soup.find('ul', class_='My(0) P(0) Wow(bw) Ov(h)')
    print('----')

    if ul:
        list_items = ul.find_all('li', limit=10)
        
        articles = []
        for li in list_items:
            # Extract information as before
            a_tag = li.find('a', href=True)
            if not (a_tag and a_tag.text.strip()):
                continue

            article = {
                "title": a_tag.text.strip() if a_tag and a_tag.text else 'No Title',
                "link": a_tag['href'] if a_tag and 'href' in a_tag.attrs else 'No Link',
                "image_src": li.find('img')['src'] if li.find('img') and 'src' in li.find('img').attrs else 'No Image',
                "author_info": li.find('div', class_="C(#959595) Fz(11px) D(ib) Mb(6px)").text.replace("•", " • ").strip() if li.find('div', class_="C(#959595) Fz(11px) D(ib) Mb(6px)") else 'No Author Info',
                "description": li.find('p').text.strip() if li.find('p') and li.find('p').text else 'No Description'
            }
            articles.append(article)

        return articles
    else:
        print('The specified ul was not found')


articles_json = extract_info_to_json()
print(json.dumps(articles_json, indent=4))

driver.quit()
