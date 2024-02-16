# This code was used to initialize the database in mysql from a csv.

import pandas as pd

from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


''' Create rank column
df = pd.read_csv('./players_data.csv')
df.insert(0, 'Rank', range(1, len(df) + 1))
print(df)

# Define the CSV file path
csv_file_path = './players_data.csv'

# Save the DataFrame as a CSV file
df.to_csv(csv_file_path, index=False)
'''

''' Initial DB Creation in MySQL
# MySQL Database connection
    # Read the data from CSV
csv_file_path = './players_data.csv'
df = pd.read_csv(csv_file_path)

# Connect to the MySQL database
# Create a connection to the MySQL database using SQLAlchemy
# Replace 'username', 'password', 'hostname', 'port', and 'database' with your details
database_url = "mysql+mysqlconnector://root:________@127.0.0.1:3306/playerdb"
engine = create_engine(database_url)

# Use the DataFrame's `to_sql` method to create a new table in the database
# The 'if_exists' parameter is set to 'fail', so it will raise an error if the table already exists
# Set 'index=False' if you don't want pandas to create an index as a separate column
table_name = 'players_data'
df.to_sql(table_name, engine, if_exists='fail', index=False)

print(f"Table '{table_name}' created successfully in the database.")
'''


