/* ============================================
   JavaScript for Martha Barnds Art

   This script handles the interactive elements on the
   site including the responsive navigation toggle,
   product slider control and commission form handling
   via EmailJS. All code is encapsulated to avoid
   polluting the global namespace.
============================================ */

document.addEventListener('DOMContentLoaded', function () {
  // === Mobile Navigation Toggle ===
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      navMobile.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // === Product Slider ===
  const slider = document.querySelector('.product-slider');
  if (slider) {
    const slidesWrapper = slider.querySelector('.slides-wrapper');
    const slides = slider.querySelector('.slides');
    const cards = slides.querySelectorAll('.product-card');
    const prevBtn = slider.querySelector('.arrow.prev');
    const nextBtn = slider.querySelector('.arrow.next');
    let index = 0;

    // Calculate the number of cards visible in the viewport
    function visibleCount() {
      const wrapperWidth = slidesWrapper.clientWidth;
      const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
      return Math.floor(wrapperWidth / cardWidth);
    }

    function updateSlider() {
      const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight);
      slides.style.transform = `translateX(-${index * cardWidth}px)`;
      // disable navigation when at the edges
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= cards.length - visibleCount();
    }

    // Event handlers for arrows
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        if (index > 0) {
          index--;
          updateSlider();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (index < cards.length - visibleCount()) {
          index++;
          updateSlider();
        }
      });
    }

    // Update on window resize to recalculate card sizes
    window.addEventListener('resize', updateSlider);
    // Initial call
    updateSlider();
  }

  // === EmailJS Commission Form ===
  const commissionForm = document.getElementById('commissionForm');
  if (commissionForm) {
    // initialise EmailJS; replace YOUR_PUBLIC_KEY with your actual key
    // For more details on generating keys visit https://www.emailjs.com/
    emailjs.init('YOUR_PUBLIC_KEY');
    commissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitButton = commissionForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';

      // Collect form data
      const formData = new FormData(commissionForm);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Replace SERVICE_ID and TEMPLATE_ID with your EmailJS values
      emailjs
        .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data)
        .then(
          function (response) {
            alert('Thank you! Your request has been sent.');
            commissionForm.reset();
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
          },
          function (error) {
            console.error('FAILED...', error);
            alert('Oops! Something went wrong. Please try again later.');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
          }
        );
    });
  }
});