from flask import Flask, request, jsonify, send_file, redirect
from flask_cors import CORS
import requests
import logging
from datetime import datetime
import os
from io import BytesIO

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Environment variables for configuration
PORT = int(os.environ.get('PORT', 5000))
IP_API_URL = os.environ.get('IP_API_URL', 'https://api.ipify.org')
REQUEST_TIMEOUT = int(os.environ.get('REQUEST_TIMEOUT', 5))

@app.route('/')
def index():
    """Serve the login page"""
    return send_file('static/login.html')

@app.route('/app')
def serve_app():
    """Serve the main application"""
    return send_file('static/index.html')

@app.route('/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/get-ip', methods=['GET'])
def get_ip():
    """Get the client's public IP address"""
    try:
        # Get the client's real IP if behind proxy
        client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        logging.info(f"IP request from client: {client_ip}")

        # Using ipify API to get public IP
        response = requests.get(
            f'{IP_API_URL}?format=json',
            timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()  # Raise exception for bad status codes
        
        data = response.json()
        logging.info(f"Successfully retrieved IP: {data.get('ip')}")
        
        return jsonify({
            'ip': data.get('ip'),
            'timestamp': datetime.now().isoformat(),
            'success': True
        })

    except requests.Timeout:
        logging.error("Request to IP API timed out")
        return jsonify({
            'error': 'Request timed out',
            'success': False
        }), 504

    except requests.RequestException as e:
        logging.error(f"Error fetching IP: {str(e)}")
        return jsonify({
            'error': 'Could not fetch IP address',
            'details': str(e),
            'success': False
        }), 500

    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred',
            'success': False
        }), 500

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Resource not found',
        'success': False
    }), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal server error',
        'success': False
    }), 500

@app.route('/speed-test-file/<size>')
def speed_test_file(size):
    """Generate test files of different sizes"""
    sizes = {
        'small': 1024 * 1024,      # 1MB
        'medium': 1024 * 1024 * 5,  # 5MB
        'large': 1024 * 1024 * 10,  # 10MB
        'xlarge': 1024 * 1024 * 20  # 20MB
    }
    
    byte_size = sizes.get(size, sizes['small'])
    test_data = os.urandom(byte_size)  # Use random data instead of zeros
    
    return send_file(
        BytesIO(test_data),
        mimetype='application/octet-stream',
        as_attachment=True,
        download_name=f'speedtest-{size}.dat'
    )

if __name__ == '__main__':
    try:
        logging.info(f"Starting server on port {PORT}")
        app.run(
            host='0.0.0.0',
            port=PORT,
            debug=os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
        )
    except Exception as e:
        logging.error(f"Failed to start server: {str(e)}")