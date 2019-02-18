	function get_image_options()
	{
		let image_events = html_control.events.last_event_by({acc:'image_clicked'});
		let background_image =  html_control.events.last_event_by({acc:'background_image_selected'});
		let options = {};
		let transform_options = {"Tranform_axis_x":{name:"Transformar en eje x"},"Tranform_axis_y":{name:"Transformar en eje y"},"Tranform_free":{name:"Transformacion libre"},"resize":{name:"Redimensionar"}};
            
			options =    {
	        	"watch_images": {name: "Ver imagenes", icon: "fa-eye"},
	        	"insert_image": {name: "Insertar imagen", icon: "fa-edit"},
	        	"change_favicon": {name: "Cambiar favicon de pagina", icon: "fa-circle"}            		            
	        };	
		
		
		if(background_image != null)
		{
			options = {
				"change_background_image":{name:"Modificar Imagen del fondo",icon: "fa-edit"}
			}
		}

		if(image_events != null)
		{
			options["change_image"] = {name: "Cambiar Imagen", icon: "fa-file"};
			options["transform"] = {name: decode_utf8("Transformar"), icon: "fa-star",items:transform_options};
			options["delete"] = {name: decode_utf8("Eliminar"), icon: "fa-minus"};
			options["cancel_operation"] = {name: decode_utf8("Cancelar operación"), icon: "fa-times-circle"};

			if(image_events.ref_element.className.includes("resize-drag"))
			{
				options["assoc_layer"] = {name: decode_utf8("Asociar transformación a capa"), icon: "fa-edit"};	
			}
			 	
		}



		context_menu_highlight(".context-menu-one");

		return options;			    
	}


	function get_text_options()
	{
		let text_events = html_control.events.last_event_by({type:'text'});
		let options = {};
		if(text_events != null)
		{
			let transform_options = {"Tranform_axis_x":{name:"Transformar en eje x"},"Tranform_axis_y":{name:"Transformar en eje y"},"Tranform_free":{name:"Transformacion libre"}};
            
			options =  {
				"transform":{name: decode_utf8("Transformar"), icon: "fa-star",items:transform_options},
				"delete":{name: decode_utf8("Eliminar"), icon: "fa-minus"},
				"properties":{name: decode_utf8("Modificar propiedades del texto"), icon: "fa-edit"},	        	
	        	"cancel_operation": {name: decode_utf8("Cancelar operación"), icon: "fa-times-circle"}          
	        };
		}
		else
		{
			options = {
				"insert_text":{name: decode_utf8("Insertar nuevo texto"), icon: "fa-edit"}
			}
		}

		context_menu_highlight(".context-menu-two");

		return options;
	}

	function get_block_options()
	{
		//console.log(html_control.events);

		let block_events = html_control.events.last_event_by({type:'block'});
		
		let options = {}
		
		if(block_events != null)
		{ 	
			if(block_events.acc  == "panel_of_reference")
			{
				options = {			        	
		        	"insert_over_this_block": {name: "Insertar sobre este bloque", icon: "fa-arrow-up"},
		        	"replace_block": {name: "Reemplazar este bloque", icon: "fa-copy"},
		        	"insert_below_this_block": {name: "Insertar debajo de este bloque", icon: "fa-arrow-down"},
		        	"cancel_operation": {name: decode_utf8("Cancelar operación"), icon: "fa-times-circle"},
		        	"delete": {name: decode_utf8("Eliminar"), icon: "fa-minus"},
		        	"transform":{name: decode_utf8("Transformar"), icon: "fa-star"},
		        	"clone":{name: decode_utf8("Clonar"), icon: "fa-copy"}
		        };
		    }
			if(block_events.acc  == "panel_that_modify")
			{
				options =    {
		        	"select_block": {name: "Seleccionar bloque", icon: "fa-check"},
		        	"cancel_operation": {name: decode_utf8("Cancelar operación"), icon: "fa-times-circle"}           
		        };
			}
		}
		else
		{
			options = {
				"new_block": {name: "Insertar bloque vacio", icon: "fa-circle"}
			}
		}

		context_menu_highlight(".context-menu-three");

		return options;
	}


	function get_style_options()
	{

		let options = {};

		let styles_copied = html_control.events.last_event_by({acc:"copy_styles_from_other_page"});

		if(editor_html != null)
		{
			options["copy_style"] = {name:"Copiar estilos de pagina",icon:"fa-star"}; 
		}
		if(styles_copied != null)
		{
			options["paste_styles"] = {name:"Pegar estilos",icon:"fa-edit"};
		}



		options["insert_style"] = {name: decode_utf8("Insertar estilo"), icon: "fa-edit"}
			//"insert_bootstrap": {name: decode_utf8("Insertar Bootstrap"), icon: "fa-edit"},
			//"insert_fontawesome": {name: decode_utf8("Insertar libreria de Iconos"), icon: "fa-edit"}
		

		context_menu_highlight(".context-menu-four");

		return options;
	}

	function get_program_options()
	{
		let carousel = html_control.events.last_event_by({acc:"carousel_slider_of_reference"});

		let default_content = html_control.events.last_event_by({acc:"reference_to_add_default_content"});

		let already_exist;

		let register_event;

		let helper_reference;

		let reference_element;

		options = {};

		let tab_selected = html_control.events.last_event_by({acc:"last_li_selected"});

		let show_default_content = false;

		if(default_content)
		{
			show_default_content = true;			
		}	

		if(tab_selected)
		{
			if($(tab_selected.ref_element).children("a").attr("data-toggle") == "tab")
			{
				show_default_content = true;
				
			 	helper_reference = $(tab_selected.ref_element).children("a").attr("href");

			 	reference_element = editor_html.find(helper_reference).get(0);

			 	console.log(reference_element);

			 	already_exist = html_control.events.last_event_by({acc:"reference_to_add_default_content"});

				register_event = new editor_event(reference_element,"reference_to_add_default_content","program");
				 
				if(already_exist)
				{
				  	 	html_control.events.replace_event(already_exist,register_event);
				} 		
				else
				{
			  	 	html_control.events.add_event(register_event);	
				}	

			}	
		}


		if(show_default_content)
		{ 	
			options["default_content"] = {name: decode_utf8("Insertar contenido predefinido"), icon: "fa-star"};
		}			
		

		if(carousel)
		{
			options["carousel_properties"] = {name: decode_utf8("Modificar propiedades de slider"), icon: "fa-edit"};
			
		}
		
		let calendar = html_control.events.last_event_by({acc:"calendar_selected"});

		if(calendar)
		{
			options["calendar_properties"] = {name: decode_utf8("Modificar propiedades del calendario"), icon: "fa-edit"};
			
		}


		context_menu_highlight(".context-menu-five");

		return options;
	}

	function get_list_options()
	{
		let transform_options = {"Tranform_axis_x":{name:"Transformar en eje x"},"Tranform_axis_y":{name:"Transformar en eje y"},"Tranform_free":{name:"Transformacion libre"}};

		options = {
			"transform":{name: decode_utf8("Transformar"), icon: "fa-star",items:transform_options},
			"properties":{name: decode_utf8("Modificar propiedades de la lista"), icon: "fa-edit"},
			"properties_li":{name: decode_utf8("Modificar propiedades del elemento \n de la lista"), icon: "fa-edit"},
			"move_up_li":{name: decode_utf8("Mover a siguiente posición"), icon: "fa-arrow-right"},
			"move_down_li":{name: decode_utf8("Mover a posición anterior"), icon: "fa-arrow-left"},
			"insert_li":{name: decode_utf8("Insertar nuevo elemento a la lista"), icon: "fa-star"},
			"insert_list":{name: decode_utf8("Insertar lista dentro de la lista"), icon: "fa-star"},
			"delete_li":{name: decode_utf8("Eliminar elemento de la lista"), icon: "fa-delete"}
		}

		context_menu_highlight(".context-menu-six");

		return options;
	}

	function get_button_options()
	{

		let transform_options = {"Tranform_axis_x":{name:"Transformar en eje x"},"Tranform_axis_y":{name:"Transformar en eje y"},"Tranform_free":{name:"Transformacion libre"}};

		already_exist = html_control.events.last_event_by({acc:"button_of_reference"});	

		if(already_exist)
		{ 	
			options = {
				"transform":{name: decode_utf8("Transformar"), icon: "fa-star",items:transform_options},
				"properties":{name: decode_utf8("Modificar propiedades del boton"), icon: "fa-edit"}			
			};
		}
		else{
			options = {};
		}	

		context_menu_highlight(".context-menu-seven");

		return options;

	}

let context_menu_image_process =  function(key, options) {
		let image_scope = getScope("#modalYT");
        let  m = "clicked: " + key;
        console.log(m);
        //window.console && console.log(m) || alert(m);
        let event_img = html_control.events.last_event_by({type:'image'});
        let image;
        let wrap_image;
        switch(key)
        {
        	case "watch_images":
			    	$("#modalYT").modal("show");
			    	image_scope.gallery_mode = null;
			    	image_scope.load_images();
		        break;

		    case "insert_image":
		    		$("#modalYT").modal("show");
		    		image_scope.gallery_mode = 1;
		    		image_scope.load_images();
		    	break;

		    case "change_image":
		    	   $("#modalYT").modal("show");
			       image_scope.gallery_mode = 2;
			       image_scope.load_images();
		        break;
		    case "Tranform_axis_x":
		    	
		    	image = html_control.events.last_event_by({type:'image'});

		    	/*if(!$(image.ref_element).parent(".fm-wrap").get(0))
		    	{
		    		$(image.ref_element).wrap("<div class='fm-wrap'></div>"); 
		    	} 				 

				wrap_image = $(image.ref_element).parent(".fm-wrap");

				drag_on_x(wrap_image);*/

				drag_on_x(image.ref_element);

				break;
			case "Tranform_axis_y":
				image = html_control.events.last_event_by({type:'image'});

				/*if(!$(image.ref_element).parent(".fm-wrap").get(0))
		    	{
		    		$(image.ref_element).wrap("<div class='fm-wrap'></div>"); 
		    	} 				 

				wrap_image = $(image.ref_element).parent(".fm-wrap");*/				

				drag_on_y(image.ref_element);
				break;
			case "Tranform_free":
				image = html_control.events.last_event_by({type:'image'});

				/*if(!$(image.ref_element).parent(".fm-wrap").get(0))
		    	{
		    		$(image.ref_element).wrap("<div class='fm-wrap'></div>"); 
		    	} 				 

				wrap_image = $(image.ref_element).parent(".fm-wrap");*/

				drag_in_both(image.ref_element);				
				break;
			case "resize":
				image = html_control.events.last_event_by({type:'image'});				   
				resize_element(image.ref_element);
				break;	
		    case "transform":		    	   
		    	   image = html_control.events.last_event_by({type:'image'});
				   interactjs_editor_frame_process(image);	        		
	        	break;
	        case "assoc_layer":	
	        		image = html_control.events.last_event_by({acc:'image_clicked'});
				    html_control.actions.assoc_parent(image);	        		
	        	break;	
	        case "change_background_image":	        		
	        		$("#modalYT").modal("show");
				    image_scope.gallery_mode = 3;
				    image_scope.load_images();	        			    
	        	break;
	        
	        case "change_favicon":
	        		if(editor_html)
	        		{
	        			if(!editor_html.find('link[rel="shortcut icon"]').get(0))
	        			{	        				
	        				editor_html.find('head').append('<link href="your_favicon_name.ico" rel="shortcut icon" type="image/x-icon" />');	        				 
	        			}
	        			$("#modalYT").modal("show");
	        			image_scope.gallery_mode = 4;
				    	image_scope.load_images();	
	        		}
	        		else
	        		{
	        			swal(
						  decode_utf8('¡Rayos!'),
						  'Aun no hay una pagina para este proceso',
						  'question'
						)
	        		}
	        		//$('link[rel="shortcut icon"]').attr('href', src);	
	        		// $('head').append('<link href="your_favicon_name.ico" rel="shortcut icon" type="image/x-icon" />');
	        	break;
		    
		    case "cancel_operation":
		    	   if(event_img)
		    	   {
		    	   	 html_control.actions.cancel_last_operation(event_img);
		    	   }		    	   
		        break;   	
		    
		    case "delete":
				if(event_img)
				{
					html_control.actions.delete_html_element(event_img);
						
				}	
				break;    
		    default:
		        swal(
				  decode_utf8('¡Rayos!'),
				  'Opcion no programada',
				  'question'
				)
			break;
		}
    }


    let context_menu_text_process =  function(key, options) {
		
		let already_exist = html_control.events.last_event_by({acc:"selected_text"});
		let properties_to_modify = [];

    	let ep = {};

        switch(key)
        {
			case "cancel_operation":							
				 
				if(already_exist)
				{
					$(already_exist.ref_element).removeAttr("contenteditable");
					html_control.actions.cancel_last_operation(already_exist);
				}

				break;
			case "insert_text":
				
				if(editor_html!=null)
				{
					editor_html.find("body").append("<span style='text-align:center;position:absolute' class='arbitrary_text'>SOY UN NUEVO TEXTO</span>");
					editor_html.find(".arbitrary_text").last().attr("contenteditable",true);
					editor_html.find(".arbitrary_text").last().focus();
				}
				else{
					swal(
					  decode_utf8('¡Oops!'),
					  'Aun no hay un documento html para este proceso',
					  'question'
					)	
				}

				break;
			case "Tranform_axis_x":

				drag_on_x(already_exist.ref_element);

				break;
			case "Tranform_axis_y":

				drag_on_y(already_exist.ref_element);

				break;
			case "Tranform_free":
			
				drag_in_both(already_exist.ref_element);

				break;	
			case "transform":
				if(already_exist)
				{
					interactjs_editor_frame_process(already_exist);
				}	
				break;
			case "properties":	    	
				
				ep = html_control.actions.change_text_alignment(already_exist.ref_element);
				properties_to_modify.push(ep);

				ep = html_control.actions.change_font_size(already_exist.ref_element);
				properties_to_modify.push(ep);

				ep = html_control.actions.change_font_weight(already_exist.ref_element);
				properties_to_modify.push(ep);

				ep = html_control.actions.change_font_style(already_exist.ref_element);
				properties_to_modify.push(ep);

				ep = html_control.actions.change_font_family(already_exist.ref_element);
				properties_to_modify.push(ep);
				

				generate_html_for_properties_process(properties_to_modify);								

				$("#modalProperties").modal("show");	    	

	    	break;
			case "delete":
				if(already_exist)
				{
					html_control.actions.delete_html_element(already_exist);	
		    	  	
				}	
				break;		
			default:
		        swal(
				  decode_utf8('¡Rayos!'),
				  'Opcion no programada',
				  'question'
				)
			break;				
		}	
	}

    let context_menu_block_process =  function(key, options) {
		//window.console && console.log(m) || alert(m);

    	let reference =	html_control.events.last_event_by({acc:"panel_of_reference"});
		let add = 	html_control.events.last_event_by({acc:"panel_that_modify_selected"});

		//console.log(html_control.events.editor_events);

        switch(key)
        {
			case "insert_over_this_block":				

				if(add)
				{						

					html_control.actions.insert_block_over(reference.ref_element,add.ref_element);

					add.acc = "panel_that_modify";

					html_control.events.remove_event(reference);
					html_control.events.remove_event(add);
				}
				else
				{
					reference.extra = "over";
				}				

		        break;

		    case "insert_below_this_block":

	    		if(add)
				{
					html_control.actions.insert_block_below(reference.ref_element,add.ref_element);

					add.acc = "panel_that_modify";

					html_control.events.remove_event(reference);
					html_control.events.remove_event(add);
				}
				else
				{
					reference.extra = "below";
				}			
			    
		        break;

		    case "replace_block":
			    
			    if(add)
				{
					html_control.actions.replace_block(reference.ref_element,add.ref_element);

					add.acc = "panel_that_modify";

					html_control.events.remove_event(reference);
					html_control.events.remove_event(add);
				}
				else
				{
					reference.extra = "replace";
				}				
			    		
		        break;

		    case "select_block":
				
				let selected = 	html_control.events.last_event_by({acc:"panel_that_modify"});

		    	if(reference)
		    	{
		    		switch(reference.extra)
        			{
        				case "over":
        					html_control.actions.insert_block_over(reference.ref_element,selected.ref_element);
        				break;
        				case "below":
        					html_control.actions.insert_block_below(reference.ref_element,selected.ref_element);
        				break;
        				case "replace":
        					html_control.actions.replace_block(reference.ref_element,selected.ref_element);
        				break;
        			}

        			html_control.events.remove_event(reference);
					html_control.events.remove_event(selected);
		    	}
		    	else
		    	{			    		
					selected.acc = "panel_that_modify_selected";	
		    	}

		        break;

		    case "cancel_operation":
		    	   
		    	   let event = html_control.events.last_event_by({type:'block'});
		    	   html_control.actions.cancel_last_operation(event);
		        break;

		    case "transform":
		    	
		    	if(reference != null)
	    	  	{  
		    	  interactjs_editor_frame_process(reference);	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}

	    		break;

	    	case "clone":
	    		
	    		 let already_exist = html_control.events.last_event_by({acc:"panel_of_reference"});

				 let register_event = new editor_event(already_exist.ref_element.cloneNode(true),"panel_that_modify_selected","block");				 
				
		    	 html_control.events.replace_event(already_exist,register_event);

				 break;	

		    case "delete":

		    	  if(reference != null)
		    	  {	
		    	  	html_control.actions.delete_html_element(reference);	    	  		    	  	 	
		    	  	//$(reference.ref_element).remove();	
		    	  	//html_control.events.remove_event(reference);	
		    	  }else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);		    	  	
		    	  }	
		    	break;

		    case "new_block":
		    	
		    	editor_html.find("body").append("<div class='content-block'><span style='text-align:center'><strong>SOY UN BLOQUE VACIO</strong></span></div>");
		    	break;	

		    default:
		        swal(
				  decode_utf8('¡Rayos!'),
				  'Opcion no programada',
				  'question'
				)
			break;
		}
    }

    let context_menu_style_process =  function(key, options) {
    	 
    	 let already_exist;
    	 let register_event;

    	 switch(key)
        {
			case "insert_style":

				let url = $("#url_name").val();
				let src = $("#editor_frame").attr('src');			

				if(url != "" && src != "")
				{
					(async function getStyle () {

						const {value: style_referenced} = await swal({
						  title: 'Ingresa la referencia del estilo',
						  input: 'text',
						  inputValue: "",
						  showCancelButton: true,
						  inputValidator: (value) => {
						    return !value && 'Necesitas escribir algo'
						  }
						})

						if (style_referenced) {
						  generate_styles_to_web_proyect(style_referenced);
						  //swal(`Lo que ingresaste es  ${style_referenced}`)
						}
					})();	
				}
				else
				{
					swal({
	                  type: 'error',
	                  title: 'Oops...',
	                  text: 'No hay donde aplicar el estilo',
	                  footer: ''
	                });	
				}

			break;

			case "copy_style":

				console.log(styles_included);

				let styles_to_copy = styles_included;

				already_exist = html_control.events.last_event_by({acc:"copy_styles_from_other_page"});
				register_event = new editor_event(styles_to_copy,"copy_styles_from_other_page","style");
				 
				if(already_exist)
				{
					
				  	 	html_control.events.replace_event(already_exist,register_event);
				} 		
				else
				{
			  	 	html_control.events.add_event(register_event);	
				}

			break;

			case "paste_styles":
				
				if(editor_html)
				{ 
					let styles_copied = html_control.events.last_event_by({acc:"copy_styles_from_other_page"});
					console.log(styles_copied.ref_element);
					let array_styles_copied = styles_copied.ref_element;
					array_styles_copied.forEach(function(element) {
					  //console.log(element);
					  editor_html.find("head link").last().after('<link rel="stylesheet"  href="'+element+'">');
					  	
					});
				}
				else{
					alert("No hay una pagina html a la que aplicarle los estilos");	
				}

				alert("Estilos pegados");

			break;

			default:
			break;
		}
    }

    let context_menu_program_process =  function(key, options) {
    	let ep;
    	let properties_to_modify = [];

    	switch(key)
        {
        	case "carousel_properties": 

	        	let carousel = html_control.events.last_event_by({acc:"carousel_slider_of_reference"});
				
				console.log(carousel);

				ep = html_control.actions.set_data_interval_carousel(carousel.ref_element);
				properties_to_modify.push(ep);
					
				generate_html_for_properties_process(properties_to_modify);								

				$("#modalProperties").modal("show");

        	break;

        	case "default_content":

        		$("#modaldefaultContent").modal("show");

        	break;

        	case "calendar_properties":

			  	let calendar = html_control.events.last_event_by({acc:"calendar_selected"});		

			  	console.log(calendar.ref_element);
				
				$("#modalCalendarProperties").modal("show");

				document.querySelector("input[name='json_files_for_events']").value=$(calendar.ref_element).attr("path");

				if(getScope("#modalCalendarProperties").show_button_to_save == false)
				{ 	
					getScope("#modalCalendarProperties").search_file();
				}

        	break;
        	
        	default:
			break;
        }

    }

    let context_menu_list_process =  function(key, options) {

    	let reference =	html_control.events.last_event_by({acc:"list_of_reference"});

    	let properties_to_modify = [];

    	let ep = {};

    	let already_exist = {};

    	let check;

    	let copy;

    	let callback = false;

    	 switch(key)
        {

        	case "Tranform_axis_x":

        		//console.log($(reference.ref_element).parent("ul").get(0));

        		if(reference != null)
	    	  	{  
		    	  drag_on_x($(reference.ref_element).parent("ul").get(0));	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}				

				break;
			case "Tranform_axis_y":

				if(reference != null)
	    	  	{
	    	  	  drag_on_y($(reference.ref_element).parent("ul").get(0));		    	  	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}

				

				break;
			case "Tranform_free":
					
				if(reference != null)
	    	  	{
	    	  	  drag_in_both($(reference.ref_element).parent("ul").get(0));	    	  	  		    	  	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}

				
				break;	
			
			case "transform":
		    	
		    	if(reference != null)
	    	  	{  
		    	  interactjs_editor_frame_process(reference);	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}

	    		break;
	    	case "properties":
				
	    		already_exist = html_control.events.last_event_by({acc:"list_of_reference"});
				
				ep = html_control.actions.change_text_alignment(already_exist.ref_element);
				properties_to_modify.push(ep);

				ep = html_control.actions.change_font_size(already_exist.ref_element);
				properties_to_modify.push(ep);

				generate_html_for_properties_process(properties_to_modify);								

				$("#modalProperties").modal("show");	    	

	    	break;	
	    	case "properties_li":
	    		
				
				already_exist = html_control.events.last_event_by({acc:"last_li_selected"});

				console.log(already_exist);				
				
	    		if($(already_exist.ref_element).find("a").length > 0)
				{
					//console.log($(already_exist.ref_element).find("a").attr('href'));
					ep = html_control.actions.modify_link(already_exist.ref_element);	
					properties_to_modify.push(ep);

				}

				if($(already_exist.ref_element).text().length > 0)
				{
					if($(already_exist.ref_element).children("ul").get(0) != null)
					{						
						ep = html_control.actions.modify_text($(already_exist.ref_element).children().first().get(0));
						properties_to_modify.push(ep);
					}
					else
					{ 
						ep = html_control.actions.modify_text(already_exist.ref_element);
						properties_to_modify.push(ep);						
					}						
				}

				ep = html_control.actions.change_classNames(already_exist.ref_element);
				properties_to_modify.push(ep);

				

				generate_html_for_properties_process(properties_to_modify);								

				$("#modalProperties").modal("show");

				break;

			case "move_up_li":

				already_exist = html_control.events.last_event_by({acc:"last_li_selected"});

				console.log(already_exist.ref_element);

				//console.log($(already_exist.ref_element).next("li").get(0));				
	
				if($(already_exist.ref_element).next("li").get(0) != null)
				{
					let after = $(already_exist.ref_element).next("li").get(0);
					$(after).after($(already_exist.ref_element));
					//console.log("make process");
				}

			break;

			case "move_down_li":

				already_exist = html_control.events.last_event_by({acc:"last_li_selected"});
				
				//console.log($(already_exist.ref_element).prev("li").get(0));

				if($(already_exist.ref_element).prev("li").get(0) != null)
				{
					let before = $(already_exist.ref_element).prev("li").get(0);
					$(before).before($(already_exist.ref_element));
					
					//console.log("make process");
				}

			break;

			case "insert_li":

				already_exist = html_control.events.last_event_by({acc:"last_li_selected"});
				
				check = $(already_exist.ref_element).parent("ul").find("li"); 
				
				copy = check.get(0).cloneNode(true);				
				
				$(copy)[0].innerHTML = $(copy)[0].innerHTML.replace($(copy)[0].innerText.trim(),"Nuevo elemento");
				
				if($(copy).children("a").length > 0)
				{
					$(copy).children("a")[0].href="#";
					console.log($(copy).children("a")[0]);
				}

				$(copy).removeClass("active");
				
				if($(copy).children("ul").length > 0)
				{
					$(copy).children("ul").remove();
				}

				if($(already_exist.ref_element).parent("ul").get(0).className.includes("nav-tabs"))
				{
					// caso para tabs

					//console.log("Is time to tabs process");				

					let last_tab_reference = $(already_exist.ref_element).parent("ul").children("li").last().find("a").attr("href");

					//console.log(last_tab_reference);

					//console.log(editor_html.find(last_tab_reference).get(0));
					
					let tab_copy = editor_html.find(last_tab_reference).get(0).cloneNode(true);
						
					let randid = "autogenerate_tab"+Math.floor((Math.random() * 100) + 10);

					$(tab_copy).attr("id",randid);

					$(tab_copy).html("<div>Placeholder Content</div>");

					$(copy).children("a").attr("href","#"+randid);

					//console.log(tab_copy);

					//console.log(copy);

					//return;

					editor_html.find(last_tab_reference).after(tab_copy);
				}
				
				$(already_exist.ref_element).after(copy);


			break;

			case "insert_list":

				already_exist = html_control.events.last_event_by({acc:"last_li_selected"});
				
				if($(already_exist.ref_element).children("ul").length == 0)
				{ 
					check = $(already_exist.ref_element).parent("ul").find("li:has(> ul)"); 
					if(check.get(0))
					{
						copy = check.get(0).cloneNode(true);
						$(copy).children("a")[0].innerHTML = $(copy).children("a")[0].innerHTML.replace($(copy).children("a")[0].innerText.trim(),$(already_exist.ref_element).children("a")[0].innerText.trim());
						$(copy).children("ul").children("li").not(':first').remove();
						$(copy).children("ul").children("li")[0].innerHTML = $(copy).children("ul").children("li")[0].innerHTML.replace($(copy).children("ul").children("li")[0].innerText.trim(),"Nuevo elemento");
						$(already_exist.ref_element).replaceWith(copy);
					}
					else{
						swal(
						  decode_utf8('¡Opps!'),
						  "No tengo una referencia para generar este resultado",
						  'question'
						);


						setTimeout(function(){ 
							swal({			
							  title: decode_utf8('¿Desea generar la lista entre listas por defecto?'),
							  text: 'Es posible que no funcione',
							  type: 'warning',
							  showCancelButton: true,
							  confirmButtonColor: '#3085d6',
							  cancelButtonColor: '#d33',
							  confirmButtonText: 'Si, !adelante!'			
							}).then((result) => {

								let default_list_on_list = '<li class=""><a href="#" class="dropdown-toggle " data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'+already_exist.ref_element.innerText+'<span class="caret"></span></a>';
                 				default_list_on_list += '<ul class="dropdown-menu">';
                      			default_list_on_list += '<li><a href="#">Nuevo elemento</a></li>';
                  				default_list_on_list += '</ul>';
            					default_list_on_list += '</li>';

								
								console.log(already_exist.ref_element.innerText);

								$(already_exist.ref_element).replaceWith(default_list_on_list);	
							});

						}, 3000);
												
					}
				}
				else
				{
					swal(
						  decode_utf8('¡Opps!'),
						  "Ya tiene una lista internamente, no se puede hacer este proceso",
						  'question'
					);
					
				}

			break;	


			case "delete_li":
				
				already_exist = html_control.events.last_event_by({acc:"last_li_selected"});
				


				if($(already_exist.ref_element).parent("ul").children("li").length > 1)
				{
					if($(already_exist.ref_element).parent("ul").get(0).className.includes("nav-tabs"))
					{
						let id_tab_ref = $(already_exist.ref_element).children("a").attr("href");
						
						//console.log(editor_html.find(id_tab_ref).get(0));
						
						callback = function()
						{
							console.log("Deleting tab content");
							editor_html.find(id_tab_ref).remove(); 
						}
							
						
					}


					html_control.actions.delete_html_element(already_exist,callback);
				}
				else
				{
					swal(
					  decode_utf8('¡Opps!'),
					  'No se puede dejar a la lista sin ningun elemento',
					  'question'
					);
				}
				
				

			break;
			default:
			break;
		}
    }

    let context_menu_button_process =  function(key, options) {

    	//console.log(html_control.events);

    	let reference =	html_control.events.last_event_by({acc:"button_of_reference"});

    	let properties_to_modify = [];

    	let ep = {};

    	let already_exist;

    	 switch(key)
        {
        	case "Tranform_axis_x":

        		console.log(reference);

        		$(reference.ref_element).mousedown(function() {
				 	console.log("prevent default");
				 	event.preventDefault();
				});

        		if(reference != null)
	    	  	{  
	    	  	  $(reference.ref_element).wrap("<div class='fm_wrapper_div'></div>");	
		    	  
		    	  drag_on_x($(reference.ref_element).parent('.fm_wrapper_div'));	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}				

				break;
			case "Tranform_axis_y":

				if(reference != null)
	    	  	{
	    	  	  $(reference.ref_element).wrap("<div class='fm_wrapper_div'></div>");  
		    	
	    	  	  drag_on_y($(reference.ref_element).parent('.fm_wrapper_div'));		    	  	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}

				

				break;
			case "Tranform_free":
					
				if(reference != null)
	    	  	{
	    	  	  console.log("Drag free");	
	    	  	  $(reference.ref_element).wrap("<div class='fm_wrapper_div'></div>");		    	
	    	  	  drag_in_both($(reference.ref_element).parent('.fm_wrapper_div'));	    	  	  		    	  	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}

				
				break;
			case "transform":
		    	
		    	if(reference != null)
	    	  	{  
		    	  interactjs_editor_frame_process(reference);	    
		    	}
		    	else{
		    	  	swal(
					  decode_utf8('¡Opps!'),
					  'No ha seleccionado un elemento para este proceso',
					  'question'
					);
	    		}

	    		break;

	    	case "properties":

				already_exist = html_control.events.last_event_by({acc:"button_of_reference"});	

				let form_as_link = $(already_exist.ref_element).closest("form").get(0);
				
				if($(form_as_link).find("input,select").length == 0)
				{
					ep = html_control.actions.form_as_link(form_as_link);	
					properties_to_modify.push(ep);
				}			
				
	    		if($(already_exist.ref_element).find("a").length > 0)
				{
					//console.log($(already_exist.ref_element).find("a").attr('href'));
					ep = html_control.actions.modify_link(already_exist.ref_element);	
					properties_to_modify.push(ep);

				}

				if($(already_exist.ref_element).text().length > 0)
				{
					ep = html_control.actions.modify_text(already_exist.ref_element);
					properties_to_modify.push(ep);						
				}												

				ep = html_control.actions.change_text_alignment(already_exist.ref_element);
				properties_to_modify.push(ep);

				ep = html_control.actions.change_font_size(already_exist.ref_element);
				properties_to_modify.push(ep);

				ep = html_control.actions.modify_padding(already_exist.ref_element);
				properties_to_modify.push(ep);
				
				generate_html_for_properties_process(properties_to_modify);

				$("#modalProperties").modal("show");	    	

	    	break;	
			default:
			break;
		}
    }


    function generate_html_for_properties_process(properties)
    {
    	$("#property_body").empty();

    	let html = "";
    	let count = 0;
    	properties.forEach(function(property){
    		count++;
    		html = "<div class='form-group'>";
    		html += "<label>"+property.label+"</label>";	
    			if(property.input == "text")
    			{
    				
    				html += "<input type='text' class='form-control' name='"+property.name+"' ";

    				if(property.default_value != null)
    				{
    					html += " value = '"+property.default_value+"' ";
    				}	

    				html += ">";	
    			}
    			if(property.input == "select")
    			{
    				html += "<select class='form-control' name='"+property.name+"' >";
    					if(property.default_value == null)
						{
							html += "<option value='' selected>Selecciona</option>";
						}
    					
    					let selected;

    					property.dataset.forEach(function(data){
    						
    						if(property.default_value != null && data.value == property.default_value)
    						{
    							selected = "selected";
    						}
    						else{
    							selected = "";
    						}

    						html += "<option value='"+data.value+"' "+selected+">"+data.option+"</option>";
    					});	

    				html += "</select>";
    			}
    		html += "<button id='input_"+count+"' class='btn btn-success form-control' >Modificar</button>";		
    		html += "</div>";
    		
    		$("#property_body").append(html);
    		$("#input_"+count).bind('click', property.callback);

    	});

    	//return html;	
    }
	


		//Menu for images
		var images_menu =  new context_menu_object('.context-menu-one',context_menu_image_process,get_image_options);
		$.contextMenu(images_menu);

	    //-------/

	    //Menu for text
	    var text_menu =  new context_menu_object('.context-menu-two',context_menu_text_process,get_text_options);
		$.contextMenu(text_menu);
	    //-------/

	    //Menu for Blocks
	 	var blocks_menu =  new context_menu_object('.context-menu-three',context_menu_block_process,get_block_options);
		$.contextMenu(blocks_menu);
	    //-------/

	    //Menu for Styles
	 	var styles_menu =  new context_menu_object('.context-menu-four',context_menu_style_process,get_style_options);
		$.contextMenu(styles_menu);
	    //-------/

	    //Menu for Programs
	    var programs_menu =  new context_menu_object('.context-menu-five',context_menu_program_process,get_program_options);
		$.contextMenu(programs_menu);

	    //Menu for List
	 	var list_menu =  new context_menu_object('.context-menu-six',context_menu_list_process,get_list_options);
		$.contextMenu(list_menu);
	    //-------/

	    //Menu for Button
	 	var button_menu =  new context_menu_object('.context-menu-seven',context_menu_button_process,get_button_options);
		$.contextMenu(button_menu);
	    //-------/