// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar style on scroll
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNav();
  };

  window.addEventListener('scroll', handleScroll);

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ===== ACTIVE NAV LINK =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation for grid children
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.fade-in')) : [];
        const i = siblings.indexOf(entry.target);
        const delay = i >= 0 ? i * 100 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // ===== COUNTER ANIMATION =====
  const statNums = document.querySelectorAll('.stat-num[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(num => counterObserver.observe(num));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ===== CIRCULAR PROGRESS ANIMATION =====
  const circles = document.querySelectorAll('.circle-fill');

  const circleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = parseInt(entry.target.getAttribute('data-percent'));
        const circumference = 2 * Math.PI * 45; // r=45
        const offset = circumference - (percent / 100) * circumference;

        entry.target.style.strokeDasharray = circumference;
        entry.target.style.strokeDashoffset = circumference;

        // Trigger reflow for animation
        entry.target.getBoundingClientRect();

        requestAnimationFrame(() => {
          entry.target.style.strokeDashoffset = offset;
        });

        circleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  circles.forEach(circle => circleObserver.observe(circle));

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Simple validation
    if (!data.name || !data.email || !data.phone) {
      shakeForm();
      return;
    }

    // Show success message
    const formWrapper = contactForm.parentElement;
    contactForm.style.opacity = '0';
    contactForm.style.transform = 'scale(0.95)';
    contactForm.style.transition = 'all 0.3s ease';

    setTimeout(() => {
      formWrapper.innerHTML = `
        <div class="form-success">
          <i class="fas fa-check-circle"></i>
          <h3>Message Sent Successfully!</h3>
          <p>Thank you, ${data.name}! We'll get back to you within 24 hours.</p>
        </div>
      `;
      formWrapper.querySelector('.form-success').style.animation = 'fadeInUp 0.5s ease forwards';
    }, 300);

    console.log('Form submitted:', data);
  });

  function shakeForm() {
    contactForm.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      contactForm.style.animation = '';
    }, 400);
  }

  // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== INITIAL CALL =====
  handleScroll();
});

// ===== CSS KEYFRAMES VIA JS =====
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    50% { transform: translateX(8px); }
    75% { transform: translateX(-4px); }
  }
`;
document.head.appendChild(styleSheet);
