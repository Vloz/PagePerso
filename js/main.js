$(window).load(function(){



    window.selectedMenu = $('#Onglets').find('li').first().get(0);

    $(window).resize(function()
    {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var ratio = 16/9;
        var video = $('.fond');
        if(w/h>=ratio)
        {
            video.css('height','auto');
            video.css('width','100%');
        }
        else
        {
            video.css('width','auto');
            video.css('height','100%');
        }
        refreshSelector();
    });
    $(window).trigger('resize');
    initAccueilSlide();
    $('#mainContainer').swipe({
        swipeLeft:function(event, direction, distance, duration, fingerCount) {
            $(window.selectedMenu).next().trigger('click');
        },
        swipeRight:function(event, direction, distance, duration, fingerCount) {
            $(window.selectedMenu).prev().trigger('click');
        }
    });
    $('.sectionHeader').find('li').on('touchstart click',function(){sctHChange.call(this,false);} );
    $('#Onglets').find('li').bind('click',ongletChange);


    $("#canvasLogo").load('img/logo.svg',function(response){
        $('#leftAccolade').css('display','block');
        $(this).addClass("logoLoaded");
    });

});

function initAccueilSlide()
{
    window.AccueilSlideTimer = setInterval(changeSlideAccueil,6000);

}

$(document).ready(function(){

    $('#formContact').validate(
        {
            rules: {
                NomUser: {
                    minlength: 5,
                    required: true
                },
                MailUser: {
                    required: true,
                    email: true
                },
                MessageUser: {
                    minlength: 15,
                    required: true
                }
            }
        });
    $('#contactBut').button();
    $('#contactBut').on('click',function() {
       if(!$('#formContact').valid())
        return;

       $('#contactBut').button('loading');

        $.post("http://contact.eu01.aws.af.cm:80",{userName: $('#NomUser').val(), userMail: $('#MailUser').val() , mailContent: $('#MessageUser').val() },'json')
            .done(function(data) {
                $('#formContact').hide();
                $('#contactAnswer').html(data);
                $('#contactAnswer').show('drop',{direction:'up'});
                setTimeout(function(){
                    $('#contactAnswer').hide('drop',{direction:'up'}, function(){
                        $('#contactModal input').val('');
                        $('#MessageUser').val('');
                        $('#formContact').show();
                    });


                },5000);
            })//.fail(function(error) { $('#errorContact').html("Erreur lors de l'envoi.");alert(error); $('#errorContact').show('drop'); })
            .always(function(){$('#contactBut').button('reset');}
        );
    });
});




function changeSlideAccueil()
{
    var currentSlide = $($('#accueilSliders').children('.thumb:visible').last());
    if(currentSlide.prevAll().length !== 0)
        currentSlide.fadeToggle(1000,function(){
            var newSlide = $($('#accueilSliders').children('.thumb:visible').last());
            $('#subAccSlider').html(newSlide.data('sub'));
        });
    else
    {
        currentSlide.nextAll().fadeToggle(800, function(){
            $('#accueilSliders').children().show();
            var newSlide = $($('#accueilSliders').children('.thumb:visible').last());
            $('#subAccSlider').html(newSlide.data('sub'));
        });
    }
}

function refreshSelector()
{
     var selector =  $('#TabSelector');
    var selection =  window.selectedMenu;
    selector.css('background', $(selection).data('color'));
    selector.css('left', selection.offsetLeft);
    selector.css('top',  40 + selection.offsetTop);
}

function ongletChange()
{
    if(window.selectedMenu === this)
        return;

    if($(window.selectedMenu).data('target') == '#CV')
    {
        $('#apercuCV').css('visibility','visible');
    }
    $('#Onglets').find('li').unbind('click');
    $('#Onglets').find('li').css('opacity','');
    $(this).css('opacity',1);
    var cible = $(this).data('target');
    var XMLrequest = new XMLHttpRequest(); // new XML request
    if(cible=="#CV" && document.CV == null)
    {
        XMLrequest.open("GET", 'img/cv.svg', false); // URL of the SVG file on server
        XMLrequest.send(null); // get the SVG file
        $('#CVCanvas').children("svg").remove();
        document.CV = XMLrequest.responseXML.getElementsByTagName("svg")[0];
    }

    var o = $(window.selectedMenu).nextAll('li[data-target="'+cible+'"]').length === 0;
    $('.row-fluid:visible').hide('slide', {direction: o?'right':'left',
        duration: 'slow',
        easing: 'easeOutQuart'});



    $(cible).show('slide', {direction: o?'left':'right',
        duration: 'slow',
        easing: 'easeOutQuart'}, function(){
        $('#Onglets').find('li').bind('click',ongletChange);
        if(cible=="#CV")
        {
            var d =$('#CVCanvas');
            $('#apercuCV').css('visibility','hidden');
            d.append(document.CV);
            d.children("svg").css('position','absolute');
            d.children("svg").css('top','0');
            d.children("svg").css('left','0');

            var t = $(".SvgSection");
            t.css('opacity','0');
            var age =$("#tspan4964").get(0);
            age.textContent= '('+getMyAge()+'ans)';
            var sections = $('.SvgSection');
            sections.bind('touchstart click', svgSectionClick);
            $('.SvgSection').insertAfter($($('#CVCanvas').find('svg').children().last()));
            sections.css('cursor','pointer');
            //Selection par defaut du CV.svg
            $('#Section4').trigger('click');
        }

    });
    window.selectedMenu = this;
    refreshSelector();
}

function sctHChange(isAuto)
{
    if(document.currentSctH != this)
    {
        document.currentSctH = this;
        $(this).parents('.sectionHeader').find('li').css('opacity','');
        $(this).css('opacity','1');
        var visibleSection = $(this).parents('.sectionHeader').parent().find('div.sectionBody[style*="block"]');
        var str = $(this).data('target');
        $(visibleSection).toggle('drop', {direction:'right'});
        $(str).toggle('drop', {direction:'right'});
        if( !isAuto && window.TABTIMER != null)
            clearInterval(window.TABTIMER);
    }

}

function svgSectionClick()
{
    if(window.TABTIMER != null)
        clearInterval(window.TABTIMER);

    $('.SvgSection').insertAfter($($('#CVCanvas').find('svg').children().last()));
    $(this).insertBefore($($('#CVCanvas').find('svg').children().first()));
    $('.SvgSection').css('opacity','0');
    $(this).css('opacity','1');
    if( window.CurrentSct === this)
        return;
    window.CurrentSct = this;

    var targetedId = $(this).attr('id');
    $('#DescptBody>div:visible').slideUp();
    var sectionToShow = $('#DescptBody').children('div[data-target="'+targetedId+'"]').get(0);
    $(sectionToShow).slideDown();
    var tabsContainer = $(sectionToShow).find('.sectionHeader');
    if(tabsContainer.length !=0)
    {
        var tabs = $(tabsContainer).find('li');
        tabs.css('opacity',0.5)
        $(tabs.get(0)).css('opacity',1);
        $($(sectionToShow).find(".sectionBody")).css('display','none');
        $($(sectionToShow).find(".sectionBody").first()).css('display','block')

        if(tabs.length>1)
            window.TABTIMER = setInterval(function()
            {
                var currentTab =  $('#DescptBody div:visible').children('.sectionHeader').find('li[style*="opacity: 1"]');
                var prochain =$(currentTab).next()  ;
                if(prochain.length == 0)
                    prochain = currentTab.prevAll().last();
                sctHChange.call(prochain,true);

            },5000);
    }

}

function getMyAge() {
    var today = new Date();
    var birthDate = new Date('03/27/1989');
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
