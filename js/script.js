'use strict';

document.documentElement.classList.add('js-ready');

// Reveal content only when it enters the viewport; fall back gracefully.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Highlight the current navigation section while scrolling.
const sectionLinks = Array.from(document.querySelectorAll('.navbar .nav-link[href^="#"]'));
const trackedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-28% 0px -60% 0px', threshold: 0 });
  trackedSections.forEach((section) => navObserver.observe(section));
}

// Close the mobile Bootstrap menu after choosing a section.
const navCollapse = document.getElementById('mainNav');
if (navCollapse && window.bootstrap) {
  const mobileNav = window.bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
  sectionLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 991.98px)').matches) mobileNav.hide();
    });
  });
}

// Small role rotator. These are interests/statuses, not claims of employment.
const typedRole = document.getElementById('typed-role');
const roleMessages = ['CAI Student', 'สนใจ AI & Web Development', 'Learning new technologies'];
if (typedRole && !reduceMotion) {
  let roleIndex = 0;
  let charIndex = roleMessages[0].length;
  let deleting = false;
  const typeNext = () => {
    const message = roleMessages[roleIndex];
    if (deleting) {
      charIndex = Math.max(0, charIndex - 1);
      typedRole.textContent = message.slice(0, charIndex);
    } else {
      charIndex = Math.min(message.length, charIndex + 1);
      typedRole.textContent = message.slice(0, charIndex);
    }
    let delay = deleting ? 35 : 65;
    if (!deleting && charIndex === message.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roleMessages.length;
      delay = 300;
    }
    window.setTimeout(typeNext, delay);
  };
  window.setTimeout(typeNext, 2000);
}

// Copy the email address with a visible success/fallback message.
const copyButton = document.querySelector('[data-copy-email]');
const copyFeedback = document.getElementById('copyFeedback');
if (copyButton && copyFeedback) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.getAttribute('data-copy-email');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = 'คัดลอกอีเมลแล้ว';
      } else {
        const temporaryInput = document.createElement('textarea');
        temporaryInput.value = email;
        temporaryInput.setAttribute('readonly', '');
        temporaryInput.style.position = 'absolute';
        temporaryInput.style.left = '-9999px';
        document.body.appendChild(temporaryInput);
        temporaryInput.select();
        const copied = document.execCommand('copy');
        temporaryInput.remove();
        copyFeedback.textContent = copied ? 'คัดลอกอีเมลแล้ว' : 'อีเมล: ' + email;
      }
    } catch (error) {
      copyFeedback.textContent = 'อีเมลสำหรับติดต่อ: ' + email;
    }
    window.setTimeout(() => { copyFeedback.textContent = ''; }, 3500);
  });
}

// Use the current year without hard-coding it in the footer.
const yearElement = document.getElementById('copyrightYear');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());
