var loading;

//Аккардион
$(() => {
    var icons = {
        header: "close",
        activeHeader: "open"
        };
        $( "#accordion" ).accordion({
        icons: icons
        });
        $( "#accordion" ).accordion();
});

//Открытие и закрытие по бургер
if($('.burger')) {
    $(() => {
        $('.burger').click(() => {
            $('.mainmenu').addClass('mainmenu_active');
            $('.cross').addClass('cross_active');
            $('.burger').addClass('burger_notActive');
            $('body').addClass('lock');
        })

        $('.cross').click(() => {
            $('.mainmenu').removeClass('mainmenu_active');
            $('.cross').removeClass('cross_active');
            $('.burger').removeClass('burger_notActive');
            $('body').removeClass('lock');
        })
    })
}

// Маска для телефона
jQuery(($) => {
    $(".js-phone").mask("+7 (999) 999-99-99");
});

// Модальное окно
// открыть по кнопке
$(() => {
    $('.js-button').click((event) => {
        event.preventDefault();
        
        $('.js-modal').addClass('active');
        });    
    }
) 

//закрытие  по крестику
$(() => {
    $('.js-cross').click((event) => {
        event.preventDefault();

        $(".modal").removeClass('active');
        });    
    }
)

//закрыть по клику вне окна
$(() => {
    $(document).mouseup((event) => { 
        if (event.target != $('.js-modal-container')[0] && $('.js-modal-container').has(event.target).length === 0) {
            $('.modal').removeClass('active');
            }
        });   
    }
)

//Открытие ценника
/*$(() => {
    $('.js-click').click((event) => {
        event.preventDefault();
        
        $('.list').addClass('list_notActive');
        $('.price').addClass('price_active');
    })

    $('.js-back').click((event) => {
        event.preventDefault();

        $('.list').removeClass('list_notActive');
        $('.price').removeClass('price_active');
    })
})*/

$(function(){
    
    $(".js-click").click(function() {
        
        href = $(this).attr("href");
        $target = $(href);
        
        if ($target.length > 0)
        {
            $("#js-types").fadeOut(100, function(){
                $target.fadeIn();    
            });
        } 
        
        return false;
     });
     
     $(".js-back").click(function() {
        
        $(".js-price").fadeOut(100, function(){
            $("#js-types").fadeIn();
        });
        
        return false;
     });  
     
     $("body").on('click', '.js-post-app', function() {
        $form = $(this).closest("form");        
        
        if (!loading)
        {
            loading = true;

            ar = fill_mas([$form]);
            
            ar['mode'] = 'send_form';
            ar['mango'] = $("[data-mango]").data("mango");
            ar['referal'] = $("[name=referal]").val(); 
            
            argv = {op: 'data', args: ar};
    
            doPostAjax(argv, function(code, answer){
                loading = false;
                if (code == "success")
                {
                    document.querySelector('.thanks').classList.add('_is-open')
                    $form.find("input[type=text], textarea").val('');   
                }
                
                if (code == "error")
                {
                    $form.find("[name=" + answer[0] + "]").focus();                 
                }
            });
        }        
        
        return false;
    });  
     
});