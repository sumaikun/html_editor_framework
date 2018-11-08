$(document).ready(function() {
	var initialLocaleCode = 'en';
	var themeSystem = "";
	$('#calendar').fullCalendar({
            themeSystem: themeSystem,
            header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month,agendaWeek,agendaDay,listMonth'
            },
            defaultDate: '2018-03-12',
            locale: initialLocaleCode,
            weekNumbers: true,
            navLinks: true, // can click day/week names to navigate views
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            events:[]
    });
});      


        

    