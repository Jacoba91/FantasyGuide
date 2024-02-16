# All data retrieved from www.pro-football-reference.com
from bs4 import BeautifulSoup
import pandas as pd
import requests
import csv

all_players = []

html = requests.get("https://www.pro-football-reference.com/years/2023/fantasy.htm").text
soup = BeautifulSoup(html, "lxml")
table = soup.find_all('table', class_ = 'stats_table')[0]

headers = []
for header in table.find_all('th'):
    headers.append(header.text.strip())
headers[:] = [x for x in headers if x]


with open('players_data.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(headers)  # write the headers

    for row in table.find_all('tr'):
        data = []
        # Iterate over the cells (columns) in the row
        for cell in row.find_all('td'):
            data.append(cell.text.strip())
        writer.writerow(data)  # write the player's data

# Create a DataFrame
df = pd.DataFrame(data)

# Define the CSV file path
#csv_file_path = './players_data.csv'

# Save the DataFrame as a CSV file
#df.to_csv(csv_file_path, index=False)

print(headers)

