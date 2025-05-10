from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs
import http.cookies

# Дані користувачів (для прикладу)
USERS = {
    "test_user": {
        "password": "password123",
        "name": "Test User",
        "email": "test@example.com"
    }
}

class AuthServer(BaseHTTPRequestHandler):
    def do_GET(self):
        # Парсимо cookies
        cookies = http.cookies.SimpleCookie(self.headers.get('Cookie'))
        logged_in = cookies.get('logged_in') and cookies.get('logged_in').value == 'true'

        if self.path == "/header":
            self.handle_header(logged_in)
        elif self.path == "/logout":
            self.handle_logout()
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")

    def do_POST(self):
        if self.path == "/login":
            self.handle_login()
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")

    def handle_login(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        data = parse_qs(post_data)

        username = data.get('username', [None])[0]
        password = data.get('password', [None])[0]

        if username in USERS and USERS[username]['password'] == password:
            # Успішний логін
            self.send_response(200)
            self.send_header('Set-Cookie', 'logged_in=true; Path=/')
            self.end_headers()
            self.wfile.write(b"Login successful")
        else:
            # Невірні дані
            self.send_response(401)
            self.end_headers()
            self.wfile.write(b"Invalid credentials")

    def handle_logout(self):
        # Видаляємо cookie logged_in
        self.send_response(200)
        self.send_header('Set-Cookie', 'logged_in=false; Path=/; Max-Age=0')
        self.end_headers()
        self.wfile.write(b"Logged out successfully")

    def handle_header(self, logged_in):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()

        if logged_in:
            # Шапка для авторизованих користувачів
            self.wfile.write("""
                <header>
                  <div class="logo">
                    <img src="img/logo.png" alt="Ваш Сервіс">
                    <h1>Ваш Сервіс</h1>
                  </div>
                  <nav class="menu">
                    <a href="index.html" class="active">Головна</a>
                    <a href="subscriptions.html">Мої Підписки</a>
                    <a href="profile.html">Профіль</a>
                    <a href="support.html">Підтримка</a>
                    <a href="/logout" id="logout-btn">Вихід</a>
                  </nav>
                </header>
            """.encode('utf-8'))  # Перетворення в байти
        else:
            # Гостьова шапка
            self.wfile.write("""
                <header>
                  <div class="logo">
                    <img src="img/logo.png" alt="Ваш Сервіс">
                    <h1>Ваш Сервіс</h1>
                  </div>
                  <nav class="menu">
                    <a href="index.html" class="active">Головна</a>
                    <a href="index.html#how-it-works">Як це працює?</a>
                    <a href="faq.html">Питання</a>
                    <a href="feedback.html">Відгуки</a>
                    <a href="contacts.html">Контакти</a>
                    <a href="auth.html">Вхід/Реєстрація</a>
                  </nav>
                </header>
            """.encode('utf-8'))  # Перетворення в байти

def run(server_class=HTTPServer, handler_class=AuthServer, port=8080):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Сервер запущено на http://localhost:{port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run()