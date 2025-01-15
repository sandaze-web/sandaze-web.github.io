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
  }, isLock ? 0 : 0)
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

      if(!document.querySelector('.header-navBx').classList.contains('_is-open')) document.querySelector('.header-burger').classList.remove('active')
    }

    if (
      target.classList.contains('_overlay-bg') ||
      target.closest('.button-close')
    ) {
      const popup = target.closest('._overlay-bg')

      popup.classList.remove('_is-open')

      //дополнительные пересчеты конкретных поп апов
      document.querySelector('.header-catalog__button').classList.remove('active')
      if(!document.querySelector('.header-navBx').classList.contains('_is-open')) document.querySelector('.header-burger').classList.remove('active')

      if(popup.closest('.region')) {
        document.querySelector('.region').style.maxHeight =  0
        if(window.innerWidth <= 768) {
          let navBxMobile = document.querySelector('.header-navBx')
          navBxMobile.style.top = document.querySelector('.header').clientHeight + 'px'
          document.querySelector('.catalog').style.top = 0
        }else {
          document.querySelector('.catalog').style.top = document.querySelector('.header').clientHeight + 'px'
        }
      }

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

let geocodeApi = '06f41e63-609d-4d88-9c55-cf2900572996'
document.addEventListener('DOMContentLoaded', function() {
    // установка куки текущего города
    if(document.querySelector('.region-cities')) {
        let cities = document.querySelector('.region-cities'),
            accessButton = document.querySelector('.region__button')

        cities.addEventListener('click', (e) => {
            if(e.target.closest('.region-cities__item')) {
                setCookie('city', e.target.dataset.city, 7)
                window.location.reload()
            }
        })
        accessButton.addEventListener('click', () => {
            setCookie('city', document.querySelector('.region__city').dataset.city, 7)
            window.location.reload()
        })
    }

    if(document.querySelector('.region')) {

        document.querySelector('.region').style.maxHeight =  document.querySelector('.region').scrollHeight + 'px'
        hideCities()

        let cross = document.querySelector('.region__cross')
        cross.addEventListener('click', () => {
            setCookie('closeRegion', true, 1)
        })
    }

    if(document.querySelector('input[name="tel"]')) {
        $('input[name="tel"]').mask('+7 (999) 999 99-99')
    }

    if(document.querySelector('.description')) {
        let descWrapper = document.querySelector('.description-wrapper'),
            buttonMore = document.querySelector('.description-more p')

        buttonMore.addEventListener('click', () => {
            descWrapper.classList.add('active')
            descWrapper.style.maxHeight = descWrapper.scrollHeight + 'px'
        })
    }

    if(document.querySelector('#map')) {
        ymaps.ready(init);
        function init(){
            // Создание карты.
            let myMap = new ymaps.Map("map", {
                    // Координаты центра карты.
                    // Порядок по умолчанию: «широта, долгота».
                    // Чтобы не определять координаты центра карты вручную,
                    // воспользуйтесь инструментом Определение координат.
                    center: [59.91174358283167,30.349143781250017],
                    // Уровень масштабирования. Допустимые значения:
                    // от 0 (весь мир) до 19.
                    zoom: 8,
                }),
                objectManager = new ymaps.ObjectManager({
                    // Чтобы метки начали кластеризоваться, выставляем опцию.
                    clusterize: true,
                    // ObjectManager принимает те же опции, что и кластеризатор.
                    gridSize: 32,
                    clusterDisableClickZoom: true
                })


            //функция установки центра относительно всех точек на карте
            // Функция для установки центра карты по средним координатам
            // Функция для установки центра и масштаба карты для охвата всех точек
            function setMapCenterAndZoom(map, coordinatesArray) {
                // Находим минимальные и максимальные значения широты и долготы
                let sumLat = 0;
                let sumLon = 0;

                // Рассчитываем сумму координат
                for (let i = 0; i < coordinatesArray.length; i++) {
                    let coords = coordinatesArray[i];
                    sumLat += parseFloat(coords[0]);
                    sumLon += parseFloat(coords[1]);
                }

                // Рассчитываем средние координаты
                let avgLat = sumLat / coordinatesArray.length;
                let avgLon = sumLon / coordinatesArray.length;

                // Устанавливаем центр карты
                map.setCenter([avgLon, avgLat]);
            }



            let myCollection = new ymaps.GeoObjectCollection();
            let address = document.querySelectorAll('.services__item-info-address'),
                addressArr = []

            //перебор всех адресов и получение точек на карте
            address.forEach(item => {
                let results = [];
                let obj = {}

                // sendRequest('GET', `https://geocode-maps.yandex.ru/1.x/?apikey=${geocodeApi}&geocode=${item.dataset.city}${item.textContent.trim()}&format=json`,false, 'json', json => {
                //     let [y, x] = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
                //     addressArr.push(json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' '))
                //     obj = {
                //         "infoPoint": "<svg class='services__icon {% if properties.active %} active{% endif %}' width='44' height='53' viewBox='0 0 44 53' fill='none' xmlns='http://www.w3.org/2000/svg'><g filter='url(#filter0_d_246_59)'><circle cx='22.4547' cy='22.455' r='7.72745' fill='white'/><path d='M38.3127 29.5423L38.3127 29.5424L38.3172 29.5335C39.1242 27.9544 39.0612 25.915 37.7376 24.3296C36.8789 23.3011 36.889 21.8027 37.7614 20.7859C40.272 17.8596 38.4271 13.3196 34.587 12.974C33.2526 12.8539 32.2002 11.7873 32.0981 10.4514C31.8041 6.60696 27.2893 4.70121 24.3296 7.1722C23.3011 8.03086 21.8027 8.02078 20.7859 7.14837C17.8596 4.63781 13.3196 6.48268 12.974 10.3228C12.8539 11.6572 11.7873 12.7096 10.4514 12.8117C6.60696 13.1057 4.70121 17.6205 7.1722 20.5802C8.03086 21.6087 8.02078 23.107 7.14837 24.1239C5.4001 26.1617 5.77148 28.9705 7.42392 30.6029L19.9202 46.7551C21.2033 48.4135 23.7065 48.4153 24.9918 46.7586L37.3829 30.7883L37.3841 30.787C37.4023 30.7668 37.4279 30.7382 37.459 30.703C37.5209 30.633 37.606 30.535 37.6985 30.4236C37.8651 30.223 38.1198 29.9036 38.2726 29.6188L38.2726 29.6188L38.2772 29.61L38.3127 29.5423ZM29.1823 22.4549C29.1823 26.1704 26.1704 29.1823 22.4549 29.1823C18.7394 29.1823 15.7274 26.1704 15.7274 22.4549C15.7274 18.7394 18.7394 15.7274 22.4549 15.7274C26.1704 15.7274 29.1823 18.7394 29.1823 22.4549Z' fill='#0D2938' stroke='white' stroke-width='2'/></g><defs><filter id='filter0_d_246_59' x='0.998779' y='0.99707' width='42.9138' height='52.0029' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'><feFlood flood-opacity='0' result='BackgroundImageFix'/><feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/><feOffset/><feGaussianBlur stdDeviation='2'/><feComposite in2='hardAlpha' operator='out'/><feColorMatrix type='matrix' values='0 0 0 0 0.0197222 0 0 0 0 0.0666667 0 0 0 0 0.0407323 0 0 0 0.12 0'/><feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_246_59'/><feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_246_59' result='shape'/></filter></defs></svg>",
                //         "help": item.textContent,
                //         "latitude": x,
                //         "longitude": y
                //     }
                //     results.push(createPlacemark(obj));
                //
                //     if (addressArr.length === address.length) {
                //         setMapCenterAndZoom(myMap, addressArr);
                //     }
                // })
                // data.points.forEach(function(item, index) {
                //     arr_adress.push(item);
                // });
            })

            myMap.geoObjects.add(myCollection);
            myMap.geoObjects.add(objectManager);

            // Функция создания метки
            function createPlacemark(item) {
                let squareLayout = ymaps.templateLayoutFactory.createClass(item.infoPoint);
                let place = new ymaps.Placemark(
                    [item.latitude, item.longitude],
                    {
                        hintContent: item.help,
                    },
                    {
                        iconLayout: squareLayout,
                        iconShape: {
                            type: 'Rectangle',
                            coordinates: [
                                [15, 20], [30, 40]
                            ]
                        }
                    }
                );
                myCollection.add(place);
            }

            let thatCoordinates;
            //обработка нажатия
            myCollection.events.add('click', function (e) {
                let that = e.get('target').properties.get('active');
                myCollection.each(function(item, index){
                    item.properties.set('active', false);

                    if(e.get('target') == item && !that){
                        e.get('target').properties.set('active', true);
                        thatCoordinates = e.get('coords');
                        let currentClickAddress = e.get('target').properties.get('hintContent'),
                            addresses = document.querySelectorAll('.services__item-info-main .services__item-info-address')

                        addresses.forEach(el => {
                            if(currentClickAddress === el.textContent) {
                                if(window.innerWidth > 768) {
                                    document.querySelector('.services-map-box').scrollTo({
                                        top: el.closest('.services__item').offsetTop,
                                        behavior: 'smooth'
                                    });
                                }else{
                                    let items = document.querySelectorAll('.services-map-box .services__item')
                                    items.forEach(service_item => service_item.style.display = 'flex')
                                    items.forEach(service_item => {
                                        service_item.style.display = 'none'
                                        if(!service_item.querySelector('.services__item-info-address')) return false
                                        if(service_item.querySelector('.services__item-info-address').textContent === currentClickAddress) {
                                            service_item.style.display = 'flex'
                                        }else{
                                            toggleBodyLock(true)
                                        }
                                    })
                                    document.querySelector('.services-map-helper').classList.add('_is-open')
                                }
                            }
                        })
                    }
                });
            });

            myMap.controls.remove('geolocationControl'); // удаляем геолокацию
            myMap.controls.remove('searchControl'); // удаляем поиск
            myMap.controls.remove('trafficControl'); // удаляем контроль трафика
            myMap.controls.remove('typeSelector'); // удаляем тип
            myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
            myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
            myMap.controls.remove('rulerControl'); // удаляем контрол правил
        }


        if(window.innerWidth <= 768) {
            let servisesItemSwipeble = new SwipeablePopup('.services-map-box', '.services-map-helper')
        }
    }

    if(document.querySelector('.services-wrapper')) {
        let buttons         = document.querySelectorAll('.services-control-buttonBx__item'),
            blocksChanger   = document.querySelectorAll('.js-block-changer')

        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                buttons.forEach(el => {el.classList.remove('active')}) // сброс активной кнопки
                button.classList.add('active')

                blocksChanger.forEach(el => {
                    el.style.opacity = 0
                    setTimeout(() => {
                        el.style.display = 'none'
                    }, 400)
                })

                setTimeout(() => {
                    blocksChanger[index].style.display = 'flex'
                }, 400)
                setTimeout(() => {
                    blocksChanger[index].style.opacity = 1
                }, 600)
            })
        })
    }

    if(document.querySelector('.service-map')) {
        let addr = $('.js-map').data('addr'),
            x = $(".js-map").data('x') === undefined ? 0 : $(".js-map").data('x'),
            y =$(".js-map").data('y') === undefined ? 0 : $(".js-map").data('y')

        ymaps.ready(init);

        function init() {
            let squareLayout = ymaps.templateLayoutFactory.createClass("<svg class='services__icon {% if properties.active %} active{% endif %}' width='44' height='53' viewBox='0 0 44 53' fill='none' xmlns='http://www.w3.org/2000/svg'><g filter='url(#filter0_d_246_59)'><circle cx='22.4547' cy='22.455' r='7.72745' fill='white'/><path d='M38.3127 29.5423L38.3127 29.5424L38.3172 29.5335C39.1242 27.9544 39.0612 25.915 37.7376 24.3296C36.8789 23.3011 36.889 21.8027 37.7614 20.7859C40.272 17.8596 38.4271 13.3196 34.587 12.974C33.2526 12.8539 32.2002 11.7873 32.0981 10.4514C31.8041 6.60696 27.2893 4.70121 24.3296 7.1722C23.3011 8.03086 21.8027 8.02078 20.7859 7.14837C17.8596 4.63781 13.3196 6.48268 12.974 10.3228C12.8539 11.6572 11.7873 12.7096 10.4514 12.8117C6.60696 13.1057 4.70121 17.6205 7.1722 20.5802C8.03086 21.6087 8.02078 23.107 7.14837 24.1239C5.4001 26.1617 5.77148 28.9705 7.42392 30.6029L19.9202 46.7551C21.2033 48.4135 23.7065 48.4153 24.9918 46.7586L37.3829 30.7883L37.3841 30.787C37.4023 30.7668 37.4279 30.7382 37.459 30.703C37.5209 30.633 37.606 30.535 37.6985 30.4236C37.8651 30.223 38.1198 29.9036 38.2726 29.6188L38.2726 29.6188L38.2772 29.61L38.3127 29.5423ZM29.1823 22.4549C29.1823 26.1704 26.1704 29.1823 22.4549 29.1823C18.7394 29.1823 15.7274 26.1704 15.7274 22.4549C15.7274 18.7394 18.7394 15.7274 22.4549 15.7274C26.1704 15.7274 29.1823 18.7394 29.1823 22.4549Z' fill='#0D2938' stroke='white' stroke-width='2'/></g><defs><filter id='filter0_d_246_59' x='0.998779' y='0.99707' width='42.9138' height='52.0029' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'><feFlood flood-opacity='0' result='BackgroundImageFix'/><feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/><feOffset/><feGaussianBlur stdDeviation='2'/><feComposite in2='hardAlpha' operator='out'/><feColorMatrix type='matrix' values='0 0 0 0 0.0197222 0 0 0 0 0.0666667 0 0 0 0 0.0407323 0 0 0 0.12 0'/><feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_246_59'/><feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_246_59' result='shape'/></filter></defs></svg>");
            let Map = new ymaps.Map("service-map", {
                center: [x, y],
                zoom: 15,
                controls: [
                    'zoomControl',
                    'rulerControl',
                    'routeButtonControl',
                ]
            });
            //если не заданы x и y то запрос геокодеру по адресу
            if(!x || !y) {
                let address = document.querySelector('.service-info__item-address'),
                    city = document.querySelector('.service-info__item-address').dataset.city !== undefined ? document.querySelector('.service-info__item-address').dataset.city : ''
                // sendRequest('GET', `https://geocode-maps.yandex.ru/1.x/?apikey=${geocodeApi}&geocode=${city}${address.textContent.trim()}&format=json`,false, 'json', json => {
                //     [y, x] = json.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
                //     let mark = new ymaps.Placemark([x, y],
                //         {
                //             hint: 'Сервисный центр ',
                //             balloonContent: addr,
                //         },
                //         {
                //             iconLayout: squareLayout,
                //             iconShape: {
                //                 type: 'Rectangle',
                //                 coordinates: [
                //                     [15, 20], [30, 40]
                //                 ]
                //             }
                //         }
                //     );
                //
                //     Map.geoObjects.add(mark);
                //     Map.setCenter([x, y])
                //
                //     let dataToSendCoords = {
                //         service_id: parseInt(document.querySelector('.service').dataset.serviceId),
                //         x: x,
                //         y: y,
                //     };
                //     // sendRequest('POST', `${location.protocol}//${location.hostname}/wp-content/api/service/coords/`, JSON.stringify(dataToSendCoords), 'json', (json) => {})
                // })
            }else{
                let mark = new ymaps.Placemark([x, y],
                    {
                        hint: 'Сервисный центр ',
                        balloonContent: addr,
                    },
                    {
                        iconLayout: squareLayout,
                        iconShape: {
                            type: 'Rectangle',
                            coordinates: [
                                [15, 20], [30, 40]
                            ]
                        }
                    }
                );

                Map.geoObjects.add(mark);
                Map.setCenter([x, y])
            }
        }

    }

    if(document.querySelector('.header')) {
        let catalogButton = document.querySelectorAll('.header-catalog__button'),
            catalog = document.querySelector('.catalog')

        catalogButton.forEach(el => {
            el.addEventListener('click', () => {
                catalogButton.forEach(el => {el.classList.toggle('active')})
                catalog.classList.toggle('_is-open')
                toggleBodyLock(catalog.classList.contains('_is-open'))

                if(window.innerWidth > 768) animateToBlock('.header')
            })
        })

        let burger = document.querySelector('.header-burger'),
            nav = document.querySelector('.header-navBx')

        burger.addEventListener('click', () => {
            burger.classList.toggle('active')
            nav.classList.toggle('_is-open')
            toggleBodyLock( nav.classList.contains('_is-open'))
        })

        if(window.innerWidth <= 768) {
            let swipeableWrapper = new SwipeablePopup('.catalog-wrapper', '.catalog')
        }

        let header = document.querySelector('.header'),
            navBxMobile = document.querySelector('.header-navBx')

        if(window.innerWidth <= 768) {
            navBxMobile.style.top = header.getBoundingClientRect().top + header.clientHeight + 'px'
            catalog.style.top = 0
        }else {
            if(document.querySelector('.region-wrapper')) {
                catalog.style.top = document.querySelector('.region-wrapper').scrollHeight + header.scrollHeight + 'px'
            }
        }
    }


    if(document.querySelector('.modal')) {
        if(window.innerWidth <= 768) {
            let swipeableRepair = new SwipeablePopup('.repair-formBx', '.repair')
            let swipeableQuestion = new SwipeablePopup('.question-formBx', '.repair')
        }
    }
    if(document.querySelector('.services__item')) {
        let servicesBox = document.querySelector('.services-box')

        servicesBox.addEventListener('mouseover', (el) => {
            if(el.target.closest('.services__item')) {
                let currentItem = el.target.closest('.services__item')
                document.querySelectorAll('.services-box .services__item').forEach(item => item.style.opacity = '.65')
                currentItem.style.opacity = '1';
            }
        })
        servicesBox.addEventListener('mouseout', (el) => {
            if(el.target.closest('.services__item')) {
                document.querySelectorAll('.services-box .services__item').forEach(item => item.style.opacity = '1')
            }
        })
    }


    if(document.querySelector('[data-more]')){
        let sectionsButton = document.querySelectorAll('[data-more] button')
        sectionsButton.forEach(button => {
            button.addEventListener('click', () => {
                let iterationNmae = button.closest('[data-more]').dataset.more,
                    page = parseInt(button.dataset.page)
                button.classList.add('isLoading')
                // sendRequest('GET', `${location.href}?${iterationNmae}_iteration=${++page}`, '', 'html', data => {
                //     // Парсим полученный HTML-код в jQuery объект
                //     const $loadedContent = $('<div>').html(data);
                //
                //     // Найдем элемент #content-to-append в загруженном содержимом
                //     const $contentToAppend = $loadedContent.find(`.${button.previousElementSibling.firstElementChild.classList[0]}`);
                //
                //     if($contentToAppend.length === 0) {
                //         button.style.display = 'none'
                //         return false;
                //     }
                //     button.dataset.page = button.dataset.page + 1
                //     // Добавим $contentToAppend к #technics-box
                //     $(`.${button.previousElementSibling.classList[0]}`).append($contentToAppend);
                //     button.classList.remove('isLoading')
                // })
            })
        })
    }

    document.addEventListener('mouseup', function(evt) {
        if(document.querySelector('.search-input')) {
            let inputs = document.querySelectorAll('.search-input')
            inputs.forEach(input => {
                if (input !== document.activeElement && input.parentNode.querySelector('.control-list') !== evt.target) {
                    input.parentNode.classList.remove('active')
                }
            })
        }
        if(document.querySelector('.adding-city')) {
            let inputs = document.querySelectorAll('.adding-city')
            inputs.forEach(input => {
                if (input !== document.activeElement && input.parentNode.querySelector('.adding-form-fieldBx') !== evt.target) {
                    input.parentNode.classList.remove('active')
                }
            })
        }
    })

    if(document.querySelector('#services-control-input')) {
        $('#services-control-input').hideseek({ });
    }

    if(document.querySelector('.search-input')) {
        let setStatusRequest = (isRequest) => {
            if(isRequest) {
                //заблокировать input
                // document.querySelector('.control-box').classList.add('disable')
            }else{
                //разблокировать input
                // document.querySelector('.control-box').classList.remove('disable')
            }
        }

        let sendFilters = (data) => {
            setStatusRequest(true)
            // sendRequest('POST', `${location.protocol}//${location.hostname}/wp-content/api/service/filters/`, data, 'json', json => {
            //     if(json.link) {
            //         let countFilter = document.querySelector('.control__button')
            //         countFilter.querySelector('span').textContent = json.count
            //         countFilter.dataset.link = json.link
            //     }else{
            //
            //     }
            //     setStatusRequest(false)
            // })
        }
        //первый запрос при заходе на страницу
        sendFilters(generateFilterData())

        //выпадающий список
        let inputs = document.querySelectorAll('.search-input')
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentNode.classList.add('active')
            })
            $(input).hideseek({ });
        })

        let searchBxs = document.querySelectorAll('.control-list')
        searchBxs.forEach(searchBx => {
            searchBx.addEventListener('click', e => {
                if(e.target.closest('.control-list__link')) {
                    e.target.closest('.control-selectBx').querySelector('input').value = e.target.closest('.control-list__link').textContent
                }
            })
        })

        //проверка на куки и вставка в hidden
        if(getCookie('city')) {
            let cities = document.querySelectorAll('.control-list-city .control-list__link')
            cities.forEach(el => {
                let code = el.dataset.code
                if(code === getCookie('city')) {
                    document.querySelector('.search-input-city').value = el.textContent
                }
            })
        }

        //обработка инпутов фильров
        document.querySelectorAll('.search-input').forEach(input => {
            input.addEventListener('change', (e) => {
                if(!e.target.value) {
                    e.target.parentNode.querySelector('input[type="hidden"]').value = ''
                    // sendFilters(generateFilterData())
                    return false;
                }
                let list = e.target.parentNode.querySelector('.control-list'),
                    $li = list.querySelector('li:not([style="display: none;"])')
                if($li) {
                    e.target.value = $li.querySelector('div').textContent
                    e.target.parentNode.querySelector('input[type="hidden"]').value = $li.querySelector('div').dataset.code
                    list.closest('.control-selectBx').classList.remove('active')
                }

                sendFilters(generateFilterData())
            })
        })
        //обработка инпутов фильров
        document.querySelectorAll('.search-input').forEach(input => {
            input.addEventListener('keyup', (e) => {
                if(!e.target.value) {
                    e.target.parentNode.querySelector('input[type="hidden"]').value = ''
                    sendFilters(generateFilterData())
                    return false;
                }
            })
        })

        let controlLists = document.querySelectorAll('.control-list')
        controlLists.forEach(list => {
            list.addEventListener('click', ({target}) => {
                if(target.classList.contains('control-list__link')) {
                    list.parentNode.querySelector('input').value = target.textContent
                    list.parentNode.querySelector('input[type="hidden"]').value = target.dataset.code
                    list.parentNode.classList.remove('active')
                    sendFilters(generateFilterData())
                }
            })
        })

        //при нажатии на кнопку откроется ссылка из data-link
        document.querySelector('.control__button').addEventListener('click', () => {
            window.location.href = document.querySelector('.control__button').dataset.link
        })
    }

    if(document.querySelector('.guide')) {
        let cityButtonMore = document.querySelector('.js-button-city')
        cityButtonMore.addEventListener('click', () => {
            if(cityButtonMore.parentNode.querySelector('.guide-wrapper').classList.contains('show')) {
                cityButtonMore.parentNode.querySelector('.guide-wrapper').classList.remove('show')
                animateToBlock('.guide')
                cityButtonMore.textContent = 'Показать список городов'
            }else{
                cityButtonMore.parentNode.querySelector('.guide-wrapper').classList.add('show')
                animateToBlock('.guide-wrapper')
                cityButtonMore.textContent = 'Скрыть список городов'
            }
        })
    }

    if(document.querySelector('.brands-served')) {
        hideElements('.brands-more .brands-served__item', '.brands-more .brands-served__button')
        hideElements('.service-technics-more .brands-served__item', '.service-technics-more .brands-served__button')
    }

    if(document.querySelector('.paginationjs')) {
        let pagination = document.querySelector('.paginationjs')

        let totalPages = document.querySelector('.paginationjs ul li:last-child').textContent; // Замените на актуальное количество страниц
        let currentPage = 5; // Замените на активную страницу

        let  updatePagination = () => {
            let paginationHtml = '';

            if (window.innerWidth < 768) { // Адаптация для мобильных устройств (примерная ширина)
                if (totalPages <= 3) {
                    for (let i = 1; i <= totalPages; i++) {
                        paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                    }
                } else {
                    if (currentPage <= 2) {
                        for (let i = 1; i <= 3; i++) {
                            paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                        }
                        paginationHtml += '<span class="ellipsis">...</span>';
                        paginationHtml += '<li>' + totalPages + '</li>';
                    } else if (currentPage >= totalPages - 1) {
                        paginationHtml += '<li>1</li>';
                        paginationHtml += '<span class="ellipsis">...</span>';
                        for (let i = totalPages - 2; i <= totalPages; i++) {
                            paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                        }
                    } else {
                        paginationHtml += '<li>1</li>';
                        paginationHtml += '<span class="ellipsis">...</span>';
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                            paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                        }
                        // paginationHtml += '<span class="ellipsis">...</li>';
                        paginationHtml += '<li>' + totalPages + '</li>';
                    }
                }
            } else { // Адаптация для десктопов и планшетов
                if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) {
                        paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                    }
                } else {
                    if (currentPage <= 3) {
                        for (let i = 1; i <= 4; i++) {
                            paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                        }
                        paginationHtml += '<span class="ellipsis">...</span>';
                        paginationHtml += '<li>' + totalPages + '</li>';
                    } else if (currentPage >= totalPages - 2) {
                        paginationHtml += '<li>1</li>';
                        paginationHtml += '<span class="ellipsis">...</span>';
                        for (let i = totalPages - 3; i <= totalPages; i++) {
                            paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                        }
                    } else {
                        paginationHtml += '<li>1</li>';
                        paginationHtml += '<span class="ellipsis">...</span>';
                        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                            paginationHtml += '<li' + (i === currentPage ? ' class="active"' : '') + '>' + i + '</li>';
                        }
                        paginationHtml += '<span class="ellipsis">...</span>';
                        paginationHtml += '<li>' + totalPages + '</li>';
                    }
                }
            }

            $(".paginationjs ul").html(paginationHtml);
        }

        pagination.addEventListener('click', (e) => {
            console.log(e.target.tagName)
            if(e.target.tagName == 'LI') {
                let clickedPage = currentPage = parseInt(e.target.textContent)
                document.querySelectorAll('.paginationjs ul li').forEach(el => el.classList.remove('active'))
                e.target.classList.add('active')
                animateToBlock('.services-box')

                updatePagination()
                // sendRequest('GET', `${location.href}?page=${clickedPage}`, '', 'html', data => {
                //     // Парсим полученный HTML-код в jQuery объект
                //     const $loadedContent = $('<div>').html(data);
                //
                //     // Найдем элемент #content-to-append в загруженном содержимом
                //     const $contentToAppend = $loadedContent.find(`.services-box li`);
                //
                //     $(`.services-box `).html($contentToAppend);
                // })
            }
        })
    }

    if(document.querySelector('.faq')) {
        let faqItems = document.querySelectorAll('.faq__item')

        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                let content = item.querySelector('.faq__item-answer');

                if(content.style.maxHeight){
                    content.style.maxHeight = null;
                    item.classList.remove('active');
                }else{
                    document.querySelectorAll('.faq__item-answer').forEach(el => el.style.maxHeight = null);
                    faqItems.forEach(el => el.classList.remove('active'));
                    content.style.maxHeight = content.scrollHeight + 'px';
                    item.classList.add('active');
                }

            })
        })
    }

    if(document.querySelector('.adding')) {
        //выпадающий список
        let inputs = document.querySelectorAll('.adding-city')
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentNode.classList.add('active')
            })
            $(input).hideseek({ });
        })


        let searchBxs = document.querySelectorAll('.adding-list')
        searchBxs.forEach(searchBx => {
            searchBx.addEventListener('click', e => {
                if(e.target.closest('.adding-list__link')) {
                    e.target.closest('.adding-form-fieldBx').querySelector('input').value = e.target.closest('.adding-list__link').textContent
                    e.target.closest('.adding-form-fieldBx').querySelector('input[type="hidden"]').value = e.target.closest('.adding-list__link').dataset.code
                }
            })
        })
    }
});

$('.svg img').each(function () {
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

let hideElements = ($items, $more) => {
    let allServicesItem = document.querySelectorAll($items)

    for (let i = 12; i < allServicesItem.length; i++) {
        allServicesItem[i].classList.add('hidden')
    }

    let more = document.querySelectorAll($more);

    for (let i = 0; i < more.length; i++) {
        more[i].addEventListener('click', function () {
            let showPerClick = 12;

            let hidden = document.querySelectorAll(`${$items}.hidden`);
            for (let i = 0; i < showPerClick; i++) {
                if (!hidden[i]) return this.style.display = "none";

                hidden[i].classList.remove('hidden');
            }
        });
    }
}
let hideCities = () => {
    let allServicesItem = document.querySelectorAll('.region-cities__item')

    let more = document.querySelectorAll('.region__more');

    for (let i = 0; i < more.length; i++) {
        more[i].addEventListener('click', function () {
            let showPerClick = allServicesItem.length;

            let hidden = document.querySelectorAll('.region-cities__item.hidden');
            for (let i = 0; i < showPerClick; i++) {
                if (!hidden[i]) return this.style.display = "none";

                hidden[i].classList.remove('hidden');
                document.querySelector('.catalog').style.top = document.querySelector('.region').scrollHeight + document.querySelector('.header').scrollHeight - 40 + 'px'
                document.querySelector('.region').style.maxHeight =  document.querySelector('.region').scrollHeight + 'px'
            }
        });
    }
}

let animateToBlock = (selector) => {
    $('html, body').stop().animate({
        scrollTop: $(selector).offset().top - 100
    }, 700);
}

// Функция для установки куки
let setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
let getCookie = (name) => {
    let allCookies = document.cookie;
    let cookiesArray = allCookies.split("; ");

    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i];
        let parts = cookie.split("=");
        let cookieName = parts[0];
        let cookieValue = parts[1];

        if (cookieName === name) {
            // Нашли куку с заданным именем, возвращаем ее значение
            return decodeURIComponent(cookieValue);
        }
    }

    // Если кука с указанным именем не найдена, возвращаем null или пустую строку
    return null;
}

function sendRequest(type = 'POST', link, data, dataType = 'json',  callback = json => {}) {
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

let generateFilterData = (sectionOfInput) => {
    let formData = {};

    $('input[type="hidden"]').each(function() {
        formData[$(this).attr('name')] = $(this).val() == '' ? false : parseInt($(this).val());
    });
    return JSON.stringify(formData)
}


// Паралакс мышей ========================================================================================
// const mousePrlx = new MousePRLX({})
// =======================================================================================================

// Фиксированный header ==================================================================================
// headerFixed()
// =======================================================================================================

togglePopupWindows()
// =======================================================================================================
