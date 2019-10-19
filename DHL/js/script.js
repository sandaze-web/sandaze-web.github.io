$(document).ready(function () {
    $('.navbar__button-search').click(function (e) {
        e.preventDefault();
        $('#input-search').toggleClass('active1');
        $('#input-search').val('');
    });
    $('.navbar-burger-menu').click(function (e) { 
        e.preventDefault();
        $('.navbar-burger').toggleClass('active');
    });
});