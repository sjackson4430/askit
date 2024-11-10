from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# Get allowed origins from environment or use default
ALLOWED_ORIGINS = ['https://sjackson4430.github.io']

# Update CORS configuration to be more specific
CORS(app, resources={
    r"/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        "supports_credentials": False
    }
})

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept'
    return response

@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'API is running'
    })

# Your other routes here...

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)