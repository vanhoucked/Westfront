from flask import Flask, request, jsonify
import os
import platform
import logging
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

VALID_TOKEN = "jouw_harde_gecodeerde_token"  # Vervang dit door jouw token
WAKE_ME_ON_LAN_PATH = "C:\\Users\Dre\\Downloads\\wakemeonlan-x64\\WakeMeOnLan.exe"  # Pas dit aan naar het juiste pad

# Configure logging
logging.basicConfig(filename='log.txt',
                    level=logging.DEBUG,  # Log op niveau DEBUG en hoger
                    format='%(asctime)s - %(levelname)s - %(message)s')

@app.route('/shutdown', methods=['POST'])
def shutdown():
    token = request.headers.get('Authorization')  # Verkrijg de token uit de headers
    if not token or token.split(" ")[1] != VALID_TOKEN:
        logging.warning('Invalid token for shutdown requested')
        return jsonify({'message': 'Invalid token'}), 403  # 403 Forbidden

    logging.info('Shutdown requested')
    shutdown_server()
    return 'Server shutting down...'

@app.route('/reboot', methods=['POST'])
def reboot():
    token = request.headers.get('Authorization')  # Verkrijg de token uit de headers
    if not token or token.split(" ")[1] != VALID_TOKEN:
        logging.warning('Invalid token for shutdown requested')
        return jsonify({'message': 'Invalid token'}), 403  # 403 Forbidden

    logging.info('Reboot requested')
    reboot_server()
    return 'Server rebooting...'

@app.route('/status', methods=['GET'])
def status():
    return '', 200  # Status 200 als de server actief is

@app.route('/check_port_8080', methods=['POST'])
def check_port_8080():
    try:
        # Check if a web server is running on port 8080
        result = subprocess.run(['curl', '-Is', 'http://127.0.0.1:8080'], capture_output=True, text=True)
        if result.returncode == 0:
            logging.info('Server is running on port 8080')
            return jsonify({'status': 'running'}), 200
        else:
            logging.info('No server running on port 8080')
            return jsonify({'status': 'not_running'}), 200
    except Exception as e:
        logging.error(f'Error checking port 8080: {e}')
        return jsonify({'status': 'error'}), 500

@app.route('/wake', methods=['POST'])
def wake_single_computer():
    token = request.headers.get('Authorization')
    if not token or token.split(" ")[1] != VALID_TOKEN:
        logging.warning('Invalid token for wake_single_computer requested')
        return jsonify({'message': 'Invalid token'}), 403  # 403 Forbidden

    data = request.get_json()
    if 'mac_address' not in data:
        logging.error('MAC address not provided')
        return jsonify({'message': 'MAC address is required'}), 400  # 400 Bad Request

    mac_address = data['mac_address']

    try:
        logging.info(f'Wake signal requested for MAC address: {mac_address}')
        # Commando om een enkele computer wakker te maken via MAC-adres
        result = subprocess.run([WAKE_ME_ON_LAN_PATH, '/wakeup', mac_address], capture_output=True, text=True)
        if result.returncode == 0:
            logging.info(f'Successfully sent wake signal to computer with MAC address {mac_address}')
            return jsonify({'message': f'Wake signal sent to {mac_address}'}), 200
        else:
            logging.error(f'Failed to wake computer with MAC address {mac_address}: {result.stderr}')
            return jsonify({'message': f'Failed to send wake signal to {mac_address}'}), 500
    except Exception as e:
        logging.error(f'Error during wake_single_computer for MAC {mac_address}: {e}')
        return jsonify({'message': f'Error occurred while trying to wake {mac_address}'}), 500

if __name__ == '__main__':
    app.run(port=5000)


def shutdown_server():
    logging.info('Shutting down the server')
    try:
        # Using 'shutdown' command for Windows
        subprocess.run(["shutdown", "/s", "/t", "10"], check=True)
    except Exception as e:
        logging.error(f'Failed to shut down the server: {e}')
        raise RuntimeError('Failed to shut down the server')

def reboot_server():
    logging.info('Rebooting the server')
    try:
        # Using 'shutdown' command for Windows
        subprocess.run(["shutdown", "/r", "/t", "10"], check=True)
    except Exception as e:
        logging.error(f'Failed to reboot the server: {e}')
        raise RuntimeError('Failed to reboot the server')

if __name__ == '__main__':
    app.run(port=5000)