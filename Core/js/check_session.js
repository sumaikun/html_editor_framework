if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
{

	console.log("I am a local server");
 	
}
else{
   
	$.post( "ServerSide/LoginController.php",{Acc:"check_session"}, function( data ) {       
       data = JSON.parse(data);
       console.log(data);			    
       if(data.status != "OK")
       {
          console.log("no session");
       	//alert("It's a local server!");	
   			  window.location.href = "login.html";	
       }
       else{
          console.log("session");
       }	
       
   });
   	//window.location.href = "login.html";
}