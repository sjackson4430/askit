from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/get-ip', methods=['GET'])
def get_ip():
    try:
        # Using ipify API to get public IP
        response = requests.get('https://api.ipify.org?format=json')
        return jsonify(response.json())
    except:
        return jsonify({'error': 'Could not fetch IP address'}), 500

if __name__ == '__main__':
    app.run(port=5000) 