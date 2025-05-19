// ===== Завантаження шапки і футера =====
function loadPartial(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = data;
      if (id === 'header') afterHeaderLoaded();
    })
    .catch(error => console.error('Помилка завантаження компонента:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  loadPartial('header', 'partials/header.html');
  loadPartial('footer', 'partials/footer.html');
  renderTopSubscriptions();
  renderRandomReviews();
});

// ====== Популярні підписки, топ-3 ======
function renderTopSubscriptions() {
  const container = document.getElementById('top-subscriptions');
  if (!container) return;
  fetch('data/subscriptions_index.json')
    .then(res => res.json())
    .then(data => {
      const top = data.slice(0, 3);
      container.innerHTML = '';
      top.forEach((sub, idx) => {
        container.innerHTML += `
          <div class="top-sub-card animate-fade-in" style="animation-delay: ${idx*0.15}s">
            <div class="top-sub-card__info">
              <img src="${sub.logo}" alt="${sub.name}" class="top-sub-card__logo" />
              <div>
                <h3 class="top-sub-card__title">${sub.name}</h3>
                <p class="top-sub-card__desc">${sub.shortDescription}</p>
                <ul class="top-sub-card__features">
                  ${(sub.details?.ai ? '<li>🤖 ШІ допомога</li>' : '')}
                  ${(sub.details?.multiDevice ? '<li>📱 До 3 пристроїв</li>' : '')}
                  ${(sub.details?.voice ? '<li>🎙️ Голосове керування</li>' : '')}
                  ${(sub.details?.hd ? '<li>HD якість</li>' : '')}
                  ${(sub.details?.autoRenew ? '<li>🔄 Автопродовження</li>' : '')}
                </ul>
              </div>
            </div>
            <div class="top-sub-card__price-block">
              ${sub.oldPriceActive ? `<span class="top-sub-card__oldprice">${sub.oldPrice} ${sub.currency}</span>` : ''}
              <span class="top-sub-card__price">${sub.price} ${sub.currency}</span>
              ${sub.saveText ? `<span class="top-sub-card__save">${sub.saveText}</span>` : ''}
              <button class="btn-subscribe">Оформити</button>
            </div>
          </div>
        `;
      });
    });
}

// ====== Відгуки: 5-6 рандомних ======
function renderRandomReviews() {
  const container = document.getElementById('reviews-list');
  if (!container) return;
  fetch('data/reviews.json')
    .then(res => res.json())
    .then(reviews => {
      // Перемішати масив
      const shuffled = reviews.sort(() => Math.random() - 0.5).slice(0, 8);
      container.innerHTML = '';
      let lang = localStorage.getItem('lang');
      if (!lang) {
        lang = (navigator.language || 'uk').toLowerCase().startsWith('uk') ? 'uk' :
               (navigator.language.toLowerCase().startsWith('en') ? 'en' : 'ru');
      }
      shuffled.forEach((r, idx) => {
        let text =
          lang === 'uk' && r.text_uk ? r.text_uk :
          lang === 'en' && r.text_en ? r.text_en :
          r.text_ru;
        container.innerHTML += `
          <div class="review-card animate-up" style="animation-delay: ${idx*0.1}s">
            <div class="review-card__header">
              <img src="${r.avatar}" alt="${r.author}" class="review-card__avatar" />
              <div>
                <div class="review-card__author">${r.author}</div>
                <div class="review-card__sub">${r.subscription}</div>
              </div>
            </div>
            <div class="review-card__text">
              ${text}
            </div>
            <div class="review-card__date">${formatUkrDate(r.date)}</div>
          </div>
        `;
      });
    });
}

// ===== Хук після підключення header =====
function afterHeaderLoaded() {
  setupLangDropdown();
}

// ===== Функція форматує дату "2025-05-02" => "2 травня 2025" =====
function formatUkrDate(str) {
  if (!str) return '';
  const months = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ];
  const d = new Date(str);
  if (isNaN(d)) return '';
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ======= ДОДАНО: логіка перемикання мови =======
function setupLangDropdown() {
  const langBtn = document.getElementById('langDropdownBtn');
  const langList = document.getElementById('langList');
  if (langBtn && langList) {
    // Встановити збережену мову з localStorage (якщо є)
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      langList.querySelectorAll('li').forEach(i => {
        i.classList.remove('active');
        if (i.getAttribute('data-short').toLowerCase() === savedLang) {
          i.classList.add('active');
          const langCurrent = document.querySelector('.lang-current');
          if (langCurrent) langCurrent.textContent = i.getAttribute('data-short');
        }
      });
    }

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

    // Вибір мови (показувати лише скорочення у кнопці, зберігати в localStorage)
    langList.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', function(e) {
        langList.querySelectorAll('li').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        document.querySelector('.lang-current').textContent = this.getAttribute('data-short');
        langBtn.setAttribute('aria-expanded', 'false');
        langList.classList.remove('show');
        // Зберігаємо вибір у localStorage і оновлюємо сторінку
        localStorage.setItem('lang', this.getAttribute('data-short').toLowerCase());
        location.reload();
      });
    });
  }
}