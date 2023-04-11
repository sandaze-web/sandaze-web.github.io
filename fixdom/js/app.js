const html = document.documentElement
const body = document.body
const pageWrapper = document.querySelector('.main')
const header = document.querySelector('.header')
const firstScreen = document.querySelector('[data-observ]')
const burgerButton = document.querySelector('.icon-menu')
const menu = document.querySelector('.menu')
const lockPaddingElements = document.querySelectorAll('[data-lp]')


const toggleBodyLock = (isLock) => {
  FLS(`Попап ${isLock ? 'открыт' : 'закрыт'}`)
  const lockPaddingValue = window.innerWidth - pageWrapper.offsetWidth

  setTimeout(() => {
    if (lockPaddingElements) {
      lockPaddingElements.forEach((element) => {
        element.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
      })
    }
  
    body.style.paddingRight = isLock ? `${lockPaddingValue}px` : '0px'
    body.classList.toggle('lock', isLock)
  }, isLock ? 0 : 500)
}
// logger (Full Logging System) =================================================================================================================
function FLS(message) {
  setTimeout(() => (window.FLS ? console.log(message) : null), 0)
}

// Проверка браузера на поддержку .webp изображений =================================================================================================================
function isWebp() {
  // Проверка поддержки webp
  const testWebp = (callback) => {
    const webP = new Image()

    webP.onload = webP.onerror = () => callback(webP.height === 2)
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }
  // Добавление класса _webp или _no-webp для HTML
  testWebp((support) => {
    const className = support ? 'webp' : 'no-webp'
    html.classList.add(className)

    FLS(support ? 'webp поддерживается' : 'webp не поддерживается')
  })
}

/* Проверка мобильного браузера */
const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i),
  any: () =>
    isMobile.Android() ||
    isMobile.BlackBerry() ||
    isMobile.iOS() ||
    isMobile.Opera() ||
    isMobile.Windows(),
}
/* Добавление класса touch для HTML если браузер мобильный */
function addTouchClass() {
  // Добавление класса _touch для HTML если браузер мобильный
  if (isMobile.any()) {
    html.classList.add('touch')
  }
}

// Добавление loaded для HTML после полной загрузки страницы
function addLoadedClass() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      html.classList.add('loaded')
    }, 0)
  })
}

// Получение хеша в адресе сайта
const getHash = () => {
  if (location.hash) {
    return location.hash.replace('#', '')
  }
}

// Указание хеша в адресе сайта
function setHash(hash) {
  hash = hash ? `#${hash}` : window.location.href.split('#')[0]
  history.pushState('', '', hash)
}

// Функция для фиксированной шапки при скролле =================================================================================================================
function headerFixed() {
  const headerStickyObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('sticky', !entry.isIntersecting)
  })

  if (firstScreen) {
    headerStickyObserver.observe(firstScreen)
  }
}

// Универсальная функция для открытия и закрытия попапо =================================================================================================================
const togglePopupWindows = () => {
  document.addEventListener('click', ({ target }) => {
    if (target.closest('[data-type]')) {
      const popup = document.querySelector(
        `[data-popup="${target.dataset.type}"]`
      )

      if (document.querySelector('._is-open')) {
        document.querySelectorAll('._is-open').forEach((modal) => {
          modal.classList.remove('_is-open')
        })
      }

      popup.classList.add('_is-open')
      toggleBodyLock(true)
    }

    if (
      target.classList.contains('_overlay-bg') ||
      target.closest('.button-close')
    ) {
      const popup = target.closest('._overlay-bg')

      popup.classList.remove('_is-open')
      if(target.classList.contains('politics')) {
        toggleBodyLock(true)
      }else{
        toggleBodyLock(false)
      }

    }
  })
}

// Модуль работы с меню (бургер) =======================================================================================================================================================================================================================
const menuInit = () => {
  if (burgerButton) {
    document.addEventListener('click', ({ target }) => {
      if (target.closest('.icon-menu')) {
        html.classList.toggle('menu-open')
        toggleBodyLock(html.classList.contains('menu-open'))
      }
    })
  }
}
const menuOpen = () => {
  toggleBodyLock(true)
  html.classList.add('menu-open')
}
const menuClose = () => {
  toggleBodyLock(false)
  html.classList.remove('menu-open')
}


document.addEventListener('DOMContentLoaded', function () {


  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const timeline = gsap.timeline();
  gsap.defaults({duration: 2});

  // анимация тайтла на главной
  timeline.to("#content__title", {
    transform: "rotateX(0deg) skew(0deg, 0deg) scale(1, 1) translate(0%, 0)",
    opacity: 1,
    delay: 0.4,
    ease: 'power4.out',
  })

  //Анимация картинки на главной
  gsap.fromTo('.content-imgBx', {opacity: 0,},
      {opacity: 1, ease: 'Back.easeOut', delay: 0.5})

  //анимация пунктов на главной
  gsap.to('.content-lists__item', {transform: "rotateX(0deg) skew(0deg, 0deg) scale(1, 1) translate(0%, 0)", opacity: 1,ease: 'power4.out', delay: 0.8})

  //анимация кнопок на главной
  gsap.to('.content-buttonBx', {opacity: 1, ease: 'power4.out', delay: 1.3})

  //анимация заголовков, подзаголовков и оберток кнопок
  let titles = document.querySelectorAll('.animate-title'),
      subtitles = document.querySelectorAll('.animate-subtitle'),
      buttonBx = document.querySelectorAll('.animate-box')
  titles.forEach(el => {
    gsap.to(el,{
      scrollTrigger: el,
      transform: "rotateX(0deg) skew(0deg, 0deg) scale(1, 1) translate(0%, 0)",
      opacity: 1,
      delay: 0.4,
      ease: 'power4.out',
    })
  })
  subtitles.forEach(el => {
    gsap.to(el,{
      scrollTrigger: el,
      transform: "rotateX(0deg) skew(0deg, 0deg) scale(1, 1) translate(0%, 0)",
      opacity: 0.6,
      delay: 0.5,
      ease: 'power4.out',
    })
  })
  buttonBx.forEach(el => {
    gsap.to(el,{
      scrollTrigger: el,
      opacity: 1, ease: 'power4.out', delay: 0.6
    })
  })

  //анимация техники
  gsap.timeline({
    scrollTrigger: {
      trigger: '.technics__title',
      start: `bottom bottom`,
      end: 'bottom bottom',
      // markers: true,
    }
  }).fromTo('.technics-box.first .technics__item', {y: 80,  opacity: 0}, {y: 0, stagger: 0.3, opacity: 1, ease: 'linear', duration: 0.2})
    .fromTo('.technics-box.last .technics__item', {y: 80,  opacity: 0}, {y: 0, stagger: 0.3, opacity: 1, ease: 'linear', duration: 0.2})
    .fromTo('.equipment-more', { opacity: 0}, {opacity: 1, ease: 'linear', duration: 0.2})

  gsap.timeline({
    scrollTrigger: {
      trigger: '.advantages-helper.first',
      // markers: true,
      start: '50% bottom'
    }
  }).fromTo('.advantages-helper.first .advantages__item', {y: 100,  opacity: 0}, {y: 0, stagger: 0.3, opacity: 1, ease: 'Expo.easeOut', duration: 1.5})
  gsap.timeline({
    scrollTrigger: {
      trigger: '.advantages-helper.last',
      // markers: true,
      start: '50% bottom'
    }
  }).fromTo('.advantages-helper.last .advantages__item', {y: 100,  opacity: 0}, {y: 0, stagger: 0.3, opacity: 1, ease: 'Expo.easeOut', duration: 1.5})



  //наезжающие блоки
  ScrollTrigger.create({
    trigger: '.technics',
    pin: true,
    pinSpacing: false,
    start: 'bottom bottom',
    // markers: true,
  })

  ScrollTrigger.create({
    trigger: '.advantages',
    pin: true,
    pinSpacing: false,
    start: 'bottom bottom',
  })

  if(document.querySelector('.phone-mask')) {
    $('.phone-mask').mask('+7 (999) 999-99-99')
  }

  if(document.querySelector('.pb')) {
    const btns = document.querySelectorAll('.pb')

    btns.forEach(el => {
      el.addEventListener('mouseover', function(e) {
        let
            size = Math.max(this.offsetWidth, this.offsetHeight),
            x = e.offsetX - size / 2,
            y = e.offsetY - size / 2,
            wave = this.querySelector('.wave')

        // Create an element if it doesn't exist
        if (!wave) {
          wave = document.createElement('span')
          wave.className = 'wave'
        }
        wave.style.cssText = `width:${size}px;height:${size}px;top:${y}px;left:${x}px`
        this.appendChild(wave)
      })
    })
  }

  if(document.querySelector('.modal')) {
    let modals = document.querySelectorAll('.modal .modal-box')
    let start_touch = null,
        end_touch = null,
        moveY
    let resetData = () => {
      start_touch = 0
      end_touch = 0
      moveY = 0
    }
    modals.forEach(el => {
      el.addEventListener('swiped-down', function(e) {
        if($(el).scrollTop() <= 0 && (el.querySelector('.modal-politics') && $('.modal-politics').scrollTop() <= 0)) {
          el.closest('.modal').classList.remove('_is-open')
          el.style = ``

          if(el.querySelector('.modal-politics')) {
            toggleBodyLock(true)
          }else{
            toggleBodyLock(false)
          }

          resetData()
        }
      });

      el.addEventListener("touchmove", (e) => {
        if($(el).scrollTop() === 0 && (el.querySelector('.modal-politics') && $('.modal-politics').scrollTop() <= 0 || !e.target.closest('.modal-politics'))) {
          moveY = e.touches[0].clientY - start_touch

          if(moveY > 0) {
            el.style.transform = `translateY(${moveY}px)`

            if(moveY > 100) {
              el.style.opacity = 1 - (moveY / 150 - 1)
            }
          }
        }

      }, false);

      el.addEventListener("touchstart", (e) => {
        start_touch = e.touches[0].clientY;
        el.style.transition = `.0s`
      }, false);

      el.addEventListener("touchend", (e) => {
        end_touch = e.changedTouches[0].clientY
        if((moveY > 100) && $(el).scrollTop() <= 0 ){
          el.closest('.modal').classList.remove('_is-open')
          el.style = ``

          if(el.querySelector('.modal-politics')) {
            toggleBodyLock(true)
          }else{
            toggleBodyLock(false)
          }

          resetData()
        }else if(moveY > 20 && moveY <= 100){
          el.style.transform = `translateY(0)`
          el.style.transition = `.3s`
        }
      }, false);
    })

    let allNotice = document.querySelectorAll('.modal__notice span')

    allNotice.forEach(el => {
      el.addEventListener('click', () => {
        document.querySelector('.modal.politics').classList.add('_is-open')
      })
    })
  }
  if(document.querySelector('.equipment__button')) {
    let buttonMore = document.querySelector('.equipment__button'),
        technicsHeight = document.querySelector('.technics').clientHeight,
        pinSpacer = document.querySelector('.technics').closest('.pin-spacer')
    buttonMore.addEventListener('click', () => {
      buttonMore.classList.add('active')
    })
  }

  // обработка форм
  if(document.querySelector('.modal form')) {
    let allForm = document.querySelectorAll('.modal form')
    allForm.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        e.target.reset()
        e.target.closest('.modal').classList.remove('_is-open')
        document.querySelector('.thanks').classList.add('_is-open')
      })
    })
  }
})

togglePopupWindows()
// =======================================================================================================
