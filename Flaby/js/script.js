$(document).ready(function () {

//burgerMenu with mobile menu

{

$('.header-burgerMenu').click(function (e) { 
    e.preventDefault();
    $('.header-burgerMenu__line').toggleClass('activeBurger');
    $('.header-navbar__menu').toggleClass('activeMenu');
    $('body').toggleClass('fixed');
});

}


//Slider
{
    
    const cards = document.querySelectorAll('.comments-box__item');
    let count = 0
    
    function cardProperty(params) {
        for (let i = 0; i < cards.length; i++) {
            count = params-1;
            cards[i].classList.add('comments-box__item-nonactive');
            if(i<=params-1){
                cards[i].style.transform = 'scale(0.9) translate(-100px)';
            }
        }
        cards[count].classList.remove('comments-box__item-nonactive');
        cards[count].classList.add('comments-box__item-active');
    }
    function cardSlideLeft(params){
        if(count == cards.length-1){
            return;
        }
        cards[count].classList.remove('comments-box__item-active');
        cards[count].classList.add('comments-box__item-nonactive');
        cards[count].style.transform = 'scale(0.9) translate(-100px)';
        count++;
        cards[count].classList.remove('comments-box__item-nonactive');
        cards[count].classList.add('comments-box__item-active');
    }
    function cardSlideRight(params){
        if(count == 0){
            return;
        }
        cards[count].classList.remove('comments-box__item-active');
        cards[count].classList.add('comments-box__item-nonactive');
        cards[count].style.transform = 'scale(0.9) translate(100px)';
        count--;
        console.log(count);
        cards[count].classList.remove('comments-box__item-nonactive');
        cards[count].classList.add('comments-box__item-active');
    }
    $('.comments-buttons__right').click(cardSlideLeft);
    $('.comments-buttons__left').click(cardSlideRight);
    cardProperty(2);
}

//Footer
{
    $('.footer-link__title-box').click(function (e) { 
        e.preventDefault();
        if ( $(window).width() < 562 ) {
        $(this).next().slideToggle(300);
        if($('.footer-box').hasClass("one")){
            $('.nav-wrapper').not($(this).next()).slideUp(300);
        }
    }
    });
}

});

