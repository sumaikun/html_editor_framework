if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
{

	console.log("I am a local server");
 	
}
else{
   
	$.post( "ServerSide/LoginController.php",{Acc:"check_session"}, function( data ) {
       console.log(data);
       data = JSON.parse(data);			    
       if(data.STATUS != "OK")
       {
       	//alert("It's a local server!");	
   			window.location.href = "login.html";	
       }	
       
   });
   	//window.location.href = "login.html";
}