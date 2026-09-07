/**
 * MCP CONSULTANTS - Animated Number Counters
 * Uses IntersectionObserver to trigger smooth numeric counting upon scrolling into viewport
 */

document.addEventListener('DOMContentLoaded', () => {
  initNumberCounters();
});

function initNumberCounters() {
  const counterElements = document.querySelectorAll('.counter-number');
  if (counterElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2200; // ms
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateNumber);
  };

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach(animateCounter);
        obs.disconnect(); // Stop observing once triggered
      }
    });
  }, observerOptions);

  const legacySection = document.querySelector('.legacy-section');
  if (legacySection) {
    observer.observe(legacySection);
  }
}
