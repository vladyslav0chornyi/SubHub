document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedback-form');
  const feedbackList = document.getElementById('feedback-list');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('feedback-name').value;
    const message = document.getElementById('feedback-message').value;

    const feedbackItem = document.createElement('div');
    feedbackItem.innerHTML = `<p><strong>${name}:</strong> ${message}</p>`;
    feedbackList.appendChild(feedbackItem);

    form.reset();
  });
});