/** Maharani Films interaction layer.
 * Dependency-free by design: enqueue this file unchanged in WordPress.
 */
(function () {
  'use strict';

  const onReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  function setupReveal() {
    const items = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => observer.observe(item));
  }

  function setupVideo() {
    const video = document.querySelector('[data-hero-video]');
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        /* Poster remains a complete fallback when a browser blocks autoplay. */
      });
    }
  }

  function setupMediaSwitcher({ root, row, media, rowKey, mediaKey, initial }) {
    const scope = document.querySelector(root);
    if (!scope) return;

    const rows = Array.from(scope.querySelectorAll(row));
    const mediaItems = Array.from(scope.querySelectorAll(media));
    if (!rows.length || !mediaItems.length) return;

    const activate = (key) => {
      rows.forEach((item) => {
        const active = item.getAttribute(rowKey) === key;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });

      mediaItems.forEach((item) => {
        const active = item.getAttribute(mediaKey) === key;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-hidden', String(!active));
      });
    };

    rows.forEach((item) => {
      const key = item.getAttribute(rowKey);
      item.addEventListener('pointerenter', () => activate(key));
      item.addEventListener('focus', () => activate(key));
      item.addEventListener('click', () => activate(key));
      item.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activate(key);
      });
    });

    activate(initial || rows[0].getAttribute(rowKey));
  }

  onReady(() => {
    setupReveal();
    setupVideo();
    setupMediaSwitcher({
      root: '[data-weekend-switcher]',
      row: '.weekend-row',
      media: '.weekend-img',
      rowKey: 'data-target',
      mediaKey: 'data-step',
      initial: '01'
    });
    setupMediaSwitcher({
      root: '[data-traditions-switcher]',
      row: '.tradition-row',
      media: '.tradition-row__media',
      rowKey: 'data-target',
      mediaKey: 'data-step',
      initial: 'hindu'
    });
  });
})();
