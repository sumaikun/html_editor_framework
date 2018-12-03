( function( $, Snap ) {

	// Window width
		var $window_width = window.innerWidth;

	// Load page from bottom
	$(window).on('load', function () {
		$('html, body').animate({scrollTop: $(document).height()-$(window).height()}, 1);
	});

	// setTimeout Preloader
	setTimeout(function(){
		$('.preloader').fadeOut('300');
	}, 2000);

	// Rocket fire animation
		// Get flames
		var flame1 = Snap("#flame1");
		var flame2 = Snap("#flame2");

		// Animations
		var flame1_animation1 = function() {
			flame1.animate( {
				d: "M32.61,118.193l18.965,1.348c0,0,1.178,15.857-3.526,28.011c0,0,0.597-6.866-1.297-9.441c0,0,2.107,1.288-2.172,6.583C44.578,144.693,29.173,142.615,32.61,118.193z"
			}, 400, flame1_animation2 );
		};

		var flame1_animation2 = function() {
			flame1.animate( {
				d: "M32.476,119.037l19.098,0.504c0,0,3.081,11.104-1.624,23.258c0,0-1.305-2.114-3.199-4.689c0,0-0.39,5.073-4.67,10.368C42.08,148.478,29.039,143.459,32.476,119.037z"
			}, 400, flame1_animation1 );
		};

		var flame2_animation1 = function() {
			flame2.animate( {
				d: "M34.354,119.072l15.006,0.395c0,0,1.008,6.658-2.687,16.21c0,0,0.409-0.767-0.496-2.658c0,0-0.329,0.936-3.691,5.096C42.487,138.113,31.654,138.26,34.354,119.072z"
			}, 400, flame2_animation2 );
		};

		var flame2_animation2 = function() {
			flame2.animate( {
				d: "M34.354,119.072l15.006,0.395c0,0,3.02,7.916-0.674,17.467c0,0-1.604-2.024-2.509-3.916c0,0-0.914,5.025-4.276,9.185C41.902,142.202,31.654,138.261,34.354,119.072z"
			}, 400, flame2_animation1 );
		};

		// Start animation
		flame1_animation1();
		flame2_animation1();

	// Clouds animation
		// Get clouds
		var $cloud_1 = $('.cloud--1');
		var $cloud_2 = $('.cloud--2');
		var $cloud_3 = $('.cloud--3');
		var $cloud_4 = $('.cloud--4');
		var $cloud_5 = $('.cloud--5');
		var $cloud_6 = $('.cloud--6');
		var $cloud_7 = $('.cloud--7');

		// Cloud animations
			// Cloud 1
			TweenMax.fromTo( $cloud_1, 30, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone });
			// Cloud 2
			TweenMax.fromTo( $cloud_2, 30, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone, delay: 4 });
			// Cloud 3
			TweenMax.fromTo( $cloud_3, 30, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone, delay: 8 });
			// Cloud 4
			TweenMax.fromTo( $cloud_4, 33, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone, delay: 20 });
			// Cloud 5
			TweenMax.fromTo( $cloud_5, 30, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone, delay: 13 });
			// Cloud 6
			TweenMax.fromTo( $cloud_6, 40, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone });
			// Cloud 7
			TweenMax.fromTo( $cloud_7, 25, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone });

	// Airplanes animation
		// Get airplanes
		var $airplane_1 = $('.airplane--1');
		var $airplane_2 = $('.airplane--2');
		var $airplane_3 = $('.airplane--3');

		// Cloud animations
			// Airplane 1
			TweenMax.fromTo( $airplane_1, 8, { x:$window_width, ease: Linear.easeNone }, { x:-280, repeat: -1, ease: Linear.easeNone });
			// Airplane 2
			TweenMax.fromTo( $airplane_2, 8, { x:-280, ease: Linear.easeNone }, { x:$window_width, repeat: -1, ease: Linear.easeNone });
			// Airplane 3
			TweenMax.fromTo( $airplane_3, 8, { x:-280, ease: Linear.easeNone, delay: 0 }, { x:$window_width, repeat: -1, ease: Linear.easeNone, delay: 3 });

	// Ballon animation
		// Get ballon
		var $ballon = $('.ballon');

		// Animation
		TweenMax.to( $ballon, 20, { bezier:{ type:'quadratic', values:[ {x:0, y:0}, {x:100, y:0}, {x:100, y:100}, {x:100, y:200}, {x:0, y:200}, {x:-100, y:200}, {x:-100, y:100}, {x:-100, y:0},{x:0, y:0} ] }, ease: Linear.easeNone, repeat: -1 } );

	// Meteoroid flames animation
		// Get flames
		var meteoroid_flame1 = Snap.selectAll(".meteoroid--flame1");
		var meteoroid_flame2 = Snap.selectAll(".meteoroid--flame2");

		// Animations
		var meteoroid_flame1_animation1 = function() {
			meteoroid_flame1.animate( {
				d: "M55.97,46.013c0,0,51.663,188.283,2.73,207.536C2.748,275.561,0.616,149.375,39.947,45.618c0,0-13.673,67.712-6.991,73.552c10.496,9.173,11.188-83.313,12.149-85.392c0.554-1.195,2.228,64.759,2.461,72.435c0.283,9.333,2.348,25.218,6.513,11.946c4.165-13.273-2.587-72.068-2.587-72.068s7.935,54.452,11.318,63.524C68.124,123.867,57.525,54.155,55.97,46.013"
			}, 400, meteoroid_flame1_animation2 );
		};

		var meteoroid_flame1_animation2 = function() {
			meteoroid_flame1.animate( {
				d: "M65.834,72.663c0,0,41.799,161.633-7.134,180.886C2.748,275.561-5.164,168.921,34.167,65.165c0,0-7.893,48.165-1.211,54.005c10.496,9.173,10.416-37.76,11.377-39.838c0.554-1.195,3,19.206,3.233,26.882c0.283,9.333,2.348,25.218,6.513,11.946c4.165-13.273-7.246-63.328-7.246-63.328s12.594,45.711,15.977,54.784C68.124,123.867,67.389,80.805,65.834,72.663"
			}, 400, meteoroid_flame1_animation1 );
		};

		var meteoroid_flame2_animation1 = function() {
			meteoroid_flame2.animate( {
				d: "M65.626,140.969c0,0,30.185,86.277-7.588,108.536C22.184,270.633,0.432,201.07,30.504,123.572c0,0-3.538,40.961,2.578,42.038c5.613,0.988,8.638-35.138,11.575-41.241c2.939-6.104,6.118,24.067,7.196,28.88c1.457,6.511,3.859,16.026,8.888,7.967C65.911,152.932,63.546,136.63,65.626,140.969"
			}, 300, meteoroid_flame2_animation2 );
		};

		var meteoroid_flame2_animation2 = function() {
			meteoroid_flame2.animate( {
				d: "M62.34,122.497c0,0,36.49,102.726-1.282,124.984c-35.854,21.128-64.438-19.756-34.366-97.254c0,0,0.275,14.306,6.391,15.383c5.613,0.988,5.315-3.177,8.252-9.28c2.939-6.104,9.44-7.894,10.519-3.081c1.457,6.511,3.859,16.026,8.888,7.967C65.911,152.932,60.26,118.158,62.34,122.497"
			}, 500, meteoroid_flame2_animation1 );
		};

		// Start animation
		meteoroid_flame1_animation1();
		meteoroid_flame2_animation1();

	// Meteoroids movement animations
		// Get meteoroids
		var $meteoroid_1 = $('.meteoroid--1');
		var $meteoroid_2 = $('.meteoroid--2');

		// Meteoroids animations
			// Meteoroid 1
			TweenMax.fromTo( $meteoroid_1, 5, { x:-280, y: 200, height: 265, ease: Linear.easeNone }, { x:$window_width, y: 1700, height: 140, repeat: -1, ease: Linear.easeNone, delay: 2 });

			// Meteoroid 2
			TweenMax.fromTo( $meteoroid_2, 7, { x:-280, y: 800, height: 265, ease: Linear.easeNone }, { x:$window_width, y: 2200, height: 140, repeat: -1, ease: Linear.easeNone, delay: 5 });

	// ISS animation
		// Get iss
		var $iss = $('.iss');

		// Animation
		TweenMax.to( $iss, 20, { bezier:{ type:'quadratic', values:[ {x:0, y:0}, {x:50, y:0}, {x:50, y:50}, {x:50, y:100}, {x:0, y:100}, {x:-50, y:100}, {x:-50, y:50}, {x:-50, y:0},{x:0, y:0} ] }, ease: Linear.easeNone, repeat: -1 } );

	// Aurora borealis animation
		// Get aurora clouds
		var $aurora_1 = $('.aurora--1');
		var $aurora_2 = $('.aurora--2');
		var $aurora_3 = $('.aurora--3');

		// Animation
			// Aurora 1
			TweenMax.to( $aurora_1, 25, { bezier:{ type:'quadratic', values:[ {x:0, y:0}, {x:25, y:0}, {x:25, y:25}, {x:25, y:50}, {x:0, y:50}, {x:-25, y:50}, {x:-25, y:25}, {x:-25, y:0},{x:0, y:0} ] }, ease: Linear.easeNone, repeat: -1 } );

			// Aurora 2
			TweenMax.to( $aurora_2, 25, { bezier:{ type:'quadratic', values:[ {x:0, y:0}, {x:-25, y:0}, {x:-25, y:-25}, {x:-25, y:-50}, {x:0, y:-50}, {x:25, y:-50}, {x:25, y:-25}, {x:25, y:0},{x:0, y:0} ] }, ease: Linear.easeNone, repeat: -1 } );

			// Aurora 3
			TweenMax.to( $aurora_3, 15, { bezier:{ type:'quadratic', values:[ {x:0, y:0}, {x:-25, y:0}, {x:-25, y:-25}, {x:-25, y:-50}, {x:0, y:-50}, {x:25, y:-50}, {x:25, y:-25}, {x:25, y:0},{x:0, y:0} ] }, ease: Linear.easeNone, repeat: -1 } );

	// Popover
		// Get popover buttons
		var $popover_button = $('.popover__button');

		// Toggle class on tooltip when clicked
		$popover_button.on('click', function(){
			// Get current data value for this button
			var $current_id = $(this).data('popover');
			// Toggle class on element with same ID and data
			$('#' + $current_id).toggleClass('popover--active');
		});

	// SSS animation
		// Get iss
		var $sss = $('.sss');

		// Animation
		TweenMax.to( $sss, 20, { bezier:{ type:'quadratic', values:[ {x:0, y:0}, {x:25, y:0}, {x:25, y:25}, {x:25, y:50}, {x:0, y:50}, {x:-25, y:50}, {x:-25, y:25}, {x:-25, y:0},{x:0, y:0} ] }, ease: Linear.easeNone, repeat: -1 } );

	// Moon animation
		// Get moon
		var $moon = $('.moon');

		// Animation
		TweenMax.to( $moon, 20, { bezier:{ type:'quadratic', values:[ {x:0, y:0}, {x:-20, y:0}, {x:-20, y:-20}, {x:-20, y:-45}, {x:0, y:-45}, {x:20, y:-45}, {x:20, y:-20}, {x:20, y:0},{x:0, y:0} ] }, ease: Linear.easeNone, repeat: -1 } );

} )( jQuery, Snap );