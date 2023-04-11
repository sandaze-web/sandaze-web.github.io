const html = document.documentElement
const body = document.body
const pageWrapper = document.querySelector('.main')
const header = document.querySelector('.header')
const firstScreen = document.querySelector('[data-observ]')
const burgerButton = document.querySelector('.icon-menu')
const menu = document.querySelector('.menu')
const lockPaddingElements = document.querySelectorAll('[data-lp]')


const toggleBodyLock = (isLock) => {
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




togglePopupWindows()

$('a[href^="#"]').on("click", function (e) {
    let anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr("href")).offset().top - 0
    }, 700);
    e.preventDefault();
});
document.addEventListener('DOMContentLoaded', function () {
    if(document.querySelector('.equipment__button')) {
        let buttonMore = document.querySelector('.equipment__button')
        buttonMore.addEventListener('click', () => {
            buttonMore.classList.add('active')
        })
    }

    if(document.querySelector('.content-box')) {
        if(document.querySelector('.content-box').children.length < 2 && window.innerWidth > 768) {
            document.querySelector('.content-box .content-accordion ul').style.maxHeight = document.querySelector('.content-box').scrollHeight - 78 + 'px';
            document.querySelector('.content-box .content-accordion ul').style.minHeight = 'auto';
        }
    }
    if(document.querySelector('#search-technic')) {


        $('#search-technic').hideseek({
            highlight: true
        });
        $('#search-technic').on("_after", function() {
            let technicsList = document.querySelectorAll('.content-technics-lists__item'),
                brandsList = document.querySelectorAll('.content-brands-lists__item')

            let isHiddenTechnic = true
            let isHiddenBrands = true

            technicsList.forEach(el => {
                if ($(el).css('display') != 'none') {
                    isHiddenTechnic = false
                }
            })
            brandsList.forEach(el => {
                if ($(el).css('display') != 'none') {
                    isHiddenBrands = false
                }
            })

            if(isHiddenTechnic) {
                document.querySelector('.content-technics').style.display = 'none'
                document.querySelector('.content-brands').classList.add('remove-border')
            }else{
                document.querySelector('.content-technics').style.display = 'block'
                document.querySelector('.content-brands').classList.remove('remove-border')
            }

            if(isHiddenBrands) {
                document.querySelector('.content-brands').style.display = 'none'
            }else{
                document.querySelector('.content-brands').style.display = 'block'
            }
        });
    }

    if(document.querySelector('.input-mask')) {
        document.querySelectorAll('.input-mask').forEach(el => {
            $(el).mask('+7 (999) 999-99-99')
        })
    }

    if(document.querySelector('.price-inner') && window.innerWidth <= 480){
        hidePrice()

    }

    if(document.querySelector('.header-burger')) {
        let burger = document.querySelector('.header-burger'),
            mobileMenu = document.querySelector('.content-searchBx')

        burger.addEventListener('click', () => {
            burger.classList.toggle('active')
            mobileMenu.classList.toggle('_is-open')
            toggleBodyLock(burger.classList.contains('active'))
        })
    }
    if(document.querySelector('.content-box__title')) {
        if(window.innerWidth <= 900) {
            let accordionsTitle = document.querySelectorAll('.content-box__title')
            accordionsTitle.forEach(el => {
                let accordion = el.parentNode.querySelector('.content-accordion')
                // accordion.style.maxHeight = accordion.scrollHeight + 'px'
                el.addEventListener('click', () => {
                    if(accordion.style.maxHeight){
                        accordion.style.maxHeight = null
                        el.classList.remove('active')
                    }else{
                        accordion.style.maxHeight = accordion.scrollHeight + 'px'
                        el.classList.add('active')
                    }
                })
            })
        }
    }

    if(document.querySelector('#applicationForm')) {
        let applicationForm = document.querySelector('#applicationForm')

        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault()

            e.target.reset()
            applicationForm.closest('.modal-form').classList.remove('_is-open')
            document.querySelector('#successPopup').classList.add('_is-open')
        })
    }



    $('img.svg').each(function() {
        let $img = $(this);
        let imgID = $img.attr('id');
        let imgClass = $img.attr('class');
        let imgURL = $img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            let $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });

    if(document.querySelector('.modal-form__notice')) {
        let allPolitics = document.querySelectorAll('.modal-form__notice')
        allPolitics.forEach(el => {
            el.addEventListener('click' ,(e) => {
                e.preventDefault();
                document.querySelector('.modal.politics').classList.add('_is-open')
            })
        })
    }

    if(document.querySelector('.brands-slider')) {
        $('.brands-slider').slick({
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: '.brands__arrow.left',
            nextArrow: '.brands__arrow.right',
            autoplay: true,
            autoplaySpeed: 5000,
            responsive: [
                {
                    breakpoint: 490,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true,
                    }
                },
                {
                    breakpoint: 901,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true,
                    }
                },
            ]
        });

    }
})

let hidePrice = () => {
    let allServicesItem = document.querySelectorAll('.price-inner .price__item')

    for (let i = 10; i < allServicesItem.length; i++) {
        allServicesItem[i].classList.add('hidden')
    }

    let more = document.querySelectorAll('.price__button');

    for (let i = 0; i < more.length; i++) {
        more[i].addEventListener('click', function() {
            let showPerClick = 3;

            let hidden = document.querySelectorAll('.price-inner .price__item.hidden');
            for (let i = 0; i < showPerClick; i++) {
                if (!hidden[i]) return this.style.display = "none";

                hidden[i].classList.remove('hidden');
            }
        });
    }
}