/* ============================================
   OHCD - Oramah Human Capital Development
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── Header Scroll Effect ───
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ─── Mobile Navigation Toggle ───
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // ─── Scroll Animations (Intersection Observer) ───
  const fadeElements = document.querySelectorAll('.fade-up, .fade-in');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add staggered delay for grid children
          const parent = entry.target.parentElement;
          if (parent) {
            const siblings = parent.querySelectorAll('.fade-up, .fade-in');
            siblings.forEach(function (sibling, index) {
              if (sibling === entry.target) {
                entry.target.style.transitionDelay = (index * 0.08) + 's';
              }
            });
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything if IntersectionObserver not supported
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ─── Counter Animation for Stats ───
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (num) {
      counterObserver.observe(num);
    });
  }

  function animateCounter(element) {
    const text = element.textContent;
    // Only animate pure numbers or percentages
    const match = text.match(/^([\d,]+)/);
    if (!match) return;

    const target = parseInt(match[1].replace(/,/g, ''));
    if (isNaN(target) || target === 0) return;

    const suffix = text.replace(match[1], '');
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ─── Contact Form Handler ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Simulate form submission
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.innerHTML = 'Message Sent! &#10003;';
        submitBtn.style.background = '#2ecc71';

        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ─── Active Navigation Highlight ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (link.classList.contains('active') && href !== currentPage) {
      // Don't remove active from nav-cta styled buttons
      if (!link.classList.contains('nav-cta')) {
        link.classList.remove('active');
      }
    }
  });

  // ─── Back to Top (appears on scroll) ───
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '&#8593;';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 600) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  backToTop.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-3px)';
    this.style.boxShadow = '0 6px 25px rgba(0,0,0,0.2)';
  });

  backToTop.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  });

});
