from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# Get port from Railway or use default
port = int(os.environ.get('PORT', 5000))

# Get allowed origins from environment or use default
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'https://sjackson4430.github.io').split(',')

# Update CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        "supports_credentials": True
    }
})

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)