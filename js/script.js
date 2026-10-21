/**
 * HEARTCALM Acne Water Gel - Landing Page Scripts
 * ================================================
 * Features:
 * 1. Navbar scroll effect & active link highlight
 * 2. Smooth scrolling with navbar offset
 * 3. Newsletter form validation + modal
 * 4. Counter animation for statistics
 * 5. Scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', function () {
  // ========== 1. NAVBAR SCROLL EFFECT ==========
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navbarHeight = navbar ? navbar.offsetHeight : 64;

  /**
   * Menambahkan/menghapus class 'scrolled' pada navbar
   * saat pengguna menggulir halaman.
   */
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /**
   * Menyorot link navigasi yang aktif berdasarkan
   * posisi scroll dan section yang terlihat.
   */
  function highlightActiveNavLink() {
    const scrollPosition = window.scrollY + navbarHeight + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', function () {
    handleNavbarScroll();
    highlightActiveNavLink();
  });

  // ========== 2. SMOOTH SCROLLING WITH OFFSET ==========

  /**
   * Mengimplementasikan smooth scrolling untuk semua link anchor
   * dengan memperhitungkan tinggi navbar sebagai offset.
   */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const targetPosition = targetElement.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Menutup navbar mobile jika terbuka (Bootstrap collapse ID: navMenu)
        const navbarCollapse = document.getElementById('navMenu');
        if (navbarCollapse) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      }
    });
  });

  // ========== 3. NEWSLETTER FORM VALIDATION ==========
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const emailError = document.getElementById('emailError');

  /**
   * Memvalidasi format alamat email menggunakan regex.
   * @param {string} email - Alamat email yang akan divalidasi.
   * @returns {boolean} - True jika email valid, false jika tidak.
   */
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Menampilkan pesan error pada input email.
   * @param {string} message - Pesan error yang ditampilkan.
   */
  function showEmailError(message) {
    if (!newsletterEmail || !emailError) return;
    newsletterEmail.classList.add('is-invalid');
    newsletterEmail.classList.remove('is-valid');
    emailError.textContent = message;
    emailError.classList.remove('hidden');
  }

  /**
   * Menghapus pesan error dari input email.
   */
  function clearEmailError() {
    if (!newsletterEmail || !emailError) return;
    newsletterEmail.classList.remove('is-invalid');
    emailError.classList.add('hidden');
  }

  /**
   * Menampilkan status valid pada input email.
   */
  function showEmailValid() {
    if (!newsletterEmail || !emailError) return;
    newsletterEmail.classList.remove('is-invalid');
    newsletterEmail.classList.add('is-valid');
    emailError.classList.add('hidden');
  }

  // Validasi real-time saat mengetik
  if (newsletterEmail) {
    newsletterEmail.addEventListener('input', function () {
      const emailValue = this.value.trim();
      if (emailValue === '') {
        clearEmailError();
        this.classList.remove('is-valid');
      } else if (isValidEmail(emailValue)) {
        showEmailValid();
      } else {
        showEmailError('Masukkan email yang valid.');
      }
    });
  }

  /**
   * Event handler untuk submit form newsletter.
   * Memvalidasi email dan menampilkan modal konfirmasi
   * jika input valid.
   */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const emailValue = newsletterEmail.value.trim();

      if (emailValue === '') {
        showEmailError('Email tidak boleh kosong.');
        return;
      }

      if (!isValidEmail(emailValue)) {
        showEmailError('Format email tidak valid. Contoh: nama@email.com');
        return;
      }

      // Email valid — tampilkan modal konfirmasi
      showEmailValid();
      const newsletterModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
      newsletterModal.show();

      // Reset form setelah berhasil
      newsletterForm.reset();
      newsletterEmail.classList.remove('is-valid');
    });
  }

  // ========== 4. COUNTER ANIMATION ==========

  /**
   * Menganimasikan angka statistik dari 0 ke nilai target
   * menggunakan Intersection Observer untuk trigger saat elemen
   * terlihat di viewport.
   */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  /**
   * Menganimasikan satu elemen counter dari 0 ke targetnya.
   * @param {HTMLElement} element - Elemen yang berisi angka statistik.
   */
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    /**
     * Fungsi easing untuk animasi yang lebih natural.
     * @param {number} t - Progress animasi (0-1).
     * @returns {number} - Nilai eased.
     */
    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const currentValue = Math.round(target * easedProgress);

      element.textContent = currentValue + '%';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Intersection Observer untuk counter
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        statNumbers.forEach(function (counter) {
          animateCounter(counter);
        });
      }
    });
  }, {
    threshold: 0.5
  });

  // Observe section hasil penggunaan
  const hasilSection = document.getElementById('hasil-penggunaan');
  if (hasilSection) {
    counterObserver.observe(hasilSection);
  }

  // ========== 5. SCROLL REVEAL ANIMATIONS ==========

  /**
   * Menambahkan animasi reveal saat elemen muncul
   * di viewport menggunakan Intersection Observer.
   * Targets cards and containers in each section by their IDs.
   */
  const revealSelectors = [
    '#ingredientPanthenol',
    '#ingredientCeramide',
    '#ingredientEction',
    '#ingredientCentella',
    '#benefitMoisture',
    '#benefitAcne',
    '#benefitRedness',
    '#testimonialNadya',
    '#testimonialMia',
    '#testimonialAlya',
    '#testimonialLuna',
    '#statAcne',
    '#statRedness',
    '#statMoisture',
    '#ingredientAccordion',
    '#ingredientDetails'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(', '));

  revealElements.forEach(function (element) {
    element.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });

  // ========== 6. INITIALIZATION ==========
  handleNavbarScroll();
  highlightActiveNavLink();
});
