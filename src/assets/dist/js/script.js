$(function() {


    /**** funcionalidad Slider Interna Resultados */
    $(window).resize(function() {
        initSwiper();
    });

    function buildSwiper() {
        mySwiper = new Swiper('#js-c-slider--answers', {
            slidesPerView: 3,
            spaceBetween: 20,
            shortSwipes: true,
            centerInsufficientSlides: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                dynamicBullets: true,
                clickable: true,
            },
            breakpoints: {
                1024: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                640: {
                    slidesPerView: 1,
                }
            }
        });
    }

    var mySwiper = undefined;

    function initSwiper() {
        var screenWidth = $(window).width();
        if (screenWidth < 767 && mySwiper == undefined) {
            buildSwiper();
        } else if (screenWidth > 767 && mySwiper != undefined) {
            mySwiper.destroy();
            mySwiper = undefined;
            $('.swiper-wrapper').removeAttr('style');
            $('.swiper-slide').removeAttr('style');
        }
    }





    // MUESTRA Y OCULTA BUSCADORES
    $(document).ready(function() {
        $("#btn1").click(function() {
            $("#hide1").hide();
            $("#btn2").removeClass("hide").addClass("show");
            $("#btn1").removeClass("show").addClass("hide");
        });
        $("#btn2").click(function() {
            $("#hide1").show();
            $("#btn1").removeClass("hide").addClass("show");
            $("#btn2").removeClass("show").addClass("hide");
        });
    });
    // MUESTRA Y OCULTA COMPARTIR
    $('#btnSharedResult').click(function(evt) {
        $('.shared_options').toggleClass('muestra');
    });
    // MENÚ MOBILE 
    $('#js-toggle-mobile, .btn-close').click(function() {
        $('main').toggleClass('offcanvas');
        $('body').toggleClass('offcanvas');
    });
    // VALICACIÓN CAMPO
    $("#nameGift").keyup(function(e) {
        var name = $(this).val();
        var btn = $('.btn-validate');
        if (name.length >= 1) {
            btn.removeClass('not-active');
        } else {
            btn.addClass('not-active');
        }
    });
});