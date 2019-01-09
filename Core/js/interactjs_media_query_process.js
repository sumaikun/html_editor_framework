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






		//Guardando las viejas funciones de transformación


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


								//sheet.deleteRule (i); Eliminar regla

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
