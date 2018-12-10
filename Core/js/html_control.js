var control_cicle = 0;

//var css_to_generate = [];

var editor_html;

var asistant_html;

var styles_included = [];

var proyect_folder;

function test_css_service()
{ 

	let styles_to_process = editor_html.find(".custom_styles");
	
	swal({			
	  title: decode_utf8('¿Esta seguro de guardar?'),
	  text: 'Esto modificara los archivos css',
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Si, !adelante!'			
	}).then((result) => {
	  	if (result.value)
	  	{

	  	  	if(styles_to_process.length == 0)
			{
				swal(
				  decode_utf8('¡Oops!'),
				  'Aun no hay estilos que procesar',
				  'question'
				);
			}
			else
			{
				//console.log(styles_to_process);
				for(let k in styles_to_process)
				{
					if(styles_to_process[k].sheet != null)
					{
						//console.log(styles_to_process[k].sheet);
						let new_css_test = "";
						for (rule in styles_to_process[k].sheet.rules) {
							if(styles_to_process[k].sheet.rules[rule].cssText)
							{ 	
								new_css_test +=  styles_to_process[k].sheet.rules[rule].cssText+"\n";
							}
						}
						
						//console.log(remove_dns_server(styles_to_process[k].sheet.href));

						getScope("#StyleCtrl").modify_styles({css:new_css_test,route:remove_dns_server(styles_to_process[k].sheet.href)});


						swal(
						  decode_utf8('¡Bien!'),
						  'Se han modificado los css',
						  'success'
						);
				    }
				}				
				
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


	function editor_property(name,label,input,dataset,default_value,callback)
	{
		this.name = name;
		this.label = label;
		this.input = input;
		this.dataset = dataset;
		this.default_value = default_value;
		this.callback = callback;
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
			insert_default_content:function()
			{

				swal({			
				  title: decode_utf8('¿Esta seguro/a?'),
				  text: decode_utf8('Esto va a insertar este contenido en el lugar seleccionado'),
				  type: 'warning',
				  showCancelButton: true,
				  confirmButtonColor: '#3085d6',
				  cancelButtonColor: '#d33',
				  confirmButtonText: 'Si, !adelante!'			
				}).then((result) => {					
					if(result.value)
					{

						if(editor_html.find("#default_blog_posts").length == 0)
						{
							let request = getScope("#StyleCtrl").add_custom_file_from_core(proyect_folder,"css/post_styles.css");
							request.then(function(response){
								editor_html.find("head link").last().after('<link rel="stylesheet" id="default_blog_posts" class="custom_styles" href="css/post_styles.css">');	
							});
						}

						let event_to_add_content = html_control.events.last_event_by({acc:"reference_to_add_default_content"});
	            
						//console.log(event_to_add_content.ref_element);

						//console.log($("#default_content_body .tab-pane.active").html());
					
						$(event_to_add_content.ref_element).html($("#default_content_body .tab-pane.active").html());

						html_control.events.remove_event(event_to_add_content);

						$("#modaldefaultContent").modal("hide");
					}
				});

				
			},
			insert_image:function(element){
				if(editor_html!=null)
				{
					let image_url = String(element[0].currentSrc.toString());	            

	            	image_url = image_url.replace(window.location.origin,"");

	            	image_url = image_url.replace("/"+proyect_folder+"/","");
					
					editor_html.find("body").append("<img class='img img-responsive arbitrary_image' src='"+image_url+"'></img>");
					
				}
				else{
					swal(
					  decode_utf8('¡Oops!'),
					  'Aun no hay un documento html para este proceso',
					  'question'
					)	
				}
			}, 
			replace_image:function(element){
			
	            //get last selected_image 

	            //console.log(proyect_folder);

	            //console.log(element[0].currentSrc);

	            //console.log(window.location);

	            let new_url = String(element[0].currentSrc.toString());	            

	            new_url = new_url.replace(window.location.origin,"");

	            new_url = new_url.replace("/"+proyect_folder+"/","");

	            //console.log(new_url);

	            element_to_edit = html_control.events.last_event_by({type:'image'});
	            
	            $(element_to_edit.ref_element).attr("src",new_url);		            
				
	            html_control.events.remove_event(element_to_edit);
			},
			change_page_ico:function(element){

				 let new_url = String(element[0].currentSrc.toString());	            

	            new_url = new_url.replace(window.location.origin,"");

	            new_url = new_url.replace("/"+proyect_folder+"/","");

				editor_html.find('link[rel="shortcut icon"]').attr('href', new_url);
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
					$(element_of_reference).replaceWith(generated_html);					
					return true;
				}

				$(element_of_reference).replaceWith($(element_to_add));
			},
			modify_link:function(ref_element)
			{
				tocallback = function() {						
						let new_data = $("input[name='inner_href']").val();
						$(ref_element).find("a").attr('href',new_data)						
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);

					};


				let ep = new editor_property("inner_href","Modificar enlace","text",null,$(ref_element).find("a").attr('href'),tocallback);
				return ep;	 
				
			},
			modify_text:function(ref_element){

				let tocallback = function() {

						//console.log($("input[name='inner_text']").val());
						let new_data = $("input[name='inner_text']").val();
						let copy_text = String($(ref_element)[0].innerText.toString());

						$(ref_element)[0].innerHTML = $(ref_element)[0].innerHTML.replace("&nbsp;","");
						$(ref_element)[0].innerHTML = $(ref_element)[0].innerHTML.replace(copy_text.trim(),new_data);
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};
					
					let ep = new editor_property("inner_text","Modificar texto","text",null,$(ref_element).text(),tocallback);

					return ep;
					
			},
			change_text_alignment:function(ref_element){
				
				//console.log(ref_element);

				let tocallback = function() {

						//console.log($("input[name='inner_text']").val());
						/*if(!ref_element.className.includes("resize-drag"))
						{
							$(ref_element).addClass("resize-drag");
						}*/						

						$(ref_element).css("text-align",$("select[name='inner_alignment']").val());												
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};

					let dataset = [{option:"izquierda",value:"left"},{option:"derecha",value:"right"},{option:"centro",value:"center"},{option:"justificado",value:"justify"}];
					
					let ep = new editor_property("inner_alignment",decode_utf8("Selecciona alineación de texto"),"select",dataset,null,tocallback);

					return ep;
			},
			change_font_size:function(ref_element){
				
				//console.log(ref_element);

					let tocallback = function() {											

						$(ref_element).css("font-size",$("input[name='inner_font_size']").val());												
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};
					
					let ep = new editor_property("inner_font_size",decode_utf8("Selecciona el tamaño del texto"),"text",null,$(ref_element).css("font-size"),tocallback);

					return ep;
			},
			change_font_weight:function(ref_element)
			{
					let tocallback = function() {											

						$(ref_element).css("font-weight",$("select[name='inner_font_weight']").val());												
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};
					
					let dataset = [{option:"Normal",value:"normal"},{option:"Bold",value:"bold"},{option:"Bolder",value:"bolder"},{option:"Lighter",value:"lighter"}];
					
					let ep = new editor_property("inner_font_weight",decode_utf8("Selecciona la anchura de la letra"),"select",dataset,null,tocallback);

					return ep;
			},
			change_font_style:function(ref_element)
			{
					let tocallback = function() {											

						$(ref_element).css("font-style",$("select[name='inner_font_style']").val());												
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};
					
					let dataset = [{option:"Normal",value:"normal"},{option:"Italic",value:"italic"},{option:"Oblique",value:"oblique"}];
					
					let ep = new editor_property("inner_font_style",decode_utf8("Selecciona El estilo de letra"),"select",dataset,null,tocallback);

					return ep;
			},
			change_font_family:function(ref_element)
			{
					let tocallback = function() {											

						$(ref_element).css("font-family",$("select[name='inner_font_family']").val());												
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};
					
					let dataset = [{option:"Cursive",value:"cursive"},{option:"Fantasy",value:"fantasy"},{option:"Monospace",value:"monospace"},{option:"None",value:"none"},{option:"Serif",value:"serif"},{option:"Sans Serif",value:"sans-serif"}];
					
					let ep = new editor_property("inner_font_style",decode_utf8("Selecciona El tipo de fuente"),"select",dataset,null,tocallback);

					return ep;
			},
			modify_padding:function(ref_element){
				let tocallback = function() {											

						$(ref_element).css("padding",$("input[name='inner_padding_size']").val());												
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};
					
				let ep = new editor_property("inner_padding_size",decode_utf8("Selecciona el tamaño del padding en % Nota:'No se recomienda modificar el tamaño con transformar ya que provocaria un conflicto' "),"text",null,$(ref_element).css("padding"),tocallback);

				return ep;	
			},
			change_classNames:function(ref_element)
			{
				let tocallback = function() {
						
					ref_element.className = $("input[name='inner_classname']").val(); 
					swal(
					  decode_utf8('¡Bien!'),
					  'Se ha modificado el parametro',
					  'success'
					);
				};

				//let dataset = [{option:"On",value:"true"},{option:"Off",value:"false"}];
				
				let ep = new editor_property("inner_classname",decode_utf8("Clases"),"text",null,ref_element.className,tocallback);

				return ep;
			},
			form_as_link:function(ref_element)
			{
				tocallback = function() {						
						let new_data = $("input[name='inner_action']").val();
						$(ref_element).attr('action',new_data)						
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);

					};


				let ep = new editor_property("inner_action","Modificar enlace","text",null,$(ref_element).attr('action'),tocallback);
				return ep;	
			},
			set_data_interval_carousel:function(ref_element){
				let tocallback = function() {
						
						$(ref_element).attr("data-interval",$("input[name='data_interval']").val());												
					
						swal(
						  decode_utf8('¡Bien!'),
						  'Se ha modificado el parametro',
						  'success'
						);
					};

					//let dataset = [{option:"On",value:"true"},{option:"Off",value:"false"}];
					
					let ep = new editor_property("data_interval",decode_utf8("Selecciona el tiempo, Nota: Toca recargar para ver los cambios , escriba false para detener el slider"),"text",null,$(ref_element).attr("data-interval"),tocallback);

					return ep;
			},
			change_background_image:function(element){
				let background_image =  html_control.events.last_event_by({acc:'background_image_selected'});
				let imageUrl = String(element[0].currentSrc.toString());
	            imageUrl = imageUrl.replace(window.location.origin,"");
	            imageUrl = imageUrl.replace("/"+proyect_folder+"/","");
				$(background_image.ref_element).css('background-image', 'url("' + imageUrl + '")');
			},
			assoc_parent:function(element)
			{
				$(element.ref_element).removeClass("resize-drag");
				console.log($(element.ref_element).parent());
				$(element.ref_element).parent().addClass("resize-drag");
				//console.log(element);
			},
			delete_html_element:function(element,callback=false)
			{
				swal({			
				  title: decode_utf8('¿Esta seguro/a?'),
				  text: decode_utf8('Va a eliminar un elemento de la página'),
				  type: 'warning',
				  showCancelButton: true,
				  confirmButtonColor: '#3085d6',
				  cancelButtonColor: '#d33',
				  confirmButtonText: 'Si, !adelante!'			
				}).then((result) => {					
					if(result.value)
					{ 	
						$(element.ref_element).remove();
						html_control.events.remove_event(element);
						if(callback)
						{
							callback();
						}
					}
				});
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
		//console.log(styles_included);

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
				//dynamic_styles_for_editor();

			});
			
		}

		console.log('css/'+referenced_style+".css");

		console.log(styles_included);

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

					editor_html.find("body").after('<script  type="text/javascript" class="custom_scripts" src="js/template_virbmain.min.js">');
					editor_html.find("body").after('<script  type="text/javascript" class="custom_scripts" src="js/template_virbscripts.min.js">');
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
				//dynamic_styles_for_editor();

			});
				
		}
	}


	function dynamic_styles_for_editor(){
		//load editor frame stylesheets in a reference array object.
		let doc = document.getElementById("editor_frame").contentDocument;	  
		

		  for (sheet in doc.styleSheets) {
			    	
		    if(doc.styleSheets[sheet].ownerNode != null){ 


				if(doc.styleSheets[sheet].ownerNode.href == null)
				{
					//Prevent error when page load fail
					return;
				}


		    	// If is on server should edit

		    	if(doc.styleSheets[sheet].ownerNode.href.includes(window.location.origin))
		    	{	
		    		if(!doc.styleSheets[sheet].ownerNode.href.includes("bootstrap") && !doc.styleSheets[sheet].ownerNode.href.includes("font-awesome"))
		    		{
		    			if(!doc.styleSheets[sheet].ownerNode.className.includes("custom_styles"))
		    			{
		    				doc.styleSheets[sheet].ownerNode.classList.add("custom_styles");
		    				//console.log("Estilo interno a agregar la etiqueta");
		    			} 
		    			
		    		}
		    	}

			    if(doc.styleSheets[sheet].ownerNode.className == "custom_styles")
			    {		    

			    	//Process for keep track of what editable css had been already saved in proyect

			    	let referenced_url = String(doc.styleSheets[sheet].ownerNode.href);	            

	            	referenced_url = referenced_url.replace(window.location.origin,"");

	            	referenced_url = referenced_url.replace("/"+proyect_folder+"/","");
					
					//console.log(referenced_url);
					
					if(styles_included.indexOf(referenced_url) == -1)
					{
						styles_included.push(referenced_url);			    	
			    	}
			    }
		    }
		}
		//console.log(styles_included);
		//console.log(css_to_generate);
	}

	function context_menu_highlight(element)
	{
		$(".context_menu_active").removeClass("context_menu_active");
		$(element).addClass("context_menu_active");
	}

	function get_image_options()
	{
		let image_events = html_control.events.last_event_by({acc:'image_clicked'});
		let background_image =  html_control.events.last_event_by({acc:'background_image_selected'});
		let options = {};
		
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
			options["transform"] = {name: decode_utf8("Transformar"), icon: "fa-star"};
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
			options =  {
				"transform":{name: decode_utf8("Transformar"), icon: "fa-star"},
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
		options = {
			"transform":{name: decode_utf8("Transformar"), icon: "fa-star"},
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
		options = {
			"transform":{name: decode_utf8("Transformar"), icon: "fa-star"},
			"properties":{name: decode_utf8("Modificar propiedades del boton"), icon: "fa-edit"}			
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
						$(already_exist).replaceWith(copy);
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
	

	//js related to events //
	$(document).ready(function() {

		//console.log(document.styleSheets);

		init = function(){ 

			let current_url = new URL(window.location);
			let page_parameter = current_url.searchParams.get("page");
			if(page_parameter != null)
			{
				$("#url_name").val(page_parameter);
				search_html();
			}

		}

		init();


		window.current_event = {event:"none"};


		//constante de acceso a programa en angular js.

			$('#editor_frame').on('load',function (){
		   	
			   	styles_included = [];

			   	editor_html = $(this).contents();

			   	//

			    //console.log(document.getElementById("editor_frame").contentWindow.location);

				if(document.getElementById("editor_frame").contentWindow.location.pathname != $("#url_name").val())
				{
					$("#url_name").val(document.getElementById("editor_frame").contentWindow.location.pathname);
					search_html();
				}			    

			   	proyect_folder = get_folder_proyect(document.getElementById("editor_frame").contentWindow.location.pathname);

			   	//let doc = document.getElementById("editor_frame").contentDocument;

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
							 	//la selección no funciona
							 	//console.log(this);				       
							 	//Conseguir información por selección.
						        /*u_sel = editor_html[0].getSelection();				      
						     	console.log(this);
						      	console.log(u_sel);
						      	console.log(count);
						      	count++;*/
						     }
					});	


					
					editor_html.find(".program.calendar").contextmenu(function(e) {					

						//Programa de calendario

						//console.log(this);

						//e.preventDefault();

						if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}

					  	console.log("Selecciono calendario");					  	

					  	let already_exist = html_control.events.last_event_by({acc:"calendar_selected"});

						//let register_event = new editor_event($(this).children("div").first().get(0),"calendar_selected","program");

						let register_event = new editor_event(this,"calendar_selected","program");
						 
						if(already_exist)
						{
	 				  	 	html_control.events.replace_event(already_exist,register_event);	 				  	 	
						} 		
						else
						{
					  	 	html_control.events.add_event(register_event);	
						}						 					  	 				  	 
					  	 
					  	if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  	 	$('.context-menu-five').contextMenu();
					  	}			


					  	e.stopPropagation();
    					e.stopImmediatePropagation();						
					});

					editor_html.find(".to_insert_default_content").contextmenu(function(e) {	
						
						if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}

					  	already_exist = html_control.events.last_event_by({acc:"reference_to_add_default_content"});

						register_event = new editor_event(this,"reference_to_add_default_content","program");
						 
						if(already_exist)
						{
						  	 	html_control.events.replace_event(already_exist,register_event);
						} 		
						else
						{
					  	 	html_control.events.add_event(register_event);	
						}
						

						if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  	 	$('.context-menu-five').contextMenu();
					  	}  	
					
					});					

					editor_html.find(".content-block,.fdb-block").contextmenu( makeDoubleRightClickHandler( function(e) {
					  	
					  	console.log("here");

					  	if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}


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
					  	 
					  	if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  	 	$('.context-menu-three').contextMenu();
					  	}					 
					  	 

					}));				

				
					editor_html.find("img").contextmenu(function(e) {
					 	 //e.preventDefault();

					 	 if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}
					  	 
					  	 let event = new editor_event(this,"image_clicked","image",1);
						  	 

					  	 html_control.events.add_event(event);

					  	 console.log(document.querySelector("input[name='hide_menus']").checked);

					  	 if(!document.querySelector("input[name='hide_menus']").checked)
					  	 {
					  	 	$('.context-menu-one').contextMenu();
					  	 	e.stopPropagation();
    						e.stopImmediatePropagation();
					  	 }
					  	 				  	   
					});

					editor_html.find("li").contextmenu(function(e) {
					  	
						let already_exist;

						let register_event;

						if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}
						
					  	if($(this).parent("ul").get(0))
					  	{
					  		already_exist = html_control.events.last_event_by({acc:"list_of_reference"});

							register_event = new editor_event(this,"list_of_reference","list");
							 
							if(already_exist)
							{							
		 				  	 	html_control.events.replace_event(already_exist,register_event);
							} 		
							else
							{
						  	 	html_control.events.add_event(register_event);	
							}				
					  	}


						//$(this).attr('contenteditable','true');						

						if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}

					  	already_exist = html_control.events.last_event_by({acc:"last_li_selected"});

						register_event = new editor_event(this,"last_li_selected","component_list");
						 
						if(already_exist)
						{							
	 				  	 	html_control.events.replace_event(already_exist,register_event);
						} 		
						else
						{
					  	 	html_control.events.add_event(register_event);	
						}				
											
						//e.stopPropagation();

						if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  	 	$('.context-menu-six').contextMenu();
					  	 	e.stopPropagation();
    						e.stopImmediatePropagation();
					  	 	
					  	}
					});

					/*editor_html.find("ul").contextmenu(function(e) {
					  	
					  	console.log(this);

					  	//console.log($(this));

					  	if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}

					  	let already_exist = html_control.events.last_event_by({acc:"list_of_reference"});

						let register_event = new editor_event(this,"list_of_reference","list");
						 
						if(already_exist)
						{							
	 				  	 	html_control.events.replace_event(already_exist,register_event);
						} 		
						else
						{
					  	 	html_control.events.add_event(register_event);	
						}						 
					  	
						if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  	 	$('.context-menu-six').contextMenu();
					  	 	//e.stopPropagation();
    						//e.stopImmediatePropagation();
					  	 	
					  	}
											
						

					});*/

					

					editor_html.find("button").contextmenu(function(e) {				  	
					  	

					  	if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}

					  	let already_exist = html_control.events.last_event_by({acc:"button_of_reference"});

						let register_event = new editor_event(this,"button_of_reference","button");
						 
						if(already_exist)
						{							
	 				  	 	html_control.events.replace_event(already_exist,register_event);
						} 		
						else
						{
					  	 	html_control.events.add_event(register_event);	
						}			  	
						
						if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  		e.stopPropagation();
    						e.stopImmediatePropagation();
					  	 	$('.context-menu-seven').contextMenu();
					  	}

						//$(this).attr('contenteditable','true');

						$(this).blur(function(){
							  //console.log("onblur button");
							  //$(this).attr('contenteditable','false');								
						});					
						

					});

					editor_html.find("h1,h2,h3,h4,span,p").contextmenu(function(e) {					

						//console.log(this);

						//e.preventDefault();

						if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}						

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

						if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  	 	$('.context-menu-two').contextMenu();

					  	 	//e.stopPropagation();
    						//e.stopImmediatePropagation();
					  	}

											
						
						/*if($(this).text().trim() == 'OK') { 
				           e.preventDefault();
				           alert("Aqui hay texto");
				           window.current_event = {event:"image_clicked"};
					  	   window.current_element_to_edit = {element:this};
				       	   console.log(this);	
				       	   $('.context-menu-two').contextMenu();	
				       }*/
					});



					editor_html.find("form").submit(function(e){
						
						if($(this).find('.resize-drag').length !== 0 || $(this).hasClass("resize-drag"))
						{
							console.log("found");
							e.preventDefault();
						}


					});

					editor_html.find("a").click(function(e){
						
						if($(this).find('.resize-drag').length !== 0 || $(this).hasClass("resize-drag"))
						{
							console.log("found");
							e.preventDefault();
						}

					});

					editor_html.find(".resize-drag").click(function(e){
						console.log("clicked");
						e.preventDefault();
					});


					editor_html.find(".tab-pane").contextmenu(function(e){
						
						if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}


					  	console.log("Tab pane right clicked");

					});

					editor_html.find("div").contextmenu(function(e) {
						
						//console.log($(this).children());

						if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}
						
						if($(this).css('background-image') && $(this).css('background-image')!= "none")
						{
							console.log("Has a background");



							let already_exist = html_control.events.last_event_by({acc:"background_image_selected"});

							let register_event = new editor_event(this,"background_image_selected","image");
							 
							if(already_exist)
							{
								
		 				  	 	html_control.events.replace_event(already_exist,register_event);
							} 		
							else
							{
						  	 	html_control.events.add_event(register_event);	
							}						  	
							
							if(!document.querySelector("input[name='hide_menus']").checked)
						  	{
						  	 	$('.context-menu-one').contextMenu();
						  	 	e.stopPropagation();
    							e.stopImmediatePropagation();
						  	}
						}




						if($(this).children("div,ul,nav,img,h1,h2,h3,h4,span,p,i,section,header,footer,article,form,button,figure").length == 0)
						{
							if(document.querySelector("input[name='hide_inspect']").checked)
						  	{
						  		 e.preventDefault();						 
						  	}

							console.log(this);

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

							if(!document.querySelector("input[name='hide_menus']").checked)
						  	{
						  	 	$('.context-menu-two').contextMenu();
						  	 	e.stopPropagation();
    							e.stopImmediatePropagation();
						  	}

						  		
						}

						/*
						Just javascript:

						var hasBGImage = element.style.backgroundImage !== '';
						Using jQuery:

						var hasBGImage = $(element).css('background-image') !== 'none';
						*/


						
						
						


						/*control_cicle++;
						console.log(control_cicle);

						if(control_cicle == 1)
						{
							
						}*/	
													 
					});


					editor_html.find(".carousel.slide").contextmenu(function(e) {

						 //console.log(this);

						 if(document.querySelector("input[name='hide_inspect']").checked)
					  	{
					  		 e.preventDefault();						 
					  	}

						 let already_exist = html_control.events.last_event_by({acc:"carousel_slider_of_reference"});
 
						 let register_event = new editor_event(this,"carousel_slider_of_reference","carousel");
						 
						 if(already_exist)
						 {
	 				  	 	html_control.events.replace_event(already_exist,register_event);	 				  	 	
						 } 		
						 else
						 {
					  	 	html_control.events.add_event(register_event);	
						 }

						 if(!document.querySelector("input[name='hide_menus']").checked)
					  	{
					  	 	$('.context-menu-five').contextMenu();
					  	}	

					});






				}
		        
				editor_html.find("body").debouncedDNI(  function() {			

					editor_body_events();
				});	
			  
			    editor_body_events();			

		});



		$('#asistant_frame').on('load',function (){
			asistant_html = $(this).contents();
			

			asistant_html.find("#playground").debouncedDNI(  function() {
				
				
					//console.log("playground changed");
				
				asistant_html.find(".fdb-block").contextmenu(function(e) {
				  	 if(document.querySelector("input[name='hide_inspect']").checked)
				  	{
				  		 e.preventDefault();						 
				  	}				  	
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
				  	 //e.preventDefault();
				  	 if(document.querySelector("input[name='hide_inspect']").checked)
				  	{
				  		 e.preventDefault();						 
				  	}

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

					if(!document.querySelector("input[name='hide_menus']").checked)
				    {
				  	 	$('.context-menu-three').contextMenu();
				  	}
				  	 				  		   
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


	});

//Transformaciónes

	function add_script_to_transform()
	{
		editor_html.find("body").append('<script class="interactjs" src="/Framework/Core/js/interact.js"><\/script>');
		editor_html.find("body").append('<script class="interactjs" src="/Framework/Core/js/relative_drag_and_drop.js"><\/script>');
	}

	function interactjs_editor_frame_process(html_event)
	{
		if(editor_html.find("#media_query").length == 0)
		{
			console.log("add media query css file "+proyect_folder);
			let request = getScope("#StyleCtrl").add_media_query_properties(proyect_folder);
			request.then(function(response){
				editor_html.find("head link").last().after('<link rel="stylesheet" id="media_query" href="css/media_query.css">');	
			});
			
			
		}
		 		    	   
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


	function set_only_media_query(html_event)
	{
		if(editor_html.find("#media_query").length == 0)
		{
			console.log("add media query css file "+proyect_folder);
			let request = getScope("#StyleCtrl").add_media_query_properties(proyect_folder);
			request.then(function(response){
				editor_html.find("head link").last().after('<link rel="stylesheet" id="media_query" href="css/media_query.css">');	
			});			
			
		}

	}	