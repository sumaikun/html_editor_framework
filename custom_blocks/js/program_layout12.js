$('#timer').timezz({
  'date' : 'February 5, 2019 00:00:00',
  'days' : 'Days',
  'hours' : 'Hrs',
  'minutes' : 'Min',
  'seconds' : 'Sec'
});

// Menu Sidebar
$(function(){
	$("#menu-handle").click(function(){
		$("#float-menu").toggleClass("show");
	});
});

//Menu Scrollbar
$(function(){
    $('.content-block').slimScroll({
        height: '100%',
        size: '6px',
        alwaysVisible: true
    });
});


// Animated menu icon script
$(document).ready(function(){
	$('#nav-icon1').click(function(){
		$(this).toggleClass('open');
	});
});

//Remove Placeholder text on focus
jQuery(document).ready(function()  
{  
    jQuery('input').each(function()  
    {  
        if (jQuery(this).attr('placeholder') && jQuery(this).attr('placeholder') != '')  
        {  
            jQuery(this).attr( 'data-placeholder', jQuery(this).attr('placeholder') );  
        }  
    });  
  
    jQuery('input').focus(function()  
    {  
        if (jQuery(this).attr('data-placeholder') && jQuery(this).attr('data-placeholder') != '')  
        {  
            jQuery(this).attr('placeholder', '');  
        }  
    });  
  
    jQuery('input').blur(function()  
    {  
        if (jQuery(this).attr('data-placeholder') && jQuery(this).attr('data-placeholder') != '')  
        {  
            jQuery(this).attr('placeholder', jQuery(this).attr('data-placeholder'));  
        }  
    });  
});  


$("a").click(function(event) {
    if ($(this).text() != "#") {
        event.preventDefault();
    }           
});