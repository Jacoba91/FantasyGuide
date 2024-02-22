from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv

import pymysql
from pymysql import Error
import pymysql.cursors

from insight_api import get_openai_response
from trade_insight import analyze_fantasy_trade

load_dotenv()
sql_passcode = os.getenv('SQL_PASSWORD')

app = Flask(__name__)
CORS(app)

# Gets data from sql database
def get_data():

    try:
        # Database connection
        connection = pymysql.connect(
        host='127.0.0.1',
        database='playerdb',
        user='root',
        password=sql_passcode,
        cursorclass=pymysql.cursors.DictCursor
        )

        if connection.open:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM players_data")
                result = cursor.fetchall()  # This will now be a list of dictionaries
            return result


    except Error as e:
        print("Error while connecting to MySQL", e)
        return []

    finally:
        if connection.open:
            connection.close()
            print("MySQL connection is closed")


@app.route('/players', methods=['GET'])
def players():
    data = get_data()  # Fetch the data, which should be a list of dictionaries
    return jsonify(data)  # Convert the data to JSON and return the response


# Get the names of players in current roster to pass into language model
@app.route('/api/update-roster', methods=['POST'])
def update_roster():
    data = request.json
    player_names = data.get('playerNames')

    # Validate player_names
    if not player_names:
        return jsonify({"status": "error", "message": "No player names provided"}), 400

    # Call the function from insight_api.py
    openai_response = get_openai_response(player_names)

    # Process the player names
    return jsonify({"status": "success", "feedback": openai_response})

# Get players staged for trade analysis and call language model response.
@app.route('/api/analyze-trade', methods=['POST'])
def get_players_for_trade():
    data = request.json

    try:
        team_a_players = data['teamA']
        team_b_players = data['teamB']
        
        # Call the function from insight_api.py
        ai_analysis = analyze_fantasy_trade(team_a_players, team_b_players)
        return jsonify({"status": "success", "feedback": ai_analysis})
    
    except KeyError:
        # Handle cases where teamA or teamB data is not provided
        return jsonify({"status": "error", "message": "Missing player data in request"}), 400
    
    except Exception as e:
        # Handle any other exceptions
        return jsonify({"status": "error", "message": str(e)}), 500

# Test connection to frontend
@app.route('/test')
def test_connection():
    return {"message": "Connection successful"}

if __name__ == '__main__':
    app.run(debug=True)