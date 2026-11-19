/* Premium portfolio enhancement layer — load with defer, after the page markup. */
(() => {
  'use strict';
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();
  ready(() => {
    // Reading progress indicator
    const progress = document.createElement('div');
    progress.id = 'portfolio-reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    // Back-to-top button
    const topButton = document.createElement('button');
    topButton.id = 'portfolio-back-to-top';
    topButton.type = 'button';
    topButton.setAttribute('aria-label', 'Back to top');
    topButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(topButton);
    topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    let scheduled = false;
    const updateScrollUI = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
      topButton.classList.toggle('is-visible', window.scrollY > 420);
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateScrollUI); }
    }, { passive: true });
    window.addEventListener('resize', updateScrollUI, { passive: true });
    updateScrollUI();

    // Reveal content progressively; preserve visibility if IntersectionObserver is unavailable.
    const revealSelectors = 'section, .project-card, .project, .service-card, .skill-card, [data-reveal]';
    const revealItems = [...document.querySelectorAll(revealSelectors)];
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
      revealItems.forEach((element, index) => {
        element.setAttribute('data-portfolio-reveal', '');
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
        observer.observe(element);
      });
    }

    // Mark the navigation link for the section currently in view.
    const sections = [...document.querySelectorAll('main section[id], section[id]')];
    const navLinks = [...document.querySelectorAll('a[href^="#"]')];
    if ('IntersectionObserver' in window && sections.length) {
      const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active-section', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-25% 0px -65% 0px' });
      sections.forEach(section => navObserver.observe(section));
    }
  });
})();
