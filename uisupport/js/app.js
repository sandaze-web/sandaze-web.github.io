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
      toggleBodyLock(false)
      document.querySelector('.header-burger').classList.remove('active')
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


$('a[href^="#"]').on("click", function (e) {
    let anchor = $(this);
    let offsetAnchor = 220
    if(window.innerWidth <= 768) offsetAnchor = 100
    let offset = document.documentElement.clientHeight * offsetAnchor / 929
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr("href")).offset().top - offset
    }, 700);
    e.preventDefault();
});
document.addEventListener('DOMContentLoaded', function () {
    if(document.querySelector('.faq') !== null) {
        let faqItems = document.querySelectorAll('.faq-question')

        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                let content = item.parentNode.querySelector('.faq-answerBx');

                if(content.style.maxHeight){
                    content.style.maxHeight = null;
                    item.parentNode.classList.remove('active');
                }else{
                    document.querySelectorAll('.faq-answerBx').forEach(el => el.style.maxHeight = null);
                    document.querySelectorAll('.faq__item').forEach(el => el.classList.remove('active'));
                    content.style.maxHeight = content.scrollHeight + 'px';
                    item.parentNode.classList.add('active');
                }
            })
        })
    }

    if(document.querySelector('.phone-mask')) {
        $('.phone-mask').mask('+7 (999) 999-99-99')
    }
    if(document.querySelector('.price-inner')) {
        let allInnerTechnics = document.querySelectorAll('.price-inner'),
            technicsNavItems = document.querySelectorAll('.price-nav__item')

        technicsNavItems.forEach((el, index) => {
            el.addEventListener('click', () => {
                allInnerTechnics.forEach(item => item.classList.remove('active'))
                allInnerTechnics[index].classList.add('active')

                technicsNavItems.forEach(item => item.classList.remove('active'))
                el.classList.add('active')
            })
        })
    }

    if(document.querySelector('.price-nav')) {
        if(window.innerWidth <= 800) {
            console.log(213)
            $('.price-nav').slick({
                infinite: false,
                slidesToShow: 1.5,
                slidesToScroll: 1,
                variableWidth: true,
                arrows: false,
                responsive: [
                    {
                        breakpoints: 481,
                        settings: {
                            // slidesToShow: 2.5,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });
        }
    }

    if(document.querySelector('.header-burger')) {
        let burger = document.querySelector('.header-burger')
        burger.addEventListener('click', () => {
            burger.classList.toggle('active')
            document.querySelector('.nav-mobile').classList.toggle('_is-open')
        })

    }

    if(document.querySelector('.modal form')) {
        document.querySelector('.modal form').addEventListener('submit', (e) => {
            e.preventDefault()
            e.target.closest('.modal').classList.remove('_is-open')
            e.target.reset()
            document.querySelector('.modal.thanks').classList.add('_is-open')
        })
    }

    if(document.querySelector('.offer-form')) {
        let forms = document.querySelectorAll('.send-form'),
            thanksModal = document.querySelector('.modal.thanks')
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault()
                e.target.reset()
                thanksModal.classList.add('_is-open')
            })
        })
    }
})
// Паралакс мышей ========================================================================================
// const mousePrlx = new MousePRLX({})
// =======================================================================================================

// Фиксированный header ==================================================================================
// headerFixed()
// =======================================================================================================

togglePopupWindows()
// =======================================================================================================
