$(document).ready(function () {
    //Слайдер
    $('.slick').slick({
        prevArrow: '.prev',
        nextArrow: '.next',
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    });

    //Header
    {
        //Фиксированное меню
        $(document).scroll(function () { 
            if($(document).scrollTop () >= 0.1){
                $('#fixed-navbar').addClass('fixed');
                $('.header-content').css({
                    marginTop: `144px`,
                });
            }else{
                $('#fixed-navbar').removeClass('fixed');
                $('.header-content').css({
                    marginTop: `40px`,
                });
            }
        });
        //Burger-menu
        $('.burger').click(e => { 
            e.preventDefault();
            $('.burger-menu').toggleClass('active');
            $('.header-nav').toggleClass('active');
        });
    }
});


//Плавное перемещение якорей
$('a[href^="#"]').on("click", function (e) {
    let anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $(anchor.attr("href")).offset().top -100
    }, 500);
    e.preventDefault();
});

// Header parallax effect
