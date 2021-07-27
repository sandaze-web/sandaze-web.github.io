$(document).ready(function () {
    $('.reviews-slider').slick({
        slidesToShow: 1,
        appendArrows: $('.reviews-slider-buttonBx'),
        prevArrow: `<div class="reviews-slider__button reviews-slider_right"><i class="fas fa-chevron-left"></i></div>`,
        nextArrow: `<div class="reviews-slider__button reviews-slider_left"><i class="fas fa-chevron-right"></i></div>`
      });
      $('.mob-button').click(function (e) { 
        e.preventDefault();
        $('.mob').css('display', 'block');
      });
      $('.button-mob').click(function (e) {
          $('.mob').css('display', 'none');
       })
});