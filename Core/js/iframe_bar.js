		
		function create_html()
		{
			swal({			
			  title: decode_utf8('¿Esta seguro de crear el archivo?'),
			  text: 'Tenga cuenta la ruta donde lo esta creando así como la extensión del archivo a crear',
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Si, !adelante!'			
			}).then((result) => {
					let url = $("#url_name").val();

					return getScope("#modalYT").create_document(url).then(function(response){
						console.log("Creado");
						let iframe = document.getElementById("editor_frame"); iframe.src = url;
					});
			});		
		}


		function search_html()
		{

			if(editor_html != null)
			{
			
				if(editor_html.find(".resize-drag").length != 0)
				{
					console.log("Borro interact por si acaso");										

					save_process("normal").then(function(response){
						

						let url_name = $("#url_name").val();

						if(url_name == "")
						{
							return alert("No puede mandar un valor vacio");
						}

						$("#editor_frame").attr("src",url_name);	
					});
				}
				else
				{

					let url_name = $("#url_name").val();

					if(url_name=="")
					{
						return alert("No puede mandar un valor vacio");
					}

					$("#editor_frame").attr("src",url_name);
				}	
				
			}
			else
			{ 
				console.log($("#url_name").val());

				let url_name = $("#url_name").val();

				if(url_name=="")
				{
					return alert("No puede mandar un valor vacio");
				}

				$("#editor_frame").attr("src",url_name+"?gen_rand="+Math.round(Math.random() * 10000000));	
			}
		}

		function reload_editor()
		{
			location.href = URL_add_parameter(location.href, 'page',$("#url_name").val());
			//location.reload(true);
		}

		function reload_html()
		{
			console.log("reload html");
			let iframe = document.getElementById("editor_frame");
			//console.log(iframe);
			//console.log(iframe.src);
			//console.log(window.location);

			if(iframe.src.includes("?"))
			{
				iframe.src = iframe.src.substring(0, iframe.src.indexOf('?'));
			}


			if(iframe.src != window.location.href){
				
				let generated_url = iframe.src.replace(window.location.origin,"");

				let random_number = Math.ceil((Math.random() * 10000000000000000) + 1);

				generated_url = generated_url+"?reload="+random_number;

				console.log(generated_url);				
				
				iframe.src = generated_url;

			}			
		}


		function deploy_html()
		{
			let html_selected = document.querySelector("#content_editor").value;
			
			switch(html_selected)
            {	
            	case "froala_blocks":
				    document.getElementById("asistant_frame").src="blocks/index.html";
			    break;
			    case "custom_blocks":
				    document.getElementById("asistant_frame").src="custom_blocks/index.html";
			    break;        					    
			    default:
			       break;
			}
		}

		function switch_screen(size){

			if(size == "tv_size")
			{
				$(".to_table_responsive").addClass("table-responsive");
			}
			else
			{
				$(".to_table_responsive").removeClass("table-responsive");
			}

			//Es mejor solucion evaluar si las dimensiones sobrepasan la pantalla para agregar eso.

			let element = document.getElementById("editor_frame");
			let element2 = document.getElementById("asistant_frame");
    		element.className = size;
    		element2.className = size;

    		$(".screen_menu_active").removeClass("screen_menu_active");
			console.log("#"+size+"_button");
			$("#"+size+"_button").addClass("screen_menu_active");
		}
		

		$("#bootstrap_version").change(function(){
			console.log($(this).val());

			let inner_html = $("#editor_frame").contents();
			
			var boostrap_style_tag_frame = inner_html.find("#bootstrap_style");

			var boostrap_script_tag_frame = inner_html.find("#bootstrap_script");

			if($(this).val() == 'b_3.7')
			{
				boostrap_script_tag_frame.attr("src","https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js");	
				boostrap_style_tag_frame.attr("href","https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css");				
			}

			if($(this).val() == 'b_4.0')
			{
				boostrap_script_tag_frame.attr("src","https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js");	
				boostrap_style_tag_frame.attr("href","https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");		
			}


		});

		function save_to_server(mode="normal")
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
			  	if (result.value){
			   	
				   	let url = $("#url_name").val();
					let src = $("#editor_frame").attr('src');			

					if(url != "" && src != "")
					{
						if(document.getElementById("editor_frame").contentWindow.location.pathname != $("#url_name").val())
						{
							swal({			
							  title: decode_utf8('¡La dirección en la que desea guardar es distinta a la dirección del documento!'),
							  text: 'Esto puede ser un error verifique que la dirección al lado del boton buscar corresponda con el lugar a donde hacer el cambio',
							  type: 'warning',
							  showCancelButton: true,
							  confirmButtonColor: '#3085d6',
							  cancelButtonColor: '#d33',
							  confirmButtonText: 'Si, !adelante!'			
							}).then((result) => {
							  	if (result.value){
							  		save_process(mode);
							  	}
							  	else{}
							});  		
						}
						else{

							if(editor_html.find(".resize-drag").length > 0)
							{
								apply_all_screens();
							}
							else
							{
								save_process(mode);	
							}
														
						

						}
						
					}
					else
					{
						swal({
		                  type: 'error',
		                  title: 'Oops...',
		                  text: 'No hay datos suficientes para guardar',
		                  footer: ''
		                });	
					}
			  	}

			});		
			
		}


		function save_process(mode)
		{

			//console.log(editor_html.find(".wow"));

			editor_html.find(".wow").removeAttr("style");

			editor_html.find(".wow").removeClass("animated");

			editor_html.find(".program.calendar").html('<div id="calendar"></div>');

			if(editor_html.find(".carousel-inner").length > 0)
			{
				editor_html.find(".carousel-inner *").removeAttr("style");	
			} 			

			editor_html.find("h1,h2,h3,h4,span,p,div").removeAttr("contenteditable");

			if(mode == "normal")
			{
				

				editor_html.find(".interactjs").remove();

				console.log(editor_html.find(".resize-drag"));				

				editor_html.find(".resize-drag").removeAttr("style");

				editor_html.find(".resize-drag").removeAttr("data-x");

				editor_html.find(".resize-drag").removeAttr("data-y");

				editor_html.find(".resize-drag").removeClass("resize-drag");

			    editor_html.find("html").removeAttr("style");

			    //console.log(editor_html.find(".content-block.program.calendar"));			    

									    
					
			}
			if(mode=="interact")
			{
				editor_html.find("h1,h2,h3,h4,span,p").removeAttr("contenteditable");
			}	

			
			//console.log(html);

			//let url = $("#url_name").val();

			let url = document.getElementById("editor_frame").contentWindow.location.pathname;

			console.log(url);

			let html = document.getElementById('editor_frame').contentWindow.document.documentElement.outerHTML;

			return getScope("#modalYT").save_document(url,html).then(function(response){
				console.log("Guardado");
				if(mode=="normal")
				{ 
					reload_html();
					//search_html();
				}	
			});
		}


		window.onbeforeunload = function() {
			console.log("onbeforeunload");
			if(editor_html != null)
			{
				if(editor_html.find(".resize-drag").length != 0)
				{
					console.log("Borro interact por si acaso");
					
					save_process("normal").then(function(response){
						console.log("Interact borrado antes de guardar");
					});
						
				}
			}


		    return 'some warning message';
		};


		function apply_all_screens(){
			swal({			
			  title: decode_utf8('¿Esta seguro de guardar?'),
			  text: decode_utf8('Esto aplicara la transformación en todos los tamaños de pantalla'),
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Si, !adelante!'			
			}).then((result) => {
			  	if (result.value)
			  	{
			  		
			  		modify_media_query(0);
				    //con la regla de all generar id del elemento 
				    //con el id del elemento aplicar el estilo 
			  	}
			  	else{}
			});				
		}

		function apply_to_screen(){
			swal({			
			  title: decode_utf8('¿Esta seguro de guardar?'),
			  text: decode_utf8('Esto aplicara la transformación para el tamaño de pantalla actual'),
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Si, !adelante!'			
			}).then((result) => {
			  	if (result.value)
			  	{
			  		let index_to_modify;
			  		switch(document.getElementById("editor_frame").className){
			  			case "tv_size":
			  				index_to_modify = 1;
			  				break;
			  			case "desktop_size":
			  				index_to_modify = 2;
			  				break;
			  			case "tablet_size":
			  				index_to_modify = 3;
			  				break;
			  			case "phone_size":
			  				index_to_modify = 5;
			  				break;
			  			case "small_phone_size":
			  				index_to_modify = 6;
			  				break;			
			  			default:
			  				
			  				break;
			  		}

			  		console.log(index_to_modify);

			  		modify_media_query(index_to_modify);


				}
			  	else{}
			});		  		
			//console.log(editor_html.find(".resize-drag").removeClass("resize-drag"));
		}

		function modify_media_query(media_index)
		{
			let doc = document.getElementById("editor_frame").contentDocument;
					//console.log(doc.styleSheets); 

				    for (sheet in doc.styleSheets) {
						    	
					    if(doc.styleSheets[sheet].ownerNode != null){ 
						  	//console.log(doc.styleSheets[sheet]);
						  	//Conseguir stylesheet de media querys, conseguir la regla de all
						  	if(doc.styleSheets[sheet].ownerNode.id == "media_query")
						  	{
						  		let elements_to_style = editor_html.find(".resize-drag , .custom_style_modified");
						  		
						  		//console.log(elements_to_style);

						  		//let styles_to_add = "";

						  		let current_ids = [];

						  		let new_styles = [];

						  		for(let i = 0; i < elements_to_style.length; i++)
								{
									let id_to_generate;

									if(elements_to_style[i].id == "")
									{
										let random_number = Math.ceil((Math.random() * 10000) + 1);
								   		id_to_generate = elements_to_style[i].localName+"_"+random_number;
								   		elements_to_style[i].id = id_to_generate; 	
									}
									else
									{
										current_ids.push(elements_to_style[i].id);

										id_to_generate = elements_to_style[i].id;
									}	
									
									//styles_to_add += " #"+id_to_generate+"{"+$(elements_to_style[i]).attr("style")+"} ";

									new_styles.push(" #"+id_to_generate+"{"+$(elements_to_style[i]).attr("style")+"} ");
								}

									
								//evitar que los ids se repitan y 	


								let previous_properties = get_media_previous_properties(doc.styleSheets[sheet].rules[0]);
								
								let previous_styles = "";

								for(let k in previous_properties)
								{
									let exists = false;
									for(let j in current_ids)
									{
										if(previous_properties[k].includes("#"+current_ids[j]))
										{
											//console.log("encontrado",current_ids[j]);
											exists = true;
										}
									}

									if(exists == false)
									{
										previous_styles += previous_properties[k];										
									}
								}

								console.log(doc.styleSheets[sheet]);								

								console.log(new_styles);

								for(let j in new_styles)
								{ 	
									doc.styleSheets[sheet].cssRules[media_index].insertRule(new_styles[j],doc.styleSheets[sheet].cssRules[media_index].cssRules.length);								
								}

								/* Futura implementación para prevenir el duplicado de etiquetas

								for(let m in doc.styleSheets[sheet].cssRules[0].cssRules)
								{
									if(doc.styleSheets[sheet].cssRules[0].cssRules[m].selectorText == "#img_44")
									{
										console.log("encontrado");
										doc.styleSheets[sheet].cssRules[0].cssRules[m].style.cssText = "transform: translate(0px, -10px);";
									}	
								}

								*/																
								
								let generated_css = "";
								
								for (rule in doc.styleSheets[sheet].rules) {
						    		if(doc.styleSheets[sheet].rules[rule].cssText)
						    		{ 	
						    			generated_css +=  doc.styleSheets[sheet].rules[rule].cssText+"\n";
						    		}
						    	}

						    	console.log(generated_css);

						  		getScope("#StyleCtrl").modify_styles({css:generated_css,route:remove_dns_server(doc.styleSheets[sheet].href)});	
						  	}				 
						    
						   
						}
				    }

			save_process("normal").then(function(response){
				console.log("Recargar forzando a reiniciarse el cache");
			});	    
		}

		function change_media_query_sheet()
		{

		}


		function get_media_previous_properties(sheet_rule)
		{
			
			let index = sheet_rule.cssText.indexOf("{");
			let string_to_array = sheet_rule.cssText.substring(parseInt(index+1),sheet_rule.cssText.length - 2);

			//console.log(string_to_array);

			let array_from_string = string_to_array.split("}");
			
			return array_from_string;

			//return string_to_array;
		}


		
