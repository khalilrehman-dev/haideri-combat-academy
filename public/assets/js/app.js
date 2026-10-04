/* Haideri Combat Academy: progressive enhancement, no frameworks or trackers. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const data = window.HCA || { site: {}, media: { photos: [], videos: [] }, stances: [] };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const text = (selector, value, root = document) => {
    const element = $(selector, root);
    if (element) element.textContent = value;
  };
  const params = () => new URLSearchParams(window.location.search);
  const updateURL = (entries) => {
    try {
      const url = new URL(window.location.href);
      Object.entries(entries).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== 'featured') url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      });
      window.history.replaceState({}, '', url);
    } catch (_) { /* Opening the static site as file:// may restrict history changes. */ }
  };
  const makeIcon = (name) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    use.setAttribute('href', `#i-${name}`);
    svg.append(use);
    return svg;
  };
  const makeLink = (href, label, className = 'button secondary') => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    link.className = className;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.append(makeIcon('up-right'));
    return link;
  };
  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // Accessible modal dialogs, explicit keyboard containment and Escape handling.
  const focusBeforeDialog = new WeakMap();
  const menu = $('#navigation-dialog');
  const menuToggle = $('.menu-toggle');
  const mediaDialog = $('#media-dialog');
  const stage = $('#media-stage');
  let photoItems = [];
  let photoIndex = 0;
  let mediaKind = '';
  const syncBodyLock = () => document.body.classList.toggle('dialog-open', !!$('dialog[open]'));
  const openDialog = (dialog) => {
    if (!dialog || typeof dialog.showModal !== 'function') return false;
    focusBeforeDialog.set(dialog, document.activeElement);
    $$('dialog[open]').filter(x => x !== dialog).forEach(x => x.close());
    if (!dialog.open) dialog.showModal();
    syncBodyLock();
    return true;
  };
  const collapseMenuState = () => {
    if (!menuToggle) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('cancel', () => {
      if (dialog === menu) collapseMenuState();
    });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const focusable = $$('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', dialog)
        .filter(element => element.getClientRects().length && !element.closest('[hidden]'));
      if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault(); first.focus();
      }
    });
    $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      // A queued close event can arrive after a very quick re-open. Do not
      // clear the newly opened viewer or move focus behind the modal.
      if (dialog.open) return;
      if (dialog === menu) collapseMenuState();
      if (dialog === mediaDialog) {
        const video = $('video', stage);
        if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
        stage.replaceChildren(); // Removes iframes too, so background playback stops.
        mediaKind = '';
      }
      syncBodyLock();
      const previous = focusBeforeDialog.get(dialog);
      if (!$('dialog[open]') && previous instanceof HTMLElement && previous.isConnected && previous.getClientRects().length) previous.focus({ preventScroll: true });
    });
  });
  if (menu && menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (openDialog(menu)) {
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close navigation menu');
      }
    });
    $$('a', menu).forEach(link => link.addEventListener('click', () => menu.close()));
    window.matchMedia('(min-width: 961px)').addEventListener('change', event => {
      if (event.matches && menu.open) menu.close();
    });
  }

  // Search, tags, discipline filters, ordering and shareable query strings.
  const filterControllers = [];
  $$('[data-filter-root]').forEach(root => {
    const controls = $$('[data-filter]', root);
    const items = $$('[data-filter-item]', root);
    const grid = $('[data-filter-grid]', root);
    const count = $('[data-filter-count]', root);
    const empty = $('[data-filter-empty]', root);
    const state = {};
    const defaults = { category: 'all', tag: 'all', search: '', sort: 'featured' };
    controls.forEach(control => {
      const key = control.dataset.filter;
      let value = params().get(key) || defaults[key] || '';
      if (control.tagName === 'SELECT' && ![...control.options].some(option => option.value === value)) value = defaults[key];
      if (control.type === 'hidden') {
        const allowed = $$(`[data-set-filter="${key}"]`, root).map(button => button.dataset.value);
        if (!allowed.includes(value)) value = defaults[key];
      }
      control.value = value;
      state[key] = value;
    });
    if (count) { count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite'); }
    const apply = (writeURL = true) => {
      controls.forEach(control => { state[control.dataset.filter] = control.value; });
      const search = (state.search || '').trim().toLocaleLowerCase();
      let visible = 0;
      items.forEach(item => {
        const tags = (item.dataset.tags || '').split(/\s+/);
        const category = item.dataset.category || '';
        const searchable = [item.dataset.title, item.textContent, ...tags].join(' ').toLocaleLowerCase();
        const match = (!state.category || state.category === 'all' || category === state.category)
          && (!state.tag || state.tag === 'all' || tags.includes(state.tag))
          && (!search || searchable.includes(search));
        item.hidden = !match;
        if (match) visible += 1;
      });
      const ordered = [...items].sort((a, b) => {
        if (state.sort === 'title') return (a.dataset.title || '').localeCompare(b.dataset.title || '');
        if (state.sort === 'newest') return Number(b.dataset.order || 0) - Number(a.dataset.order || 0);
        const featured = Number(b.dataset.featured === 'true') - Number(a.dataset.featured === 'true');
        return featured || Number(a.dataset.order || 0) - Number(b.dataset.order || 0);
      });
      if (grid) ordered.forEach(item => grid.append(item));
      if (empty) empty.hidden = visible > 0;
      const plural = root.dataset.countLabel || 'items';
      text('[data-filter-count]', `${visible} ${visible === 1 ? plural.replace(/s$/, '') : plural}`, root);
      $$('[data-set-filter]', root).forEach(button => {
        const selected = state[button.dataset.setFilter] === button.dataset.value;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
      if (writeURL) updateURL(state);
    };
    controls.forEach(control => control.addEventListener(control.type === 'search' ? 'input' : 'change', () => apply()));
    $$('[data-set-filter]', root).forEach(button => button.addEventListener('click', () => {
      const control = controls.find(x => x.dataset.filter === button.dataset.setFilter);
      if (control) control.value = button.dataset.value;
      apply();
    }));
    $$('[data-clear-filters]', root).forEach(button => button.addEventListener('click', () => {
      controls.forEach(control => { control.value = defaults[control.dataset.filter] || ''; });
      apply();
    }));
    apply(false);
    filterControllers.push({ root, apply });
  });

  const showPhoto = () => {
    const photo = photoItems[photoIndex];
    if (!photo || !stage) return;
    mediaKind = 'photo';
    text('#media-title', photo.title);
    text('#media-description', photo.description);
    text('#media-counter', `PHOTO ${photoIndex + 1} OF ${photoItems.length}`);
    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt || photo.title;
    image.decoding = 'async';
    image.addEventListener('error', () => {
      const error = document.createElement('p');
      error.className = 'media-error';
      error.textContent = 'This photo could not be loaded. Please close the viewer and try again.';
      stage.replaceChildren(error);
    }, { once: true });
    stage.replaceChildren(image);
    const nav = $('.media-navigation', mediaDialog);
    if (nav) nav.hidden = photoItems.length < 2;
  };
  $$('[data-open-photo]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !mediaDialog || typeof mediaDialog.showModal !== 'function') return;
    const scope = link.closest('[data-filter-root]') || link.closest('.photo-grid') || document;
    const visibleIDs = $$('[data-open-photo]', scope)
      .filter(item => !item.closest('[data-filter-item]')?.hidden)
      .map(item => item.dataset.openPhoto);
    photoItems = visibleIDs.map(id => data.media.photos.find(photo => photo.id === id)).filter(Boolean);
    photoIndex = photoItems.findIndex(photo => photo.id === link.dataset.openPhoto);
    if (photoIndex < 0) return;
    event.preventDefault();
    showPhoto();
    openDialog(mediaDialog);
  }));
  const stepPhoto = (delta) => {
    if (mediaKind !== 'photo' || !photoItems.length) return;
    photoIndex = (photoIndex + delta + photoItems.length) % photoItems.length;
    showPhoto();
  };
  $('[data-previous-photo]')?.addEventListener('click', () => stepPhoto(-1));
  $('[data-next-photo]')?.addEventListener('click', () => stepPhoto(1));
  mediaDialog?.addEventListener('keydown', event => {
    if (mediaKind !== 'photo') return;
    if (event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); stepPhoto(-1); }
  });
  let touchStart = null;
  stage?.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' && mediaKind === 'photo') touchStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  stage?.addEventListener('pointerup', event => {
    if (!touchStart || mediaKind !== 'photo') return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 70) stepPhoto(dx < 0 ? 1 : -1);
    touchStart = null;
  }, { passive: true });

  // Real file playback and opt-in YouTube embeds; no sample clips are invented.
  $$('[data-open-video]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !mediaDialog || typeof mediaDialog.showModal !== 'function') return;
    const clip = data.media.videos.find(video => video.id === link.dataset.openVideo);
    if (!clip) return;
    event.preventDefault();
    mediaKind = 'video';
    text('#media-title', clip.title);
    text('#media-description', clip.description);
    text('#media-counter', 'HAIDERI / VIDEO LIBRARY');
    $('.media-navigation', mediaDialog).hidden = true;
    stage.replaceChildren();
    if (clip.type === 'youtube' && /^[A-Za-z0-9_-]{11}$/.test(clip.youtubeId || '')) {
      const consent = document.createElement('div');
      consent.className = 'video-consent-card';
      consent.append(makeIcon('youtube'));
      const title = document.createElement('h3'); title.textContent = 'PLAY THIS YOUTUBE VIDEO?';
      const explanation = document.createElement('p');
      explanation.textContent = 'Loading this player connects your browser to YouTube. You can also watch directly on the official video page.';
      const load = document.createElement('button');
      load.type = 'button'; load.className = 'button primary'; load.textContent = 'Load YouTube player'; load.append(makeIcon('play'));
      load.addEventListener('click', () => {
        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube-nocookie.com/embed/${clip.youtubeId}?rel=0&autoplay=1`;
        frame.title = clip.title;
        frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.allowFullscreen = true;
        stage.replaceChildren(frame);
        const description = $('#media-description');
        description.replaceChildren(document.createTextNode(`${clip.description} `), makeLink(`https://www.youtube.com/watch?v=${clip.youtubeId}`, 'Open on YouTube', 'text-button'));
      }, { once: true });
      consent.append(title, explanation, load, makeLink(`https://www.youtube.com/watch?v=${clip.youtubeId}`, 'Watch on YouTube'));
      stage.append(consent);
    } else if (clip.type === 'file' && clip.src) {
      const video = document.createElement('video');
      video.src = clip.src;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      if (clip.poster) video.poster = clip.poster;
      video.setAttribute('aria-label', clip.title);
      if (clip.captions) {
        const track = document.createElement('track');
        track.kind = 'captions'; track.label = clip.captionLabel || 'English'; track.srclang = clip.captionLanguage || 'en'; track.src = clip.captions; track.default = true;
        video.append(track);
      }
      video.addEventListener('error', () => {
        const error = document.createElement('div'); error.className = 'video-consent-card';
        const message = document.createElement('p'); message.textContent = 'This browser could not play the video. Try opening the original file directly.';
        error.append(message, makeLink(clip.src, 'Open video directly'));
        stage.replaceChildren(error);
      }, { once: true });
      stage.append(video);
      video.play().catch(() => { /* Native controls remain available when autoplay is blocked. */ });
    }
    openDialog(mediaDialog);
  }));

  // A simple mirrored orientation explorer, with an accessible textual description.
  const compareButtons = $$('[data-compare-stance]');
  const compare = (id, writeURL = true) => {
    if (!['orthodox', 'southpaw'].includes(id)) return;
    const stance = data.stances.find(item => item.id === id);
    if (!stance) return;
    text('[data-stance-name]', `${stance.name.toUpperCase()}.`);
    text('[data-stance-summary]', stance.summary);
    text('[data-stance-lead]', stance.lead);
    text('[data-stance-rear]', stance.rear);
    const map = $('[data-stance-map]');
    if (map) {
      map.dataset.stanceMap = id;
      map.setAttribute('aria-label', `${stance.name} orientation: ${stance.lead.toLowerCase()} forward, ${stance.rear.toLowerCase()} to the rear.`);
    }
    compareButtons.forEach(button => {
      const selected = button.dataset.compareStance === id;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (writeURL) updateURL({ stance: id });
  };
  if (compareButtons.length) {
    compare(params().get('stance') || 'orthodox', false);
    compareButtons.forEach(button => button.addEventListener('click', () => compare(button.dataset.compareStance)));
  }

  // The browser prepares the message only. The visitor still presses Send in WhatsApp.
  const form = $('#enquiry-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const name = String(fields.get('name') || '').trim().slice(0, 80);
    if (name.length < 2) {
      const nameInput = $('#name', form);
      nameInput.setCustomValidity('Please enter your name.');
      nameInput.reportValidity();
      nameInput.addEventListener('input', () => nameInput.setCustomValidity(''), { once: true });
      return;
    }
    const interest = String(fields.get('discipline') || 'Help choosing a discipline');
    const experience = String(fields.get('experience') || 'Not specified');
    const message = String(fields.get('message') || '').trim().slice(0, 1200);
    const lines = [
      'Hello Haideri Combat Academy!',
      '',
      `My name is ${name}.`,
      `Interest: ${interest}`,
      `Experience: ${experience}`,
      ...(message ? ['', message] : []),
      '',
      'Please share the current training options, timings and fees. Thank you!'
    ];
    const url = `https://wa.me/${data.site.whatsapp || '923045261579'}?text=${encodeURIComponent(lines.join('\n'))}`;
    const status = $('#form-status');
    status.replaceChildren(document.createTextNode('Opening WhatsApp. Your message has not been sent yet. '), makeLink(url, 'Open chat manually', 'text-button'));
    window.location.assign(url);
  });

  // Keep old home-page location/contact bookmarks useful after the page split.
  if (document.body.dataset.page === 'index.html' && ['#location', '#connect'].includes(window.location.hash)) {
    window.location.replace('contact.html' + (window.location.hash === '#location' ? '#location' : '#enquiry'));
  }
})();
