from flask import Flask, jsonify
from app import get_data  # Import your get_data function

app = Flask(__name__)

# Now you can use app.app_context() to create an application context
with app.app_context():
    data = get_data()
    json_data = jsonify(data)
    print(json_data.get_json())  # This will print the JSON data.