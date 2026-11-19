const menu = document.querySelector('.header__mobile');
if (menu) {
  let closeTimer;
  const cancelClose = () => {
    clearTimeout(closeTimer);
    menu.classList.remove('is-closing');
  };
  const close = () => {
    if (!menu.open || menu.classList.contains('is-closing')) return;
    menu.classList.add('is-closing');
    closeTimer = setTimeout(() => {
      menu.open = false;
      menu.classList.remove('is-closing');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320);
  };
  menu.querySelector('summary').addEventListener('click', event => {
    event.preventDefault();
    if (!menu.open) {
      cancelClose();
      menu.classList.add('is-opening');
      menu.open = true;
      // Commit the clipped state before starting the opening transition.
      menu.querySelector('nav').getBoundingClientRect();
      requestAnimationFrame(() => menu.classList.remove('is-opening'));
      return;
    }
    if (menu.classList.contains('is-closing')) cancelClose();
    else close();
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) close();
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !menu.open) return;
    close();
    menu.querySelector('summary').focus();
  });
}

document.querySelectorAll('[data-select]').forEach(select => {
  const summary = select.querySelector('summary');
  const options = Array.from(select.querySelectorAll('[data-select-option]'));
  let closeTimer;
  const cancelClose = () => {
    clearTimeout(closeTimer);
    select.classList.remove('is-closing');
  };
  const close = () => {
    if (!select.open || select.classList.contains('is-closing')) return;
    select.classList.add('is-closing');
    closeTimer = setTimeout(() => {
      select.open = false;
      select.classList.remove('is-closing');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280);
  };
  select.addEventListener('select-close', close);
  summary.addEventListener('click', event => {
    if (!select.open) { cancelClose(); return; }
    event.preventDefault();
    if (select.classList.contains('is-closing')) cancelClose();
    else close();
  });
  select.addEventListener('toggle', () => {
    if (!select.open) return;
    document.querySelectorAll('[data-select][open]').forEach(other => {
      if (other !== select) other.dispatchEvent(new Event('select-close'));
    });
  });
  options.forEach(option => option.addEventListener('click', () => {
    select.querySelector('[data-select-label]').textContent = (option.querySelector('[data-vehicle-name]') || option).textContent.trim();
    options.forEach(other => other.setAttribute('aria-pressed', String(other === option)));
    select.dispatchEvent(new CustomEvent('select-change', { bubbles: true, detail: { option } }));
    close();
    summary.focus({ preventScroll: true });
  }));
  select.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      close();
      summary.focus({ preventScroll: true });
      event.preventDefault();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    cancelClose();
    select.open = true;
    const index = options.indexOf(document.activeElement);
    let next = event.key === 'ArrowUp' ? index - 1 : index + 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = options.length - 1;
    options[(next + options.length) % options.length].focus();
  });
  document.addEventListener('click', event => {
    if (!select.contains(event.target)) close();
  });
  select.addEventListener('focusout', event => {
    if (!select.contains(event.relatedTarget)) close();
  });
});

document.querySelectorAll('.car-card__colors, [data-vehicle-colors]').forEach(colors => {
  colors.addEventListener('click', event => {
    const selected = event.target.closest('.car-card__color');
    if (!selected) return;
    colors.querySelectorAll('.car-card__color').forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
  });
});

const trims = Array.from(document.querySelectorAll('[data-trim]'));
const trimMobile = matchMedia('(max-width: 700px)');
const setTrimOpen = (trim, open) => {
  if (trim.hasAttribute('data-trim-mobile-open') && trimMobile.matches) open = true;
  trim.classList.toggle('is-collapsed', !open);
  trim.querySelector('[data-trim-toggle]').setAttribute('aria-expanded', String(open));
  const body = trim.querySelector('.vehicle-trim__body');
  body.inert = !open;
  body.setAttribute('aria-hidden', String(!open));
};
trims.forEach(trim => {
  const mobileOpen = trim.hasAttribute('data-trim-mobile-open');
  setTrimOpen(trim, mobileOpen && trimMobile.matches);
  if (mobileOpen) trimMobile.addEventListener('change', () => setTrimOpen(trim, trimMobile.matches));
  trim.querySelector('.vehicle-trim__body').getAnimations().forEach(animation => animation.finish());
  trim.querySelector('.vehicle-trim__header').addEventListener('click', event => {
    if (event.target.closest('a')) return;
    const open = trim.classList.contains('is-collapsed');
    if (open) trims.forEach(other => { if (other !== trim) setTrimOpen(other, false); });
    setTrimOpen(trim, open);
  });
});

document.querySelectorAll('[data-placeholder-link]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

document.querySelectorAll('[data-scroll-content]').forEach(content => {
  const menu = content.parentElement;
  const track = menu.querySelector('[data-scroll-track]');
  const thumb = track.querySelector('[data-scroll-thumb]');
  const update = () => {
    const overflow = content.scrollHeight - content.clientHeight;
    track.hidden = overflow <= 0;
    const height = Math.max(24, track.clientHeight * content.clientHeight / content.scrollHeight);
    const position = overflow > 0 ? content.scrollTop / overflow * (track.clientHeight - height) : 0;
    track.style.setProperty('--scroll-height', height + 'px');
    track.style.setProperty('--scroll-position', position + 'px');
    thumb.setAttribute('aria-valuenow', String(Math.round(overflow > 0 ? content.scrollTop / overflow * 100 : 0)));
  };
  content.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(content);
  let startY = 0;
  let startScroll = 0;
  thumb.addEventListener('pointerdown', event => {
    event.preventDefault();
    startY = event.clientY;
    startScroll = content.scrollTop;
    thumb.setPointerCapture(event.pointerId);
  });
  thumb.addEventListener('pointermove', event => {
    if (!thumb.hasPointerCapture(event.pointerId)) return;
    const travel = track.clientHeight - thumb.offsetHeight;
    if (travel > 0) content.scrollTop = startScroll + (event.clientY - startY) / travel * (content.scrollHeight - content.clientHeight);
  });
  thumb.addEventListener('pointerup', event => thumb.releasePointerCapture(event.pointerId));
  thumb.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') content.scrollTop = 0;
    else if (event.key === 'End') content.scrollTop = content.scrollHeight;
    else content.scrollTop += (event.key.includes('Down') ? 1 : -1) * (event.key.includes('Page') ? content.clientHeight : 36);
  });
  update();
});

document.querySelectorAll('[data-vehicle-slider]').forEach(slider => {
  if (document.body.classList.contains('special-offer-page')) {
    const track = slider.querySelector('.vehicle-slider__track');
    const slides = Array.from(track.children);
    const dots = Array.from(slider.querySelectorAll('[data-vehicle-slide]'));
    const mobile = matchMedia('(max-width: 700px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let swiper;
    const update = () => {
      const enabled = !slider.hasAttribute('data-mobile-only') || mobile.matches;
      if (!enabled) {
        swiper?.destroy(true, true);
        swiper = undefined;
        slider.classList.remove('vehicle-slider--swiper');
        return;
      }
      if (swiper) return;
      slider.classList.add('swiper', 'vehicle-slider--swiper');
      track.classList.add('swiper-wrapper');
      slides.forEach(slide => slide.classList.add('swiper-slide'));
      swiper = new Swiper(slider, {
        slidesPerView: 1,
        loop: true,
        speed: reduced.matches ? 0 : 400,
        navigation: { prevEl: slider.querySelector('[data-vehicle-prev]'), nextEl: slider.querySelector('[data-vehicle-next]') },
        keyboard: { enabled: true, onlyInViewport: true },
        on: { slideChange(instance) { dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === instance.realIndex))); } },
      });
    };
    dots.forEach((dot, index) => dot.addEventListener('click', () => swiper?.slideToLoop(index)));
    mobile.addEventListener('change', update);
    reduced.addEventListener('change', () => { if (swiper) swiper.params.speed = reduced.matches ? 0 : 400; });
    update();
    return;
  }
  const track = slider.querySelector('.vehicle-slider__track');
  const slides = Array.from(track.children);
  const dots = Array.from(slider.querySelectorAll('[data-vehicle-slide]'));
  const current = () => Math.round(track.scrollLeft / (slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0)));
  const goTo = index => {
    const slide = slides[(index + slides.length) % slides.length];
    track.scrollTo({
      left: slide.offsetLeft - slides[0].offsetLeft,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };
  slider.querySelector('[data-vehicle-prev]')?.addEventListener('click', () => goTo(current() - 1));
  slider.querySelector('[data-vehicle-next]')?.addEventListener('click', () => goTo(current() + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
  const update = () => dots.forEach((dot, index) => dot.setAttribute('aria-current', String(index === current())));
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
});

const vehicleMobile = matchMedia('(max-width: 700px)');
document.querySelectorAll('.vehicle-feature__description').forEach(description => {
  const summary = description.querySelector('summary');
  const text = description.querySelector('p');
  let expanded = false;
  let animations = [];
  const update = () => {
    animations.forEach(animation => animation.cancel());
    description.open = !vehicleMobile.matches || expanded;
    description.classList.toggle('is-expanded', description.open);
  };
  summary.addEventListener('click', async event => {
    if (!vehicleMobile.matches) return;
    event.preventDefault();
    if (expanded) return;
    const start = text.getBoundingClientRect().height;
    expanded = true;
    description.open = true;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
    animations = [
      text.animate([{ height: start + 'px' }, { height: text.scrollHeight + 'px' }], { duration, easing: 'ease-in-out' }),
      summary.animate([{ opacity: 1, translate: '0 0' }, { opacity: 1, translate: '0 6px', offset: .65 }, { opacity: 0, translate: '0 12px' }], { duration, easing: 'ease-in-out' }),
    ];
    await Promise.allSettled(animations.map(animation => animation.finished));
    if (summary === document.activeElement) {
      text.setAttribute('tabindex', '-1');
      text.focus({ preventScroll: true });
      text.addEventListener('blur', () => text.removeAttribute('tabindex'), { once: true });
    }
    update();
  });
  vehicleMobile.addEventListener('change', update);
  update();
});

document.querySelectorAll('[data-expand]').forEach(button => {
  const list = document.getElementById(button.getAttribute('aria-controls'));
  const label = button.firstChild;
  const update = expanded => {
    list.classList.toggle('is-collapsed', !expanded);
    button.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? 'Свернуть ' : 'Показать ещё ';
  };
  update(false);
  button.addEventListener('click', () => update(button.getAttribute('aria-expanded') !== 'true'));
});

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const swiper = new Swiper(carousel.querySelector('.offers__slider'), {
    slidesPerView: 1.11,
    spaceBetween: 11,
    loop: true,
    // Swiper 9 reorders existing slides; match the loop span to each layout.
    loopedSlides: 2,
    speed: reducedMotion.matches ? 0 : 400,
    navigation: { prevEl: carousel.querySelector('[data-prev]'), nextEl: carousel.querySelector('[data-next]') },
    breakpoints: {
      481: { slidesPerView: 2, loopedSlides: 2, spaceBetween: 20 },
      901: { slidesPerView: 3, loopedSlides: 3, spaceBetween: 20 },
    },
    a11y: { prevSlideMessage: 'Предыдущее предложение', nextSlideMessage: 'Следующее предложение' },
  });
  reducedMotion.addEventListener('change', () => { swiper.params.speed = reducedMotion.matches ? 0 : 400; });
});

const ribbon = document.querySelector('.hero__ribbon');
if (ribbon) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const swiper = new Swiper(ribbon, {
    slidesPerView: 'auto',
    loop: true,
    speed: 30000,
    allowTouchMove: false,
    autoplay: reducedMotion.matches ? false : { delay: 0, disableOnInteraction: false },
    a11y: false,
  });
  document.fonts.ready.then(() => swiper.update());
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      swiper.autoplay.stop();
      swiper.setTranslate(swiper.getTranslate());
      swiper.setTransition(0);
    } else {
      swiper.params.autoplay = { delay: 0, disableOnInteraction: false, waitForTransition: true };
      swiper.autoplay.start();
    }
  });
}

const credit = document.querySelector('[data-credit]');
if (credit) {
  const down = credit.querySelector('#credit-down');
  const term = credit.querySelector('#credit-term');
  const priceInput = credit.querySelector('#credit-price');
  const money = new Intl.NumberFormat('ru-RU');
  const plural = new Intl.PluralRules('ru-RU');
  const years = { one: 'год', few: 'года', many: 'лет', other: 'лет' };
  const months = { one: 'месяц', few: 'месяца', many: 'месяцев', other: 'месяца' };
  const rubles = value => money.format(Math.round(value)) + ' ₽';
  const write = (id, value) => { credit.querySelector(id).textContent = value; };
  const updateRange = range => {
    const progress = (Number(range.value) - Number(range.min)) / (Number(range.max) - Number(range.min)) * 100;
    range.style.setProperty('--range-progress', progress + '%');
  };
  [down, term].forEach(range => {
    updateRange(range);
    range.addEventListener('input', () => updateRange(range));
  });

  const calculate = () => {
    const price = Number(priceInput.value.replace(/\D/g, ''));
    const deposit = price * Number(down.value) / 100;
    const principal = price - deposit;
    const duration = Number(term.value);
    const monthlyRate = .16 / 12;
    const payment = principal * monthlyRate / (1 - (1 + monthlyRate) ** -duration);
    const fullYears = Math.floor(duration / 12);
    const remaining = duration % 12;

    write('#credit-down-value', down.value + '%');
    write('#credit-down-sum', '(' + rubles(deposit) + ')');
    write('#credit-term-value', [
      fullYears && fullYears + ' ' + years[plural.select(fullYears)],
      remaining && remaining + ' ' + months[plural.select(remaining)],
    ].filter(Boolean).join(' и '));
    write('#credit-monthly', rubles(payment) + '/мес');
    write('#credit-daily', 'это ~' + rubles(payment * 12 / 365) + ' в день');
    write('#credit-sum', rubles(principal));
    write('#credit-total', rubles(payment * duration));
  };
  credit.addEventListener('input', calculate);
  credit.addEventListener('select-change', event => {
    const option = event.detail.option;
    const price = option.querySelector('[data-vehicle-price]');
    if (!price) return;
    priceInput.value = price.textContent.trim();
    const photo = option.querySelector('[data-vehicle-image]');
    const image = credit.querySelector('.credit__vehicle-image');
    image.src = photo.getAttribute('src');
    image.alt = photo.alt;
    credit.querySelector('.credit__model > p').textContent = option.querySelector('[data-vehicle-description]').textContent;
    calculate();
  });
}

const consultation = document.querySelector('[data-consultation]');
if (consultation) {
  const phone = consultation.querySelector('input[type="tel"]');
  $(phone).mask('+7 (999) 999-99-99', { autoclear: false });
  const validatePhone = () => phone.setCustomValidity(phone.value && !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone.value) ? 'Введите номер телефона полностью' : '');
  phone.addEventListener('input', validatePhone);
  phone.addEventListener('blur', validatePhone);
  consultation.addEventListener('submit', event => {
    event.preventDefault();
    consultation.querySelector('[role="status"]').hidden = false;
  });
  consultation.querySelector('button[type="submit"]').disabled = false;
}
