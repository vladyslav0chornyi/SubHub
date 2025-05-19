function header() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Перевіряємо статус авторизації
  const header = document.getElementById('header'); // Контейнер для шапки

  if (isLoggedIn) {
    // Шапка для залогіненого користувача
    header.innerHTML = `
      <header>
        <div class="logo">
          <img src="img/logo.png" alt="Ваш Сервіс">
          <h1>Ваш Сервіс</h1>
        </div>
        <nav class="menu">
          <a href="index.html" class="active">Головна</a>
          <a href="subscriptions.html">Підписки</a>
          <a href="faq.html">Питання</a>
          <a href="transactions.html">Транзакції</a>
          <a href="support.html">Техпідтримка</a>
          <a href="feedback.html">Відгуки</a>
          <a href="contacts.html">Контакти</a>
        </nav>
        <div class="actions">
          <div class="language-select">
            <img src="img/uk-flag.png" alt="Українська" title="Українська" class="lang-option">
            <img src="img/en-flag.png" alt="English" title="English" class="lang-option">
          </div>
          <button id="logout-btn" class="animated-btn">Вийти</button>
        </div>
      </header>
    `;

    // Додаємо обробник для кнопки "Вийти"
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.setItem('isLoggedIn', 'false'); // Очищуємо статус авторизації
      header(); // Оновлюємо шапку
    });
  } else {
    // Шапка для гостя
    header.innerHTML = `
      <header>
        <div class="logo">
          <img src="img/logo.png" alt="Ваш Сервіс">
          <h1>Ваш Сервіс</h1>
        </div>
        <nav class="menu">
          <a href="../index.html" class="active">Головна</a>
          <a href="../index.html#how-it-works">Як це працює?</a> <!-- Посилання на секцію з відео -->
          <a href="../faq.html">Питання</a>
          <a href="../feedback.html">Відгуки</a>
          <a href="../contacts.html">Контакти</a>
          <a href="../auth.html" id="login-btn">Вхід/Реєстрація</a>
        </nav>
        <div class="actions">
          <button class="login-btn animated-btn" id="login-btn" onclick="window.location.href='auth.html'">Увійти/Реєстрація</button>
          <div class="language-select">
            <img src="img/uk-flag.png" alt="Українська" title="Українська" class="lang-option">
            <img src="img/en-flag.png" alt="English" title="English" class="lang-option">
          </div>
        </div>
      </header>
    `;

    // Додаємо обробник для кнопки "Вхід" (для симуляції логіну)
    document.getElementById('login-btn').addEventListener('click', () => {
      localStorage.setItem('isLoggedIn', 'true'); // Зберігаємо статус авторизації
      header(); // Оновлюємо шапку
    });
  }
}

// Викликаємо функцію при завантаженні сторінки
header();