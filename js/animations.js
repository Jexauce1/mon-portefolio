/**
 * animations.js
 * ─────────────────────────────────────────────────────────
 * Toutes les animations GSAP du portfolio :
 *   - Curseur custom
 *   - Hero : slide-up des lignes de texte
 *   - Nav : shrink au scroll
 *   - Projects : fade-in au scroll (ScrollTrigger)
 *   - Skills : barres qui se remplissent
 *   - Contact : big text reveal
 *   - Effet glitch sur le nom au hover
 * ─────────────────────────────────────────────────────────
 */

(function () {

  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────
     CURSEUR CUSTOM
  ───────────────────────────────────── */
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');

  // Position "cible" — le cercle suit avec un délai (lerp en JS)
  let mouseX = 0, mouseY = 0;
  let curX   = 0, curY   = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Le point suit instantanément
    gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0 });
  });

  // Le grand cercle suit avec un léger lag (feel premium)
  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    gsap.set(cursor, { x: curX, y: curY });
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Expand sur les liens et projets
  document.querySelectorAll('a, .project-row, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 1.7, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });

  /* ─────────────────────────────────────
     NAV : shrink au scroll
  ───────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -60px',
    onEnter:      () => navbar.classList.add('scrolled'),
    onLeaveBack:  () => navbar.classList.remove('scrolled'),
  });

  /* ─────────────────────────────────────
     HERO — slide-up des lignes de texte
  ───────────────────────────────────── */
  const heroTL = gsap.timeline({ delay: 0.2 });

  // Tag
  heroTL.to('#heroTag', {
    opacity: 1, y: 0,
    duration: 0.6, ease: 'power2.out',
    from: { y: 16 }
  });

  // Lignes du nom : chaque .line-inner glisse de translateY(110%) → 0
  heroTL.to('.line-inner', {
    y: 0,
    duration: 0.9,
    ease: 'power4.out',
    stagger: 0.12
  }, '-=0.2');

  // Sous-titre
  heroTL.to('#heroSub', {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
    from: { y: 12 }
  }, '-=0.4');

  // Ligne accent
  heroTL.to('#heroLine', {
    width: '80px', duration: 0.9, ease: 'power3.inOut'
  }, '-=0.3');

  // Scroll hint
  heroTL.to('#scrollHint', {
    opacity: 1, duration: 0.5
  }, '-=0.2');

  /* ─────────────────────────────────────
     HERO — glitch au hover du nom
  ───────────────────────────────────── */
  const heroName = document.getElementById('heroName');
  heroName.addEventListener('mouseenter', () => {
    gsap.timeline()
      .to(heroName, { skewX: 5,  duration: 0.07, ease: 'none' })
      .to(heroName, { skewX: -3, duration: 0.07, ease: 'none' })
      .to(heroName, { skewX: 2,  duration: 0.07, ease: 'none' })
      .to(heroName, { skewX: 0,  duration: 0.07, ease: 'none' });
  });

  /* ─────────────────────────────────────
     PROJECTS — fade-in stagger au scroll
  ───────────────────────────────────── */
  // On anime les lignes visibles (pas les .hidden)
  function animateVisibleRows() {
    const rows = document.querySelectorAll('.project-row:not(.hidden)');
    gsap.fromTo(rows,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform'
      }
    );
  }

  ScrollTrigger.create({
    trigger: '#projects',
    start: 'top 75%',
    once: true,
    onEnter: animateVisibleRows
  });

  // Export pour que filters.js puisse rappeler l'anim
  window.animateVisibleRows = animateVisibleRows;

  /* ─────────────────────────────────────
     SECTION TITLES — slide-in
  ───────────────────────────────────── */
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.fromTo(title,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%'
        }
      }
    );
  });

  /* ─────────────────────────────────────
     SKILLS — barres qui se remplissent
  ───────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '#skillsList',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.skill-fill').forEach((bar, i) => {
        const targetWidth = bar.getAttribute('data-width') + '%';
        gsap.to(bar, {
          width: targetWidth,
          duration: 1.4,
          delay: i * 0.08,
          ease: 'power2.out'
        });
      });
    }
  });

  /* ─────────────────────────────────────
     STATS — counter-up
  ───────────────────────────────────── */
  ScrollTrigger.create({
    trigger: '.stats-row',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo('.stat',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  });

  /* ─────────────────────────────────────
     CONTACT — big text reveal
  ───────────────────────────────────── */
  gsap.fromTo('.contact-big',
    { opacity: 0, y: 80 },
    {
      opacity: 1, y: 0,
      duration: 1.1, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-big',
        start: 'top 80%'
      }
    }
  );

  gsap.fromTo('.contact-sub',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0,
      duration: 0.8, ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact-sub',
        start: 'top 85%'
      }
    }
  );

  gsap.fromTo('.contact-link',
    { opacity: 0, y: 16 },
    {
      opacity: 1, y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact-row',
        start: 'top 88%'
      }
    }
  );


  /* ─────────────────────────────────────
     HAMBURGER — menu mobile GSAP
  ───────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileAvail = document.querySelector('.mobile-available');

  let menuOpen = false;

  // Timeline d'ouverture (créée une fois, rejouée)
  const menuTL = gsap.timeline({ paused: true });

  menuTL
    // Fade-in du fond
    .to(mobileMenu, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out'
    })
    // Liens qui montent en stagger
    .to(mobileLinks, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out'
    }, '-=0.15')
    // Mention disponible
    .to(mobileAvail, {
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2');

  function openMenu() {
    menuOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // bloque le scroll
    menuTL.play();
  }

  function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    menuTL.reverse().then(() => {
      mobileMenu.classList.remove('active');
    });
  }

  hamburger.addEventListener('click', () => {
    menuOpen ? closeMenu() : openMenu();
  });

  // Ferme le menu quand on clique sur un lien
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Ferme avec Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

})(); // fin IIFE — NE PAS SUPPRIMER
