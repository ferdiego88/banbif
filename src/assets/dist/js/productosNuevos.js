//Tab
$(document).ready(function() {
    $('.material-tabs-item').click(function(evt) {
        let index = $(this).index();
        $('.material-tabs-item').removeClass('active');
        $(evt.currentTarget).addClass('active');
        $('.tab-content-item').removeClass('active');
        $('.tab-content-item').eq(index).addClass("active");
    });
    $('.show-more').on('click', function(evt) {
        evt.preventDefault();
        if ($(evt.currentTarget).hasClass('selected')) {
            $(evt.currentTarget).removeClass('selected');
            $(evt.currentTarget).prev().removeClass('open');
            $(this).text('ver más');
        } else {
            $(evt.currentTarget).addClass('selected');
            $(evt.currentTarget).prev().addClass('open');
            $(this).text('ver menos');
        }
    });
    $('.show-more2').on('click', function(evt) {
        evt.preventDefault();
        if ($(evt.currentTarget).hasClass('selected')) {
            $(evt.currentTarget).removeClass('selected');
            $(evt.currentTarget).prev().removeClass('open2');
            $(this).text('ver más');
        } else {
            $(evt.currentTarget).addClass('selected');
            $(evt.currentTarget).prev().addClass('open2');
            $(this).text('ver menos');
        }
    });
    if ($('#material-tabs').length > 0) {
        var posTabs3c = $('#material-tabs').offset().top;
        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop();
            var tabs = $('#material-tabs');
            var tabsHeight = tabs.outerHeight();
            var content = $('.bordeTabs');
            if (scrollTop >= posTabs3c) {
                tabs.addClass('sticky');
                content.css('padding-top', tabsHeight + 'px');
            } else {
                tabs.removeClass('sticky');
                content.removeAttr('style');
            }
        });
    }
});
//Tab3c
$(document).ready(function() {
    if ($('#material-tabs3c').length > 0) {
        var posTabs3c = $('#material-tabs3c').offset().top;
        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop();
            var tabs = $('#material-tabs3c');
            var tabsHeight = tabs.outerHeight();
            var content = $('.bordeTabs');
            if (scrollTop >= posTabs3c) {
                tabs.addClass('sticky');
                content.css('padding-top', tabsHeight + 'px');
            } else {
                tabs.removeClass('sticky');
                content.removeAttr('style');
            }
        });
    }
});
//Acordeones
$(document).ready(function() {
    $('.collapse.in').prev('.panel-heading').addClass('active');
    $('#accordion, #bs-collapse')
        .on('show.bs.collapse', function(a) {
            $(a.target).prev('.panel-heading').addClass('active');
        })
        .on('hide.bs.collapse', function(a) {
            $(a.target).prev('.panel-heading').removeClass('active');
        });
});
//Toggle Buttons "Active"
$(document).ready(function() {
    $('.btn-toggle .btn').click(function() {
        $('.btn', $(this).parent()).removeClass('active');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active')
        } else {
            $(this).addClass('active')
        }
    });
});
//Muestra Info al hacer click al SWITCH"
$(function() {
    $(".descripciones").click(function() {
        $(".description").toggleClass("switch-content-hide");
    });
});