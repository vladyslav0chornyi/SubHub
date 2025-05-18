// ===== Динамічне завантаження шапки і футера =====
function loadPartial(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (id === 'header') afterHeaderLoaded();
      if (id === 'footer') afterFooterLoaded();
    })
    .catch(error => console.error('Помилка завантаження компонента:', error));
}

// Колбеки після завантаження частин
function afterHeaderLoaded() {
  // ==== Мовний dropdown ====
  const langBtn = document.getElementById('langDropdownBtn');
  const langList = document.getElementById('langList');
  if (langBtn && langList) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const expanded = langBtn.getAttribute('aria-expanded') === 'true';
      langBtn.setAttribute('aria-expanded', (!expanded).toString());
      langList.classList.toggle('show', !expanded);
    });

    // Клік поза списком — закрити
    document.addEventListener('click', function (e) {
      if (!langList.contains(e.target) && e.target !== langBtn) {
        langBtn.setAttribute('aria-expanded', 'false');
        langList.classList.remove('show');
      }
    });

    // Вибір мови (показувати лише скорочення у кнопці)
    langList.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', function(e) {
        langList.querySelectorAll('li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        document.querySelector('.lang-current').textContent = this.getAttribute('data-short');
        langBtn.setAttribute('aria-expanded', 'false');
        langList.classList.remove('show');
        // TODO: логіка зміни мови
      });
    });
  }

  // Динамічна підсвітка активної сторінки в меню
  const navLinks = document.querySelectorAll('.nav-btn');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (
      linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  // Єдина кнопка авторизації/реєстрації
  const mainAuthBtn = document.querySelector('.btn-primary');
  if (mainAuthBtn) {
    mainAuthBtn.addEventListener('click', (e) => {
      // Якщо auth.html — не потрібно, інакше:
      // e.preventDefault();
      // alert('Відкривається форма входу/реєстрації');
    });
  }
}

function afterFooterLoaded() {
  // Можна додати логику, якщо потрібно для футера
}

// ===== Основна ініціалізація =====
document.addEventListener('DOMContentLoaded', () => {
  loadPartial('header', 'partials/header.html');
  loadPartial('footer', 'partials/footer.html');
  createSimpleCarousel('subscriptions-carousel', 'data/subscriptions.json', 6);
  createSimpleCarousel('reviews-carousel', 'data/reviews.json', 6);
});

/**
 * Спрощена автокарусель для підписок та відгуків
 * @param {string} carouselId
 * @param {string} dataUrl
 * @param {number} visibleCount
 */
function createSimpleCarousel(carouselId, dataUrl, visibleCount = 6) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  if (!track) return;

  fetch(dataUrl)
    .then(res => res.json())
    .then(cardsData => {
      // Генеруємо картки
      track.innerHTML = '';
      cardsData.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = carouselId.includes('subscription') ? 'subscription-card' : 'review-card';
        if (carouselId.includes('subscription')) {
          cardEl.innerHTML = `
            <img src="${card.img}" alt="${card.title}">
            <h3>${card.title}</h3>
            <p>${card.desc}</p>
          `;
        } else {
          cardEl.innerHTML = `
            <h3>${card.author}</h3>
            <div class="review-subscription">${card.subscription ? `<small>${card.subscription}</small>` : ''}</div>
            <p>${card.text}</p>
          `;
        }
        track.appendChild(cardEl);
      });

      const cards = Array.from(track.children);
      let pos = 0;
      let cardWidth;

      function update() {
        cardWidth = cards[0].offsetWidth + 16;
        track.style.transition = 'transform 0.6s cubic-bezier(.4,.13,.45,1)';
        track.style.transform = `translateX(${-pos * cardWidth}px)`;
      }

      function next() {
        pos++;
        if (pos > cards.length - visibleCount) pos = 0;
        update();
      }

      setInterval(next, 3500);
      window.addEventListener('resize', update);
      update();
    });
}