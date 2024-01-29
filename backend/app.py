from flask import Flask, jsonify
from flask_cors import CORS

import pymysql
from pymysql import Error
import pymysql.cursors


app = Flask(__name__)
CORS(app)

def get_data():
    try:
        # Database connection
        connection = pymysql.connect(
        host='127.0.0.1',        # or your host
        database='playerdb',
        user='root',    # your MySQL username
        password='Great2see!', # your MySQL password
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



# Test connection to frontend
@app.route('/test')
def test_connection():
    return {"message": "Connection successful"}

if __name__ == '__main__':
    app.run(debug=True)