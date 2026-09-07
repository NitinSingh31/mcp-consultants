/**
 * MCP CONSULTANTS - Touch & Autoplay Slider Engine
 * Controls Hero Carousel and Client Testimonials Carousel
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initTestimonialsSlider();
});

/**
 * Hero Banner Slider
 */
function initHeroSlider() {
  const track = document.querySelector('.hero-slider-track');
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-nav .slider-dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayInterval = null;

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoplay();
    });
  });

  // Pause on hover
  const sliderSection = document.querySelector('.hero-slider-section');
  if (sliderSection) {
    sliderSection.addEventListener('mouseenter', stopAutoplay);
    sliderSection.addEventListener('mouseleave', startAutoplay);
  }

  // Swipe support for touch devices
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      goToSlide(currentIndex + 1); // Swiped left
    } else if (touchEndX - touchStartX > 50) {
      goToSlide(currentIndex - 1); // Swiped right
    }
    startAutoplay();
  }, { passive: true });

  startAutoplay();
}

/**
 * Client Testimonials Carousel
 */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonial-card-wrap');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  const totalCards = cards.length;

  function updateCards() {
    cards.forEach((card, idx) => {
      card.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
  }

  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCards();
  }

  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCards();
  }

  if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
  if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
}
