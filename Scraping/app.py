from flask import Flask, jsonify
from flask_cors import CORS
from scraper import fetch_schemes  # Make sure scraper.py exists and fetch_schemes() returns data

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "✅ Server is running. Visit /api/schemes to fetch schemes."

@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    try:
        schemes = fetch_schemes()
        return jsonify({"schemes": schemes}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)