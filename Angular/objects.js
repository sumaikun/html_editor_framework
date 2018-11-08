function bad_request_response_inteceptor() {  
    var RequestInterceptor = {
        response: function(response) {
            //console.log(response);            
                          
            return response;
        },
        responseError:function(response) {
            console.log(response);            
            if (response.status == 500){                
                swal({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: '<a href>Why do I have this issue?</a>'
                });
        
            }              
            return response;
        } 
    };
    return RequestInterceptor;
}


function config_provider_interceptors($httpProvider,interceptors) {	
	console.log($httpProvider);
    interceptors.forEach(function(interceptor){
    	console.log(interceptor);
    	$httpProvider.interceptors.push(interceptor);	
    });    
}