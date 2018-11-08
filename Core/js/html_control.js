var control_cicle = 0;

var css_to_generate = [];

var editor_html;

var asistant_html;

var styles_included = [];

var proyect_folder;

function test_css_service()
{

	swal({			
	  title: decode_utf8('¿Esta seguro de guardar?'),
	  text: '',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Si, !adelante!'			
	}).then((result) => {
	  	if (result.value)
	  	{

	  	  	if(css_to_generate.length == 0)
			{
				swal(
				  decode_utf8('¡Oops!'),
				  'Aun no hay estilos que procesar',
				  'question'
				);
			}
			else
			{
				console.log(css_to_generate);
				css_to_generate.forEach(function(stylesheet){
					let new_css_test = "";
					for (rule in stylesheet.stylesheet.rules) {
			    		if(stylesheet.stylesheet.rules[rule].cssText)
			    		{ 	
			    			new_css_test +=  stylesheet.stylesheet.rules[rule].cssText+"\n";
			    		}
			    	}

			    	if(new_css_test != stylesheet.generated_css)
			    	{
			    		console.log(stylesheet.generated_css);
			    		console.log(new_css_test);
			    		stylesheet.generated_css = new_css_test;	
		    			getScope("#StyleCtrl").modify_styles({css:stylesheet.generated_css,route:stylesheet.route});
			    	}
			    	else{
			    		//temporal para que funcione
			    		stylesheet.generated_css = new_css_test;	
		    			getScope("#StyleCtrl").modify_styles({css:stylesheet.generated_css,route:stylesheet.route});

			    	}

				});

				console.log(css_to_generate);
				
			}	

  		}

  	});
}


//html control and states

	function editor_event(ref_element,acc,type,kind_of_process=1,extra=""){	
		this.ref_element = ref_element;
		this.acc = acc;
		this.type = type;
		this.kind_of_process = kind_of_process;
		this.extra = extra;
	}

	

	var html_control =
	{	

		events:{
			editor_events:[],
			add_event:function(event){

				//console.log(this.editor_events);
				
				let find_object = this.editor_events.filter(
					function(editor_event){
						
						if( editor_event.acc == event.acc &&
							editor_event.type == event.type && 
							editor_event.ref_element == event.ref_element)
						{
							
							//console.log("equals");
							return true;
						}
						else
						{//console.log("no equals");
						 return false;
						}
					}
				);
				//console.log(find_object);
				if(find_object.length == 0)
				{ 	
					this.editor_events.push(event);
				}	
				//console.log(this.editor_events);


			},
			current_event:function(){
				
				return this.editor_events[this.editor_events.length -1];	
			},
			last_event_by:function(object){

				let find_object = this.editor_events.filter(
				function(editor_event){
					let build_object = {};
					for (let k in object){
						build_object[k] = editor_event[k]; 
					}
					//console.log(object);
					//console.log(build_object);
					if(isEquivalent(build_object,object))						
					{
						//console.log("equals");
						return true;
					}
					else{
						//console.log("no equals");
						return false;
					}
				});
				//console.log(find_object[find_object.length-1]);
				return find_object[find_object.length-1];
			
			},
			replace_event:function(event1,event2)
			{

				//Mover evento reemplazado al final.

				

				//console.log(this.editor_events);
				//console.log(event1);
				var index = this.editor_events.indexOf(event1);
				this.editor_events[index] = event2;
				//console.log(this.editor_events[index]);					
			},
			remove_event:function(event){

				var index = this.editor_events.indexOf(event);

				this.editor_events.splice(index, 1);

				//delete this.editor_events[index];
			}
		},
		states:{
			save_state:function(){ 

			},
			previos_state:function(){
			

			},
			next_state:function(){
			

			}
		},
		actions:{ 
			replace_image:function(element){
			
	            //get last selected_image 

	            element_to_edit = html_control.events.last_event_by({type:'image'});
	            
	            $(element_to_edit.ref_element).attr("src",element[0].currentSrc);		            
				
	            html_control.events.remove_event(element_to_edit);
			},
			cancel_last_operation:function(event){
				html_control.events.remove_event(event);
			},
			insert_block_over:function(element_of_reference,element_to_add){
				//get last_ bloque to reference
				//process to add styles
				copy_styles_to_web_proyect(element_to_add);
				console.log("insert over");
				
				if(element_to_add.className.includes("program"))
				{
					let generated_html = set_program_ready(element_to_add);
					$(element_of_reference).before(generated_html);					
					return true;
				}

				$(element_of_reference).before($(element_to_add));
			},
			insert_block_below:function(element_of_reference,element_to_add){
				//get last_ bloque to reference
				//process to add styles
				copy_styles_to_web_proyect(element_to_add);
				console.log("insert below");
				
				if(element_to_add.className.includes("program"))
				{
					let generated_html = set_program_ready(element_to_add);
					$(element_of_reference).after(generated_html);					
					return true;
				}

				$(element_of_reference).after($(element_to_add));
			},
			replace_block:function(element_of_reference,element_to_add){
				//get last_ bloque to reference
				//process to add styles
				copy_styles_to_web_proyect(element_to_add);
				console.log("replacement");
				
				if(element_to_add.className.includes("program"))
				{
					let generated_html = set_program_ready(element_to_add);
					$(element_of_reference).html(generated_html);					
					return true;
				}

				$(element_of_reference).html($(element_to_add));
			}

		}

	}

	function set_program_ready(element_to_check)
	{
		let generated_html = "";
		if(element_to_check.className.includes("calendar"))
		{
			if(editor_html.find(".calendar_program_tags").length == 0)
			{ 	
				editor_html.find("head link").last().after("<link  class='calendar_program_tags' href='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css' rel='stylesheet' />");
				editor_html.find("head link").last().after("<link class='calendar_program_tags' href='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.print.min.css' rel='stylesheet' media='print' />");
				editor_html.find("head link").last().after("<script class='calendar_program_tags' src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js'></script>");
				editor_html.find("head script").last().after("<script class='calendar_program_tags' src='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js'></script>");
				editor_html.find("head script").last().after("<script class='calendar_program_tags' src='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/locale-all.js'></script>");
			}	
			generated_html += "<div class='content-block program calendar'>"
			generated_html += "<div id='calendar'></div>";
			generated_html += "</div>";


			swal({			
			  title: decode_utf8('¡Para visualizar los cambios debe guardar el documento!'),
			  text: 'Esto guardara todos los cambios que halla hecho, sin embargo puede guardar mas tarde',
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Si, !adelante!'			
			}).then((result) => {
			  	if (result.value)
			  	{
					save_process("normal").then(function(response){
						console.log("Guardado normal");
						//$('#editor_frame').attr('src', $('#editor_frame').attr('src'));
						let iframe = document.getElementById("editor_frame"); iframe.src = document.getElementById("editor_frame").contentWindow.location.pathname+"?reload=true";
					});
				}	
			});	
		}

		return generated_html;
	}


	function copy_styles_to_web_proyect(element_to_check){	
		 
		/*if(element_to_check.className.includes("program"))
		{
			set_program_ready(element_to_check);
		}*/
		
		console.log(element_to_check.className);
		console.log(styles_included);

		if(element_to_check.className == "fdb-block")
		{
			generate_styles_to_web_proyect("fdb-block");	
						
		}
		if(element_to_check.className.includes("content-block"))
		{
			let  referenced_array = element_to_check.className.split(" ");
			
			let  referenced_style = referenced_array[1];

			console.log(referenced_style);

			generate_styles_to_web_proyect(referenced_style);			
			 
		}



		//console.log(window.location);
	}


	function generate_styles_to_web_proyect(referenced_style)
	{

		if(referenced_style == "fdb-block" && styles_included.indexOf('css/froala_blocks.css') == -1)
		{					
			let request = getScope("#StyleCtrl").copy_stylesheets({style:"fdb-block",folder:proyect_folder});
			request.then(function(response){
									
				//console.log(document.getElementById("editor_frame").contentWindow.location);
				if(editor_html.find(".custom_styles").length == 0)
				{
					console.log("new tag added");
					editor_html.find("head link").last().after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/froala_blocks.css">');
				}
				else
				{
					console.log("new tag added");
					editor_html.find(".custom_styles").last().after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/froala_blocks.css">');
				}	
				
				styles_included.push('css/froala_blocks.css');
				dynamic_styles_for_editor();

			});
			
		}



		if(styles_included.indexOf('css/'+referenced_style+".css") == -1)
		{					
			let request = getScope("#StyleCtrl").copy_stylesheets({style:"content-block",folder:proyect_folder,reference:referenced_style});
			request.then(function(response){

				if(response.data.status == 2)
				{
					swal(
					  decode_utf8('¡Oops!'),
					  'El estilo no existe',
					  'question'
					);

					return;
				}

				if(referenced_style == "virb")
				{
					console.log("new virb tag added");
					if(editor_html.find(".custom_styles").length > 0)
					{
						editor_html.find(".custom_styles").last().after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/template_virb.css">');
						editor_html.find(".custom_styles").last().after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/template_virb.min.css">');
					}
					else
					{
						editor_html.find("head link").last().after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/template_virb.css">');
						editor_html.find("head link").last().after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/template_virb.min.css">');							
					}	

					editor_html.find("body").after('<script  type="text/javascript" class="custom_scripts" href="js/template_virbmain.min.js">');
					editor_html.find("body").after('<script  type="text/javascript" class="custom_scripts" href="js/template_virbscripts.min.js">');
				}
				else
				{ 	
					//console.log(document.getElementById("editor_frame").contentWindow.location);
					console.log("new tag added");

					console.log('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/'+referenced_style+'.css>');

					if(editor_html.find(".custom_styles").length > 0)
					{
						editor_html.find(".custom_styles").last().after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/'+referenced_style+'.css">');
					}
					else
					{
						editor_html.find("head").after('<link type="text/css" rel="stylesheet" class="custom_styles" href="css/'+referenced_style+'.css">');
					}	

					console.log(response.data);



					if(response.data.script_tag)
					{
						console.log("add js script");
						editor_html.find("body").after('<script  type="text/javascript" class="custom_scripts" src="js/program_'+referenced_style+'.js">');
					}

				}

				styles_included.push('css/'+referenced_style+".css");
				dynamic_styles_for_editor();

			});
				
		}
	}


	function dynamic_styles_for_editor(){
		//load editor frame stylesheets in a reference array object.
		let doc = document.getElementById("editor_frame").contentDocument;
		//console.log(doc.styleSheets); 

		  for (sheet in doc.styleSheets) {
			    	
		    if(doc.styleSheets[sheet].ownerNode != null){ 
			    if(doc.styleSheets[sheet].ownerNode.className == "custom_styles")
			    {						 
			    	//console.log(doc.styleSheets[sheet]);   	
			    	let generated_css = "";
			    	for (rule in doc.styleSheets[sheet].rules) {
			    		if(doc.styleSheets[sheet].rules[rule].cssText)
			    		{ 	
			    			generated_css +=  doc.styleSheets[sheet].rules[rule].cssText+"\n";
			    		}
			    	}
			    	
			    	//console.log(doc.styleSheets[sheet]);
			    	
			    	let css_to_observe = {stylesheet:doc.styleSheets[sheet],generated_css:generated_css,route:remove_dns_server(doc.styleSheets[sheet].href)};			    	
			    	
			    	let add_to_css = true;

			    	css_to_generate.forEach(function(css){
			    		//console.log(css);
			    		if(css_to_observe.route == css.route)
			    		{
			    			add_to_css = false;
			    		}
			    	});
			    	
			    	if(add_to_css)
			    	{ 	
			    		css_to_generate.push(css_to_observe);	
			    	}

			    	
			    	
			    }
		    }
		}

		//console.log(css_to_generate);
	}


	function get_image_options()
	{
		let image_events = html_control.events.last_event_by({type:'image'});
		let options = {};
		
		if(image_events == null)
		{
			options =    {
	        	"watch_images": {name: "Ver imagenes", icon: "fa-eye"},
	        	"insert_image": {name: "Insertar imagen", icon: "fa-edit"}            		            
	        };	
		}
		else
		{
			options =    {		        	
	            "change_image": {name: "Cambiar Imagen", icon: "fa-file"},
	            "transform":{name: decode_utf8("Transformar"), icon: "fa-star"},
	            "delete":{name: decode_utf8("Eliminar"), icon: "fa-minus"},
	            "cancel_operation": {name: decode_utf8("Cancelar operación"), icon: "fa-times-circle"}            		            
	        };	
		}

		return options;			    
	}


	function get_text_options()
	{
		let text_events = html_control.events.last_event_by({type:'text'});
		let options = {};
		if(text_events != null)
		{
			options =  {
				"transform":{name: decode_utf8("Transformar"), icon: "fa-star"},
				"delete":{name: decode_utf8("Eliminar"), icon: "fa-minus"},	        	
	        	"cancel_operation": {name: decode_utf8("Cancelar operación"), icon: "fa-times-circle"}           
	        };
		}
		else
		{
			options = {
				"insert_text":{name: decode_utf8("Insertar nuevo texto"), icon: "fa-edit"}
			}
		}

		return options;
	}

	function get_block_options()
	{
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
		return options;
	}


	function get_style_options()
	{
		options = {
			"insert_style": {name: decode_utf8("Insertar estilo"), icon: "fa-edit"}
			//"insert_bootstrap": {name: decode_utf8("Insertar Bootstrap"), icon: "fa-edit"},
			//"insert_fontawesome": {name: decode_utf8("Insertar libreria de Iconos"), icon: "fa-edit"}
		}
		return options;
	}

	let context_menu_image_process =  function(key, options) {
		let image_scope = getScope("#modalYT");
        let  m = "clicked: " + key;
        console.log(m);
        //window.console && console.log(m) || alert(m);
        let event_img = html_control.events.last_event_by({type:'image'});
        switch(key)
        {
        	case "watch_images":
			    	$("#modalYT").modal("show");
			    	image_scope.load_images();
		        break;

		    case "change_image":
		    	   $("#modalYT").modal("show");
			       image_scope.ready_change_image = true;
			       image_scope.load_images();
		        break;

		    case "transform":		    	   
		    	   let image = html_control.events.last_event_by({type:'image'});
				   interactjs_editor_frame_process(image);	        		
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
					$(event_img.ref_element).remove();	
		    	  	html_control.events.remove_event(event_img);
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

        switch(key)
        {
			case "cancel_operation":							
				 
				if(already_exist)
				{
					$(already_exist.ref_element).removeAttr("contenteditable");
					html_control.actions.cancel_last_operation(already_exist);
				}

				break;
			case "transform":
				if(already_exist)
				{
					interactjs_editor_frame_process(already_exist);
				}	
				break;
			case "delete":
				if(already_exist)
				{
					$(already_exist.ref_element).remove();	
		    	  	html_control.events.remove_event(already_exist);
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
	    		
	    		 let already_exist = html_control.events.last_event_by({acc:"panel_that_modify"});

				 let register_event = new editor_event(reference.ref_element.cloneNode(true),"panel_that_modify","block");
				 
				 if(already_exist)
				 {
				  	 	html_control.events.replace_event(already_exist,register_event);
				 } 		
				 else
				 {
			  	 	html_control.events.add_event(register_event);	
				 }

				 break;	

		    case "delete":

		    	  if(reference != null)
		    	  { 	
		    	  	$(reference.ref_element).remove();	
		    	  	html_control.events.remove_event(reference);	
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

			default:
			break;
		}
    }
	

	//js related to events //
	$(document).ready(function() {

		//console.log(document.styleSheets);

		window.current_event = {event:"none"};


		//constante de acceso a programa en angular js.

			$('#editor_frame').on('load',function (){
		   	
			   	editor_html = $(this).contents();

			   	//

			    //console.log(document.getElementById("editor_frame").contentWindow.location);

				if(document.getElementById("editor_frame").contentWindow.location.pathname != $("#url_name").val())
				{
					$("#url_name").val(document.getElementById("editor_frame").contentWindow.location.pathname);
				}			    

			   	proyect_folder = get_folder_proyect(document.getElementById("editor_frame").contentWindow.location.pathname);

			   	dynamic_styles_for_editor();

			   	//console.log(document.styleSheets);
			
				//var count = 0;

				let boostrap_ver = editor_html.find("#bootstrap_style");
				

				if(boostrap_ver.length != 0)
				{  	
					if(boostrap_ver.attr("href").includes("3.3.7"))
					{
						document.querySelector("#bootstrap_version").value = 'b_3.7';
					}

					if(boostrap_ver.attr("href").includes("4.0.0"))
					{
						document.querySelector("#bootstrap_version").value = 'b_4.0';	
					}
				}		

				function editor_body_events()
				{ 
					editor_html.find("*").click(function() {
							 //console.log("click");
							 if(window.getSelection){				       
							 	//Conseguir información por selección.
						        /*u_sel = editor_html[0].getSelection();				      
						     	console.log(this);
						      	console.log(u_sel);
						      	console.log(count);
						      	count++;*/
						     }
					});

					editor_html.find(".content-block,.fdb-block").contextmenu( makeDoubleRightClickHandler( function(e) {
					  	 e.preventDefault();						 
					  	 
						 let already_exist = html_control.events.last_event_by({acc:"panel_of_reference"});

						 let register_event = new editor_event(this,"panel_of_reference","block");
						 
						 if(already_exist)
						 {
	 				  	 	html_control.events.replace_event(already_exist,register_event);	 				  	 	
						 } 		
						 else
						 {
					  	 	html_control.events.add_event(register_event);	
						 }						 					  	 				  	 
					  	 
						 
					  	 $('.context-menu-three').contextMenu();

					}));

					editor_html.find("li,button,a").contextmenu(function(e) {
					  	
					  	console.log($(this));

					});


					editor_html.find("h1,h2,h3,h4,span,p").contextmenu(function(e) {					

						e.preventDefault();
						//console.log(this);

						let already_exist = html_control.events.last_event_by({acc:"selected_text"});

						let register_event = new editor_event(this,"selected_text","text");
						 
						if(already_exist)
						{
							$(already_exist.ref_element).removeAttr("contenteditable");
	 				  	 	html_control.events.replace_event(already_exist,register_event);
						} 		
						else
						{
					  	 	html_control.events.add_event(register_event);	
						} 
						 
					  	
						$(this).attr('contenteditable','true');

						$(this).focus();

						$('.context-menu-two').contextMenu();					
						
						/*if($(this).text().trim() == 'OK') { 
				           e.preventDefault();
				           alert("Aqui hay texto");
				           window.current_event = {event:"image_clicked"};
					  	   window.current_element_to_edit = {element:this};
				       	   console.log(this);	
				       	   $('.context-menu-two').contextMenu();	
				       }*/
					});

				
					editor_html.find("img").contextmenu(function(e) {
					  	 //e.preventDefault();
					  	 
					  	 let event = new editor_event(this,"image_clicked","image",1);
						  	 

					  	 html_control.events.add_event(event);


					  	 $('.context-menu-one').contextMenu();				  	   
					});

				}
		        
				editor_html.find("body").debouncedDNI(  function() {

					//console.log("editor body changed");

					editor_body_events();
				});	
			    //console.log('ok frame');
			    editor_body_events();			

		});



		$('#asistant_frame').on('load',function (){
			asistant_html = $(this).contents();
			

			asistant_html.find("#playground").debouncedDNI(  function() {
				
				
					//console.log("playground changed");
				
				asistant_html.find(".fdb-block").contextmenu(function(e) {
				  	 e.preventDefault();				  	
				  	 //console.log(getComputedStyle(this)); 
			  	 	 //console.log("right clicked fdbblock");

				  	 let already_exist = html_control.events.last_event_by({acc:"panel_that_modify"});

					 let register_event = new editor_event(this.cloneNode(true),"panel_that_modify","block");
					 
					 if(already_exist)
					 {
 				  	 	html_control.events.replace_event(already_exist,register_event);
					 } 		
					 else
					 {
				  	 	html_control.events.add_event(register_event);	
					 }


				  	 $('.context-menu-three').contextMenu();
					 
				});					
				
				 
			});

			asistant_html.find("#playground").on('load',function (){
				console.log("iframe inside iframe");
				inframe_inception = $(this).contents();
				
				inframe_inception.find(".content-block").contextmenu(function(e) {
				  	 e.preventDefault();
				  	 console.log("right clicked inception");
				  	 
				  	 let already_exist = html_control.events.last_event_by({acc:"panel_that_modify"});

					 let register_event = new editor_event(this.cloneNode(true),"panel_that_modify","block");
					 
					 if(already_exist)
					 {
 				  	 	html_control.events.replace_event(already_exist,register_event);
					 } 		
					 else
					 {
				  	 	html_control.events.add_event(register_event);	
					 }	

				  	 $('.context-menu-three').contextMenu();				  		   
				});
			});				
		});	


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

	    //Menu for Blocks
	 	var styles_menu =  new context_menu_object('.context-menu-four',context_menu_style_process,get_style_options);
		$.contextMenu(styles_menu);
	    //-------/


	});

//Transformaciónes

	function add_script_to_transform()
	{
		editor_html.find("body").append('<script class="interactjs" src="/Framework/Core/js/interact.js"><\/script>');
		editor_html.find("body").append('<script class="interactjs" src="/Framework/Core/js/basic_drag_and_drop.js"><\/script>');
	}

	function interactjs_editor_frame_process(html_event)
	{
		 		    	   
		if(editor_html.find(".interactjs").length == 0)
		{
			swal({			
			  title: decode_utf8('¿Esta seguro/a?'),
			  text: decode_utf8('¡Para hacer un elemento transformable se debe configurar el documento!,este proceso lo reabrira con componentes nuevos'),
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Si, !adelante!'			
			}).then((result) => {
			  	if (result.value)
			  	{
			  		console.log(html_event.ref_element.className);
			  		if(!html_event.ref_element.className.includes("resize-drag"))
			  		{  
			  			$(html_event.ref_element).addClass("resize-drag");
			  		}
			  			
			  		add_script_to_transform();
			  		save_process("interact").then(function(response){
						console.log("Interact configurado");
						//$('#editor_frame').attr('src', $('#editor_frame').attr('src'));
						let iframe = document.getElementById("editor_frame"); iframe.src = document.getElementById("editor_frame").contentWindow.location.pathname+"?reload=true";
					});
		  		}
		  		else
		  		{
		  			html_control.events.remove_event(html_event);
		  		}
		  	});
			
		}
		else{
			if(!html_event.ref_element.className.includes("resize-drag"))
	  		{  
	  			$(html_event.ref_element).addClass("resize-drag");
	  		}
		}
	}