//http://69.61.125.71/app/index.php?controller=WebService&action=login

 function send_login_form()
   {
      event.preventDefault();

      let email = document.querySelector("input[name='email']").value;

      let passw = document.querySelector("input[name='passw']").value;

      $.post( "http://69.61.125.71/app/index.php?controller=WebService&action=framework_login",{Acc:"login",email:email,passw:passw}, function( data ) {
          console.log(data);
          data = JSON.parse(data);          
          if(data.STATUS == "OK")
          {
            $.post( "ServerSide/LoginController.php",{Acc:"login",email:email}, function( data ) {
                console.log(data);
                data = JSON.parse(data);          
                if(data.STATUS != "OK")
                {
                  window.location.href = "editor.html";
                }                
            });
              
          } 
          else
          {
            swal(
              '¡Oops!',
              'No hemos podido hacer login, verifica tus credenciales',
              'question'
            ); 
          }
      });
   }