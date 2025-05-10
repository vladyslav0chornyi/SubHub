// Функція для динамічного завантаження шапки і футера
function loadPartial(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(error => console.error('Помилка завантаження компонента:', error));
}

// Завантаження шапки і футера при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  loadPartial('header', 'partials/header.html');
  loadPartial('footer', 'partials/footer.html');

  // Перевірте, чи кнопка "Відгуки" працює коректно
  const feedbackButton = document.querySelector('.feedback-button');
  if (feedbackButton) {
    feedbackButton.addEventListener('click', () => {
      console.log("Кнопка 'Відгуки' натиснута");
      // Можете додати логіку для перевірки, чи шапка залишається
    });
  }
});