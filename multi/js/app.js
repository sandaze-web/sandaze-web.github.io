function digitsOnly(value) {
  return value.replace(/\D/g, '');
}

function groupThousands(digits) {
  return digits.replace(/\B(?=(\d{3})+$)/g, ' ');
}

function initNumericInput(input, format) {
  input.addEventListener('input', event => {
    const value = format(digitsOnly(input.value));
    if (value === input.value) return;

    const digitsBeforeCaret = digitsOnly(input.value.slice(0, input.selectionStart)).length;
    const groups = value.match(/ ?\d/g) ?? [];
    let caret = groups.slice(0, digitsBeforeCaret).join('').length;
    if (event.inputType === 'deleteContentForward' && value[caret] === ' ') caret++;

    input.value = value;
    input.setSelectionRange(caret, caret);
  });
}

function initPhoneInputs() {
  const jquery = window.jQuery;
  if (!jquery?.fn.mask) return;

  jquery('.field--phone input').each(function () {
    const input = this;
    const phone = jquery(input).mask('+7 (999) 999-99-99', { autoclear: false });
    const clearEmptyMask = () => {
      if (!phone.mask()) input.value = '';
    };
    const insertCountryPrefix = event => {
      const digit = event.type === 'beforeinput' ? event.data : event.key;
      if (input.value || digit !== '7' || event.ctrlKey || event.metaKey || event.altKey || !event.cancelable) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      input.value = input.placeholder;
      input.setSelectionRange(4, 4);
    };

    // The plugin normally inserts the full mask before the user types.
    phone.off('focus.mask');
    input.addEventListener('keypress', insertCountryPrefix, true);
    input.addEventListener('beforeinput', insertCountryPrefix, true);
    phone.on('blur', clearEmptyMask);
    phone.on('keydown', event => {
      if (event.key === 'Backspace' || event.key === 'Delete') clearEmptyMask();
    });
    phone.on('input paste', () => window.setTimeout(clearEmptyMask, 0));
  });
}

function initInventoryRange(filters, name, format) {
  const min = filters.querySelector(`[name="${name}-min"]`);
  const max = filters.querySelector(`[name="${name}-max"]`);
  if (!min || !max) return;

  const updateRange = () => {
    const minDigits = digitsOnly(min.value);
    const maxDigits = digitsOnly(max.value);
    if (minDigits && maxDigits && BigInt(maxDigits) < BigInt(minDigits)) max.value = min.value;
  };

  [min, max].forEach(input => {
    initNumericInput(input, format);
    input.addEventListener('change', updateRange);
  });
  updateRange();
}

function initInventorySheets(inventory, filters) {
  const filterSheet = inventory.querySelector('.inventory-sheet--filters');
  if (!filterSheet) return;

  const compact = matchMedia('(max-width: 1080px)');
  const desktopSlot = filters.parentElement;
  const sheetSlot = filterSheet.querySelector('.inventory-sheet__fields');
  const sortSheet = inventory.querySelector('.inventory-sheet--sort');
  const desktopSort = filters.querySelector('[name="sort"]');
  const syncLayout = () => {
    if (compact.matches) sheetSlot.append(filters);
    else {
      filterSheet.close();
      sortSheet.close();
      desktopSlot.append(filters);
    }
  };
  compact.addEventListener('change', syncLayout);
  syncLayout();

  for (const sheet of [filterSheet, sortSheet]) {
    inventory.querySelector(`.inventory__toolbar [aria-controls="${sheet.id}"]`).addEventListener('click', () => {
      const scrollArea = sheet.querySelector('.inventory-sheet__content') || sheet;
      sheet.showModal();
      scrollArea.scrollTop = 0;
    });
    sheet.querySelector('.inventory-sheet__close').addEventListener('click', () => sheet.close());
    sheet.addEventListener('click', event => {
      if (event.target !== sheet) return;
      const { top, bottom, left, right } = sheet.getBoundingClientRect();
      if (event.clientY < top || event.clientY > bottom || event.clientX < left || event.clientX > right) sheet.close();
    });
  }

  filterSheet.querySelector('.inventory-sheet__reset').addEventListener('click', () => {
    for (const input of filters.querySelectorAll('input')) {
      if (input.type === 'checkbox') input.checked = false;
      else input.value = '';
    }
    const brand = filters.querySelector('[name="brand"]');
    brand.value = '';
    brand.dispatchEvent(new Event('change', { bubbles: true }));
  });

  desktopSort.addEventListener('change', () => {
    const radio = [...sortSheet.querySelectorAll('input')].find(option => option.value === desktopSort.value);
    if (radio) radio.checked = true;
  });
  sortSheet.addEventListener('change', event => {
    const value = event.target.value;
    if ([...desktopSort.options].some(option => option.value === value)) desktopSort.value = value;
    sortSheet.close();
  });
}

function initInventory(inventory) {
  const filters = inventory.querySelector('.inventory-filter');
  const grid = inventory.querySelector('.inventory__grid');
  const more = inventory.querySelector('.catalog__more');
  const template = inventory.querySelector('#inventory-card');
  const mobile = matchMedia('(max-width: 480px)');
  const desktopBatchSize = grid.childElementCount;
  const hasMobileToolbar = Boolean(inventory.querySelector('.inventory__toolbar'));
  const maxBatches = Number(more.dataset.maxBatches);
  let loadedBatches = 1;

  const brand = filters.querySelector('[name="brand"]');
  const model = filters.querySelector('[name="model"]');
  const updateModel = () => {
    model.disabled = !brand.value;
    if (model.disabled) model.value = '';
  };
  brand.addEventListener('change', updateModel);
  updateModel();
  initInventorySheets(inventory, filters);

  initInventoryRange(filters, 'price', groupThousands);
  initInventoryRange(filters, 'mileage', groupThousands);
  const currentYear = new Date().getFullYear();
  initInventoryRange(filters, 'year', digits => {
    const year = digits.slice(0, 4);
    return Number(year) > currentYear ? String(currentYear) : year;
  });

  more.addEventListener('click', () => {
    if (loadedBatches === maxBatches) return;
    const fragment = document.createDocumentFragment();
    const hiddenCards = mobile.matches ? [...grid.querySelectorAll('.car-card--inventory-extra')] : [];
    for (const card of hiddenCards) card.classList.remove('car-card--inventory-extra');
    const batchSize = hasMobileToolbar && mobile.matches ? 10 : desktopBatchSize;
    for (let index = hiddenCards.length; index < batchSize; index++) fragment.append(template.content.cloneNode(true));
    const firstCard = hiddenCards[0] || fragment.firstElementChild;
    const sliders = fragment.querySelectorAll('.car-card__slider');
    grid.append(fragment);
    sliders.forEach(initCarSlider);
    hiddenCards.forEach(card => card.querySelector('.car-card__slider')?.swiper?.update());
    loadedBatches++;
    more.hidden = loadedBatches === maxBatches;
    if (more.hidden) firstCard.querySelector('button').focus({ preventScroll: true });
  });

  initCarTrimMenus(grid);
}

function initCarTrimMenus(grid) {
  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-trim]');
    if (!button) return;
    const trim = button.closest('.car-trim');
    const engine = button.closest('.car-trim__group').querySelector('p').textContent;
    trim.querySelector('.car-trim__value').textContent = `${button.dataset.trim}, ${engine}`;
    trim.querySelector('[aria-pressed="true"]').setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-pressed', 'true');
    trim.querySelector('summary').focus({ preventScroll: true });
    trim.open = false;
  });
  grid.addEventListener('keydown', event => {
    const trim = event.target.closest('.car-trim[open]');
    if (event.key !== 'Escape' || !trim) return;
    trim.querySelector('summary').focus({ preventScroll: true });
    trim.open = false;
  });
  document.addEventListener('click', event => {
    const trim = grid.querySelector('.car-trim[open]');
    if (trim && !trim.contains(event.target)) trim.open = false;
  });
}

function initBankTicker(viewport) {
  const track = viewport.querySelector('.vehicle-banks__track');
  const list = track.firstElementChild;
  const resize = new ResizeObserver(() => {
    const distance = list.getBoundingClientRect().width;
    if (!distance) return;
    const listCount = Math.ceil(viewport.clientWidth / distance) + 1;

    while (track.childElementCount < listCount) {
      const copy = list.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.append(copy);
    }
    while (track.childElementCount > listCount) track.lastElementChild.remove();

    track.style.setProperty('--bank-distance', `${distance}px`);
    track.style.setProperty('--bank-duration', `${distance / 30}s`);
  });
  resize.observe(viewport);
  resize.observe(list);
}

function createPriceCounter(element, format) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame;
  let current;
  let target;

  return value => {
    value = Math.round(value);
    if (value === target) return;
    target = value;
    cancelAnimationFrame(frame);
    if (current === undefined || current === target || reducedMotion.matches) {
      current = target;
      element.textContent = format(current);
      element.removeAttribute('aria-busy');
      return;
    }

    const from = current;
    const start = performance.now();
    element.setAttribute('aria-busy', 'true');
    const tick = now => {
      const progress = Math.min(1, (now - start) / 360);
      current = Math.round(from + (target - from) * (1 - (1 - progress) ** 3));
      element.textContent = format(current);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else element.removeAttribute('aria-busy');
    };
    frame = requestAnimationFrame(tick);
  };
}

function initVehicleFinance(finance) {
  const price = finance.querySelector('#credit-price');
  const term = finance.querySelector('#credit-term');
  const deposit = finance.querySelector('#credit-deposit');
  const payment = finance.querySelector('.vehicle-finance__result output');
  const options = finance.querySelectorAll('[name="credit-option"]');
  const fixedPrice = Number(finance.dataset.vehiclePrice);
  const vehiclePrice = () => price ? price.valueAsNumber : fixedPrice;
  const monthlyRate = 0.049 / 12;
  const rubles = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  const updatePayment = createPriceCounter(payment, value => `от ${rubles.format(value)} ₽`);
  const duration = new Intl.NumberFormat('ru-RU', { style: 'unit', unit: 'month', unitDisplay: 'long' });
  const years = new Intl.NumberFormat('ru-RU', { style: 'unit', unit: 'year', unitDisplay: 'long' });

  const updateRange = (input, text) => {
    input.parentElement.querySelector('output').value = text;
    input.setAttribute('aria-valuetext', text);
    const min = Number(input.min);
    const progress = 100 * (input.valueAsNumber - min) / (Number(input.max) - min);
    input.style.setProperty('--range-progress', `${progress}%`);
  };

  const updateCalculator = () => {
    const termMonths = term.valueAsNumber;
    const fullYears = Math.floor(termMonths / 12);
    const remainingMonths = termMonths % 12;
    const termText = [
      fullYears ? years.format(fullYears) : '',
      remainingMonths ? duration.format(remainingMonths) : '',
    ].filter(Boolean).join(' ');
    const depositAmount = deposit.valueAsNumber;
    const principal = vehiclePrice() - depositAmount;
    const monthlyPayment = principal * monthlyRate / (1 - (1 + monthlyRate) ** -termMonths);

    updateRange(term, termText);
    updateRange(deposit, `${rubles.format(depositAmount)} ₽`);
    if (price) updateRange(price, `${rubles.format(vehiclePrice())} ₽`);
    updatePayment(monthlyPayment);
  };

  const applyOption = option => {
    if (option === 'payment' || option === 'rate') term.value = term.max;
    if (option === 'payment') deposit.value = deposit.max;
    if (option === 'no-deposit') {
      deposit.value = deposit.min;
      if (price) term.value = term.defaultValue;
    }
    updateCalculator();
  };

  term.addEventListener('input', updateCalculator);
  deposit.addEventListener('input', updateCalculator);
  if (price) {
    const updateDepositLimit = () => {
      deposit.max = Math.floor(vehiclePrice() * 0.9);
    };
    price.addEventListener('input', () => {
      const wasMaximum = deposit.value === deposit.max;
      updateDepositLimit();
      if (wasMaximum) deposit.value = deposit.max;
      updateCalculator();
    });
    updateDepositLimit();
  }
  options.forEach(option => {
    option.addEventListener('change', () => applyOption(option.value));
  });
  applyOption(finance.querySelector('[name="credit-option"]:checked').value);
}

function initVehiclePhotoSlider(gallery) {
  const thumbs = [...gallery.querySelectorAll('.vehicle-photo-slider__thumb')];
  const updateThumbs = swiper => {
    thumbs.forEach((thumb, index) => {
      thumb.setAttribute('aria-current', String(index === swiper.activeIndex));
    });
  };
  const swiper = new Swiper(gallery.querySelector('.vehicle-photo-slider__main'), {
    initialSlide: thumbs.findIndex(thumb => thumb.getAttribute('aria-current') === 'true'),
    rewind: true,
    speed: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450,
    navigation: {
      prevEl: gallery.querySelector('.vehicle-photo-slider__prev'),
      nextEl: gallery.querySelector('.vehicle-photo-slider__next'),
    },
    on: { init: updateThumbs, slideChange: updateThumbs },
  });

  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => swiper.slideTo(index)));
}

function initTabs(tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
  const activateTab = active => {
    tabs.forEach(tab => {
      const selected = tab === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      const offsets = vertical ? { ArrowUp: -1, ArrowDown: 1 } : { ArrowLeft: -1, ArrowRight: 1 };
      offsets.Home = -index;
      offsets.End = tabs.length - 1 - index;
      if (!Object.hasOwn(offsets, event.key)) return;
      const next = tabs[(index + offsets[event.key] + tabs.length) % tabs.length];
      event.preventDefault();
      activateTab(next);
      next.focus();
    });
  });
}

function initVehicleDiscounts(offer) {
  const total = offer.querySelector('[data-discounted-price]');
  const savings = offer.querySelector('[data-discount-savings]');
  const basePrice = Number(offer.dataset.priceBeforeDiscounts);
  if (!total || !Number.isSafeInteger(basePrice) || basePrice < 0) return;

  const rubles = new Intl.NumberFormat('ru-RU');
  const formatPrice = value => `от ${rubles.format(value)} ₽`;
  total.parentElement.dataset.priceWidth = formatPrice(basePrice);
  const updatePrice = createPriceCounter(total, formatPrice);
  const updateTotal = () => {
    let savingsAmount = 0;
    for (const toggle of offer.querySelectorAll('input[data-discount]:checked')) {
      const discount = Number(toggle.dataset.discount);
      if (Number.isSafeInteger(discount) && discount > 0) {
        savingsAmount = Math.min(basePrice, savingsAmount + discount);
      }
    }
    updatePrice(basePrice - savingsAmount);
    if (savings) savings.textContent = `${rubles.format(savingsAmount)} ₽`;
  };

  offer.addEventListener('change', event => {
    if (event.target.matches('input[data-discount]')) updateTotal();
  });
  updateTotal();
}

function initGalleryLightbox(slider) {
  const photos = [...slider.querySelectorAll('.vehicle-gallery__photo')].map(link => ({
    src: link.href,
    type: 'image',
    alt: link.querySelector('img').alt,
  }));

  slider.addEventListener('click', event => {
    const link = event.target.closest('.vehicle-gallery__photo');
    if (!link || !window.Fancybox || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const startIndex = photos.findIndex(photo => photo.src === link.href);
    if (startIndex < 0) return;
    event.preventDefault();
    window.Fancybox.show(photos, { startIndex, triggerEl: link });
  });
}

function initVehicle() {
  initTabs(document.querySelector('.vehicle-specifications [role="tablist"]'));
  const trimButtons = [...document.querySelectorAll('button.vehicle-trim__name')];
  const selectedFeatures = document.getElementById('vehicle-selected-features');
  trimButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      for (const option of trimButtons) option.setAttribute('aria-pressed', String(option === button));
      const features = button.closest('.vehicle-trim').querySelector('.vehicle-features');
      selectedFeatures.replaceChildren(...Array.from(features.cloneNode(true).childNodes));
    });
  });

  const photoSlider = document.querySelector('.vehicle-photo-slider');
  if (photoSlider) {
    initVehiclePhotoSlider(photoSlider);
    initCarTrimMenus(document.querySelector('#vehicle-related .catalog__grid'));
  }
  document.querySelectorAll('.vehicle-carousel').forEach(carousel => {
    const slider = carousel.querySelector('.vehicle-carousel__slider');
    const gallery = slider.dataset.carousel === 'gallery';
    if (gallery) initGalleryLightbox(slider);
    new Swiper(slider, {
      slidesPerView: 'auto',
      spaceBetween: 12,
      centeredSlides: gallery,
      initialSlide: gallery ? 1 : 0,
      loop:gallery,
      rewind:!gallery,
      watchOverflow:false,
      speed: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450,
      navigation: {
        prevEl: carousel.querySelector('.vehicle-carousel__prev'),
        nextEl: carousel.querySelector('.vehicle-carousel__next'),
      },
      on: {
        progress(swiper) {
          if (!gallery) slider.toggleAttribute('data-at-end', swiper.isEnd);
        },
      },
    });
  });
}

function initComparison(comparison) {
  const viewport = comparison.querySelector('.comparison__viewport');
  const toolbar = comparison.querySelector('.comparison__toolbar');
  const controls = comparison.querySelector('.comparison__controls');
  const cards = comparison.querySelector('.comparison__cards');
  const panel = comparison.querySelector('.comparison__panel');
  const selectors = [...comparison.querySelectorAll('.comparison__selector')];
  const mobile = matchMedia('(max-width: 480px)');
  const filter = comparison.querySelector('.comparison__filter input');
  const count = comparison.querySelector('.comparison__count');
  const clear = comparison.querySelector('.comparison__clear');
  const empty = comparison.querySelector('.comparison__empty');
  const noDifferences = comparison.querySelector('.comparison__no-differences');
  const header = comparison.querySelector('.comparison__head');
  const specs = comparison.querySelector('.comparison__specs-scroll');
  const pluralRules = new Intl.PluralRules('ru');
  const carForms = { one: 'автомобиль', few: 'автомобиля', many: 'автомобилей' };
  let selectedCars = [];

  function syncMobileColumns(carIds) {
    const useMobilePanel = mobile.matches && carIds.length > 0;
    if (useMobilePanel && toolbar.parentElement !== panel) {
      panel.prepend(toolbar, controls);
    } else if (!useMobilePanel && toolbar.parentElement === panel) {
      viewport.before(toolbar);
      cards.prepend(controls);
    }

    selectedCars = selectedCars.filter(id => carIds.includes(id));
    selectedCars.push(...carIds.filter(id => !selectedCars.includes(id)).slice(0, 2 - selectedCars.length));

    viewport.querySelectorAll('[data-car]').forEach(item => {
      const slot = selectedCars.indexOf(item.dataset.car);
      if (slot === -1) item.removeAttribute('data-comparison-column');
      else item.dataset.comparisonColumn = slot + 1;
    });

    selectors.forEach((selector, slot) => {
      const id = selectedCars[slot];
      selector.hidden = id === undefined;
      selector.querySelector('.comparison__position').textContent = `${carIds.indexOf(id) + 1}/${carIds.length}`;
      selector.querySelectorAll('button').forEach(button => { button.disabled = carIds.length < 2; });
    });
  }

  const getCarIds = () => Array.from(cards.querySelectorAll('.comparison-card'), card => card.dataset.car);

  function updateRows() {
    const groups = [...comparison.querySelectorAll('.comparison__group')];
    groups.forEach(group => {
      const rows = [...group.querySelectorAll('.comparison__row')];
      rows.forEach(row => {
        const cells = row.querySelectorAll('[role="cell"]');
        const comparedCells = Array.from(cells).filter(cell => !mobile.matches || selectedCars.includes(cell.dataset.car));
        // The server can supply the same comparison key for differently formatted values.
        const values = new Set(comparedCells.map(cell =>
          cell.dataset.compareValue ?? cell.textContent.replace(/\s+/g, ' ').trim()
        ));
        row.hidden = filter.checked && values.size < 2;
      });
      group.hidden = rows.every(row => row.hidden);
    });
    noDifferences.hidden = groups.some(group => !group.hidden);
  }

  function updateComparison() {
    const carIds = getCarIds();
    const total = carIds.length;
    count.textContent = `${total} ${carForms[pluralRules.select(total)]}`;
    filter.disabled = total < 2;
    if (filter.disabled) filter.checked = false;
    clear.disabled = total === 0;
    viewport.hidden = total === 0;
    empty.hidden = total !== 0;
    syncMobileColumns(carIds);
    updateRows();
  }

  selectors.forEach((selector, slot) => {
    selector.addEventListener('click', event => {
      const arrow = event.target.closest('[data-step]');
      const carIds = getCarIds();
      if (!arrow || carIds.length < 2) return;

      const current = carIds.indexOf(selectedCars[slot]);
      const next = carIds[(current + Number(arrow.dataset.step) + carIds.length) % carIds.length];
      const otherSlot = 1 - slot;
      if (next === selectedCars[otherSlot]) selectedCars[otherSlot] = selectedCars[slot];
      selectedCars[slot] = next;
      updateComparison();
    });
  });
  mobile.addEventListener('change', updateComparison);
  filter.addEventListener('change', updateRows);
  header.addEventListener('scroll', () => { specs.scrollLeft = header.scrollLeft; });
  specs.addEventListener('scroll', () => { header.scrollLeft = specs.scrollLeft; });
  comparison.querySelectorAll('.comparison-card__remove').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.comparison-card');
      const nextCard = card.nextElementSibling || card.previousElementSibling;
      const slot = selectedCars.indexOf(card.dataset.car);
      comparison.querySelectorAll('[data-car]').forEach(item => {
        if (item.dataset.car === card.dataset.car) item.remove();
      });
      updateComparison();
      const nextButton = mobile.matches
        ? cards.querySelector(`[data-comparison-column="${slot + 1}"] .comparison-card__remove`)
          || cards.querySelector('[data-comparison-column] .comparison-card__remove')
        : nextCard?.querySelector('.comparison-card__remove');
      (nextButton || empty.querySelector('a')).focus();
    });
  });
  clear.addEventListener('click', () => {
    comparison.querySelectorAll('[data-car]').forEach(item => item.remove());
    updateComparison();
    empty.querySelector('a').focus();
  });
  updateComparison();
}

async function initDealerMap(container) {
  const key = container.dataset.yandexMapsKey?.trim();
  if (!key) return;

  const canvas = container.querySelector('.dealer-contacts__map-canvas');
  const fallback = container.querySelector('.dealer-contacts__map-link');
  const script = document.createElement('script');
  const source = new URL('https://api-maps.yandex.ru/v3/');
  source.search = new URLSearchParams({ apikey: key, lang: 'ru_RU' });
  script.src = source.href;

  let map;
  try {
    await new Promise((resolve, reject) => {
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.append(script);
    });
    const api = window.ymaps3;
    await api.ready;
    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = api;
    const coordinates = [60.508424, 56.796141];
    const marker = document.createElement('span');
    marker.className = 'dealer-contacts__map-marker';
    marker.title = 'улица Рябинина, 24';

    canvas.hidden = false;
    map = new YMap(canvas, {
      location: { center: coordinates, zoom: 17 },
      behaviors: ['drag', 'pinchZoom', 'dblClick'],
    });
    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer());
    map.addChild(new YMapMarker({ coordinates }, marker));
    fallback.hidden = true;
  } catch {
    canvas.hidden = true;
    map?.destroy();
  }
}

function initBlogPost(post) {
  const contents = post.querySelector('.post-toc details');
  contents.addEventListener('toggle', () => {
    if (contents.open) contents.querySelector('a').focus({ preventScroll: true });
  });

  post.querySelectorAll('.post-gallery').forEach(gallery => {
    const slides = gallery.querySelectorAll('.swiper-slide');
    new Swiper(gallery, {
      initialSlide: Math.min(1, slides.length - 1),
      watchOverflow: true,
      navigation: {
        prevEl: gallery.querySelector('.post-slider__prev'),
        nextEl: gallery.querySelector('.post-slider__next'),
      },
      pagination: {
        el: gallery.querySelector('.post-gallery__pagination'),
        clickable: true,
        bulletClass: 'post-gallery__bullet',
        bulletActiveClass: 'post-gallery__bullet--active',
        renderBullet: (index, className) => `<button type="button" class="${className}" aria-label="Фото ${index + 1}"></button>`,
      },
    });
  });
  new Swiper(post.querySelector('.post-offers__slider'), {
    slidesPerView: 2,
    spaceBetween: 4,
    watchOverflow: true,
    breakpoints: { 481: { slidesPerView: 1.35, spaceBetween: 12 }, 560: { slidesPerView: 2 }, 1100: { slidesPerView: 4 } },
  });
  post.querySelectorAll('.post-offers__container').forEach(initCarTrimMenus);

  const actions = post.querySelector('.post-actions');
  const like = actions.querySelector('.post-actions__like');
  const count = post.querySelector('[data-post-like-count]');
  const initialLikes = Number(count.textContent);
  like.addEventListener('click', () => {
    const liked = like.getAttribute('aria-pressed') !== 'true';
    like.setAttribute('aria-pressed', String(liked));
    count.textContent = String(initialLikes + Number(liked));
    count.parentElement.setAttribute('aria-label', `Отметок «Нравится»: ${count.textContent}`);
  });

  const share = actions.querySelector('.post-actions__share');
  const summary = share.querySelector('summary');
  const status = actions.querySelector('.post-actions__status');
  const postUrl = new URL(location.href);
  postUrl.hash = '';
  actions.querySelectorAll('[data-share-param]').forEach(link => {
    const url = new URL(link.href);
    url.searchParams.set(link.dataset.shareParam, postUrl.href);
    link.href = url.href;
  });

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(postUrl.href);
      status.textContent = 'Ссылка скопирована';
    } catch {
      status.textContent = 'Скопируйте ссылку из адресной строки';
    }
    share.open = false;
    summary.focus();
  }
  actions.querySelector('.post-actions__copy').addEventListener('click', copyLink);
  actions.querySelector('.post-actions__native').addEventListener('click', async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title: document.title, url: postUrl.href });
      share.open = false;
      summary.focus();
    } catch (error) {
      if (error.name !== 'AbortError') await copyLink();
    }
  });
  actions.addEventListener('keydown', event => {
    if (event.key === 'Escape' && share.open) {
      share.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!share.contains(event.target)) share.open = false;
  });
}

function initRelatedPosts(related) {
  new Swiper(related.querySelector('.post-related__slider'), {
    slidesPerView: 'auto',
    spaceBetween: 12,
    loop: true,
    breakpoints: { 481: { slidesPerView: 1.25 }, 640: { slidesPerView: 2 }, 1000: { slidesPerView: 3 } },
    navigation: {
      prevEl: related.querySelector('.post-slider__prev'),
      nextEl: related.querySelector('.post-slider__next'),
    },
  });
}


function initCarSlider(slider) {
  const card = slider.closest('.car-card');
  const dots = card.querySelector('.car-card__dots');
  const updatePagination = swiper => card.querySelectorAll('.car-card__dot').forEach((button, i) => {
    button.setAttribute('aria-current', String(i === swiper.activeIndex));
  });
  const swiper = new Swiper(slider, {
    speed: 600,
    watchOverflow: true,
    pagination: {
      el: dots,
      clickable: true,
      bulletClass: 'car-card__dot',
      bulletActiveClass: 'car-card__dot--active',
      renderBullet: (index, className) => `<button type="button" class="${className}" aria-label="Фото ${index + 1}"></button>`,
    },
    on: { init: updatePagination, slideChange: updatePagination },
  });

  slider.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || event.buttons || !swiper.enabled) return;
    const { left, width } = slider.getBoundingClientRect();
    if (!width) return;
    const index = Math.floor((event.clientX - left) / width * swiper.slides.length);
    if (index >= 0 && index < swiper.slides.length && index !== swiper.activeIndex) {
      swiper.slideTo(index, 0);
    }
  });
}

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if (event.target.closest('a, button, input, select, textarea, label, summary, [role="button"]')) return;
  const card = event.target.closest('.car-card');
  if (!card || card.querySelector('.car-card__slider')?.swiper?.allowClick === false) return;
  if (!window.getSelection()?.isCollapsed) return;
  card.querySelector('.car-card__heading h3 a[href]')?.click();
});

document.addEventListener('DOMContentLoaded', () => {
  initPhoneInputs();
  const brandQuery = document.getElementById('brand-query');
  if (brandQuery) {
    const brands = [...document.querySelectorAll('#brand-list li')].map(item => ({
      item,
      name: item.querySelector('.brands__name').textContent.toLocaleLowerCase('ru'),
    }));
    const status = document.querySelector('.brands-directory__status');
    const filterBrands = () => {
      const query = brandQuery.value.trim().toLocaleLowerCase('ru');
      let hasMatches = false;
      brands.forEach(({ item, name }) => {
        item.hidden = !name.includes(query);
        hasMatches ||= !item.hidden;
      });
      status.textContent = hasMatches ? '' : 'Марки не найдены';
    };
    brandQuery.addEventListener('input', filterBrands);
    window.addEventListener('pageshow', filterBrands);
    filterBrands();
  }
  const offerRequest = document.getElementById('offer-request');
    const offerRequestTitle = offerRequest?.querySelector('#offer-request-title');

    const defaultOfferTitle = offerRequestTitle?.textContent.trim() || '';
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-offer-request]');
    if (!trigger || event.defaultPrevented || event.button !== 0) return;
    if (trigger.matches('a[href]') && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)) return;


    event.preventDefault();

      // Получаем заголовок из атрибута кнопки
      const title = trigger.dataset.offerTitle?.trim() || "Получить предложение";

      // Меняем заголовок модального окна
      if (offerRequestTitle) {
          offerRequestTitle.textContent = title;
      }
    if (!offerRequest.open) offerRequest.showModal();
  });
  offerRequest.querySelector('.offer-request__close').addEventListener('click', () => offerRequest.close());
  offerRequest.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (!event.repeat) offerRequest.close();
  });
  const isOfferBackdrop = event => {
    if (event.target !== offerRequest) return false;
    const { left, right, top, bottom } = offerRequest.getBoundingClientRect();
    return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom;
  };
  let offerPointerDownOnBackdrop = false;
  offerRequest.addEventListener('pointerdown', event => {
    offerPointerDownOnBackdrop = isOfferBackdrop(event);
  });
  offerRequest.addEventListener('click', event => {
    if (offerPointerDownOnBackdrop && isOfferBackdrop(event)) offerRequest.close();
    offerPointerDownOnBackdrop = false;
  });
  offerRequest.querySelectorAll('.offer-request__consent a').forEach(link => {
    link.addEventListener('click', () => offerRequest.close());
  });
  const dealerMap = document.querySelector('.dealer-contacts__map');
  if (dealerMap) initDealerMap(dealerMap);
  const blogPost = document.querySelector('.blog-post');
  if (blogPost) {
    initBlogPost(blogPost);
    initRelatedPosts(document.querySelector('.post-related'));
  }
  const blogSort = document.querySelector('.blog-list__sort');
  if (blogSort) {
    const grid = document.querySelector('.blog-list__grid');
    blogSort.addEventListener('change', () => {
      const direction = blogSort.value === 'oldest' ? 1 : -1;
      const cards = [...grid.children].map(card => ({
        card,
        date: card.querySelector('time').dateTime,
      }));
      cards.sort((a, b) => direction * a.date.localeCompare(b.date));
      grid.append(...cards.map(({ card }) => card));
    });
  }
  const sliderSpeed = 600;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const heroSlider = document.querySelector('.hero__slider');
  const hero = heroSlider && new Swiper(heroSlider, {
    speed: reducedMotion.matches ? 0 : 420,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    // autoplay: reducedMotion.matches ? false : { delay: 5000, disableOnInteraction: false },
    rewind: true,
    threshold: 3,
    longSwipesMs: 450,
    longSwipesRatio: 0.2,
    keyboard: { enabled: true, onlyInViewport: true },
    pagination: {
      el: '.hero__pagination', clickable: true,
      bulletClass: 'hero__bullet', bulletActiveClass: 'hero__bullet--active',
      renderBullet: (index, className) => `<button class="${className}" aria-label="Слайд ${index + 1}"></button>`,
    },
    on: { slideChange() { document.querySelectorAll('.hero__bullet').forEach((button, i) => button.setAttribute('aria-current', String(i === this.activeIndex))); } },
  });
  if (hero) document.querySelectorAll('.hero__bullet').forEach((button, i) => button.setAttribute('aria-current', String(i === hero.activeIndex)));
  document.querySelectorAll('.car-card__slider').forEach(initCarSlider);
  document.querySelectorAll('.home-page__main .catalog__grid').forEach(initCarTrimMenus);
  const inventory = document.querySelector('.inventory');
  if (inventory) initInventory(inventory);
  const tradeEvaluation = document.querySelector('.trade-form--manual');
  if (tradeEvaluation) {
    initNumericInput(tradeEvaluation.elements.mileage, groupThousands);
    initNumericInput(tradeEvaluation.elements.year, digits => digits.slice(0, 4));
  }
  document.querySelectorAll('[data-price-before-discounts]').forEach(initVehicleDiscounts);
  document.querySelectorAll('.vehicle-finance').forEach(initVehicleFinance);
  document.querySelectorAll('.vehicle-banks').forEach(initBankTicker);
  const creditConditions = document.querySelector('.credit-conditions__tabs');
  if (creditConditions) initTabs(creditConditions);
  if (document.body.classList.contains('vehicle-page')) initVehicle();
  const comparison = document.querySelector('.comparison');
  if (comparison) initComparison(comparison);
  document.querySelectorAll('.favorites__grid, #favorites-related .catalog__grid, #comparison-related .catalog__grid').forEach(initCarTrimMenus);
  document.querySelectorAll(':is(.header__counter-action, .pagination__numbers a, .blog-read-link, .blog-list__social, .post-table__model)[href="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (link.getAttribute('href') === '#') event.preventDefault();
    });
  });
  const offersSlider = document.querySelector('.offers__slider');
  if (offersSlider) new Swiper(offersSlider, {
    speed: sliderSpeed, slidesPerView: 'auto', initialSlide: 1,
    loop: true, centeredSlides: false, spaceBetween: 24,
    breakpoints: { 481: { centeredSlides: true, spaceBetween: 115 } },
    navigation: { prevEl: '.offers__prev', nextEl: '.offers__next' },
  });
  const header = document.querySelector('.header');
  const root = document.documentElement;
  const syncHeaderTheme = () => {
    if (!root.classList.contains('search-open')) {
      header.classList.toggle('header--scrolled', window.scrollY > 0);
    }
  };
  const syncHeaderHeight = () => {
    root.style.setProperty('--site-header-height', `${header.getBoundingClientRect().height}px`);
  };
  syncHeaderTheme();
  syncHeaderHeight();
  new ResizeObserver(syncHeaderHeight).observe(header);
  window.addEventListener('scroll', syncHeaderTheme, { passive: true });
  window.addEventListener('pageshow', syncHeaderTheme);

  const navigation = header.querySelector('.header__nav');
  const mobileNavigation = header.classList.contains('header--mobile') && matchMedia('(max-width: 480px)');
  const dropdowns = [...navigation.querySelectorAll('.header__dropdown')].map(item => ({
    item,
    trigger: item.querySelector('.header__dropdown-trigger'),
    panel: item.querySelector('.header__submenu'),
  }));
  const setDropdown = ({ item, trigger, panel }, open) => {
    if (mobileNavigation?.matches) open = false;
    item.classList.toggle('header__dropdown--open', open);
    trigger.setAttribute('aria-expanded', String(open));
    panel.inert = !open && !mobileNavigation?.matches;
  };
  const closeDropdowns = except => dropdowns.forEach(dropdown => {
    if (dropdown !== except) setDropdown(dropdown, false);
  });
  dropdowns.forEach(dropdown => {
    const { item, trigger, panel } = dropdown;
    const openDropdown = () => {
      closeDropdowns(dropdown);
      setDropdown(dropdown, true);
    };
    item.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse') openDropdown();
    });
    item.addEventListener('pointerleave', () => {
      if (!item.contains(document.activeElement)) setDropdown(dropdown, false);
    });
    item.addEventListener('focusout', event => {
      if (!item.contains(event.relatedTarget)) setDropdown(dropdown, false);
    });
    trigger.addEventListener('click', () => {
      if (panel.inert) openDropdown();
      else setDropdown(dropdown, false);
    });
    item.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.inert && !mobileNavigation?.matches) {
        trigger.focus();
        setDropdown(dropdown, false);
      }
      if (event.key === 'ArrowDown' && event.target === trigger) {
        event.preventDefault();
        openDropdown();
        panel.querySelector('a')?.focus();
      }
    });
  });
  document.addEventListener('pointerdown', event => {
    closeDropdowns(dropdowns.find(({ item }) => item.contains(event.target)));
  });

  const toggle = document.querySelector('.header__toggle');
  const setNavigation = open => {
    toggle.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('header__nav--open', open);
    navigation.inert = Boolean(mobileNavigation?.matches && !open);
    if (!open) closeDropdowns();
  };
  if (mobileNavigation) {
    setNavigation(false);
    mobileNavigation.addEventListener('change', () => setNavigation(false));
    const creditOptions = document.querySelector('.credit-options');
    const tradeEvaluation = document.getElementById('trade-evaluation');
    const updateServiceOrder = () => {
      if (creditOptions) {
        if (mobileNavigation.matches) creditConditions.closest('section').before(creditOptions);
        else creditConditions.closest('section').after(creditOptions);
      }
      if (tradeEvaluation) {
        const steps = document.querySelector('.service-steps');
        if (mobileNavigation.matches) steps.after(tradeEvaluation);
        else steps.before(tradeEvaluation);
      }
    };
    if (creditOptions || tradeEvaluation) {
      updateServiceOrder();
      mobileNavigation.addEventListener('change', updateServiceOrder);
    }
    if (document.body.classList.contains('home-page')) {
      const helpName = document.getElementById('help-name');
      const helpConsent = document.querySelector('.help__mobile-consent input');
      const help = helpName.closest('.help');
      const advantages = document.querySelector('.home-page__main .advantages');
      const exclusive = document.getElementById('exclusive');
      const syncHelp = () => {
        if (mobileNavigation.matches) advantages.before(help);
        else exclusive.after(help);
        for (const field of [helpName, helpConsent]) {
          field.disabled = !mobileNavigation.matches;
          field.required = mobileNavigation.matches;
        }
      };
      syncHelp();
      mobileNavigation.addEventListener('change', syncHelp);
    }
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !mobileNavigation.matches || !navigation.classList.contains('header__nav--open')) return;
      if (!toggle.closest('.header').contains(event.target)) return;
      setNavigation(false);
      toggle.focus();
    });
    document.addEventListener('pointerdown', event => {
      if (mobileNavigation.matches && !toggle.closest('.header').contains(event.target)) setNavigation(false);
    });
  }
  toggle.addEventListener('click', () => {
    setNavigation(toggle.getAttribute('aria-expanded') !== 'true');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    setNavigation(false);
  }));
  let aboutAnimation;
  document.querySelector('.about__toggle')?.addEventListener('click', event => {
    const text = document.querySelector('.about__text');
    const startHeight = text.getBoundingClientRect().height;
    if (aboutAnimation) aboutAnimation.cancel();
    const open = event.currentTarget.getAttribute('aria-expanded') !== 'true';
    event.currentTarget.setAttribute('aria-expanded', String(open)); event.currentTarget.textContent = open ? 'Свернуть' : 'Читать дальше';
    text.classList.toggle('about__text--expanded', open);
    const endHeight = text.getBoundingClientRect().height;
    aboutAnimation = text.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], {
      duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420,
      easing: 'ease-in-out',
    });
  });
  const search = document.querySelector('.search');
  const searchButton = document.querySelector('.header__search');
  const searchInput = search.querySelector('.search__input');
  const searchResults = search.querySelector('.search__results');
  const searchGrid = search.querySelector('.search__grid');
  const mobileSearch = matchMedia('(max-width: 480px)');
  initCarTrimMenus(searchGrid);
  const syncSearchViewport = () => {
    if (search.open && mobileSearch.matches && window.visualViewport) {
      search.style.setProperty('--search-viewport-height', `${window.visualViewport.height}px`);
    } else {
      search.style.removeProperty('--search-viewport-height');
    }
  };
  window.visualViewport?.addEventListener('resize', syncSearchViewport);
  mobileSearch.addEventListener('change', syncSearchViewport);
  let searchClosing = false;
  let searchScrollY = 0;
  const closeSearch = (fragment = '') => {
    if (!search.open || searchClosing) return;
    searchClosing = true;
    search.classList.remove('search--visible');
    const finish = () => {
      search.close();
      syncSearchViewport();
      document.documentElement.classList.remove('search-open');
      document.documentElement.style.removeProperty('--search-scroll-top');
      hero?.keyboard.enable();
      searchClosing = false;
      searchButton.focus({ preventScroll: true });
      window.scrollTo({ top: searchScrollY, behavior: 'instant' });
      if (fragment) location.assign(fragment);
    };
    window.setTimeout(finish, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300);
  };
  searchButton.addEventListener('click', () => {
    if (search.open) return;
    if (mobileNavigation?.matches) setNavigation(false);
    closeDropdowns();
    searchScrollY = window.scrollY;
    document.documentElement.style.setProperty('--search-scroll-top', `${-searchScrollY}px`);
    document.documentElement.classList.add('search-open');
    searchInput.value = '';
    search.showModal();
    syncSearchViewport();
    hero?.keyboard.disable();
    searchResults.scrollTop = 0;
    searchGrid.querySelectorAll('.car-card__slider').forEach(slider => slider.swiper?.update());
    requestAnimationFrame(() => requestAnimationFrame(() => {
      search.classList.add('search--visible');
    }));
  });
  search.querySelector('.search__close').addEventListener('click', () => closeSearch());
  search.addEventListener('cancel', event => { event.preventDefault(); closeSearch(); });
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeSearch(); }
  });
  search.querySelector('.search__form').addEventListener('submit', event => event.preventDefault());
  search.querySelectorAll('a:not([data-offer-request])').forEach(link => link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const samePage = link.origin === location.origin && link.pathname === location.pathname && link.search === location.search;
    if (samePage && link.hash && document.getElementById(link.hash.slice(1))) {
      event.preventDefault();
      closeSearch(link.hash);
      return;
    }
    closeSearch();
  }));
  document.addEventListener('click', event => {
    const action = event.target.closest('.car-card__action');
    if (action) action.setAttribute('aria-pressed', String(action.getAttribute('aria-pressed') !== 'true'));

    const swatch = event.target.closest('.car-card__swatch');
    if (swatch && swatch.getAttribute('aria-pressed') !== 'true') {
      swatch.parentElement.querySelector('[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
      swatch.setAttribute('aria-pressed', 'true');
    }
  });
  document.querySelectorAll('.field__clear').forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById(button.getAttribute('aria-controls'));
    input.value = '';
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }));
  document.querySelectorAll('.help__form, .question, .vehicle-enquiry__form, .trade-form, .offer-request__form').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault(); form.querySelector('.form-status').textContent = 'Отправка заявок пока не подключена. Позвоните нам: +7 (343) 343-39-71.';
  }));
});
