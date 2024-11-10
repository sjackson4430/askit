from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": ["https://sjackson4430.github.io"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
    }
})

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running'
    })

# DNS lookup endpoint
@app.route('/dns-lookup')
def dns_lookup():
    domain = request.args.get('domain')
    if not domain:
        return jsonify({'error': 'Domain parameter is required'}), 400
    try:
        # Your DNS lookup logic here
        return jsonify({
            'ip': '1.1.1.1',  # Replace with actual DNS lookup
            'records': {
                'A': ['1.1.1.1'],
                'AAAA': ['2606:4700:4700::1111']
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Network info endpoint
@app.route('/network-info')
def network_info():
    return jsonify({
        'publicIp': request.remote_addr,
        'isp': 'Unknown',
        'location': 'Unknown',
        'latency': 0
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)