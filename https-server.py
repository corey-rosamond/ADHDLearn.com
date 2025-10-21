#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import os

# Change to the directory containing the game
game_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(game_dir)

# Server configuration
host = '0.0.0.0'
port = 8000

# Create SSL context
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain('cert.pem', 'key.pem')

# Create HTTP server
server_address = (host, port)
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)

# Wrap socket with SSL
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"[HTTPS Server] Starting HTTPS server...")
print(f"[HTTPS Server] Serving from: {game_dir}")
print(f"[HTTPS Server] Local: https://localhost:{port}")
print(f"[HTTPS Server] Network: https://192.168.50.52:{port}")
print(f"[HTTPS Server] Press Ctrl+C to stop")
print()

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print("\n[HTTPS Server] Stopping server...")
    httpd.server_close()
    print("[HTTPS Server] Server stopped")
