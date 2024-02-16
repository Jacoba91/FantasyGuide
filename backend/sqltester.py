from flask import Flask, jsonify
from app import get_data  # Import get_data function

app = Flask(__name__)

with app.app_context():
    data = get_data()
    json_data = jsonify(data)
    print(json_data.get_json())  # This should print the JSON data