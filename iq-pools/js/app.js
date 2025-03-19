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
      if(document.querySelector('.header-burger').classList.contains('active')) {
        document.querySelector('.header-burger').classList.remove('active')
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

class SwipeablePopup {
    constructor(selector, popupModal) {
        this.popup = document.querySelector(selector);
        this.startY = 0;
        this.startPopupY = 0; // Store the initial popup position
        this.touching = false;
        this.popupModal = document.querySelector(popupModal);
        this.startedInUpperArea = false;

        this.popup.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.popup.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.popup.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onTouchStart(event) {
        this.startY = event.touches[0].clientY;
        this.startPopupY = this.popup.offsetTop; // Store the initial popup position
        const parentTopOffset = this.popup.parentElement.offsetTop; // Offset of parent container
        this.startedInUpperArea = this.startY <= (this.startPopupY + parentTopOffset + 50); // Check if started in upper area
        this.touching = true;
    }

    onTouchMove(event) {
        if (!this.touching || !this.startedInUpperArea) return;

        const deltaY = event.touches[0].clientY - this.startY;

        if (deltaY > 0 && deltaY <= 120) { // Check if moving downwards
            const newY = deltaY;
            this.popup.style.transform = `translate(0%, ${newY}px)`; // Apply translateY

            // Calculate opacity based on distance
            const opacity = 1 - (deltaY / 300); // Make it more transparent as deltaY approaches 100
            this.popup.style.opacity = opacity;
        }
    }

    onTouchEnd(event) {
        if (!this.touching || !this.startedInUpperArea) return;
        this.touching = false;
        if(!this.startedInUpperArea) this.startPopupY = 0

        const deltaY = event.changedTouches[0].clientY - this.startY;
        console.log(deltaY)
        if (Math.abs(deltaY) < 120) {
            this.popup.style.transform = `translate(0%, 0)`; // Return to the initial position
            this.popup.style.opacity = 1
        } else {
            this.popup.style.transform = `translate(0%, 100%)`;
            this.popupModal.classList.remove('_is-open')

            let isCloseAllModal = true
            document.querySelectorAll('[data-popup]').forEach(el_modal => {
                if(el_modal.classList.contains('_is-open')) isCloseAllModal = false
            })

            toggleBodyLock(!isCloseAllModal)

            setTimeout(() => {
                this.popup.removeAttribute('style')
            }, 500)
        }
        this.popup.removeAttribute('style')

    }
}

// Включить/выключить FLS (Full Logging System) (в работе)

let geocodeApi = '06f41e63-609d-4d88-9c55-cf2900572996',
    mobileWidth = 600
document.addEventListener('DOMContentLoaded', function () { // Аналог $(document).ready(function(){
    if (document.querySelector('.gallery')) {
        $('.gallery-wrapper').slick({
            slidesToShow: 5,
            swipeToSlide: true,
            arrows: false,
            centerMode: true,
            responsive: [
                {
                    breakpoint: 1600,
                    settings: {
                        slidesToShow: 4,
                        swipe: true,
                    }
                },
                {
                    breakpoint: 1366,
                    settings: {
                        slidesToShow: 3.5,
                        swipe: true,
                    }
                },
                {
                    breakpoint: 1240,
                    settings: {
                        slidesToShow: 3,
                        swipe: true,
                    }
                },
                {
                    breakpoint: 980,
                    settings: {
                        slidesToShow: 2,
                        swipe: true,
                    }
                },
                {
                    breakpoint: 750,
                    settings: {
                        slidesToShow: 1.8,
                        swipe: true,
                    }
                },
                {
                    breakpoint: 650,
                    settings: {
                        slidesToShow: 1.4,
                        swipe: true,
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        swipe: true,
                        centerMode: true,
                        swipeToSlide: false,
                    },
                },
            ],
        });
    }

    //изменения вида каталога грид/лист
    if (document.querySelector('.catalog-viewBx')) {
        let viewButton = document.querySelector('.catalog-viewBx'),
            catalog = document.querySelector('.catalog-box')
        viewButton.addEventListener('click', () => {
            viewButton.classList.toggle('list')
            if (catalog) catalog.classList.toggle('list')
        })
    }

    if(document.querySelector('.modal-wrapper')) {
        let swipeable = new SwipeablePopup('.modal-wrapper', '.modal')
    }

    if(document.querySelector('.header-burger')) {
        let burger = document.querySelector('.header-burger')
        burger.addEventListener('click', () => {
            burger.classList.toggle('active')
            document.querySelector('.header-nav').classList.toggle('_is-open')
            toggleBodyLock( burger.classList.contains('active'))
        })
    }

    if(document.querySelector('.header__select')) {
        let city = document.querySelector('.header__select'),
            citiesBox = document.querySelector('.header-cities')
        city.addEventListener('click', () => {
            city.classList.toggle('active')
            citiesBox.classList.toggle('active')
        })

        let cities = document.querySelectorAll('.header-cities__item')
        cities.forEach(el => {
            el.addEventListener('click', () => {
                city.textContent = el.textContent
                citiesBox.classList.toggle('active')
                city.classList.toggle('active')
            })
        })
    }
    if(document.querySelector('.footer__select')) {
        let city = document.querySelector('.footer__select'),
            citiesBox = document.querySelector('.footer-cities')
        city.addEventListener('click', () => {
            city.classList.toggle('active')
            citiesBox.classList.toggle('active')
        })

        let cities = document.querySelectorAll('.footer-cities__item')
        cities.forEach(el => {
            el.addEventListener('click', () => {
                city.textContent = el.textContent
                citiesBox.classList.toggle('active')
                city.classList.toggle('active')
            })
        })
    }

    if (document.querySelectorAll('.assortiments')) {
        if (window.innerWidth <= mobileWidth) {
            let sliders = document.querySelectorAll('.assortiments-slider')
            sliders.forEach(slider => {
                const swiper = new Swiper(slider, {
                    // Default parameters
                    slidesPerView: 1,
                    spaceBetween: 20,
                    // navigation: {
                    //     nextEl: '.card__arrow.right',
                    //     prevEl: '.card__arrow.left',
                    // },
                    pagination: {
                        el: slider.querySelector('.assortiments-pagination'),
                        type: 'bullets',
                        clickable: true,
                    },
                })
            })
        }
    }

    if (document.querySelector('.services-card')) {
        if (window.innerWidth <= mobileWidth) {
            let swiper = new Swiper('.services-card-slider', {
                // Default parameters
                slidesPerView: 1.08,
                spaceBetween: 20,
                // navigation: {
                //     nextEl: '.card__arrow.right',
                //     prevEl: '.card__arrow.left',
                // },
                pagination: {
                    el: '.services-card-pagination',
                    type: 'bullets',
                    clickable: true,
                },
            })
        }
    }

    if (document.querySelector('.card')) {
        const swiper = new Swiper('.card-slider', {
            // Default parameters
            slidesPerView: 1,
            navigation: {
                nextEl: '.card__arrow.right',
                prevEl: '.card__arrow.left',
            },
            pagination: {
                el: '.card-pagination',
                type: 'bullets',
                clickable: true,
            },
            // Responsive breakpoints
            // breakpoints: {
            //     // when window width is >= 320px
            //     320: {
            //         slidesPerView: 2,
            //         spaceBetween: 20
            //     },
            //     // when window width is >= 480px
            //     480: {
            //         slidesPerView: 3,
            //         spaceBetween: 30
            //     },
            //     // when window width is >= 640px
            //     640: {
            //         slidesPerView: 4,
            //         spaceBetween: 40
            //     }
            // }
        })
    }
    if(document.querySelector('.card-characters')) {
        // Получаем все элементы с классом .card-characters__item span
        let elements = document.querySelectorAll('.card-characters__item span');
        let maxWidth = 0;
        elements.forEach(function(element) {
            // Получаем текущую ширину элемента

            let width = element.offsetWidth;

            // Проверяем, является ли текущая ширина максимальной
            if (width > maxWidth) {
                maxWidth = width;
            }
        });
        elements.forEach(function(element) {
            element.style.width = maxWidth + 'px';
        });
    }
    if (document.querySelector('.card-feedback-slider')) {
        let players = []

        if(document.querySelector('.js-video')) {
            players = Array.from(document.querySelectorAll('.js-video')).map(p => new Plyr(p,{
                controls: ['play', 'progress', 'mute', 'current-time', 'settings', 'volume', 'play-large'],
                fullscreen: { enabled: true, fallback: true, iosNative: true }
            }));
        }


        let cardFeedbackSliders = document.querySelectorAll('.card-feedback-slider')
        cardFeedbackSliders.forEach((slider, index) => {
            const swiper = new Swiper(slider, {
                // Default parameters
                slidesPerView: 1,
                navigation: {
                    nextEl: slider.querySelector('.card-feedback__arrow.right'),
                    prevEl: slider.querySelector('.card-feedback__arrow.left'),
                },
                pagination: {
                    el: slider.querySelector('.card-feedback-pagination'),
                    type: 'bullets',
                    clickable: true,
                },
            })
            swiper.on('slideChange', function () {
                players.forEach(el => el.pause())
            })
        })

        if(window.innerWidth < 900) {
            const card = new Swiper('.card-feedabck-helper', {
                // Default parameters
                slidesPerView: 1,
                pagination: {
                    el: '.card-feedabck-swiper-pagination',
                    type: 'bullets',
                },
            })
        }
    }

    if(document.querySelector('.card-tabs')) {
        if(window.innerWidth > 900) {
            let elements = document.querySelectorAll('.card-tab');
            let maxHeight = 0;
            let content = document.querySelector('.card-tabs-content');
            elements.forEach(function(element) {
                // Получаем текущую ширину элемента

                let height = element.offsetHeight;

                // Проверяем, является ли текущая ширина максимальной
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
            content.style.height = maxHeight + 24 + 'px';
        }

        let tabNavs = document.querySelectorAll('.card-tabs__item'),
            tabs = Array.from(document.querySelectorAll('.card-tab'))
        tabNavs.forEach((nav, index) => {
            nav.addEventListener('click', () => {
                tabNavs.forEach(el => el.classList.remove('active'))
                nav.classList.add('active')

                tabs.forEach(el => el.classList.remove('show'))
                tabs[index].classList.add('show')
            })
        })
    }

    if (document.querySelector('.card-info')) {
        let buttons = Array.from(document.querySelectorAll('.card-info__item')),
            items = Array.from(document.querySelectorAll('.card-info-item')),
            wrapper = document.querySelector('.card-info-wrapper')


        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                buttons.forEach(el => el.classList.remove('active'))
                button.classList.add('active')

                items.forEach(el => el.style.display = 'none')
                items[index].style.display = 'block'

            })
        })
    }

    if (document.querySelector('.service-slider')) {
        const swiper = new Swiper('.service-slider', {
            // Default parameters
            slidesPerView: 1,
            navigation: {
                nextEl: '.service__arrow.right',
                prevEl: '.service__arrow.left',
            },
            pagination: {
                el: '.service-pagination',
                type: 'bullets',
                clickable: true,
            },
            // Responsive breakpoints
            // breakpoints: {
            //     // when window width is >= 320px
            //     320: {
            //         slidesPerView: 2,
            //         spaceBetween: 20
            //     },
            //     // when window width is >= 480px
            //     480: {
            //         slidesPerView: 3,
            //         spaceBetween: 30
            //     },
            //     // when window width is >= 640px
            //     640: {
            //         slidesPerView: 4,
            //         spaceBetween: 40
            //     }
            // }
        })
    }
    if (document.querySelector('.faq')) {
        let footerPages = document.querySelectorAll('.faq__item')

        footerPages.forEach(item => {
            item.addEventListener('click', () => {
                let content = item.querySelector('.faq__item-answerBx');

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    item.classList.remove('active');
                } else {
                    document.querySelectorAll('.faq__item-answerBx').forEach(el => el.style.maxHeight = null);
                    document.querySelectorAll('.faq__item').forEach(el => el.classList.remove('active'));
                    content.style.maxHeight = content.scrollHeight + 'px';
                    item.classList.add('active');
                }

            })
        })
    }

    if (document.querySelector('.goal-box')) {
        let footerPages = document.querySelectorAll('.goal__item')

        footerPages.forEach(item => {
            item.addEventListener('click', () => {
                let content = item.querySelector('.goal-answer');

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    item.classList.remove('active');
                } else {
                    document.querySelectorAll('.goal-answer').forEach(el => el.style.maxHeight = null);
                    document.querySelectorAll('.goal__item').forEach(el => el.classList.remove('active'));
                    content.style.maxHeight = content.scrollHeight + 'px';
                    item.classList.add('active');
                }

            })
        })
    }

    if (document.querySelector('.contacts-conrollers__item')) {
        let controlers = document.querySelectorAll('.contacts-conrollers__item')
        controlers.forEach((el, index) => {
            el.addEventListener('click', () => {
                controlers.forEach(el => el.classList.remove('active'))
                el.classList.add('active')

                if (index === 1) {
                    document.querySelector('.contacts-imgBx').classList.add('show')
                } else {
                    document.querySelector('.contacts-imgBx').classList.remove('show')
                }
            })
        })
    }

    if (document.querySelector('.technology-slider')) {
        const swiper = new Swiper('.technology-slider', {
            // Default parameters
            slidesPerView: 1,
            navigation: {
                nextEl: '.technology__arrow.right',
                prevEl: '.technology__arrow.left',
            },
            pagination: {
                el: '.technology-pagination',
                type: 'bullets',
                clickable: true,
            },
            // Responsive breakpoints
            // breakpoints: {
            //     // when window width is >= 320px
            //     320: {
            //         slidesPerView: 2,
            //         spaceBetween: 20
            //     },
            //     // when window width is >= 480px
            //     480: {
            //         slidesPerView: 3,
            //         spaceBetween: 30
            //     },
            //     // when window width is >= 640px
            //     640: {
            //         slidesPerView: 4,
            //         spaceBetween: 40
            //     }
            // }
        })
    }

    //табы на странице о компании
    if (document.querySelector('.garanty')) {
        let tabs = Array.from(document.querySelectorAll('.garanty__item')),
            images = document.querySelectorAll('.garanty__item-imgBx img')

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabs.forEach(el => el.classList.remove('active'))
                tab.classList.add('active')
                let content = tabs[index].querySelector('.garanty__item-subtitle')
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    document.querySelectorAll('.garanty__item-subtitle').forEach(el => el.style.maxHeight = null);
                    content.style.maxHeight = content.scrollHeight + 'px';
                }

                images.forEach(el => el.classList.remove('active'))
                images[index].classList.add('active')
            })
        })
    }

    // вопрос/ответ
    if (document.querySelector('.addresses')) {
        let footerPages = document.querySelectorAll('.addresses__item-titleBx')

        footerPages.forEach(item => {
            item.addEventListener('click', () => {
                let content = item.parentNode.querySelector('.addresses__item-answer');

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    item.parentNode.classList.remove('active');
                } else {
                    document.querySelectorAll('.addresses__item-answer').forEach(el => el.style.maxHeight = null);
                    document.querySelectorAll('.addresses__item').forEach(el => el.classList.remove('active'));
                    content.style.maxHeight = content.scrollHeight + 'px';
                    item.parentNode.classList.add('active');
                }

            })
        })

        $('#addresses-search').hideseek({
            highlight: true
        });
    }

    //карта с адресами
    if (document.querySelector('.addresses-map')) {
        ymaps.ready(init);

        function init() {
            // Создание карты.
            let myMap = new ymaps.Map("addresses-map", {
                    // Координаты центра карты.
                    // Порядок по умолчанию: «широта, долгота».
                    // Чтобы не определять координаты центра карты вручную,
                    // воспользуйтесь инструментом Определение координат.
                    center: [55.7536, 37.618],
                    // Уровень масштабирования. Допустимые значения:
                    // от 0 (весь мир) до 19.
                    zoom: 10,
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32,
                    clusterDisableClickZoom: true
                })

            // objectManager.objects.options.set({iconImageHref: 'images/map/volt.svg'});
            // myMap.geoObjects.add(objectManager);

            // Обработчик клика по городу в контейнере
            let cityElements = document.querySelectorAll('.addresses__item-title')
            cityElements.forEach(function (cityElement, index) {
                // if(index === 0) {
                //     showCityOnMap(parseFloat(cityElement.getAttribute('data-lat')), parseFloat(cityElement.getAttribute('data-lon')), cityElement.textContent);
                // }
                cityElement.addEventListener('click', function () {
                    // sendRequest('GET', `https://geocode-maps.yandex.ru/1.x/?apikey=${geocodeApi}&geocode=${cityElement.textContent}&format=json`,false, 'json', json => {
                    //     let [y, x] = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
                    //     console.log(y, x)
                    // })
                    let lat = parseFloat(cityElement.getAttribute('data-lat'));
                    let lon = parseFloat(cityElement.getAttribute('data-lon'));
                    showCityOnMap(lat, lon, cityElement.closest('.addresses__item').querySelector('.addresses__item-info').textContent);
                });
            });

            // Функция отображения города на карте
            function showCityOnMap(lat, lon, cityName) {
                myMap.setCenter([lat, lon], 13); // Установка центра карты на выбранный город
                myMap.geoObjects.removeAll(); // Удаление предыдущих меток

                // Добавление метки выбранного города
                let squareLayout = ymaps.templateLayoutFactory.createClass("<svg class=map__icon {% if properties.active %} active{% endif %}' width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
                    "<circle cx=\"16\" cy=\"16\" r=\"16\" fill=\"#0D1B30\"/>\n" +
                    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.9505 6.1543C20.718 6.1543 24.5157 10.0719 24.5157 14.8165C24.5157 17.0777 23.6505 19.2369 22.0809 20.8652L21.9941 20.957L21.9405 20.8422C21.9048 20.7631 21.8691 20.684 21.8359 20.6048C21.6572 20.1786 21.5296 19.732 21.4173 19.2828L21.4071 19.242L21.4327 19.2088C22.4178 17.9531 22.9436 16.4141 22.9436 14.8165C22.9436 10.9422 19.8452 7.74176 15.9505 7.74176C12.0559 7.74176 8.95752 10.9422 8.95752 14.8165C8.95752 16.4192 9.48837 17.9633 10.4786 19.2215C11.4434 20.444 12.7833 21.3195 14.2993 21.6921L14.3529 21.7048L14.3631 21.7584C14.4626 22.2306 14.6106 22.69 14.8199 23.1239C14.8454 23.1749 14.871 23.2259 14.8965 23.277L14.973 23.425L14.8072 23.402C12.7526 23.1264 10.8819 22.103 9.52411 20.5436C8.13571 18.951 7.38281 16.9271 7.38281 14.8139C7.38536 10.0719 11.183 6.1543 15.9505 6.1543Z\" fill=\"white\"/>\n" +
                    "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.6659 13.5006C11.8446 13.3015 12.4162 13.1152 13.2151 13.1152C14.0139 13.1152 15.0399 13.3015 16.0123 13.7685C16.9821 14.2356 17.8984 14.9885 18.4828 15.8511C19.0698 16.7138 19.325 17.6913 19.5394 18.5998C19.7538 19.5084 19.9248 20.3507 20.2898 21.2261C20.6547 22.1015 21.2111 23.01 21.8236 23.6455C22.4387 24.281 23.1074 24.6434 23.8144 24.9038C24.5213 25.1641 25.264 25.3198 25.6494 25.4499C26.0348 25.5776 26.0628 25.6796 25.8459 25.7486C25.629 25.82 25.167 25.8634 24.677 25.8404C24.187 25.82 23.6663 25.7332 22.7195 25.5265C21.7726 25.3198 20.3995 24.9905 19.2204 24.4852C18.0413 23.9773 17.0536 23.2933 16.561 22.2725C16.0684 21.2516 16.0684 19.8964 16.0684 18.7096C16.0684 17.5228 16.0684 16.5122 15.7979 15.7899C15.5274 15.0702 14.9863 14.6414 14.4223 14.404C13.8582 14.1692 13.2738 14.1258 12.8527 14.1105C12.4316 14.0952 12.1738 14.1105 11.939 14.011C11.7042 13.9115 11.4898 13.6971 11.6685 13.498\" fill=\"white\"/>\n" +
                    "</svg>\n",);
                let myPlacemark = new ymaps.Placemark([lat, lon],
                    {
                    hintContent: cityName,
                    balloonContent: cityName
                    },
                    {
                        iconLayout: squareLayout,
                        iconShape: {
                            type: 'Rectangle',
                            coordinates: [
                                [0, 0], [26, 26]
                            ]
                        }
                    }
                );

                myMap.geoObjects.add(myPlacemark);
            }

            myMap.controls.remove('geolocationControl'); // удаляем геолокацию
            myMap.controls.remove('searchControl'); // удаляем поиск
            myMap.controls.remove('trafficControl'); // удаляем контроль трафика
            myMap.controls.remove('typeSelector'); // удаляем тип
            myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
            myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
            myMap.controls.remove('rulerControl'); // удаляем контрол правил
            // myMap.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)

            // myMap.geoObjects
            //     .add(myPlacemark)
        }
    }

    //кнопка Показать еще для статей
    if (document.querySelector('.articles')) {
        hideElements(Array.from(document.querySelectorAll('.articles__item')), document.querySelectorAll('.articles__button'), 3)
    }

    //копирование статьи
    if (document.querySelector('.js-copy-link')) {
        let buttons = document.querySelectorAll('.js-copy-link')
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                copyTextToClipboard(window.location.href)
            })
        })
    }

    //слайдер сравнения
    if (document.querySelector('.comprasion')) {
        let slidesPerView = document.querySelectorAll('.comprasion-slide').length >= 3 ? 3 : 1

        if (document.querySelectorAll('.comprasion-slide').length === 2) {
            slidesPerView = 2
        }
        let comprasionSliders = document.querySelectorAll('.comprasion-slider')
        comprasionSliders.forEach(slider => {
            if(window.innerWidth <= 768) {
                slider.querySelector('.comprasion-arrowBx').style.top = document.querySelector('.comprasion-slide-imgBx').clientHeight + 'px'
                slider.querySelector('.comprasion-counts').style.top = document.querySelector('.comprasion-slide-imgBx').clientHeight + 'px'
            }
            const swiper = new Swiper(slider, {
                // Default parameters
                slidesPerView: slidesPerView,
                init: false,
                navigation: {
                    nextEl: slider.querySelector('.comprasion-arrowBx .comprasion-arrow.right'),
                    prevEl: slider.querySelector('.comprasion-arrowBx .comprasion-arrow.left'),
                },
                // pagination: {
                //     el: '.card-pagination',
                //     type: 'bullets',
                //     clickable: true,
                // },
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 1,
                    },
                    // when window width is >= 480px
                    769: {
                        slidesPerView: 2,
                    },
                    // when window width is >= 480px
                    1200: {
                        slidesPerView: slidesPerView,
                    },
                }
            })
            if(window.innerWidth <= 768) {
                swiper.on("slideChange afterInit init", function () {
                    let currentSlide = this.activeIndex + 1;
                    slider.querySelector('.comprasion-counts-current').textContent =  `${currentSlide}`
                    slider.querySelector('.comprasion-counts-max').textContent =  `${this.slides.length}`
                });
            }
            swiper.init();
        })
        // if(document.querySelector('.comprasion-slide:nth-child(3)')) {
        //     document.querySelector('.comprasion-slide:nth-child(3)').classList.add('border-radius')
        // }
        // swiper.on('slideChange', function (event) {
        //     document.querySelectorAll('.comprasion-slide').forEach(el => el.classList.remove('border-radius'))
        //     document.querySelectorAll('.comprasion-slide')[event.activeIndex].nextElementSibling.nextElementSibling.classList.add('border-radius')
        // });
    }


    if (document.querySelector('.footer-box')) {
        if (window.innerWidth <= 1080) {
            let footerPages = document.querySelectorAll('.footer-pageBx__title')

            footerPages.forEach(item => {
                item.addEventListener('click', () => {
                    let content = item.parentNode.querySelector('.footer-pageBx ul');

                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                        item.parentNode.classList.remove('active');
                    } else {
                        document.querySelectorAll('.footer-pageBx ul').forEach(el => el.style.maxHeight = null);
                        document.querySelectorAll('.footer-pageBx').forEach(el => el.classList.remove('active'));
                        content.style.maxHeight = content.scrollHeight + 'px';
                        item.parentNode.classList.add('active');
                    }

                })
            })
        }
    }

    if (document.querySelector('.catalog-box')) {
        hideElements(Array.from(document.querySelectorAll('.catalog-box .assortiments__item')), document.querySelectorAll('.catalog__more'), 4)
    }

    //маска телефонов
    if(document.querySelector('.phone-mask')) {
        // $('.phone-mask').mask('+7 (999) 999-99-99', {autoclear: false})\

        document.querySelectorAll('.phone-mask').forEach(phone => {
            IMask(
                phone,
                {
                    mask: '+{7} (000) 000-00-00',
                    // lazy: false,
                    // placeholderChar: '_'
                }
            )
        })
    }

    //табы галереи
    if(document.querySelector('.photos')) {
        let photosSliders = document.querySelectorAll('.photos-slider')

        photosSliders.forEach(slider => {
            const swiper = new Swiper(slider, {
                // Default parameters
                slidesPerView: 1,
                navigation: {
                    nextEl: slider.querySelector('.photos-arrow.right'),
                    prevEl: slider.querySelector('.photos-arrow.left'),
                },
                pagination: {
                    el: slider.querySelector('.photos-pagination'),
                    type: 'bullets',
                    clickable: true,
                },
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 1,
                    },
                    // when window width is >= 480px
                    601: {
                        slidesPerView: 1,
                    },
                }
            })
        })

        let types = document.querySelectorAll('.photos-types__item'),
            items = document.querySelectorAll('.photos-item')
        types.forEach((type, typeIndex) => {
            type.addEventListener('click', () => {
                types.forEach(el => {el.classList.remove('active')})
                type.classList.add('active')

                items.forEach(el => {el.classList.remove('active')})
                items[typeIndex].classList.add('active')
            })
        })

        let subTypes = document.querySelectorAll('.photos-variants')
        subTypes.forEach((subType) => {
            subType.addEventListener('click', (e) => {
                let children = Array.from(subType.children);
                let index = children.indexOf(e.target);

                children.forEach(el => el.classList.remove('active'))
                e.target.classList.add('active')

                if(e.target.classList.contains('photos-variants__item')) {
                    subType.closest('.photos-item').querySelectorAll('.photos-content').forEach(el => el.classList.remove('active'))
                    subType.closest('.photos-item').querySelectorAll('.photos-content')[index].classList.add('active')

                }
            })
        })

        let photosContent = document.querySelectorAll('.photos-content')
        photosContent.forEach(wrapper => {
            Fancybox.bind(wrapper.querySelector(".photos-slider-wrapper"), "[data-fancybox]", {
                // Your custom options
            });
        })
    }

    if(document.querySelector('.addresses')) {
        let searchIcon = document.querySelector('.addresses-icon')
        searchIcon.addEventListener('click', () => {
            searchIcon.closest('.addresses-searchBx').classList.toggle('active')
            searchIcon.parentNode.querySelector('input').focus()
        })
    }
    if(document.querySelector('.goal')) {
        if(window.innerWidth > 600) {
            gsap.registerPlugin(ScrollTrigger);
            //наезжающие блоки
            let boxWidth = document.querySelector('.goal-box').clientWidth
            gsap.timeline({
                scrollTrigger: {
                    trigger: '.goal',
                    pin: true,
                    start: '50% 50%',
                    end: `+=${boxWidth * 2 }`,
                    scrub: 1,
                    onUpdate: self => {
                        document.querySelectorAll('.goal__item').forEach((item, index) => {
                            if(self.progress + 0.05 > (index / document.querySelectorAll('.goal__item').length)) {
                                document.querySelectorAll('.goal-years__uniq').forEach(el => el.classList.remove('active'))
                                document.querySelectorAll('.goal-years__uniq')[index].classList.add('active')

                                document.querySelectorAll('.goal__item').forEach(el => el.classList.remove('active'))
                                item.classList.add('active')
                            }
                        })
                    }
                }
            }).fromTo('.goal-box', {x: 0}, {x: - boxWidth + document.querySelector('.goal-box .goal__item').clientWidth})
        }
    }

    if(document.querySelector('.catalog-selectBx')) {
        let dropdownButtons = document.querySelectorAll('.catalog-selectBx')

        dropdownButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.parentNode.classList.toggle('active')
            })
        })

        let dropdownItems = document.querySelectorAll('.catalog-dropdown__item')
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                item.closest('.catalog-filter-priceBx').classList.remove('active')
                item.closest('.catalog-filter-priceBx').querySelector('.catalog-selectBx__text').textContent = item.textContent

            })
        })
    }

    document.addEventListener("click", function(event) {
        const priceBx = document.querySelector(".catalog-filter-priceBx");
        const cities = document.querySelector(".header-selectBx");

        // Проверяем, был ли клик вне элемента .catalog-filter-priceBx
        if(priceBx){
            if (event.target !== priceBx && !priceBx.contains(event.target)) {
                // Убираем класс 'active' у .catalog-filter-priceBx
                priceBx.classList.remove("active");
            }
        }
        if(cities){
            if (event.target !== cities && !cities.contains(event.target)) {
                // Убираем класс 'active' у .catalog-filter-priceBx
                cities.querySelector('.header-cities').classList.remove("active");
                cities.querySelector('.header__select').classList.remove("active");
            }
        }
    });

    // выбор активного цвета и цены
    if (document.querySelector('.card-color-item')) {
        let buttonActive = document.getElementsByClassName("color-active");
        let price = document.getElementById('price');
        let buttonsColor = Array.from(document.querySelectorAll('.card-color-item'));
        let preview = document.querySelector('.card-color-preview')

        price.innerText = buttonActive[0].getAttribute('data-price')

        buttonsColor.forEach((button) => {
            button.addEventListener('click', () => {
                buttonsColor.forEach(el => el.classList.remove('color-active'))
                button.classList.add('color-active')
                price.innerText = button.getAttribute('data-price')
                preview.style.background = button.querySelector('.card-color-circle').style.background

            })
        })

        const swiper = new Swiper('.card-color-slider', {
            // Default parameters
            slidesPerView: 4,
            // centerMode: true,
            spaceBetween: 16,
            navigation: {
                nextEl: '.card-color-arrow.right',
                prevEl: '.card-color-arrow.left',
            },
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 3,
                    spaceBetween: 0,
                    centerMode: false,
                },
                // when window width is >= 480px
                520: {
                    slidesPerView: 4,
                },
            }
        })
    }

    if(document.querySelector('form')) {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit' ,(e) => {
                e.preventDefault()
                console.log(validateForm(form))
            })
        })
    }

});

let validateForm = (form) => {
    let elements = form.elements;
    let isValid = true;

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        if (element.tagName === 'INPUT' && element.hasAttribute('required')) {
            let parentFormGroup = element.closest('div');

            switch (element.type) {
                case 'email':
                    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(element.value.trim())) {
                        markAsError(parentFormGroup, 'Некорректно введены данные');
                        isValid = false;
                    } else {
                        removeError(parentFormGroup);
                    }
                    break;
                case 'tel':
                    let phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
                    console.log(element.value.trim())
                    if (!phoneRegex.test(element.value.trim())) {
                        markAsError(parentFormGroup, 'Некорректно введены данные');
                        isValid = false;
                    } else {
                        removeError(parentFormGroup);
                    }
                    break;
                case 'checkbox':
                    if (!element.checked) {
                        markAsError(parentFormGroup, 'Заполните поле');
                        isValid = false;
                    } else {
                        removeError(parentFormGroup);
                    }
                    break;
                default:
                    if (element.value.trim() === '') {
                        markAsError(parentFormGroup, 'Заполните поле');
                        isValid = false;
                    } else {
                        removeError(parentFormGroup);
                    }
            }
        }
    }

    return isValid;
};

let markAsError = (element, errorMessageSpan, message) => {
    element.classList.add('error');
    // errorMessageSpan.textContent = message;
}

let removeError = (element, errorMessageSpan) => {
    element.classList.remove('error');
    // errorMessageSpan.textContent = '';
}

$('img.svg').each(function () {
    let $img = $(this);
    let imgID = $img.attr('id');
    let imgClass = $img.attr('class');
    let imgURL = $img.attr('src');

    $.get(imgURL, function (data) {
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
let sendRequest = (type = 'POST', link, data, dataType = 'json', callback = json => {
}) => {
    $.ajax({
        type: type,
        url: `${link}`,
        data: data ? data : '',
        dataType: dataType,
        processData: true,
        contentType: 'application/json',
        success: function (response) {
            callback(response)
        }
    });
}

let hideElements = (items, buttonsMore, showPerClick) => {
    for (let i = 0; i < buttonsMore.length; i++) {
        buttonsMore[i].addEventListener('click', function () {

            let hidden = items.filter(item => item.classList.contains('hidden'));
            for (let i = 0; i < showPerClick; i++) {
                if (!hidden[i]) return this.style.display = "none";

                hidden[i].classList.remove('hidden');
            }
        });
    }
}

let copyTextToClipboard = (text, textMessage = 'Скопировано!') => {
    // Создаем временный элемент для копирования текста
    let tempInput = document.createElement('input'),
        message = document.querySelector('.message')
    tempInput.value = text;
    document.body.appendChild(tempInput);

    // Выделяем текст внутри временного элемента
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    try {
        // Копируем выделенный текст в буфер обмена
        document.execCommand('copy');

        // Визуальное подтверждение копирования (опционально)
        if(message) {
            message.classList.add('active')
            message.textContent = textMessage
        }
        setTimeout(() => {
            if(message) {
                message.classList.remove('active')
            }
        }, 3000)
    } catch (err) {
        console.error('Не удалось скопировать текст: ', err);
    }

    // Удаляем временный элемент
    document.body.removeChild(tempInput);
}

// Паралакс мышей ========================================================================================
// const mousePrlx = new MousePRLX({})
// =======================================================================================================

// Фиксированный header ==================================================================================
// headerFixed()
// =======================================================================================================

togglePopupWindows()
// =======================================================================================================
