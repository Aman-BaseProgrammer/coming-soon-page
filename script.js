// ============================================
// COUNTDOWN TIMER (15 DAYS)
// ============================================

// Set the launch date to February 1st, 2026 at 00:00
const launchDate = new Date('2026-02-01T00:00:00');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update the DOM
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    
    // Check if countdown has ended
    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector('.countdown-container').innerHTML = '<p class="countdown-ended">We\'re Live! 🎉</p>';
    }
}

// Update countdown immediately and then every second
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);


// ============================================
// EMAIL FORM HANDLING
// ============================================

const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const formMessage = document.getElementById('formMessage');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Basic email validation
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Disable form during submission
    const submitButton = signupForm.querySelector('.cta-button');
    const originalButtonText = submitButton.querySelector('.button-text').textContent;
    submitButton.disabled = true;
    submitButton.querySelector('.button-text').textContent = 'Submitting...';
    
    try {
        // Simulate API call (replace with actual endpoint)
        await simulateAPICall(email);
        
        // Success state with animation
        const inputWrapper = signupForm.querySelector('.input-wrapper');
        inputWrapper.classList.add('success');
        
        showMessage('✨ Thank you! We\'ll notify you when we launch.', 'success');
        emailInput.value = '';
        
        // Remove success class after animation
        setTimeout(() => {
            inputWrapper.classList.remove('success');
        }, 600);
        
        // Optional: Track submission with analytics
        trackSignup(email);
        
    } catch (error) {
        // Error state
        showMessage('⚠️ Something went wrong. Please try again.', 'error');
        console.error('Signup error:', error);
    } finally {
        // Re-enable form
        submitButton.disabled = false;
        submitButton.querySelector('.button-text').textContent = originalButtonText;
    }
});


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form message
 */
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
    }, 5000);
}

/**
 * Simulate API call for demo purposes
 * Replace this with your actual API endpoint
 */
function simulateAPICall(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                console.log('Email submitted:', email);
                resolve();
            } else {
                reject(new Error('Simulated error'));
            }
        }, 1000);
    });
}

/**
 * Track signup with analytics
 * Replace with your analytics provider (Google Analytics, Mixpanel, etc.)
 */
function trackSignup(email) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'signup', {
            'event_category': 'engagement',
            'event_label': 'email_waitlist'
        });
    }
    
    // Example: Console log for development
    console.log('Signup tracked:', email);
}


// ============================================
// SMOOTH ANIMATIONS ON SCROLL (optional)
// ============================================

/**
 * Scroll-based effects - Subtle fade-in and blur-to-clear
 * Only applies to elements that are not initially visible
 */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add subtle entrance animation
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.filter = 'blur(0)';
            
            // Unobserve after animation completes
            setTimeout(() => {
                scrollObserver.unobserve(entry.target);
            }, 1000);
        }
    });
}, observerOptions);

// Observe elements that might be below fold
document.querySelectorAll('.social-links, .footer-text').forEach(el => {
    // Set initial state for scroll-in elements
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.filter = 'blur(5px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    scrollObserver.observe(el);
});


// ============================================
// PREVENT LAYOUT SHIFT
// ============================================

/**
 * Ensure smooth font loading to prevent CLS
 */
if ('fonts' in document) {
    document.fonts.ready.then(() => {
        document.body.style.opacity = '1';
    });
}


// ============================================
// KEYBOARD NAVIGATION ENHANCEMENT
// ============================================

/**
 * Enhanced keyboard navigation for accessibility
 */
// Removed theme toggle keyboard shortcut since theme toggle is removed


// ============================================
// EASTER EGG: KONAMI CODE (optional fun)
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Fun mantis-themed easter egg
    const mantisIcon = document.querySelector('.mantis-icon');
    mantisIcon.style.animation = 'spin 1s ease-in-out';
    
    setTimeout(() => {
        mantisIcon.style.animation = '';
    }, 1000);
    
    console.log('🦗 The mantis awakens! Intelligence mode activated.');
}

// Spin animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
