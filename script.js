// ============================================
// COUNTDOWN TIMER
// ============================================

const launchDate = new Date('2026-02-01T00:00:00').getTime();
let countdownInterval;

function updateCountdown() {
  const now = Date.now();
  const distance = launchDate - now;

  if (distance <= 0) {
    clearInterval(countdownInterval);
    document.querySelector('.countdown-container').innerHTML =
      '<p class="countdown-ended">We’re Live 🎉</p>';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);


// ============================================
// EMAIL FORM HANDLING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const emailInput = document.getElementById('email');
  const formMessage = document.getElementById('formMessage');

  if (!signupForm || !emailInput || !formMessage) return;

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'error');
      return;
    }

    const submitButton = signupForm.querySelector('.cta-button');
    const buttonText = submitButton.querySelector('.button-text');

    submitButton.disabled = true;
    buttonText.textContent = 'Submitting…';

    try {
      const result = await submitEmailToSheet(email);

      if (result.success) {
        showMessage('✨ You’re on the list. We’ll notify you at launch.', 'success');
        emailInput.value = '';
        trackSignup(email);
      } else {
        showMessage(result.error || 'Something went wrong.', 'error');
      }

    } catch (err) {
      console.error(err);
      showMessage('⚠️ Something went wrong. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      buttonText.textContent = 'Notify me';
    }
  });
});


// ============================================
// HELPERS
// ============================================

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(message, type) {
  const el = document.getElementById('formMessage');
  el.textContent = message;
  el.className = `form-message ${type}`;

  setTimeout(() => {
    el.textContent = '';
    el.className = 'form-message';
  }, 5000);
}


// ============================================
// GOOGLE APPS SCRIPT SUBMISSION
// ============================================

async function submitEmailToSheet(email) {
  const scriptURL =
    'https://script.google.com/macros/s/AKfycbzPD5yWJpAWK69tIQGftYfLOJ6m_1XsQj6mgAIQAaAGkP4oHbZ2HtAgLidk6Dt9vzyP/exec';

  const response = await fetch(scriptURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      company: '' // honeypot field (must stay empty)
    }),
  });

  if (!response.ok) {
    throw new Error('Network error');
  }

  return await response.json();
}


// ============================================
// ANALYTICS
// ============================================

function trackSignup(email) {
  if (typeof gtag === 'function') {
    gtag('event', 'waitlist_signup', {
      event_category: 'engagement',
      event_label: 'coming_soon',
    });
  }
}


// ============================================
// OPTIONAL EASTER EGG (SAFE)
// ============================================

let konami = [];
const sequence = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'
];

document.addEventListener('keydown', (e) => {
  konami.push(e.key);
  konami.splice(-sequence.length - 1);

  if (konami.join() === sequence.join()) {
    const icon = document.querySelector('.mantis-icon');
    if (!icon) return;

    icon.style.animation = 'spin 1s ease';
    setTimeout(() => (icon.style.animation = ''), 1000);
  }
});
