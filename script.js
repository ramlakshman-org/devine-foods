document.addEventListener('DOMContentLoaded', function () {
  /* ── Mobile nav ── */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Banner slider ── */
  var slides = document.querySelectorAll('.banner-slide');
  var dots = document.querySelectorAll('.dot');
  var currentSlide = 0;
  var slideInterval;

  function showSlide(index) {
    slides.forEach(function (s) { s.classList.remove('active'); });
    dots.forEach(function (d) { d.classList.remove('active'); });
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function startSlider() { slideInterval = setInterval(nextSlide, 4500); }
  function stopSlider() { clearInterval(slideInterval); }

  if (slides.length > 0) {
    showSlide(0);
    startSlider();
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        stopSlider(); currentSlide = index; showSlide(currentSlide); startSlider();
      });
    });
    /* Pause on hover/focus for accessibility (WCAG 2.2.2) */
    var sliderEl = document.querySelector('.banner-slider');
    if (sliderEl) {
      sliderEl.addEventListener('mouseenter', stopSlider);
      sliderEl.addEventListener('mouseleave', startSlider);
      sliderEl.addEventListener('focusin', stopSlider);
      sliderEl.addEventListener('focusout', startSlider);
    }
  }

  /* ── Prefill business type from URL (e.g. contact.html?type=distributor) ── */
  var businessTypeSelect = document.getElementById('businessType');
  if (businessTypeSelect) {
    var params = new URLSearchParams(window.location.search);
    var requestedType = params.get('type');
    if (requestedType) {
      var optionExists = Array.prototype.some.call(businessTypeSelect.options, function (opt) {
        return opt.value === requestedType;
      });
      if (optionExists) {
        businessTypeSelect.value = requestedType;
      }
    }
  }

  /* ── Product carousel (index page, auto-scrolling single row) ── */
  var carousel = document.getElementById('productCarousel');
  var track = document.getElementById('productTrack');
  var arrowLeft = document.getElementById('productArrowLeft');
  var arrowRight = document.getElementById('productArrowRight');

  if (carousel && track) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Clone 3× — gives a long runway before the loop boundary is reached */
    var originalCards = Array.prototype.slice.call(track.children);
    [1, 2, 3].forEach(function () {
      originalCards.forEach(function (card) {
        var clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });

    var isPaused = false;
    var isDragging = false;
    var resumeTimer = null;
    var speed = 0.55; /* px per animation frame */
    var loopWidth = 0;

    function measureLoopWidth() {
      loopWidth = track.scrollWidth / 4; /* 4× track = 1 original + 3 clones */
    }
    measureLoopWidth();
    window.addEventListener('resize', measureLoopWidth);

    function pauseAutoScroll() {
      isPaused = true;
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = null; }
    }

    function scheduleResume(delay) {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () {
        isPaused = false;
      }, delay || 2200);
    }

    function tick() {
      if (!isPaused && !isDragging && !reduceMotion && loopWidth > 0) {
        carousel.scrollLeft += speed;
        if (carousel.scrollLeft >= loopWidth) {
          carousel.scrollLeft -= loopWidth;
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    /* Touch: pause while the user is touching, resume shortly after release */
    carousel.addEventListener('touchstart', pauseAutoScroll, { passive: true });
    carousel.addEventListener('touchend', function () { scheduleResume(2200); }, { passive: true });
    carousel.addEventListener('touchcancel', function () { scheduleResume(2200); }, { passive: true });

    /* Mouse: allow click-and-drag scrolling on desktop too */
    var dragStartX = 0;
    var dragStartScroll = 0;
    carousel.addEventListener('mousedown', function (e) {
      isDragging = true;
      pauseAutoScroll();
      dragStartX = e.pageX;
      dragStartScroll = carousel.scrollLeft;
    });
    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      carousel.scrollLeft = dragStartScroll - (e.pageX - dragStartX);
    });
    window.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      scheduleResume(2200);
    });

    /* Hover pause for desktop convenience */
    carousel.addEventListener('mouseenter', pauseAutoScroll);
    carousel.addEventListener('mouseleave', function () { if (!isDragging) scheduleResume(1200); });

    /* Reposition only after scroll fully stops — avoids the visible jump caused
       by instantly reassigning scrollLeft during iOS momentum scrolling */
    var _scrollStopTimer;
    carousel.addEventListener('scroll', function () {
      if (loopWidth <= 0) return;
      clearTimeout(_scrollStopTimer);
      _scrollStopTimer = setTimeout(function () {
        var sl = carousel.scrollLeft;
        if (sl >= loopWidth) {
          carousel.scrollLeft = sl % loopWidth;
        } else if (sl < 0) {
          carousel.scrollLeft = loopWidth + (sl % loopWidth);
        }
      }, 80);
    });

    function scrollByCards(direction) {
      pauseAutoScroll();
      var firstCard = track.querySelector('.product-card');
      var cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 26 : 266;
      carousel.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
      scheduleResume(2800);
    }

    if (arrowLeft) arrowLeft.addEventListener('click', function () { scrollByCards(-1); });
    if (arrowRight) arrowRight.addEventListener('click', function () { scrollByCards(1); });
  }

  /* ── WhatsApp floating button (injected on every page) ── */
  var waBtn = document.createElement('a');
  waBtn.href = 'https://wa.me/919962918979?text=Hi%2C%20I%27m%20interested%20in%20stocking%20Devine%20products.';
  waBtn.className = 'wa-float';
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  waBtn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  document.body.appendChild(waBtn);

  /* ── Contact form handler ── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var successEl = document.getElementById('formSuccess');

    function showError(inputId, msg) {
      var el = document.getElementById(inputId);
      var errEl = document.getElementById(inputId + 'Error');
      if (el) el.classList.add('invalid');
      if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
    }

    function clearErrors() {
      contactForm.querySelectorAll('input, textarea, select').forEach(function (el) { el.classList.remove('invalid'); });
      contactForm.querySelectorAll('.field-error').forEach(function (el) { el.classList.remove('visible'); });
    }

    function validateForm() {
      clearErrors();
      var valid = true;
      var name = document.getElementById('name');
      var phone = document.getElementById('phone');
      var city = document.getElementById('city');
      var businessType = document.getElementById('businessType');
      var email = document.getElementById('email');

      if (!name || !name.value.trim()) { showError('name', 'Please enter your name.'); valid = false; }
      if (!phone || !phone.value.trim()) { showError('phone', 'Please enter your phone number.'); valid = false; }
      if (!city || !city.value.trim()) { showError('city', 'Please enter your city.'); valid = false; }
      if (!businessType || !businessType.value) { showError('businessType', 'Please select a business type.'); valid = false; }
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError('email', 'Please enter a valid email address.'); valid = false;
      }
      return valid;
    }

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      var payload = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        city: document.getElementById('city').value.trim(),
        businessType: document.getElementById('businessType').value,
        email: (document.getElementById('email') || {}).value || '',
        message: (document.getElementById('message') || {}).value || '',
      };

      try {
        var response = await fetch(contactForm.getAttribute('action'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          if (successEl) successEl.classList.add('visible');
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        var errDiv = document.createElement('p');
        errDiv.style.cssText = 'color:var(--wine);font-size:0.9rem;margin-bottom:12px;';
        errDiv.textContent = 'Something went wrong. Please call us directly or try again.';
        contactForm.prepend(errDiv);
        setTimeout(function () { if (errDiv.parentNode) errDiv.parentNode.removeChild(errDiv); }, 6000);
      } finally {
        if (submitBtn) { submitBtn.textContent = 'Send Enquiry'; submitBtn.disabled = false; }
      }
    });

    contactForm.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('input', function () {
        el.classList.remove('invalid');
        var errEl = document.getElementById(el.id + 'Error');
        if (errEl) errEl.classList.remove('visible');
      });
    });
  }
});
