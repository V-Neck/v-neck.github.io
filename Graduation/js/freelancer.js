/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */
$(document).ready(function(){
    var mes_string = ""
    $("#send-btn").click(function(){
        mes_string = ""
        var mes = [ $("#name").val(), $("#email").val(), $("#phone").val(), $("#message").val()]
        for(i=0; i<4;i++){

            if( !(i==3) && !(mes[i+1]=="") ){
                var sep = ", ";
            } 

            else {
                var sep = " ";
            }

            if( !(mes[i] == "") ){    
                mes_string = mes_string + mes[i] + sep;
                console.log(mes_string);
            }

        }
        if( !($("#name").val() == "") && !($("#email").val() == "") ){
            window.location.href = "mailto:vijohnson@bsu.edu?subject=RSVP from "+mes[0]+"&body="+mes_string;
        }
    });

    $("#send-btn").mouseenter(function(){
        $("#send-btn").css('background-color','#ee3');
    });

    $("#send-btn").mouseleave(function(){
        $("#send-btn").css('background-color','#3af');
    });
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});
