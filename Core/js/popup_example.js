//PopUP Controller

		var components_open = false;	
		var components_window; 
		
		function openpopup(address)
		{

			if(components_open)
			{
				alert("Ya hay una ventana abierta");
		    }
		    else
		    {
		    	components_window =	window.open(address,"","fullscreen=no,toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,width=500,height=500");
				components_open = true;


				components_window.onbeforeunload = function () {
				    components_open = false;
				    //alert("new window closed");
				}
		    	
		    }

		}

		function outside()
		{
			console.log(components_window);
			console.log(components_window.ready);
		}


		function search_html()
		{
			var url_name = $("#url_name").val();

			if(url_name=="")
			{
				return alert("No puede mandar un valor vacio");
			}

			$("#content_frame").attr("src",url_name);	
		}		


		function get_html()
		{
			$("#content").html(components_window.selected_html);
		}
		
	
