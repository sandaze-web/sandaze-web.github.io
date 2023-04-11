const html = document.documentElement
const body = document.body
const pageWrapper = document.querySelector('.main')
const header = document.querySelector('.header')
const firstScreen = document.querySelector('[data-observ]')
const burgerButton = document.querySelector('.icon-menu')
const menu = document.querySelector('.menu')
const lockPaddingElements = document.querySelectorAll('[data-lp]')

/*
* Универсальная функция для блокировки скрола при открытии модальных окон
* При открытии модального окна вызываем: toggleBodyLock(true)
* При закрытии окна вызываем: toggleBodyLock(false)

* lockPaddingElements - это коллекция элементов с фиксированной позицией
* В html таким элементам нужно дать атрибут [data-lp] 
*/
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




headerFixed()

//плавные якоря
$('a[href^="#"]').on("click", function (e) {
    let anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr("href")).offset().top
    }, 1000);
    e.preventDefault();
});

document.addEventListener('DOMContentLoaded', function () {
    let standardTableSections = document.querySelectorAll('.standard-table')

    standardTableSections.forEach(section => {
        let $table = section.querySelector('table')

        const MAX_ROW = 5 //количество строк в таблице
        let tableDataTable = new DataTable(`#${$table.id}`, {
            select: true,
            "pageLength": MAX_ROW,
            "language": {
                "zeroRecords": "По вашему поиску ничего не найдено"
            }
        });


        let filterBoxItems = window.innerWidth <= 768
            ? section.querySelector('.assortment-select.mobile')
            : section.querySelectorAll('.assortment-filter .assortment-filterBx__item')
        let buttonMore = section.querySelector('.table-more')
        if (buttonMore) {
            if (tableDataTable.rows().data().length <= MAX_ROW) buttonMore.style.display = 'none'
            buttonMore.addEventListener('click', () => {
                let nameTechnicsActive = null
                if(window.innerWidth > 768) filterBoxItems.forEach(item => item.classList.contains('active') ? nameTechnicsActive = item.textContent.trim() : '')
                if(window.innerWidth < 768) nameTechnicsActive = filterBoxItems.value.trim()

                let count = tableDataTable.rows( function ( idx, data, node ) {
                    return data[2].trim() === nameTechnicsActive ? true : false;
                } ).data().length;

                if(tableDataTable.page.len() + 3 >= count) {
                    if (count) {
                        tableDataTable.page.len(count).draw()
                        buttonMore.style.display = 'none'
                        return false
                    }
                }

                let pageLen = tableDataTable.page.len() + 3
                tableDataTable.page.len(pageLen).draw()
                if (pageLen >= tableDataTable.rows().data().length) {
                    buttonMore.style.display = 'none'
                }
            })
        }
        // let search = section.querySelector('.table-search')
        //   buttonMore.style.display = 'none'
        //   if(!search.value && (tableDataTable.rows().data().length > MAX_ROW)){
        //     buttonMore.style.display = 'block'
        //     tableDataTable.page.len(MAX_ROW).draw()
        //   }
        // })

        if (filterBoxItems !== null && window.innerWidth > 768) { //фильтрация по утройствам бренда

            filterBoxItems.forEach(item => {
                if(item.classList.contains('active')) tableDataTable.search(`${item.textContent.trim()}`).draw()
                item.addEventListener('click', () => {
                    tableDataTable.page.len(MAX_ROW).draw()
                    buttonMore.style.display = 'block'

                    filterBoxItems.forEach(el => {
                        el.classList.remove('active')
                    })
                    tableDataTable.search(``).draw()
                    item.classList.toggle('active')
                    tableDataTable.search(`${item.textContent.trim()}`).draw()

                })
            })
        } else if (filterBoxItems !== null) { //в мобильной версии обрабатывается select
            tableDataTable.search(`${filterBoxItems.value.trim()}`).draw()
            filterBoxItems.addEventListener('change', (e) => {
                tableDataTable.page.len(MAX_ROW).draw()
                buttonMore.style.display = 'block'
                let value = e.target.value
                tableDataTable.search(`${value.trim()}`).draw()
            })
        }
    })

    //слайдер на мобильной версии
    if (window.innerWidth <= 480) {
        if (document.querySelector('.faq-slider')) {
            const swiper = new Swiper('.faq-wrapper', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                slidesPerView: 1.4,
                spaceBetween: 26,
                autoHeight: true,
                autoplay: {
                    delay: 5000,
                },
            });
        }
        if (document.querySelector('.problems-slider')) {
            const swiper = new Swiper('.problems-slider', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                slidesPerView: 1.1,
                spaceBetween: 26,
                autoplay: {
                    delay: 5000,
                },
            });
        }
        if (document.querySelector('.feedback-slider')) {
            const swiper = new Swiper('.feedback-slider', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                slidesPerView: 1,
                spaceBetween: 26,
                autoHeight: true,
                autoplay: {
                    delay: 5000,
                },
                pagination: {
                    el: '.myClassFeedback',
                },
            });
        }
        if (document.querySelector('.devices-slider')) {
            const swiper = new Swiper('.devices-slider', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                slidesPerView: 2.8,
                // autoHeight: true,
                spaceBetween: 40,
            });
        }
        if (document.querySelector('.vacancy-slider')) {
            const swiper = new Swiper('.vacancy-slider', {
                // Optional parameters
                direction: 'horizontal',
                loop: false,
                slidesPerView: 1,
                spaceBetween: 26,
                autoHeight: true,
                autoplay: {
                    delay: 5000,
                },
                pagination: {
                    el: '.myClassPagination',
                },
            });
        }
    }

    if (document.querySelector('.header-selectBx') !== null) {
        let wrapperSelect = document.querySelector('.header-selectBx'),
            select = document.querySelector('.header-selected'),
            options = document.querySelectorAll('.header-variants__item')

        select.addEventListener('click', () => {
            wrapperSelect.classList.toggle('active')
        })

        options.forEach(el => {
            el.addEventListener('click', () => {
                select.textContent = el.textContent

                options.forEach(item => item.classList.remove('isSelected'))
                el.classList.add('isSelected')
                wrapperSelect.classList.toggle('active')
            })
        })

        let headerDropdown = document.querySelector('.header-dropdown')

        headerDropdown.addEventListener('click', () => {
            headerDropdown.classList.toggle('active')
        })
    }

    if (document.querySelector('.mask-phone') !== null) {
        let allInputsMask = document.querySelectorAll('.mask-phone')
        let allInputsMask2 = document.querySelectorAll('.mask-code')

        allInputsMask.forEach(el => {
            $(el).mask("+7 (999) 999-99-99")
        })
        allInputsMask2.forEach(el => {
            $(el).mask("****-****")
        })
    }

    if (document.querySelector('.thanks-modal') !== null) {
        let blackout = document.querySelector('.blackout'),
            over = document.querySelector('.over'),
            allModals = document.querySelectorAll('.close-on-blackout')

        blackout.addEventListener('click', () => {
            allModals.forEach(el => {
                el.classList.remove('active')
            })
            toggleBlackout()
        })

        let cross = document.querySelectorAll('.cross')

        cross.forEach(item => {
            item.addEventListener('click', () => {
                allModals.forEach(el => {
                    el.classList.remove('active')
                })
                closeAllModal()
            })
        })

        over.addEventListener('click', () => {
            closeAllModal()
        })
    }

    //мобильное меню
    if(document.querySelector('.header-burger') !== null) {
        let burger = document.querySelector('.header-burger'),
            nav = document.querySelector('.header-nav')

        burger.addEventListener('click', () => {
            nav.classList.toggle('active')
            burger.classList.toggle('active')
            toggleBlackout();
            if(!burger.classList.contains('active')) {
                closeAllModal()
            }
        })
    }

    if(document.querySelector('.content-timer') !== null) {
        let $days = document.querySelectorAll('.days'),
            $hours = document.querySelectorAll('.hours'),
            $minutes = document.querySelectorAll('.minutes')

        start_diff_timer($days,$hours, $minutes, null, 3433, 0, 'timer')
    }

    let body = document.querySelector('body');
    body.addEventListener('click', (e) => {
        if(!e.target.classList.contains('header-dropdown')) {
            if(document.querySelector('.header-dropdown').classList.contains('active')){
                document.querySelector('.header-dropdown').classList.remove('active')
            }
        }
        if(!e.target.classList.contains('header-selected')) {
            if(document.querySelector('.header-selectBx').classList.contains('active')){
                document.querySelector('.header-selectBx').classList.remove('active')
            }
        }
    })

    if(document.querySelector('.about-item') !== null) {
        let counts = document.querySelectorAll('.about__item-count')

        counts.forEach(el => {
            $(el).spincrement({duration: 3000})
        })

        let isActive = false
        window.addEventListener('scroll', () => {
            if(window.pageYOffset > 100 && window.innerWidth > 480) {
                if (isActive) return false
                let graphs = document.querySelectorAll('.devices-graphBx')
                let time = 0;
                isActive = true
                graphs.forEach(el => {
                    setTimeout(() => {
                        el.classList.remove('notActive')
                        $(el.querySelector('p')).spincrement({duration: 2000})
                    }, time)
                    time += 300
                })
            }
        })
    }

    if(document.querySelector('.form-status')) {
        let formStatus = document.querySelector('.form-status')

        formStatus.addEventListener('submit', (e) => {
            e.preventDefault()
            e.target.reset()
            toggleMessageNotFound();
        })
    }

    if(document.querySelector('.devices-box')) {
        let allGraph = document.querySelectorAll('.devices-graphBx'),
            maxRatio = 0

        allGraph.forEach(graph => {
            let graphMax = graph.querySelector('p').dataset.to.slice(0, -1)
            maxRatio = maxRatio < parseInt(graphMax) ? graphMax : maxRatio
        })

        allGraph.forEach(graph => {
            let graphMax = graph.querySelector('p').dataset.to.slice(0, -1)
            let percentRatio = Math.floor(graphMax * 100 / maxRatio)
            graph.style.height = percentRatio + '%'
        })

    }
})

let toggleBlackout = () => {
    let blackout = document.querySelector('.blackout'),
        body = document.querySelector('body')
    blackout.classList.toggle('active')
    body.classList.toggle('hidden')
}
let closeAllModal = () => {
    let allModals = document.querySelectorAll('.close-on-blackout'),
        over = document.querySelector('.over'),
        body = document.querySelector('body')
    allModals.forEach(el => {
        el.classList.remove('active')
    })
    over.classList.remove('active')
    body.classList.remove('hidden')
}

let start_diff_timer = ($days = null, $hours = null, $minutes = null, $seconds = null, difference = 5, last_seconds = 59, local_host_name, $days_text = null, $hours_text = null, $minutes_text = null, $seconds_text = null) => {
    // конечная дата, например 1 июля 2021
    let deadline;
    let timerId = null;
    let interval_5_seconds = null;

    if((new Date().getDate() > new Date(localStorage.getItem(local_host_name)).getDate()) || new Date().getMonth() > new Date(localStorage.getItem(local_host_name)).getMonth() ){
        clearInterval(interval_5_seconds)
        interval_5_seconds = null
        localStorage.removeItem(local_host_name)
    }
    if(localStorage.getItem(local_host_name)){
        deadline = new Date(localStorage.getItem(local_host_name))
    }else{
        deadline = new Date();
        deadline.setMinutes(deadline.getMinutes() + difference)
        if(deadline.getMinutes() > 59){
            deadline.setMinutes(deadline.getMinutes() - 59)
        }
        localStorage.setItem(local_host_name, deadline)
    }
    // склонение числительных
    function declensionNum(num, words) {
        return words[(num % 100 > 4 && num % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(num % 10 < 5) ? num % 10 : 5]];
    }
    function initializeClock(){
        if(!$seconds) return false
        let second = last_seconds
        if(!interval_5_seconds){
            interval_5_seconds = setInterval(() => {
                if(second < 0) second = last_seconds
                $seconds.forEach(el => {
                    el.textContent = second < 10 ? '0' + second : second
                })
                second -= 1
            }, 1000)
        }
    }
    // вычисляем разницу дат и устанавливаем оставшееся времени в качестве содержимого элементов
    function countdownTimer() {
        const diff = deadline - new Date();
        if (diff <= 0) {
            clearInterval(timerId);
            initializeClock()
        }
        const minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0
        const seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0
        const hours = diff > 0 ? Math.floor(diff / 1000 / 60 / 60) % 24 : 0
        const days = diff > 0 ? Math.floor(diff / 1000 / 60 / 60 / 24) : 0

        if($days) $days.forEach(el => {el.textContent = days < 10 ? '0' + days : days})
        if($hours) $hours.forEach(el => {el.textContent = hours < 10 ? '0' + hours : hours})
        if($minutes) $minutes.forEach(el => {el.textContent = minutes < 10 ? '0' + minutes : minutes})
        if($seconds) $seconds.forEach(el => {el.textContent = seconds < 10 ? '0' + seconds : seconds})

        if($days_text) $days_text.textContent = declensionNum(days, ['день', 'дня', 'дней'])
        if($hours_text) $hours_text.textContent = declensionNum(days, ['час', 'часа', 'часов'])
        if($minutes_text) $minutes_text.textContent = declensionNum(days, ['минута', 'минуты', 'минут'])
        if($seconds_text) $seconds_text.textContent = declensionNum(days, ['секунда', 'секунды', 'секунд'])
    }
    // вызываем функцию countdownTimer
    countdownTimer();
    // вызываем функцию countdownTimer каждую секунду
    timerId = setInterval(countdownTimer, 1000);
}

let toggleMessage = () => {
    let modal = document.querySelector('.thanks-modal'),
        over = document.querySelector('.over'),
        body = document.querySelector('body')

    modal.classList.toggle('active')
    over.classList.toggle('active')
    body.classList.toggle('hidden')
}
let toggleMessageNotFound = () => {
    let modal = document.querySelector('.not-found'),
        over = document.querySelector('.over'),
        body = document.querySelector('body')

    modal.classList.toggle('active')
    over.classList.toggle('active')
    body.classList.toggle('hidden')
}

// ========== Попап с не найденныйм когдом ==========
// toggleMessageNotFound()

// ========== Попап с благодарностью ==========
// toggleMessage()


// =======================================================================================================
