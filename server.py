import http.server
import socketserver

# Встановлюємо порт для сервера
PORT = 8080

# Налаштовуємо обробку запитів
Handler = http.server.SimpleHTTPRequestHandler

# Запускаємо сервер
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Сервер запущено на http://localhost:{PORT}")
    httpd.serve_forever()