//плавные якоря
$('a[href^="#"]').on("click", function (e) {
  let anchor = $(this);
  $('html, body').stop().animate({
    scrollTop: $(anchor.attr("href")).offset().top
  }, 1000);
  e.preventDefault();
});
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.preloader');
      let main = document.querySelector('.main');
  setTimeout(() => {
    // preloader.classList.add('active')
    main.classList.add('active');
  }, 100); //слайдер на главной

  if (document.querySelector(".content-slider") !== null) {
    new Swiper('.content-sliderBx', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 3,
      spaceBetween: 35,
      speed: 5000,
      allowTouchMove: false,
      autoplay: {
        enabled: true,
        delay: 1
      },
      breakpoints: {
        // when window width is >= 320px
        320: {
          spaceBetween: 13
        },
        768: {
          spaceBetween: 35
        }
      }
    });
  }

  if (document.querySelector('.content-imgBx') !== null) {
    let multi = 0;
    document.addEventListener('mousemove', e => {
      if (window.innerWidth <= 1440) multi = 10;
      let imgParallax = document.querySelector('.content-imgBx img.parallax');
      if (imgParallax) imgParallax.style.transform = "translate(".concat(e.clientY / (60 + multi), "px, ").concat(e.clientX / (80 + multi), "px)");
    });
  }

  if (document.querySelector(".advantages__item") !== null) {
    new Array();

    function preloadImages() {
      for (var _len = arguments.length, images = new Array(_len), _key = 0; _key < _len; _key++) {
        images[_key] = arguments[_key];
      }

      images.forEach((image, i) => {
        image = new Image();
        image.src = preloadImages.arguments[i];
      });
    } // Предварительная загрузка картинок в блоке преимуществ


    preloadImages("../images/advantages/1-mobile.png", "../images/advantages/2-mobile.png", "../images/advantages/3-mobile.png", "../images/advantages/4-mobile.png"); //аккордион со сменой фото в блоке преимуществ

    let advantagesItem = document.querySelectorAll('.advantages__item'),
        advantagesImgBx = document.querySelector('.advantages-imgBx'),
        advantagesImg = window.innerWidth <= 480 ? advantagesImgBx.querySelector('img.mobile') : advantagesImgBx.querySelector('img.desktop');
    advantagesItem.forEach(item => {
      if (item.classList.contains('active')) item.lastElementChild.style.maxHeight = item.lastElementChild.scrollHeight + 'px';
      item.addEventListener('click', () => {
        item.classList.add('active');
        advantagesItem.forEach(el => {
          el.classList.remove('active');
        });
        let content = item.lastElementChild;
        advantagesItem.forEach(el => el.lastElementChild.style.maxHeight = null);
        content.style.maxHeight = content.scrollHeight + 'px';
        item.classList.add('active');
        advantagesImgBx.classList.add('flash');
        setTimeout(() => {
          let src = "".concat(item.dataset.img, ".png");
          if (window.innerWidth <= 480) src = "".concat(item.dataset.img, "-mobile.png");
          console.log(src);
          advantagesImg.src = "images/advantages/".concat(src);
          advantagesImgBx.classList.remove('flash');
        }, 300);
      });
    });
  }

  if (document.querySelector(".feedback__item") !== null) {
    //обрезка текста отзывов
    let allFeedbackItems = document.querySelectorAll('.feedback__desc');
    allFeedbackItems.forEach(el => {
      cutText(el, 175);
    });
    let foo = document.querySelectorAll('.feedback__desc');
    foo.forEach(el => {
      el.addEventListener('click', e => {
        if (e.target.classList.contains('feedback__desc')) return false;
        openText(el, e.target.dataset.text);
      });
    });

    if (window.innerWidth <= 480) {
      //слайдер отзывов на мобилке
      new Swiper('.feedback-slider', {
        direction: 'horizontal',
        loop: true,
        slidesPerView: '1',
        spaceBetween: 40,
        pagination: {
          el: '.swiper-pagination'
        },
        autoHeight: true,
        autoplay: {
          enabled: true,
          delay: 3500
        }
      });
    } else {
      //свернутые отзывы на десктопе
      let more = document.querySelectorAll('.feedback__more');

      for (let i = 0; i < more.length; i++) {
        more[i].addEventListener('click', function () {
          let showPerClick = 3;
          let hidden = this.parentNode.querySelectorAll('div.hidden');

          for (let i = 0; i < showPerClick; i++) {
            if (!hidden[i]) return this.outerHTML = "";
            hidden[i].classList.add('flex');
            setTimeout(() => {
              hidden[i].classList.add('animate');
            }, 150);
          }
        });
      }
    }
  } //анимация кругов в блоке План ремонта


  const itemsBox = document.querySelector('.plan-box');

  if (itemsBox !== null) {
    const navbar_observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('plan')) {
            if (itemsBox) {
              itemsBox.classList.add('active');
            }
          }
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px -500px 0px'
    });
    document.querySelectorAll('section').forEach(section => navbar_observer.observe(section));
  }

  if (document.querySelector(".dropdown") !== null) {
    let allTechnics = document.querySelectorAll('.dropdown-technicsBx li'),
        dropdown = document.querySelector('.dropdown');
    allTechnics.forEach(technic => {
      technic.addEventListener('click', () => {
        if (technic.classList.contains('active')) {
          technic.classList.remove('active');
          dropdown.classList.remove('show-brands');
        } else {
          allTechnics.forEach(el => el.classList.remove('active'));
          technic.classList.add('active');
          dropdown.classList.add('show-brands');
          if (window.innerWidth <= 768) document.querySelector('.dropdown-brands').scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    }); //открытия dropdown

    let dropdownLinks = document.querySelectorAll('.header-nav_dropdown');
    let navMobileMenuHeight = document.querySelector('.nav-mobile').clientHeight;
    console.log(navMobileMenuHeight);
    if (window.innerWidth <= 768) dropdown.style.maxHeight = "calc(100% - ".concat(navMobileMenuHeight - 20, "px)");
    dropdownLinks.forEach(el => {
      el.addEventListener('click', () => {
        if (window.innerWidth > 768) toggleBlackout();

        if (window.innerWidth <= 768) {
          toggleDropdownMobile();
        } else {
          dropdown.classList.toggle('active');
        }

        el.classList.toggle('active');
      });
    });
  } //при нажатии на мутное место закрываются поп апы


  if (document.querySelector(".blackout") !== null) {
    //замутнение под шапкой
    let blackout = document.querySelector('.blackout'),
        allBlocks = document.querySelectorAll('.close-on-blackout');
    blackout.addEventListener('click', () => {
      allBlocks.forEach(el => {
        el.classList.remove('active');
      });
      toggleBlackout();
    });
  }

  if (document.querySelector(".blackout.over") !== null) {
    //замутнение над шапкой
    let blackout = document.querySelector('.blackout.over'),
        allBlocks = document.querySelectorAll('.close-on-blackout');
    blackout.addEventListener('click', () => {
      allBlocks.forEach(el => {
        if (el.classList.contains('nav-mobile') && el.classList.contains('active') || el.classList.contains('header-burger') && el.classList.contains('active')) return false;
        el.classList.remove('active');
      });
      toggleOverBlackout();
    });
  } //поиск сервисных центрова


  if (document.querySelector(".services-box") !== null) {
    $('#services-centers-search').hideseek();
  } //поиск сервисных центров на мобилке


  if (document.querySelector(".services__button") !== null) {
    if (window.innerWidth <= 768) {
      hideServicesItem();
      let searchServices = document.querySelector('#services-centers-search');
      searchServices.addEventListener('keyup', () => {
        let allServicesItem = document.querySelectorAll('.services-box li'),
            servicesButton = document.querySelector('.services__button');
        if (servicesButton) servicesButton.style.display = 'none';
        allServicesItem.forEach(el => el.classList.remove('hidden'));

        if (!searchServices.value) {
          hideServicesItem();
          servicesButton.style.display = 'block';
        }
      });
    }
  } //мобильное меню с открыванием меню техники


  if (document.querySelector('.header-burger') !== null) {
    let burger = document.querySelector('.header-burger'),
        mobileNav = document.querySelector('.nav-mobile'),
        dropdown = document.querySelector('.dropdown'),
        dropdownLink = document.querySelector('.header-nav_dropdown');
    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      burger.classList.toggle('active');

      if (!burger.classList.contains('active') && dropdown.style.pointerEvents === 'auto') {
        toggleBlackout();
        toggleDropdownMobile();
        dropdownLink.classList.toggle('active');
      } else {
        toggleBlackout();
      }
    });
  } //модальное окно с формой


  if (document.querySelector('.modal') !== null) {
    let modal = document.querySelector('.modal'),
        actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
      button.addEventListener('click', () => {
        modal.classList.toggle('active');
        toggleOverBlackout();
      });
    });
    document.querySelector('.modal-cross').addEventListener('click', () => {
      modal.classList.remove('active');
      toggleOverBlackout();
    });
  }

  if (document.querySelector(".header-logo__img") !== null) {
    // const newspaperSpinning = [
    //     { strokeDashoffset: 0 },
    //     { strokeDashoffset: 100.83442687988281 },
    //     { strokeDashoffset: 0 }
    // ];
    // const newspaperTiming = {
    //     duration: 1000,
    //     iterations: 1,
    //     easing: 'linear',
    //     delay: 0
    // }
    document.querySelectorAll(".header-logo path");
          const headerBrandWrapperWidth = document.querySelector('.header-brand-wrapper').clientWidth,
          header = document.querySelector('.header'),
          brandImg = document.querySelector('.header-brand-overflow');
          document.querySelector('.header__city'); //если пользователь находится внизу, повторить анимацию, срабатывает единожды

    if (window.pageYOffset >= 400 && window.innerWidth > 768) {
      // pathsLogo.forEach(el => {
      //     el.animate(newspaperSpinning, newspaperTiming)
      // })
      header.classList.add('active-bg');
      brandImg.style.marginLeft = "-".concat(headerBrandWrapperWidth, "px");
    }

    window.addEventListener('scroll', e => {
      //появление кнопки в блоке плана
      let stickyBox = document.querySelector('.plan-titleBx');
      if (stickyBox && stickyBox.offsetTop >= 219 && window.innerWidth > 480) stickyBox.querySelector('button').classList.add('active'); //анимация лого при скроле

      if (window.innerWidth <= 768) return false;

      if (window.pageYOffset >= 300 && window.pageYOffset <= 400) {
        // pathsLogo.forEach(el => {el.animate(newspaperSpinning, newspaperTiming)})
        header.classList.add('active-bg');
        brandImg.style.marginLeft = "-".concat(headerBrandWrapperWidth, "px");
      } else if (window.pageYOffset >= 250 && window.pageYOffset <= 299) {
        // pathsLogo.forEach(el => {el.animate(newspaperSpinning, newspaperTiming)})
        header.classList.remove('active-bg');
        brandImg.style.marginLeft = "0px";
      }
    });
  } //стандартизации таблиц с поиском и фильрацией по устройствам


  if (document.querySelector(".standard-table") !== null) {
    let standardTableSections = document.querySelectorAll('.standard-table');
    standardTableSections.forEach(section => {
      let $table = section.querySelector('table');
      console.log($table.id);
      let tableDataTable = new DataTable("#".concat($table.id), {
        // paging: false,
        // searching: false,
        select: true,
        "pageLength": 10,
        "language": {
          "zeroRecords": "По вашему поиску ничего не найдено"
        }
      });
      tableDataTable.on('select', function (e, dt, type, indexes) {
        let formProvide = window.innerWidth <= 768 ? document.querySelector('.wrapper-with-form.mobile') : section.querySelector('.wrapper-with-form'),
            titleInForm = formProvide.querySelector('.change-title');
        tableDataTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
          this.node().classList.remove('active');
        });
        titleInForm.textContent = tableDataTable[type](indexes).nodes()[0].querySelector('td:first-child').textContent;
        tableDataTable[type](indexes).nodes()[0].classList.toggle('active');
        formProvide.classList.toggle('active');
        section.scrollIntoView({
          behavior: "smooth"
        });
        toggleOverBlackout();
      });
      const MAX_ROW = 10; //количество строк в таблице

      let buttonMore = section.querySelector('.table-more');
      if (tableDataTable.rows().data().length <= MAX_ROW) buttonMore.style.display = 'none';
      buttonMore.addEventListener('click', () => {
        let pageLen = tableDataTable.page.len() + 3;
        tableDataTable.page.len(pageLen).draw();

        if (pageLen >= tableDataTable.rows().data().length) {
          buttonMore.style.display = 'none';
        }
      });
      let search = section.querySelector('.table-search');
      let filterBoxItems = window.innerWidth <= 768 ? section.querySelector('.price-filter.mobile') : section.querySelectorAll('.price-filter-box .price-filter__item');
      search.addEventListener('keyup', () => {
        if (filterBoxItems !== null) {
          let activeItem = window.innerWidth <= 768 ? filterBoxItems.options[filterBoxItems.selectedIndex] : section.querySelector('.price-filter__item.active'),
              type = '';
          if (activeItem) type = window.innerWidth <= 768 ? filterBoxItems.value : activeItem.textContent;
          tableDataTable.search("".concat(search.value, " ").concat(type)).draw();
          if (!search && !type) tableDataTable.page.len(MAX_ROW).draw();
        } else {
          tableDataTable.search(search.value).draw();
        }

        buttonMore.style.display = 'none';

        if (!search.value && tableDataTable.rows().data().length > MAX_ROW) {
          buttonMore.style.display = 'block';
          tableDataTable.page.len(MAX_ROW).draw();
        }
      });

      if (filterBoxItems !== null && window.innerWidth > 768) {
        //фильтрация по утройствам бренда
        let deviceBrand = section.querySelector('.change-device');
        filterBoxItems.forEach(item => {
          item.addEventListener('click', () => {
            if (item.classList.contains('active')) {
              item.classList.remove('active');
              tableDataTable.search("".concat(search.value)).draw();
              deviceBrand.textContent = 'устройства';
              if (!search.value && tableDataTable.rows().data().length > MAX_ROW) buttonMore.style.display = 'block';
            } else {
              deviceBrand.textContent = item.dataset.title;
              filterBoxItems.forEach(el => {
                el.classList.remove('active');
              });
              item.classList.toggle('active');
              tableDataTable.search("".concat(search.value, " ").concat(item.textContent)).draw();
              buttonMore.style.display = 'none';
            } // if(!search.value && (tableDataTable.rows().data().length > MAX_ROW)) buttonMore.style.display = 'block'

          });
        });
      } else if (filterBoxItems !== null) {
        //в модильной версии обрабатывается select
        filterBoxItems.addEventListener('change', e => {
          let option = filterBoxItems.options[filterBoxItems.selectedIndex],
              value = e.target.value,
              formProvide = document.querySelector('.wrapper-with-form.mobile');
          let deviceBrand = formProvide.querySelector('.change-device');
          deviceBrand.textContent = option.dataset.title;
          tableDataTable.search("".concat(search.value, " ").concat(value)).draw();
          buttonMore.style.display = 'none';
          if (!value) buttonMore.style.display = 'block';
        });
      }
    });
  } //при клике на блок с классом close-modal-cross будут закрываться все попапы


  if (document.querySelector('.close-modal-cross') !== null) {
    let allCross = document.querySelectorAll('.close-modal-cross'),
        blackout = document.querySelector('.blackout'),
        blackoutOver = document.querySelector('.blackout.over');
    allCross.forEach(el => {
      el.addEventListener('click', () => {
        if (blackout.classList.contains('active')) {
          toggleBlackout();
        }

        if (blackoutOver.classList.contains('active')) {
          toggleOverBlackout();
        }

        let allBlocks = document.querySelectorAll('.close-on-blackout');
        allBlocks.forEach(el => {
          el.classList.remove('active');
        });
      });
    });
  }

  if (document.querySelector('.accessories') !== null) {
    if (window.innerWidth <= 480) {
      //слайдер отзывов на мобилке
      new Swiper('.accessories-slider', {
        direction: 'horizontal',
        loop: true,
        slidesPerView: '1',
        spaceBetween: 12,
        pagination: {
          el: '.swiper-pagination'
        },
        autoHeight: true,
        autoplay: {
          enabled: true,
          delay: 3500
        }
      });
    }
  } //иаска для телефона


  if (document.querySelector('.input-mask') !== null) {
    let inputs = document.querySelectorAll('.input-mask');
    inputs.forEach(el => {
      let im = new Inputmask("+7 (999) 999-99-99");
      im.mask(el);
    });
  }
}); //обрезка текста с добавлением в конец синего слова еще, по нажатию на который происходит раскрытие текста

const cutText = function cutText(element, limit) {
  let isShow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  let preventText = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  if (isShow) {
    element.parentNode.textContent = preventText;
    return false;
  }

  element.textContent.length;
      let text = element.textContent,
      sliced = element.textContent.slice(0, limit).trim();

  if (sliced.length < element.textContent.length) {
    element.textContent = sliced;
    element.innerHTML += "<span class='more' data-text='".concat(text, "'\">\u0435\u0449\u0451</span>");
  }
};

const openText = function openText(element) {
  let preventText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  element.textContent = preventText;
  return false;
}; //специальная функция для открывающегося меню техники, прощитывает высотку меню


let toggleDropdownMobile = () => {
  let dropdown = document.querySelector('.dropdown');
      document.querySelector('.header-nav_dropdown');
      let navMobileMenuHeight = document.querySelector('.nav-mobile').clientHeight;

  if (dropdown.style.pointerEvents === 'auto') {
    dropdown.style.transform = "translateY(-100%)";
    dropdown.style.pointerEvents = "none";
  } else {
    dropdown.style.transform = "translateY(".concat(navMobileMenuHeight, "px)");
    dropdown.style.pointerEvents = "auto";
  }
}; //замутнение блока и скрытие скролла(замутнение под секцией header)


let toggleBlackout = function toggleBlackout() {
  let isCloseAll = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let blackout = document.querySelector('.blackout'),
      body = document.querySelector('body');

  if (blackout.classList.contains('active')) {
    blackout.classList.remove('active');

    if (isCloseAll) {
      let allBlocks = document.querySelectorAll('.close-on-blackout');
      allBlocks.forEach(el => {
        el.classList.remove('active');
      });
    }
  } else {
    blackout.classList.add('active');
  }

  body.classList.toggle('hidden');
}; //замутнение блока и скрытие скролла(замутнение поверх header)


let toggleOverBlackout = () => {
  let blackout = document.querySelector('.blackout.over'),
      body = document.querySelector('body');

  if (blackout.classList.contains('active')) {
    blackout.classList.remove('active');
  } else {
    blackout.classList.add('active');
  }

  body.classList.toggle('hidden');
}; //функция, которая скрывает сервисные центры


let hideServicesItem = () => {
  let allServicesItem = document.querySelectorAll('.services-box li');

  for (let i = 45; i < allServicesItem.length; i++) {
    allServicesItem[i].classList.add('hidden');
  }

  let more = document.querySelectorAll('.services__button');

  for (let i = 0; i < more.length; i++) {
    more[i].addEventListener('click', function () {
      let showPerClick = 15;
      let hidden = document.querySelectorAll('.services-box li.hidden');

      for (let i = 0; i < showPerClick; i++) {
        if (!hidden[i]) return this.style.display = "none";
        hidden[i].classList.remove('hidden');
      }
    });
  }
};
